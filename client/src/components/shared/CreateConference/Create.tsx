// components/Create/Create.tsx
"use client";
import React, { useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useFormik, FormikProvider} from 'formik';
import * as yup from 'yup';
import EventCreationStep1Modal from './Box1';
import EventCreationStep2Details from './Box2';
import { wrapperContainerStyles, horizontalLayoutStyles,detailTitleStyles } from './styles';
import { EventFormData} from './types/'; 
import {api} from "../../../api";


const initialFormData: EventFormData = {
    eventName: '',
    eventStartDate: '',
    location:'',
    eventEndDate: '',
    eventStartTime:'',
    eventEndTime:'',
    description: '',
    fullAgenda: '',
    websiteLink: '', 
    requiredBudget: '',
    fundingSource: '',
    extraRequiredResources: [] 
}

//Define the validation schema 
const validationSchema = yup.object({
    eventName: yup.string().required('Conference Name is required').min(3, 'Name must be at least 3 characters'),
    description: yup.string().required('Description is required'),
    eventStartDate: yup.string().required('Start Date is required'),
    eventEndDate: yup.string().required('End Date is required'),
    eventStartTime: yup.string().required('Start Time is required'),
    eventEndTime: yup.string().required('End Time is required'),
    requiredBudget: yup.number().typeError('Budget must be a number').positive('Budget must be positive').required('Budget is required'),
    fundingSource: yup.string().required('Funding Source is required'),
    websiteLink: yup.string().required('Link is required'),

});
const Create: React.FC = () => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleCallApi = async (payload:any) => {
    setLoading(true);
    setError(null);
    setResponse([]);
    try {
        // TODO: Replace with your API route
        const res = await api.post("/events", payload);
        setResponse(res.data);
    } catch (err: any) {
        setError(err?.message || "API call failed");
    } finally {
        setLoading(false);
    }
    };

const onSubmit = async (values: any, actions: any) => {
    const payload = {
    type:"conference",
    eventName: values.eventName,
    eventStartDate: values.eventStartDate,
    eventEndDate: values.eventEndDate,
    eventStartTime: values.eventStartTime,
    eventEndTime:values.eventEndTime,
    description: values.description,
    fullAgenda: values.fullAgenda,
    websiteLink: values.websiteLink, 
    requiredBudget:values.requiredBudget,
    fundingSource:values.fundingSource,
    extraRequiredResources:values.extraRequiredResources
    }
    handleCallApi(payload); }



    const formik = useFormik<EventFormData>({
        initialValues: initialFormData,
        validationSchema: validationSchema,
        onSubmit:onSubmit,
    });

    const handleClose = () => { console.log("Modal flow closed/canceled."); };

    return (
        <Box sx={wrapperContainerStyles}>    
            <Typography sx={{...detailTitleStyles(theme),fontSize: '26px', fontWeight:[950], alignSelf: 'flex-start'}}>
                Create Conference
            </Typography>        

            <FormikProvider value={formik}>
                <Box 
                    component="form" 
                    onSubmit={formik.handleSubmit} 
                    sx={horizontalLayoutStyles(theme)}
                >
                    <EventCreationStep1Modal 
                        onClose={handleClose}
                    />
                    <EventCreationStep2Details
                        onClose={handleClose}
                        onFinalSubmit={formik.handleSubmit} 
                        
                    />
                </Box>
            </FormikProvider>
        </Box>
    );
};

export default Create;