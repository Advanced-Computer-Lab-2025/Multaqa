import * as Yup from "yup";
import { toast } from "react-toastify";
import { api } from "../../../../api";
import { FormikProps } from "formik";
import { BoothFormValues } from "../types";
import ErrorResponse from "../../../../interfaces/errors/errorResponse.interface";

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

    const result = response.data;

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
  } catch (err: ErrorResponse) {
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

// Helper function to check if a section is complete
export const checkSectionCompletion = (
  formik: FormikProps<BoothFormValues>,
  section: "attendees" | "configuration" | "location"
) => {
  switch (section) {
    case "attendees":
      return (
        !formik.errors.boothAttendees &&
        formik.touched.boothAttendees &&
        formik.values.boothAttendees.length > 0 &&
        formik.values.boothAttendees.every((att) => att.name && att.email)
      );
    case "configuration":
      return (
        !formik.errors.boothSize &&
        !formik.errors.boothSetupDuration &&
        formik.touched.boothSize &&
        formik.touched.boothSetupDuration &&
        formik.values.boothSize &&
        formik.values.boothSetupDuration
      );
    case "location":
      return (
        !formik.errors.boothLocation &&
        formik.touched.boothLocation &&
        formik.values.boothLocation
      );
    default:
      return false;
  }
};

// Helper function to check which sections have errors
export const checkSectionErrors = (
  formik: FormikProps<BoothFormValues>
): {
  hasAttendeesError: boolean;
  hasConfigError: boolean;
  hasLocationError: boolean;
} => {
  // For configuration, show error if any field is touched and section is incomplete
  const configTouched =
    formik.touched.boothSize || formik.touched.boothSetupDuration;
  const configHasError =
    formik.errors.boothSize || formik.errors.boothSetupDuration;

  return {
    hasAttendeesError: !!(
      formik.errors.boothAttendees && formik.touched.boothAttendees
    ),
    hasConfigError: !!(configTouched && configHasError),
    hasLocationError: !!(
      formik.errors.boothLocation && formik.touched.boothLocation
    ),
  };
};

export const handleBoothSelection = (
  boothId: number,
  setSelectedBooth: (id: number) => void,
  setFieldValue: (field: string, value: unknown) => void
) => {
  setSelectedBooth(boothId);
  setFieldValue("boothLocation", `Booth ${boothId}`);
};

export const autoCloseCompletedAccordions = (
  formik: FormikProps<BoothFormValues>,
  currentlyOpenedPanel: string,
  setExpandedAccordions: React.Dispatch<React.SetStateAction<Set<string>>>
) => {
  // Check if sections are complete using helper function
  const isAttendeesComplete = checkSectionCompletion(formik, "attendees");
  const isConfigComplete = checkSectionCompletion(formik, "configuration");
  const isLocationComplete = checkSectionCompletion(formik, "location");

  // Close completed accordions when user opens a different one
  setExpandedAccordions((prev) => {
    const newSet = new Set(prev);

    // Only close completed accordions that are not the currently opened one
    if (
      isAttendeesComplete &&
      currentlyOpenedPanel !== "attendees" &&
      prev.has("attendees")
    ) {
      newSet.delete("attendees");
    }

    if (
      isConfigComplete &&
      currentlyOpenedPanel !== "configuration" &&
      prev.has("configuration")
    ) {
      newSet.delete("configuration");
    }

    if (
      isLocationComplete &&
      currentlyOpenedPanel !== "location" &&
      prev.has("location")
    ) {
      newSet.delete("location");
    }

    return newSet;
  });
};

export const handleAccordionChange =
  (
    setExpandedAccordions: React.Dispatch<React.SetStateAction<Set<string>>>,
    lastErrorStateRef: React.MutableRefObject<string>,
    panel: string,
    formik?: FormikProps<BoothFormValues>
  ) =>
  (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordions((prev) => {
      const newSet = new Set(prev);
      if (isExpanded) {
        newSet.add(panel);
        // When user opens a new accordion, close completed ones
        if (formik) {
          setTimeout(
            () =>
              autoCloseCompletedAccordions(
                formik,
                panel,
                setExpandedAccordions
              ),
            0
          );
        }
      } else {
        newSet.delete(panel);
      }
      return newSet;
    });
    // Mark that user has manually interacted - disable auto-expansion
    lastErrorStateRef.current = "USER_CONTROLLED";
  };

export const checkAndExpandAccordionWithErrors = (
  formik: FormikProps<BoothFormValues>,
  lastErrorStateRef: React.MutableRefObject<string>,
  setExpandedAccordions: React.Dispatch<React.SetStateAction<Set<string>>>
) => {
  if (Object.keys(formik.touched).length === 0) return;

  // Check sections for errors using helper function
  const { hasAttendeesError, hasConfigError, hasLocationError } =
    checkSectionErrors(formik);

  // Create a unique key for current error state
  const currentErrorState = `${hasAttendeesError}-${hasConfigError}-${hasLocationError}`;

  // Only auto-expand on initial errors (when lastErrorStateRef is not set yet)
  // Once user manually interacts with accordions, respect their choices
  if (
    lastErrorStateRef.current === "INIT" &&
    currentErrorState !== "false-false-false"
  ) {
    lastErrorStateRef.current = currentErrorState;

    // Defer state update to avoid updating during render
    setTimeout(() => {
      // Expand all accordions with errors on initial load only
      setExpandedAccordions((prev) => {
        const newSet = new Set(prev);

        if (hasAttendeesError) {
          newSet.add("attendees");
        }
        if (hasConfigError) {
          newSet.add("configuration");
        }
        if (hasLocationError) {
          newSet.add("location");
        }

        return newSet;
      });
    }, 0);
  } else if (lastErrorStateRef.current === "") {
    // Initialize as "INIT" to mark that we haven't auto-expanded yet
    lastErrorStateRef.current = "INIT";
  }
};
