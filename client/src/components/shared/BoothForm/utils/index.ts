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
    .test(
      "is-not-in-past",
      "Start date cannot be in the past",
      function (value) {
        if (!value) return true;
        // Compare only the date portions (ignore time)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(value);
        startDate.setHours(0, 0, 0, 0);

        return startDate >= today;
      }
    ),
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

        // Compare only the date portions (ignore time)
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(value);
        end.setHours(0, 0, 0, 0);

        return end > start;
      }
    )
    .test(
      "duration-check",
      "Duration must be between 1 and 4 weeks",
      function (value) {
        const { startDate } = this.parent;
        if (!startDate || !value) return true;

        // Calculate difference using date-only comparison
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(value);
        end.setHours(0, 0, 0, 0);

        // Get the time difference in milliseconds
        const diffTime = end.getTime() - start.getTime();

        // Convert to days
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays >= 7 && diffDays <= 28;
      }
    ),
  selectedBoothId: Yup.number()
    .nullable()
    .required("Please select a booth location"),
});
