import * as Yup from "yup";
import { toast } from "react-toastify";
import { api } from "../../../../api";

export const validationSchema = Yup.object({
  bazaarAttendees: Yup.array()
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
});
export const submitBazarForm = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: any,
  {
    setSubmitting,
    resetForm,
  }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void },
  vendorId: string,
  eventId: string
) => {
  try {
    const bazarData = {
      eventType: "bazaar",
      bazaarAttendees: values.bazaarAttendees,
      boothSize: values.boothSize,
    };
    const response = await api.post(
      `/vendorEvents/${vendorId}/${eventId}/bazaar`,
      bazarData
    );
    const result = response.data;
    resetForm();
    toast.success("Bazar application submitted successfully!", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  } catch (err) {
    console.error("Bazar submission error:", err);
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
  }
};
