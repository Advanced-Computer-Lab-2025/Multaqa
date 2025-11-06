import * as yup from 'yup';

const validationSchema = yup.object({
    eventName: yup.string().required('Conference Name is required').min(3, 'Name must be at least 3 characters'),
    description: yup.string().required('Description is required'),
    eventStartDate: yup.string().required('Start Date is required'),
    eventEndDate: yup.string().required('End Date is required'),
    requiredBudget: yup.number().typeError('Budget must be a number').positive('Budget must be positive').required('Budget is required'),
    fundingSource: yup.string().required('Funding Source is required'),
    websiteLink: yup.string().required('Link is required'),

});
export { validationSchema };