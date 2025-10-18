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

const CustomDatePicker = (props: any) => <CustomTextField {...props} fieldType="text" placeholder="YYYY-MM-DD" />;
const EventCreationStep2Details: React.FC<Step2Props> = ({ 
    onClose, 
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
                    <CustomDatePicker
                        label="Event Start Date"
                        value={values.eventStartDate}
                        onChange={handleChange('eventStartDate')}
                        onBlur={handleBlur('eventStartDate')}
                        error={touched.eventStartDate && Boolean(errors.eventStartDate)}
                        helperText={touched.eventStartDate && errors.eventStartDate}
                        sx={{ mb: 1 }} 
                        required
                    />
                     {/* End Date/Time */}
                    <CustomDatePicker
                        label="Event End Date"
                        value={values.eventEndDate}
                        onChange={handleChange('eventEndDate')}
                        onBlur={handleBlur('eventEndDate')}
                        error={touched.eventEndDate && Boolean(errors.eventEndDate)}
                        helperText={touched.eventEndDate && errors.eventEndDate}
                        sx={{ mb: 1 }} 
                        required
                    />
                    </Box>

                {/* 2. Full Agenda */}
                <CustomTextField 
                    name='fullAgenda'
                    fieldType="text"
                    label="Conference Agenda"
                    placeholder="Enter full agenda"
                    value={values.fullAgenda} // 💡 From Formik context
                    onChange={handleChange('fullAgenda')} // 💡 From Formik context
                    onBlur={handleBlur('fullAgenda')} // 💡 For validation
                    error={touched.fullAgenda && Boolean(errors.fullAgenda)} // 💡 For validation
                    sx={{ mb: 1 }} 
                    required
                 />
                 {/* 3. Conference Website Link */}
                <CustomTextField
                    name='websiteLink'
                    label="Website URL"
                    fieldType="text"
                    placeholder="https://example.guc.edu.eg"
                    value={values.websiteLink}
                    onChange={handleChange('websiteLink')}
                    onBlur={handleBlur('websiteLink')}
                    error={touched.websiteLink && Boolean(errors.websiteLink)}
                    sx={{ mb: 1 }} 
                />
                {/* 4. Required Budget */}
                <CustomTextField
                    name='requiredBudget'
                    label="Budget Amount (EGP)"
                    fieldType="numeric"
                    placeholder="Enter required budget"
                    value={values.requiredBudget}
                    onChange={handleChange('requiredBudget')}
                    onBlur={handleBlur('requiredBudget')}
                    error={touched.requiredBudget && Boolean(errors.requiredBudget)}
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

        </Box>
            );
};

export default EventCreationStep2Details;