// components/Create/Create.tsx

"use client";
import * as React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useFormik, FormikProvider, FormikConfig } from 'formik'; // 💡 Import Formik tools
import * as yup from 'yup'; // 💡 Import yup for validation
import EventCreationStep1Modal from './Box1';
import EventCreationStep2Details from './Box2';
import { wrapperContainerStyles, horizontalLayoutStyles } from './styles';
import { EventFormData,FormHandlerProps } from './types/'; // <-- Assuming this is the full type

// --- Formik Configuration and Schema ---
// 💡 Define the initial values
const initialFormData: EventFormData = {
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    fundingSource: '',
    website: '', // Added from Step 2 fields
    resources: [], // Assuming resources from Step 2
    agenda: '',    // Assuming agenda from Step 2
};

// 💡 Define the validation schema (simplified for now)
const validationSchema = yup.object({
    name: yup.string().required('Conference Name is required').min(3, 'Name must be at least 3 characters'),
    description: yup.string().required('Description is required'),
    startDate: yup.string().required('Start Date is required'),
    endDate: yup.string().required('End Date is required'),
    budget: yup.number().typeError('Budget must be a number').positive('Budget must be positive').required('Budget is required'),
    fundingSource: yup.string().required('Funding Source is required'),
    // Add validation for other fields as needed
});
const Create: React.FC = () => {
    const theme = useTheme();

    // 💡 1. Initialize Formik
    const formik = useFormik<EventFormData>({
        initialValues: initialFormData,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log("Final Form Data Submitted:", values);
            alert('Form Data Ready for Submission! Check console.');
            // Place your API call logic here
        },
    });

    // Stubs for flow control (can be removed if not needed)
    const handleNext = () => { console.log("Next step triggered (Box 1 data collected)."); };
    const handleBack = () => { console.log("Back triggered."); };
    const handleClose = () => { console.log("Modal flow closed/canceled."); };

    // We'll use the formik.handleSubmit on the Step 2 button, 
    // but the `onFinalSubmit` prop on the child will call it.

    return (
        <Box sx={wrapperContainerStyles}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, fontFamily: 'var(--font-poppins), system-ui, sans-serif', color:theme.palette.tertiary.dark}}>
                Create Conference
            </Typography>
            
            {/* 💡 2. Wrap the entire form in FormikProvider */}
            <FormikProvider value={formik}>
                <Box 
                    component="form" // Use Box as a form element
                    onSubmit={formik.handleSubmit} // Formik handles the submit
                    sx={horizontalLayoutStyles(theme)}
                >
                    
                    {/* 3. BOX 1 (Left): Props simplified */}
                    <EventCreationStep1Modal 
                        // Removed formData and onFieldChange props
                        onNext={handleNext} 
                        onClose={handleClose}
                    />

                    {/* 4. BOX 2 (Right): Props simplified */}
                    <EventCreationStep2Details
                        // Removed formData and onFieldChange props
                        onBack={handleBack}
                        onSubmit={formik.handleSubmit} // The button will trigger Formik's submit
                        onClose={handleClose}
                    />
                </Box>
            </FormikProvider>
        </Box>
    );
};

export default Create;