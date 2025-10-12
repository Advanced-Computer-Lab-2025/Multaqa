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
  startDate: Yup.date()
    .nullable()
    .required("Start date is required")
    .typeError("Please select a valid date")
    .min(new Date(), "Start date cannot be in the past"),
  endDate: Yup.date()
    .nullable()
    .required("End date is required")
    .typeError("Please select a valid date")
    .test(
      "is-after-start",
      "End date must be after start date",
      function (value) {
        const { startDate } = this.parent;
        if (!startDate || !value) return true;
        return new Date(value) > new Date(startDate);
      }
    )
    .test(
      "duration-check",
      "Duration must be between 1 and 4 weeks",
      function (value) {
        const { startDate } = this.parent;
        if (!startDate || !value) return true;
        const start = new Date(startDate);
        const end = new Date(value);
        const diffInDays = Math.floor(
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        );
        return diffInDays >= 7 && diffInDays <= 28;
      }
    ),
  selectedBoothId: Yup.number()
    .nullable()
    .required("Please select a booth location"),
});
