import * as Yup from "yup";
export const validationSchema = Yup.object({
//   attendees: Yup.array()
//     .of(
//       Yup.object({
//         name: Yup.string().required("Name is required"),
//         email: Yup.string()
//           .email("Please enter a valid email address")
//           .required("Email is required"),
//       })
//     )
//     .min(1, "At least one attendee is required")
//     .max(5, "Maximum 5 attendees allowed"),
//   setupDuration: Yup.string().required("Setup duration is required"),
  boothSize: Yup.string().required("Booth size is required"),
  selectedBoothId: Yup.number()
    .nullable()
    .required("Please select a booth location"),
});
