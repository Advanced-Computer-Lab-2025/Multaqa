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
                <RichTextField
                    name="description"
                    label="Description" 
                    placeholder="Provide a short description of the conference"
                />
                <Box sx={{ mt: 3 }}>
                    <RichTextField
                        name="fullAgenda"
                        label="Full Agenda" 
                        placeholder="Provide the full agenda of the workshop"
                    />
                    { errors.fullAgenda && touched.fullAgenda ? <p style={{color:"#db3030"}}>{errors.fullAgenda}</p> : <></>}
                </Box>
                
            </Box>
        </Box>
    );
};

export default EventCreationStep1Modal;