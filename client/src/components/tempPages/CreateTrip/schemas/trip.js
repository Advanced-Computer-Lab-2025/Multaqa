import * as yup from 'yup';

const tripSchema = yup.object().shape({
  tripName: yup.string().required('Trip name is required'),
  location: yup.string().required('Location is required'),
  price: yup.number().required('Price is required').min(0, 'Price must be a positive number'),
  startDate: yup.date().required('Start date is required').min(new Date(), "Start date can't be in the past"),
  endDate: yup.date().required('End date is required').min(new Date(), "End Date can't be in the past").min(yup.ref('startDate'), "End date must be after start date"),
  description: yup.string().required('Description is required'),
  capacity: yup.number().required('Capacity is required').min(1, 'Capacity must be at least 1'),
  registrationDeadline: yup
    .date()
    .required('Registration deadline is required')
    .max(yup.ref('startDate'), "Registration deadline must be before start date")
    .min(new Date(), "Registration deadline can't be in the past"),
});

export { tripSchema };  
