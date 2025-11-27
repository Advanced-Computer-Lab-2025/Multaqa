import React, { useState } from 'react';
import { useFormik } from 'formik';
import dayjs from 'dayjs';

import { Grid, Typography, Box, Paper, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField } from '@mui/material';
import { CustomSelectField, CustomTextField } from '../../shared/input-fields';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CustomButton from '../../shared/Buttons/CustomButton';
import RichTextField from '@/components/shared/TextField/TextField';
import { wrapperContainerStyles, detailTitleStyles, modalFooterStyles, horizontalLayoutStyles, step1BoxStyles, step2BoxStyles, modalHeaderStyles, modalFormStyles } from '@/components/shared/styles';
import theme from '@/themes/lightTheme';
import { toast } from 'react-toastify';

import { bazaarSchema } from "../CreateBazaar/schemas/bazaar";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { CustomModalLayout } from '@/components/shared/modals';
import { api } from '@/api';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';


// --- Shared Styles (Updated to use color prop) ---

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

// --- Component Interface ---

interface EditBazaarProps {
  bazaarId: string;
  bazaarName: string;
  location: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  registrationDeadline: Date | null;
  open: boolean;
  onClose: () => void;
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
  color: string;
}

const EditBazaar = ({ bazaarId, bazaarName, location, description, startDate, endDate, registrationDeadline, open, onClose, setRefresh, color }: EditBazaarProps) => {

  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [response, setResponse] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Use the color prop as accent color, fallback to theme if not provided
  const accentColor = color || theme.palette.primary.main;

  // Create styles with the accent color
  const tertiaryInputStyles = createTertiaryInputStyles(accentColor);
  const contentPaperStyles = createContentPaperStyles(accentColor);

  // Tab state for sections (2 tabs)
  const tabSections = [
    { key: 'general', label: 'General Info', icon: <InfoOutlinedIcon /> },
    { key: 'description', label: 'Description', icon: <DescriptionOutlinedIcon /> },
  ];
  const [activeTab, setActiveTab] = useState('general');

  const initialValues = {
    bazaarName: bazaarName,
    location: location,
    description: description,
    startDate: startDate ? dayjs(startDate) : null,
    endDate: endDate ? dayjs(endDate) : null,
    registrationDeadline: registrationDeadline ? dayjs(registrationDeadline) : null,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCallApi = async (payload: any) => {
    setLoading(true);
    setError(null);
    setResponse([]);
    try {
      const res = await api.patch("/events/" + bazaarId, payload);
      setResponse(res.data);
      if (setRefresh) {
        setRefresh((refresh) => !refresh);
      }
      toast.success("Bazaar edited successfully", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message || "API call failed");
      window.alert(err.response.data.error);
      toast.error("Failed to edit bazaar. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setActiveTab('general');
  };

  // Logic to find the first error and switch tab
  const getFirstErrorTab = (errors: any): 'general' | 'description' | null => {
    const generalFields = ['bazaarName', 'location', 'startDate', 'endDate', 'registrationDeadline'];

    // 1. Check General Info tab
    for (const field of generalFields) {
      if (errors[field]) {
        return 'general';
      }
    }

    // 2. Check Description tab
    if (errors.description) {
      return 'description';
    }

    return null;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (values: any, actions: any) => {

    // Manually run validation before proceeding
    const validationErrors = await actions.validateForm();

    if (Object.keys(validationErrors).length > 0) {
      const errorTab = getFirstErrorTab(validationErrors);

      if (errorTab) {
        setActiveTab(errorTab);
        toast.error("Please fill out all required fields.", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
      return; // Stop submission if there are validation errors
    }

    onClose();
    const startDateObj = values.startDate; // dayjs object
    const endDateObj = values.endDate;
    const registrationDeadlineObj = values.registrationDeadline;
    setActiveTab('general'); // Reset to General Info tab after submission

    const payload = {
      type: "bazaar",
      eventName: values.bazaarName,
      location: values.location,
      description: values.description,
      eventStartDate: startDateObj ? startDateObj.toISOString() : null,
      eventEndDate: endDateObj ? endDateObj.toISOString() : null,
      eventStartTime: startDateObj ? startDateObj.format("HH:mm") : null,
      eventEndTime: endDateObj ? endDateObj.format("HH:mm") : null,
      registrationDeadline: registrationDeadlineObj ? registrationDeadlineObj.toISOString() : null,
    };
    await handleCallApi(payload);
  };


  const { handleSubmit, values, isSubmitting, handleChange, handleBlur, setFieldValue, errors, touched } = useFormik({
    initialValues,
    validationSchema: bazaarSchema,
    onSubmit: onSubmit,
    validateOnChange: true,
    validateOnBlur: true,
  });

<<<<<<< HEAD
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
  
=======
  // Check if tabs have errors
  const generalHasErrors = !!(
    (errors.bazaarName && touched.bazaarName) ||
    (errors.startDate && touched.startDate) ||
    (errors.endDate && touched.endDate) ||
    (errors.registrationDeadline && touched.registrationDeadline) ||
    (errors.location && touched.location)
  );

  const descriptionHasErrors = !!(errors.description && touched.description);

>>>>>>> 11f3aa90 (merge: hatem's to salma's)
  const handleDescriptionChange = (htmlContent: string) => {
    setFieldValue('description', htmlContent);
  };

  return (
    <CustomModalLayout open={open} borderColor={accentColor} title="Edit Bazaar" onClose={handleClose} width="w-[95vw] xs:w-[80vw] lg:w-[60vw] xl:w-[60vw]">
        {/* Outer Box matching CreateTrip/CreateBazaar's structure for consistent sizing */}
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
                 

<<<<<<< HEAD
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
=======
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
                width: '220px',
                flexShrink: 0,
                background: theme.palette.background.paper,
                borderRadius: '32px',
                border: `1.5px solid ${theme.palette.grey[300]}`,
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
                        <ListItemIcon sx={{
                          minWidth: 36, color: activeTab === section.key ? accentColor : theme.palette.text.primary, '&:hover': {
                            color: accentColor
                          },
                        }}>{section.icon}</ListItemIcon>
                        <ListItemText primary={section.label} primaryTypographyProps={{ fontWeight: 700 }} />
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
                  );
                })}
              </List>
            </Box>
>>>>>>> 11f3aa90 (merge: hatem's to salma's)

                                <Box sx={{ display: "flex", flexDirection: "column", flex: 1, marginTop: "24px" }}>
                                    <CustomSelectField
                                      label="Location"
                                      fieldType="single"
                                      options={[
                                        { label: "GUC Cairo", value: "GUC Cairo" },
                                        { label: "GUC Berlin", value: "GUC Berlin" },
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
                              label={isSubmitting ? "Submitting" : 'Edit'} 
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
<<<<<<< HEAD
                </Box>
            </form>
        </Box>
=======

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
                        { label: "GUC Cairo", value: "GUC Cairo" },
                        { label: "GUC Berlin", value: "GUC Berlin" },
                      ]}
                      value={values.location}
                      onChange={(e: any) => setFieldValue("location", e.target ? e.target.value : e)}
                      name="location"
                      usePortalPositioning={true}
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
                    placeholder="Provide a short description of the bazaar"
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
                  disabled={isSubmitting}
                  label={isSubmitting ? "Submitting" : 'Edit'}
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
>>>>>>> 11f3aa90 (merge: hatem's to salma's)
    </CustomModalLayout>
  )
}

export default EditBazaar;