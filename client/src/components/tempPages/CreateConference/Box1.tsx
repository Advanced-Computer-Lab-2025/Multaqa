// components/Create/EventCreationStep1Modal.tsx
"use client";
import * as React from 'react';
import { Box, Typography, TextField, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import { useFormikContext } from 'formik'; 
import RichTextField from '../../shared/TextField/TextField'; 
import { CustomTextField } from '@/components/shared/input-fields';
import { step1BoxStyles, modalFormStyles,modalHeaderStyles,detailTitleStyles } from '../../shared/styles';
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
                    General Information
                </Typography>      
            </Box>
            <Box sx={modalFormStyles}>
                <CustomTextField 
                    name='Conference Name'
                    id='Conference Name'
                    label="Conference Name"    
                    fieldType='text'
                    placeholder='Enter Conference Name'
                    value={values.eventName}
                    onChange={handleChange('eventName')}
                    onBlur={handleBlur('eventName')}
                    fullWidth
                    autoCapitalize='off'
                    autoCapitalizeName={false}
                />  
                <CustomTextField
                    name='websiteLink'
                    label="Website URL"
                    fieldType="text"
                    placeholder="https://example.guc.edu.eg"
                    value={values.websiteLink}
                    onChange={handleChange('websiteLink')}
                    error={touched.websiteLink && Boolean(errors.websiteLink)}
                    autoCapitalize='off'
                    autoCapitalizeName={false}
                    sx={{ marginTop: "8px" }}
                />
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