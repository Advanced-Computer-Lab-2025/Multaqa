"use client";
import * as React from 'react';
import { Box, Typography} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useFormikContext } from 'formik'; // 💡 Import Formik hook
import CustomTextField from '@/components/shared/input-fields/CustomTextField';
import CustomButton from '../Buttons/CustomButton';
import { step2BoxStyles, modalFormStyles, modalFooterStyles,modalHeaderStyles, detailTitleStyles } from './styles';
import { EventFormData } from './types';
import ExtraResourcesField from './ExtraResourcesField';
import { CustomCheckboxGroup, CustomRadio} from '../input-fields';
import { Step2Props } from './types';

const CustomDateTimePicker = (props: any) => <CustomTextField {...props} fieldType="text" placeholder="YYYY-MM-DD HH:MM" />;
const EventCreationStep2Details: React.FC<Step2Props> = ({ 
    onClose, 
    onFinalSubmit 
}) => {
    const formik = useFormikContext<EventFormData>();
    const { values, handleChange, handleBlur, errors, touched, setFieldValue } = formik;
    const theme = useTheme();

    const handleSelectChange = (value: string | number | string[] | number[]) => {
       setFieldValue('fundingSource', value as string);
     }
    
    const handleCheckboxChange = (selectedValues: string[]) => {
      setFieldValue('resources', selectedValues);
    };
    return (
        <Box sx={step2BoxStyles(theme)}> 
            <Box sx={modalHeaderStyles}>
                <Typography sx={detailTitleStyles(theme)}>
                    Conference Details
                </Typography>      
            </Box>
           <Box sx={modalFormStyles}>  
                {/* 1. Start and End Dates/Times */}
                <Box sx={{display:"flex", gap:1, mt:0}}>
                    {/* Start Date/Time */}
                    <CustomDateTimePicker
                        label="Start Date/Time"
                        value={values.startDate}
                        onChange={handleChange('startDate')}
                        onBlur={handleBlur('startDate')}
                        error={touched.startDate && Boolean(errors.startDate)}
                        helperText={touched.startDate && errors.startDate}
                        sx={{ mb: 1 }} 
                        required
                    />
                     {/* End Date/Time */}
                    <CustomDateTimePicker
                        label="End Date/Time"
                        value={values.endDate}
                        onChange={handleChange('endDate')}
                        onBlur={handleBlur('endDate')}
                        error={touched.endDate && Boolean(errors.endDate)}
                        helperText={touched.endDate && errors.endDate}
                        sx={{ mb: 1 }} 
                        required
                    />
                    </Box>

                {/* 2. Full Agenda */}
                <CustomTextField 
                    name='agenda'
                    fieldType="text"
                    label="Conference Agenda"
                    placeholder="Enter full agenda"
                    value={values.agenda} // 💡 From Formik context
                    onChange={handleChange('agenda')} // 💡 From Formik context
                    onBlur={handleBlur('agenda')} // 💡 For validation
                    error={touched.agenda && Boolean(errors.agenda)} // 💡 For validation
                    sx={{ mb: 1 }} 
                    required
                 />
                 {/* 3. Conference Website Link */}
                <CustomTextField
                    name='website'
                    label="Website URL"
                    fieldType="text"
                    placeholder="https://example.guc.edu.eg"
                    value={values.website}
                    onChange={handleChange('website')}
                    onBlur={handleBlur('website')}
                    error={touched.website && Boolean(errors.website)}
                    sx={{ mb: 1 }} 
                />
                {/* 4. Required Budget */}
                <CustomTextField
                    name='budget'
                    label="Budget Amount (EGP)"
                    fieldType="numeric"
                    placeholder="Enter required budget"
                    value={values.budget}
                    onChange={handleChange('budget')}
                    onBlur={handleBlur('budget')}
                    error={touched.budget && Boolean(errors.budget)}
                    sx={{ mb: 1, mt:0 }} 
                    required
                />

                 {/* 5. Source of Funding (Select Field) */}
                <CustomCheckboxGroup
                    label="Source of Funding"
                    row={true} 
                    enableMoreThanOneOption={false}
                    size='small'
                    options={[
                        { label: 'GUC Internal Funds', value: 'GUC' },
                        { label: 'External Sponsor', value: 'External' },
                        { label: 'Hybrid', value: 'Hybrid' },
                    ]}
                    onChange={handleSelectChange} 
                    onRadioChange={handleSelectChange}
                    error={touched.fundingSource && Boolean(errors.fundingSource)}
                    />
                <ExtraResourcesField />
                 </Box>    
           {/* Footer */}
            <Box sx={modalFooterStyles}>
            <CustomButton color="tertiary" type='submit' variant="contained" sx={{px: 1.5, width:"200px", height:"32px" ,fontWeight: 600, padding:"12px", fontSize:"14px"}}>
                    Create 
            </CustomButton>
            </Box>
        </Box>
            );
};

export default EventCreationStep2Details;