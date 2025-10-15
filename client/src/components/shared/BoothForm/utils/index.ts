import * as Yup from "yup";

export const validationSchema = Yup.object({
  attendees: Yup.array()
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
  boothDuration: Yup.string().required("Duration is required"),
  selectedBoothId: Yup.number()
    .nullable()
    .required("Please select a booth location"),
});
