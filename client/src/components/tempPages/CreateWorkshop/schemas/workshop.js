import * as yup from 'yup';

const workshopSchema = yup.object().shape({
  workshopName: yup.string().required('Workshop name is required'),
  budget: yup.number().required('Budget is required').min(0, 'Budget must be a positive number'),
  capacity: yup.number().required('Capacity is required').min(1, 'Capacity must be at least 1'),
  startDate: yup.date().required('Start date is required').min(new Date(), "Start date can't be in the past"),
  endDate: yup.date().required('End date is required').min(new Date(), "End Date can't be in the past").min(yup.ref('startDate'), "End date must be after start date"),
  registrationDeadline: yup
  .date()
  .required('Registration deadline is required')
  .max(yup.ref('startDate'), "Registration deadline must be before start date")
  .min(new Date(), "Registration deadline can't be in the past"),
  description: yup.string().required('Description is required'),
  agenda: yup.string().required('Agenda is required'),
  professors: yup.array().min(1, "At least one professor should participate").required("Participating professors are required"),
  location: yup.string().required("Location is required"),
  faculty: yup.string().required("Faculty is required"),
  fundingSource: yup.string().required("Funding source is required"),
});

export { workshopSchema };