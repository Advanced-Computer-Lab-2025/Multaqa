"use client";
import * as React from 'react';
import { Box, Chip, Typography} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useFormikContext } from 'formik'; // 💡 Import Formik hook
import CustomTextField from '@/components/shared/input-fields/CustomTextField';
import { step2BoxStyles, modalFormStyles,modalHeaderStyles, detailTitleStyles } from '../../shared/styles';
import { EventFormData } from './types';
import { CustomCheckboxGroup,CustomSelectField} from '../../shared/input-fields';
import { Step2Props } from './types';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CustomIcon from '@/components/shared/Icons/CustomIcon';
import dayjs, { Dayjs } from 'dayjs';


const EventCreationStep2Details: React.FC<Step2Props> = ({ 
    onClose, 
}) => {
    const formik = useFormikContext<EventFormData>();
    const { values, handleChange, handleBlur, errors, touched, setFieldValue } = formik;
    const theme = useTheme();
    const [resourceInput, setResourceInput] = React.useState<string>("");

    const handleSelectChange = (value: string | number | string[] | number[]) => {
       setFieldValue('fundingSource', value as string);
     }
    
    return (
        <Box sx={step2BoxStyles(theme)}> 
            <Box sx={modalHeaderStyles}>
                <Typography sx={detailTitleStyles(theme)}>
                    Conference Details
                </Typography>      
            </Box>
           <Box sx={modalFormStyles}>  
                <Box sx={{ display: "flex", gap: 1, marginTop: "12px", marginBottom: "12px" }}>
                <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        name="eventStartDate"
                        label="Start Date and Time"
                        slotProps={{
                        textField: {
                            variant: "standard",
                            fullWidth: true,
                        },
                        popper: {
                            disablePortal: true,
                            placement: "right",
                            sx: { zIndex: 1500 },
                        },
                        }}
                    value={values.eventStartDate}
                    onChange={(value) => setFieldValue("eventStartDate", value)}
                    />
                    </LocalizationProvider>
                    {errors.eventStartDate && touched.eventStartDate && (
                    <p style={{ color: "#db3030", marginTop: "4px" }}>{errors.eventStartDate}</p>
                    )}
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="End Date and Time"
                        name="eventEndDate"
                        slotProps={{
                        textField: {
                            variant: "standard",
                            fullWidth: true,
                        },
                        popper: {
                            disablePortal: true,
                            placement: "left",
                            sx: { zIndex: 1500 },
                        },
                        }}
                        value={values.eventEndDate}
                        onChange={(value) => setFieldValue("eventEndDate", value)}
                    />
                    </LocalizationProvider>
                    {errors.eventEndDate && touched.eventEndDate && (
                    <p style={{ color: "#db3030", marginTop: "4px" }}>{errors.eventEndDate}</p>
                    )}
                </Box>
                </Box>
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
                    sx={{ mb: 1, mt:"8px" }} 
                    required
                />

                 {/* 5. Source of Funding (Select Field) */}
                <Box sx={{ display: "flex", flexDirection: "column", flex: 1, marginTop: "16px", marginBottom:"16px" }}>
                    <CustomSelectField
                    label="Funding"
                    fieldType="single"
                    options={[
                    { label: 'GUC', value: 'GUC' },
                    { label: 'External', value: 'External' },
                    ]}
                    value={values.fundingSource}
                    onChange={(e: any) => setFieldValue('fundingSource', e.target ? e.target.value : e)} name={''}            />
                {errors.fundingSource && touched.fundingSource && (<p style={{ color: "#db3030" }}>{errors.fundingSource}</p>)}    
                </Box>

                <Typography sx={detailTitleStyles(theme)}> Extra Resources </Typography>
          <Box sx={{display:"flex", gap:1, marginTop: "6px",marginBottom:"12px", alignItems: "center" }}>
                  <CustomTextField 
              label='Extra Resources'
              name='extraResources'
              id = 'extraResources' 
              fieldType='text' 
              neumorphicBox
              value={resourceInput}
              onChange={(e: any) => setResourceInput(e.target.value)}
              placeholder="e.g., Lab Equipment"
              autoCapitalize='off'
              autoCapitalizeName={false}
            />
            <CustomIcon
              icon="add"
              size="small"
              containerType="outwards"
              onClick={() => {
                const trimmed = resourceInput.trim();
                if (trimmed && !values.extraRequiredResources.includes(trimmed)) {
                  setFieldValue("extraRequiredResources", [...values.extraRequiredResources, trimmed]);
                  setResourceInput("");
                }
              }}
            />
           </Box> 
          
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginBottom: "12px" }}>
              {values.extraRequiredResources.map((res) => (
                <Chip
                  key={res}
                  label={res}
                  onDelete={() =>
                    setFieldValue(
                      "extraRequiredResources",
                      values.extraRequiredResources.filter((r) => r !== res)
                    )
                  }
                  color="primary"
                  variant="outlined"
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
                 </Box>    
           {/* Footer */}

        </Box>
            );
};

export default EventCreationStep2Details;