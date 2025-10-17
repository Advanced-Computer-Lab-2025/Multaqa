import * as yup from 'yup';

const bazaarSchema = yup.object().shape({
  bazaarName: yup.string().required('Bazaar name is required'),
  description: yup.string().required('Description is required'),
  location: yup.string().required('Location is required'),
  startDate: yup.date().required('Start date is required').min(new Date(), "Start date can't be in the past"),
  endDate: yup.date().required('End date is required').min(yup.ref('startDate'), "End date must be after start date"),
  registrationDeadline: yup
    .date()
    .required('Registration deadline is required')
    .max(yup.ref('startDate'), "Registration deadline must be before start date")
    .min(new Date(), "Registration deadline can't be in the past"),
});

export { bazaarSchema };