import * as Yup from "yup";
import { toast } from "react-toastify";
import { api } from "../../../../api";

export const validationSchema = Yup.object({
  boothAttendees: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
          .email("Please enter a valid email address")
          .required("Email is required"),
      })
    )
    .min(1, "At least one attendee is required")
    .max(5, "You can add up to 5 attendees"),
  boothSize: Yup.string().required("Booth size is required"),
  boothSetupDuration: Yup.number().required("Duration is required"),
  boothLocation: Yup.string().required("Please select a booth location"),
});

export const submitBoothForm = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: any,
  {
    setSubmitting,
    resetForm,
  }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void },
  vendorId: string 
) => {
  try {
    const boothData = {
      eventType: "platform_booth",
      boothSetupDuration: values.boothSetupDuration,
      boothLocation: values.boothLocation,
      boothAttendees: values.boothAttendees,
      boothSize: values.boothSize,
    };

    const response = await api.post(
      `/vendorEvents/${vendorId}/booth`,
      boothData
    );

    const result =  response.data;

    if (response.status === 200 && result.success) {
      // Reset the form and show success toast
      resetForm();
      toast.success("Booth application submitted successfully!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      // Show error toast
      throw new Error(result.message || "Failed to submit booth application.");
    }
  } catch (err) {
    console.error("Booth submission error:", err);
    toast.error(
      err.response?.data?.error || "Submission failed. Please try again.",
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
  } finally {
    setSubmitting(false);
    setSubmitting(false);
  }
};
