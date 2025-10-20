// components/Create/EventCreationStep1Modal.tsx
"use client";
import * as React from 'react';
import { Box, Typography, TextField, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import { useFormikContext } from 'formik'; 
import RichTextField from '../TextField/TextField'; 
import CustomTextField from '@/components/shared/input-fields/CustomTextField'; 
import { step1BoxStyles, modalFormStyles,modalHeaderStyles,detailTitleStyles } from './styles';
import { EventFormData } from './types'; 
import { Step1Props } from './types';

const EventCreationStep1Modal: React.FC<Step1Props> = ({ 
    onClose, 
}) => {
    const formik = useFormikContext<EventFormData>();
    const { values, handleChange, handleBlur, errors, touched, setFieldValue } = formik;
    const theme = useTheme();

    // Updates the content of the RichTextField ('description')
    const handleDescriptionChange = (htmlContent: string) => {
        setFieldValue('description', htmlContent);
    };

    return (
        <Box sx={step1BoxStyles(theme)}>
            <Box sx={modalHeaderStyles}>
                <Typography sx={detailTitleStyles(theme)}>
                    Create New Conference
                </Typography>      
            </Box>
            <Box sx={modalFormStyles}>
                <CustomTextField 
                    fieldType="text"
                    label="Conference Name"
                    placeholder="Enter conference name"
                    value={values.eventName} // 💡 From Formik context
                    onChange={handleChange('eventName')} // 💡 From Formik context
                    onBlur={handleBlur('eventName')} // 💡 For validation
                    error={touched.eventName && Boolean(errors.eventName)} // 💡 For validation
                    sx={{ mb: 1 }} 
                    required
                    autoCapitalize='off'
                    autoCapitalizeName={false}
                />
                {/* 💡 RichTextField wired using setFieldValue */}
                <RichTextField
                    label="Description" 
                    placeholder="Provide a short description of the conference"
                    onContentChange={handleDescriptionChange} // 💡 Uses the setFieldValue handler
                />
                
            </Box>
        </Box>
    );
};

export default EventCreationStep1Modal;