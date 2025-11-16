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

export const handleExport = async (setIsExporting: React.Dispatch<React.SetStateAction<boolean>>, eventId: string) => {
  setIsExporting(true);
  //wait 5000 ms
  await new Promise(resolve => setTimeout(resolve, 50000));
  try {
    const response = await api.get(`/export/event/${eventId}/attendees`, {
      responseType: "blob",
    });

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
  } catch (err) {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = err as { response?: { data?: any; status?: number } };
    let errorMessage = "Export failed. Please try again.";

    // Error responses for 'blob' requests are also blobs,
    // must try to parse them as text, then JSON.
    if (error.response?.data instanceof Blob) {
      try {
        const errorText = await error.response.data.text();
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorMessage;
      } catch (parseError) {
        console.error("Could not parse blob error response", parseError);
      }
    } else if (error.response?.data?.error) {
      // Handle standard JSON error
      errorMessage = error.response.data.error;
    }
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    toast.error(errorMessage, toastOptions as any);
  } finally {
    setIsExporting(false);
  }
};
