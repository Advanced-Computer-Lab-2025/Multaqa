import { api } from "../../../../api";
import { toast } from "react-toastify";

export const handleExport = async (
  setIsExporting: React.Dispatch<React.SetStateAction<boolean>>,
  eventId: string
) => {
  setIsExporting(true);
  try {
    const response = await api.get(`/events/export/${eventId}/attendees`, {
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

    toast.success("File download started!", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    let errorMessage = "Something went wrong. Please try again.";

    if (err.response && err.response.data instanceof Blob) {
      try {
        const errorText = await err.response.data.text();
        const errorJson = JSON.parse(errorText);
        if (errorJson.statusCode !== 404) {
          errorMessage = "Something went wrong. Please try again.";
        } else {
          errorMessage = errorJson.error || errorJson.message || errorMessage;
        }
      } catch (parseError) {
        console.error("Failed to parse error Blob as JSON:", parseError);
      }
    } else {
      errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        errorMessage;
    }
    toast.error(errorMessage, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  } finally {
    setIsExporting(false);
  }
};

export const handleGenerateQR = async (
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>,
  eventId: string
) => {
  setIsGenerating(true);
  try {
    // TODO: Replace with actual API endpoint
    const response = await api.post(`/vendorEvents/${eventId}/generateQRCodes`);

    toast.success(
      response.data.message || "QR code generated and emailed successfully!",
      {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      }
    );
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      "Failed to generate QR code. Please try again.";

    toast.error(errorMessage, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  } finally {
    setIsGenerating(false);
  }
};
