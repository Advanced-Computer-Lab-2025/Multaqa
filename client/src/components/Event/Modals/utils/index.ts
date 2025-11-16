import { api } from "../../../../api";
import { toast } from "react-toastify";
const toastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};

export const handleExport = async (
  setIsExporting: React.Dispatch<React.SetStateAction<boolean>>,
  eventId: string
) => {
  setIsExporting(true);
  try {
    const response = await api.get(
      `/events/export/event/${eventId}/attendees`,
      {
        responseType: "blob",
      }
    );

    // Create a URL for the blob
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    const url = window.URL.createObjectURL(blob);

    // Create a link to trigger the download
    const link = document.createElement("a");
    link.href = url;

    // Set the filename
    let filename = "exported-users.xlsx"; // Default
    const contentDisposition = response.headers["content-disposition"];
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch && filenameMatch.length > 1) {
        filename = filenameMatch[1];
      }
    }
    link.setAttribute("download", filename);

    // Trigger the download and clean up
    document.body.appendChild(link);
    link?.click();
    link?.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    toast.success("File download started!", toastOptions as any);
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err:any) {
    const errorMessage =
      err?.response?.data?.error ||
      err?.message ||
      "Export failed. Please try again.";
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    toast.error(errorMessage, toastOptions as any);
  } finally {
    setIsExporting(false);
  }
};
