import * as yup from 'yup';
import dayjs from 'dayjs';

const validationSchema = yup.object({
    eventName: yup.string().required('Conference Name is required').min(3, 'Name must be at least 3 characters'),
    description: yup.string().required('Description is required'),
    eventStartDate: yup.date().required('Start date is required').min(new Date(), "Start date can't be in the past"),
    eventEndDate: yup.date().required('End date is required').min(new Date(), "End Date can't be in the past").min(yup.ref('eventStartDate'), "End date must be after start date"),
    requiredBudget: yup.number().typeError('Budget must be a number').positive('Budget must be positive').required('Budget is required'),
    fundingSource: yup.string().required('Funding Source is required'),
    websiteLink: yup.string().required('Link is required'),
});

export { validationSchema };