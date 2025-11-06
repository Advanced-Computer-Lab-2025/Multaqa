// components/Create/Create.tsx
"use client";
import React, { useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useFormik, FormikProvider, FormikContextType} from 'formik';
import * as yup from 'yup';
import EventCreationStep1Modal from '../CreateConference/Box1';
import EventCreationStep2Details from '../CreateConference/Box2';
import { wrapperContainerStyles, horizontalLayoutStyles,detailTitleStyles,modalFooterStyles } from '../../shared/styles';
import { EventFormData} from '../CreateConference/types'; 
import {api} from "../../../api";
import CustomButton from '../../shared/Buttons/CustomButton';
import { CustomModalLayout } from '../../shared/modals';

//Define the validation schema 
const validationSchema = yup.object({
    eventName: yup.string().required('Conference Name is required').min(3, 'Name must be at least 3 characters'),
    description: yup.string().required('Description is required'),
    eventStartDate: yup.string().required('Start Date is required'),
    eventEndDate: yup.string().required('End Date is required'),
    requiredBudget: yup.number().typeError('Budget must be a number').positive('Budget must be positive').required('Budget is required'),
    fundingSource: yup.string().required('Funding Source is required'),
    websiteLink: yup.string().required('Link is required'),

});

interface EditConferenceProps {
    conferenceId:string;
    open:boolean;
    onClose: () => void;
    setRefresh:React.Dispatch<React.SetStateAction<boolean>>;
    eventName: string;
    description:string;
    eventStartDate: string;
    eventEndDate:string;
    eventStartTime:string;
    eventEndTime:string;
    requiredBudget:string;
    fundingSource:string;
    websiteLink:string;
    agenda:string;
    extraRequiredResources: any;
 }

const Edit: React.FC<EditConferenceProps> = ({
    conferenceId,
    open, 
    onClose, 
    setRefresh, 
    eventName, 
    description, 
    eventStartDate, 
    eventEndDate, 
    requiredBudget,
    fundingSource,
    websiteLink,
    agenda = "",
    extraRequiredResources = [],
    eventStartTime,
    eventEndTime,
    }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const initialFormData: EventFormData = {
        eventName: eventName,
        eventStartDate: eventStartDate,
        location: eventStartDate,
        eventEndDate: eventEndDate,
        eventStartTime,
        eventEndTime,
        description: description,
        fullAgenda: agenda,
        websiteLink: websiteLink, 
        requiredBudget: requiredBudget,
        fundingSource: fundingSource,
        extraRequiredResources: extraRequiredResources,
        registrationDeadline:'',
    }

    const handleCallApi = async (payload:any) => {
    setLoading(true);
    setError(null);
    setResponse([]);
    try {
        // TODO: Replace with your API route
        const res = await api.patch("/events/" + conferenceId, payload);
        setResponse(res.data);
        console.log("Success! Response:", res.data);
        setRefresh((prev)=> !prev);
    } catch (err: any) {
        setError(err?.message || "API call failed");
        window.alert(err.response.data.error);
    } finally {
        setLoading(false);
    }
    };

    const onSubmit = async (values: any, actions: any) => {
        onClose();
        const payload = {
        type:"conference",
        eventName: values.eventName,
        eventStartDate: values.eventStartDate,
        eventEndDate: values.eventEndDate,
        location:"GUC Cairo",
        eventStartTime: "06:00",
        eventEndTime:"07:00",
        description: values.description,
        fullAgenda: values.fullAgenda,
        websiteLink: values.websiteLink, 
        requiredBudget:values.requiredBudget,
        fundingSource:values.fundingSource,
        extraRequiredResources:values.extraRequiredResources,
        registrationDeadline:"2025-1-1"
        }
        console.log(formik.errors)
        handleCallApi(payload); 
    }

    const formik = useFormik<EventFormData>({
        initialValues: initialFormData,
        validationSchema: validationSchema,
        onSubmit:onSubmit,
    });
    const handleClose = () => { console.log("Modal flow closed/canceled."); };
    return (
        <CustomModalLayout open={open} onClose={onClose} width="w-[95vw] xs:w-[80vw] lg:w-[70vw] xl:w-[60vw]" borderColor="#5A67D8">
        <Box sx={{
    ...wrapperContainerStyles,    
}}>
            <Typography sx={{...detailTitleStyles(theme),fontSize: '26px', fontWeight:[950], alignSelf: 'flex-start', paddingLeft:'26px'}}>
                Edit Conference
            </Typography>        
        <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>
                <Box 
                    sx={horizontalLayoutStyles(theme)}
                >
                    <EventCreationStep1Modal 
                        onClose={handleClose}
                    />
                    <EventCreationStep2Details
                        onClose={handleClose}
                        
                    />
                </Box>
                <Box sx={modalFooterStyles}>
                <CustomButton color="tertiary" type='submit' variant="contained" sx={{px: 1.5, width:"100px", height:"32px" ,fontWeight: 600, padding:"12px", fontSize:"14px"}}>
                    Edit 
                </CustomButton>
                </Box>
            </form>
        </FormikProvider>
        </Box>
      </CustomModalLayout>  
    );
};

export default Edit;