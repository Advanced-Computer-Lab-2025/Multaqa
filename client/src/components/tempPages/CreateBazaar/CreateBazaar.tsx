import React, { useState } from 'react';
import { useFormik } from 'formik';
import dayjs from 'dayjs';

import { Grid, Typography, Box, Paper, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField } from '@mui/material';
import { CustomSelectField, CustomTextField } from '../../shared/input-fields';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CustomButton from '../../shared/Buttons/CustomButton';
import RichTextField from '../../shared/TextField/TextField';
import theme from '@/themes/lightTheme';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { wrapperContainerStyles, detailTitleStyles, modalFooterStyles, horizontalLayoutStyles, step1BoxStyles, step2BoxStyles, modalHeaderStyles, modalFormStyles } from '@/components/shared/styles';

import { bazaarSchema } from "./schemas/bazaar";

import { api } from "../../../api";
import { CustomModalLayout } from '@/components/shared/modals';
import { toast } from 'react-toastify';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

// Create tertiaryInputStyles as a function that accepts color
const createTertiaryInputStyles = (accentColor: string) => ({
  '& .MuiInputLabel-root': {
    color: theme.palette.grey[500],
    '&.Mui-focused': { color: accentColor },
  },
  '& .MuiInputBase-input': {
    color: '#000000',
    '&::placeholder': {
      color: theme.palette.grey[400],
      opacity: 1,
    },
  },
  '& .MuiInput-underline:before': {
    borderBottomColor: theme.palette.grey[400],
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    borderBottomColor: accentColor,
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: accentColor,
  },
});

// Create contentPaperStyles as a function that accepts color
const createContentPaperStyles = (accentColor: string) => ({
  p: { xs: 1, md: 3 },
  borderRadius: '32px',
  background: theme.palette.background.paper,
  border:`1.5px solid ${accentColor}`,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  boxShadow: `0 4px 24px 0 ${accentColor}14`,
  transition: 'box-shadow 0.2s',
});

const initialValues = {
    bazaarName: '',
    location: '',
    description: '',
    startDate: null,
    endDate: null,
    registrationDeadline: null,
};


interface CreateBazaarProps {
    open:boolean;
    onClose: () => void;
    setRefresh:React.Dispatch<React.SetStateAction<boolean>>;
    color: string;
 }

const CreateBazaar = ({open, onClose, setRefresh, color}: CreateBazaarProps) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Use the color prop as accent color, fallback to theme if not provided
  const accentColor = color || theme.palette.primary.main;

  // Create styles with the accent color
  const tertiaryInputStyles = createTertiaryInputStyles(accentColor);
  const contentPaperStyles = createContentPaperStyles(accentColor);

  // Updated Tab state for sections (2 tabs now)
  const tabSections = [
    { key: 'general', label: 'General Info', icon: <InfoOutlinedIcon /> },
    { key: 'description', label: 'Description', icon: <DescriptionOutlinedIcon /> },
  ];
  const [activeTab, setActiveTab] = useState('general');


  const handleCallApi = async (payload:any) => {    
    setLoading(true);
    setError(null);
    setResponse([]);
    try {
        const res = await api.post("/events", payload);
        setResponse(res.data);
        setRefresh((prev)=> !prev);
        toast.success("Bazaar created successfully", {
            position:"bottom-right",
            autoClose:3000,
            theme: "colored",
        })
    } catch (err: any) {
        setError(err?.message || "API call failed");
        window.alert(err.response.data.error);
        toast.error("Failed to create bazaar. Please try again.", {
            position:"bottom-right",
            autoClose:3000,
            theme: "colored",
            });
    } finally {
        setLoading(false);
    }
    };
    
  

  const onSubmit = async (values: any, actions: any) => {
    onClose();
    const startDateObj = values.startDate; // dayjs object
    const endDateObj = values.endDate;
    const registrationDeadlineObj = values.registrationDeadline;

    const payload = {
        type:"bazaar",
        eventName: values.bazaarName,
        location: values.location,
        description: values.description,
        eventStartDate: startDateObj ? startDateObj.toISOString() : null, // "2025-05-20T07:00:00Z"
        eventEndDate: endDateObj ? endDateObj.toISOString() : null,       // "2025-05-20T19:00:00Z"
        eventStartTime: startDateObj ? startDateObj.format("HH:mm") : null, // "07:00"
        eventEndTime: endDateObj ? endDateObj.format("HH:mm") : null,       // "19:00"
        registrationDeadline: registrationDeadlineObj ? registrationDeadlineObj.toISOString() : null, // "2025-05-15T23:59:59Z"
    };
    actions.resetForm();
    handleCallApi(payload);
  };

  const {handleSubmit, values,isSubmitting, handleChange, handleBlur, setFieldValue, errors, touched} = useFormik({
    initialValues,
    validationSchema: bazaarSchema,
    onSubmit: onSubmit,
    validateOnChange: true, 
    validateOnBlur: true,
  });

 // Check if tabs have errors
    const generalHasErrors = !!(
        (errors.bazaarName && touched.bazaarName) ||
        (errors.startDate && touched.startDate) ||
        (errors.endDate && touched.endDate) ||
        (errors.registrationDeadline && touched.registrationDeadline) ||
        (errors.description && touched.description) ||
        (errors.location && touched.location)
    );

    const descriptionHasErrors = !!(errors.description && touched.description);

