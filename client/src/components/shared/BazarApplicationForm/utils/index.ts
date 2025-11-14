import * as Yup from "yup";
import { toast } from "react-toastify";
import { api } from "../../../../api";
import type { UploadStatus } from "../../FileUpload/types";
import { BazarFormValues } from "../types"; // Import BazarFormValues
import { capitalizeName } from "../../input-fields/utils";

export const validationSchema = Yup.object({
  bazaarAttendees: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
          .email("Please enter a valid email address")
          .required("Email is required"),
        nationalId: Yup.object().required("ID document is required"),
      })
    )
    .min(1, "At least one attendee is required")
    .max(5, "You can add up to 5 attendees"),
  boothSize: Yup.string().required("Booth size is required"),
});

export const submitBazarForm = async (
  values: BazarFormValues, // Use specific type
  {
    setSubmitting,
    resetForm,
  }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void },
  eventId: string,
  attendeeIdStatuses: UploadStatus[] // Add attendeeIdStatuses
) => {
  try {
    // Process attendees to clear nationalId if upload was not successful
    const processedAttendees = values.bazaarAttendees.map(
      (attendee, index) => ({
        ...attendee,
        name: capitalizeName(String(attendee.name ?? ""), false),
        nationalId:
          attendeeIdStatuses[index] === "success"
            ? attendee.nationalId
            : null,
      })
    );

    const bazarData = {
      eventType: "bazaar",
      bazaarAttendees: processedAttendees, // Use processed attendees
      boothSize: values.boothSize,
    };

    const response = await api.post(
      `/vendorEvents/${eventId}/bazaar`,
      bazarData
    );
    console.log("Bazar submission response:", response);
    // const result = response.data; // Not used, but good to have
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
    // Provide more specific error type if available
    const error = err as { response?: { data?: { error?: string } } };
    toast.error(
      error.response?.data?.error || "Submission failed. Please try again.",
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