const handleDescriptionChange = (htmlContent: string) => {
    setFieldValue('description', htmlContent);
    };

const handleClose = () => {
onClose();
setActiveTab('general');
};

  return (
    <CustomModalLayout open={open} borderColor={accentColor} title="Create Bazaar" onClose={handleClose} width="w-[95vw] xs:w-[80vw] lg:w-[60vw] xl:w-[60vw]">
        {/* Outer Box matching CreateTrip's structure for consistent sizing */}
        <Box sx={{ 
          background: '#fff',
          borderRadius: '32px',
          p: 3,
          height: '600px', // Fixed height for consistent modal size
          display: 'flex',
          flexDirection: 'column'
        }}>
            
            <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flex: 1, // Allows this container to grow and take all available space
                    gap: 3,
                    minHeight: 0, // Important for flex container with nested scrolling content
                }}>
                                             <Box
                                               sx={{
                                                 width: '250px', 
                                                 flexShrink: 0,
                                                 background: theme.palette.background.paper,
                                                 borderRadius: '32px',
                                                 border:`1.5px solid ${accentColor}`,
                                                 p: 2,
                                                 display: 'flex',
                                                 flexDirection: 'column',
                                                 alignItems: 'flex-start',
                                                 boxShadow: `0 4px 24px 0 ${accentColor}14`,
                                                 transition: 'box-shadow 0.2s',
                                                 height: 'fit-content', 
                                                 alignSelf: 'flex-start', 
                                               }}
                                             >
                                                <List sx={{ width: '100%', height: '100%' }}>
                                              {tabSections.map((section) => {
                                                  const hasError = section.key === 'general' ? generalHasErrors : section.key === 'description' ? descriptionHasErrors : false;
                                                  
                                                  return (
                                                  <ListItem key={section.key} disablePadding>
                                                      <ListItemButton
                                                          selected={activeTab === section.key}
                                                          onClick={() => setActiveTab(section.key)}
                                                          sx={{
                                                              borderRadius: '24px',
                                                              mb: 1.5,
                                                              px: 2.5,
                                                              py: 1.5,
                                                              fontWeight: 600,
                                                              fontSize: '1.08rem',
                                                              background: activeTab === section.key ? 'rgba(110, 138, 230, 0.08)' : 'transparent',
                                                              color: activeTab === section.key ? accentColor : theme.palette.text.primary,
                                                              boxShadow: activeTab === section.key ? '0 2px 8px 0 rgba(110, 138, 230, 0.15)' : 'none',
                                                              transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
                                                              '&:hover': {
                                                                  background: 'rgba(110, 138, 230, 0.05)',
                                                                  color: accentColor,
                                                              },
                                                          }}
                                                      >
                                                          <ListItemIcon sx={{ minWidth: 36, color: activeTab === section.key ? accentColor : theme.palette.text.primary, '&:hover': {
                                                                color: accentColor
                                                              }, }}>{section.icon}</ListItemIcon>
                                                          <ListItemText primary={section.label} primaryTypographyProps={{ fontWeight:700, mr:2 }} />
                                                          {hasError && (
                                                              <ErrorOutlineIcon 
                                                                  sx={{ 
                                                                      color: '#db3030', 
                                                                      fontSize: '20px',
                                                                      ml: 'auto'
                                                                  }} 
                                                              />
                                                          )}
                                                      </ListItemButton>
                                                  </ListItem>
                                              )})}
                                          </List>
                                             </Box>
                 

                    {/* Section Content on the right - Takes remaining width and all available height */}
                    <Box sx={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      minHeight: 0, 
                      height: '100%', 
                    }}>
                        {/* General Info Tab (All fields except description) */}
                        {activeTab === 'general' && (
                            <Paper elevation={0} sx={contentPaperStyles}>
                                <CustomTextField 
                                    name='bazaarName'
                                    id='bazaarName'
                                    label="Bazaar Name" 
                                    fullWidth 
                                    placeholder='Enter Bazaar Name' 
                                    fieldType="text"
                                    value={values.bazaarName}
                                    onChange={handleChange}
                                    autoCapitalize='off'
                                    autoCapitalizeName={false}
                                    sx={{ mt: 1, mb: 2 }}
                                />
                                { errors.bazaarName && touched.bazaarName ? 
                                    <Typography sx={{ color: "#db3030", fontSize: '0.875rem', mt: -1.5, mb: 1 }}>{errors.bazaarName}</Typography> 
                                : <></>}
                                
                                {/* Date/Time Pickers section */}
                                <Box sx={{ display: "flex", gap: 2, marginBottom: "12px" }}> 
                                    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DateTimePicker
                                                name="startDate"
                                                label="Start Date and Time"
                                                slotProps={{
                                                    textField: { variant: "standard", fullWidth: true, sx: tertiaryInputStyles },
                                                }}
                                                value={values.startDate}
                                                onChange={(value) => setFieldValue("startDate", value)}
                                            />
                                        </LocalizationProvider>
                                        {errors.startDate && touched.startDate && (
                                            <Typography sx={{ color: "#db3030", fontSize: '0.875rem', mt: 0.5 }}>{errors.startDate}</Typography>
                                        )}
                                    </Box>
                    
                                    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DateTimePicker
                                                label="End Date and Time"
                                                name="endDate"
                                                slotProps={{
                                                    textField: { variant: "standard", fullWidth: true, sx: tertiaryInputStyles },
                                                }}
                                                value={values.endDate}
                                                onChange={(value) => setFieldValue("endDate", value)}
                                            />
                                        </LocalizationProvider>
                                        {errors.endDate && touched.endDate && (
                                            <Typography sx={{ color: "#db3030", fontSize: '0.875rem', mt: 0.5 }}>{errors.endDate}</Typography>
                                        )}
                                    </Box>
                                </Box>
                                
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        name='registrationDeadline'
                                        label="Deadline to Register"
                                        slotProps={{
                                            textField: { variant: "standard", fullWidth: true, sx: tertiaryInputStyles },
                                        }}
                                        value={values.registrationDeadline}
                                        onChange={(value) => setFieldValue('registrationDeadline', value)}
                                    />
                                    {errors.registrationDeadline && touched.registrationDeadline ? 
                                        <Typography sx={{ color: "#db3030", fontSize: '0.875rem', mb: 2 }}>{errors.registrationDeadline}</Typography> 
                                    : <></>}
                                </LocalizationProvider>

                                <Box sx={{ display: "flex", flexDirection: "column", flex: 1, marginTop: "24px" }}>
                              <CustomSelectField
                                      label="Location"
                                      fieldType="single"
                                      options={[
                                      { label: "Platform", value: "Platform" },
                                      { label: "B Building", value: "B Building" },
                                      { label: "D Building", value: "D Building" },
                                      { label: "A Building", value: "A Building" },
                                      { label: "C Building", value: "C Building" },
                                      { label: "Football Court", value: "Football Court" },
                                      ]}
                                      value={values.location}
                                      onChange={(e: any) => setFieldValue("location", e.target ? e.target.value : e)} 
                                      name="location"
                                    />
                                    {errors.location && touched.location && (
                                        <Typography sx={{ color: "#db3030", fontSize: '0.875rem', mt: 0.5 }}>{errors.location}</Typography>
                                    )}
                                </Box>
                            </Paper>
                        )}

                         {/* Description Tab */}
                                    {activeTab === 'description' && (
                                      <Paper elevation={0} sx={contentPaperStyles}>
                                        <TextField
                                          name="description"
                                          placeholder="Provide a short description of the trip"
                                          value={values.description}
                                          onChange={handleChange}
                                          fullWidth
                                          multiline
                                          rows={16}
                                          sx={{ 
                                              flex: 1,
                                              '& .MuiOutlinedInput-root': {
                                                  height: '100%',
                                                  alignItems: 'flex-start',
                                                  '&:hover .MuiOutlinedInput-notchedOutline': {
                                                      borderColor: accentColor,
                                                  },
                                                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                      borderColor: accentColor,
                                                      borderWidth: '2px',
                                                  },
                                              },
                                              '& .MuiOutlinedInput-notchedOutline': {
                                                  borderRadius: '16px',
                                                  borderColor: theme.palette.grey[300],
                                              },
                                              '& .MuiInputBase-input': {
                                                  height: '100% !important',
                                                  overflow: 'auto !important',
                                              }
                                          }}
                                        />
                                        {errors.description && touched.description && (
                                          <Typography sx={{ color: "#db3030", fontSize: '0.875rem', mt: 1 }}>
                                            {errors.description}
                                          </Typography>
                                        )}
                                      </Paper>
                                    )}
                      
                        {/* Submit Button */}
                        <Box sx={{ mt: 2, textAlign: "right", width: '100%', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <CustomButton 
                              disabled={isSubmitting } 
                              label={isSubmitting ? "Submitting" : 'Create'} 
                              variant='contained' 
                              color='tertiary' 
                              type='submit' 
                              sx={{ 
                                px: 3, 
                                width: "180px", 
                                height: "40px", 
                                fontWeight: 700, 
                                fontSize: "16px", 
                                borderRadius: '20px', 
                                boxShadow: `0 2px 8px 0 ${accentColor}20`,
                                background: accentColor,
                                '&:hover': {
                                  background: `${accentColor}E6`,
                                }
                              }}
                            />
                        </Box>
                    </Box>
                </Box>
            </form>
        </Box>
    </CustomModalLayout>
  )
}

export default CreateBazaar;