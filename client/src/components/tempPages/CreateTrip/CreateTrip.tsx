import React, { useState } from 'react';
import { useFormik, Formik } from 'formik';


import { CustomSelectField, CustomTextField } from '@/components/shared/input-fields';
import { Box, Grid, TextField, Typography, Paper, CardContent, AccordionDetails, Tabs, Tab, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import theme from '@/themes/lightTheme';

import InputAdornment from '@mui/material/InputAdornment';
import CustomButton from '@/components/shared/Buttons/CustomButton';
import { themes } from 'storybook/internal/theming';

import { tripSchema } from "./schemas/trip";

import StyledAccordion from '@/components/shared/Accordion/StyledAccordion';
import StyledAccordionSummary from '@/components/shared/Accordion/StyledAccordionSummary';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { api } from "../../../api";
import { CustomModalLayout } from '@/components/shared/modals';
import RichTextField from '@/components/shared/TextField/TextField';
import { wrapperContainerStyles, detailTitleStyles, modalFooterStyles, horizontalLayoutStyles, step1BoxStyles, step2BoxStyles, modalHeaderStyles, modalFormStyles } from '@/components/shared/styles';
import { toast } from 'react-toastify';


interface CreateTripProps {
  open: boolean;
  onClose: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  color: string;
}

<<<<<<< HEAD

const CreateTrip = ({open, onClose, setRefresh, color }: CreateTripProps) => {
  const handleCallApi = async (payload:any) => {
    setLoading(true);
    setError(null);
    setResponse([]);
    try {
      // TODO: Replace with your API route
      const res = await api.post("/events", payload);
      setResponse(res.data);
      setRefresh((prev)=> !prev);
      toast.success("Trip created successfully", {
                  position:"bottom-right",
                  autoClose:3000,
                  theme: "colored",
              })
    } catch (err: any) {
      setError(err?.message || "API call failed");
      window.alert(err.response.data.error);
      toast.error("Failed to create trip. Please try again.", {
          position:"bottom-right",
          autoClose:3000,
          theme: "colored",
          });
    } finally {
      setLoading(false);
    }
  };
  const accentColor = color;

const tertiaryInputStyles = {
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
};

// Shared Paper styles for all tabs
const contentPaperStyles = {
  p: { xs: 1, md: 3 },
  borderRadius: '32px',
  background: theme.palette.background.paper,
  border: `1.5px solid ${accentColor}`,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  boxShadow: '0 4px 24px 0 rgba(110, 138, 230, 0.08)',
  transition: 'box-shadow 0.2s',

};
<<<<<<< fix/critical-ui-changes

=======
>>>>>>> 11f3aa90 (merge: hatem's to salma's)
const CreateTrip = ({ open, onClose, setRefresh, color }: CreateTripProps) => {
  const handleCallApi = async (payload: any) => {
    setLoading(true);
    setError(null);
    setResponse([]);
    try {
      // TODO: Replace with your API route
      const res = await api.post("/events", payload);
      setResponse(res.data);
      setRefresh((prev) => !prev);
      toast.success("Trip created successfully", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
      })
    } catch (err: any) {
      setError(err?.message || "API call failed");
      window.alert(err.response.data.error);
      toast.error("Failed to create trip. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
=======
>>>>>>> main
=======
  const accentColor = color;

  const tertiaryInputStyles = {
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
  };

  // Shared Paper styles for all tabs
  const contentPaperStyles = {
    p: { xs: 1, md: 3 },
    borderRadius: '32px',
    background: theme.palette.background.paper,
    border: `1.5px solid ${theme.palette.grey[300]}`,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    boxShadow: `0 4px 24px 0 ${accentColor}14`,
    transition: 'box-shadow 0.2s',
  };

>>>>>>> 11f3aa90 (merge: hatem's to salma's)
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const initialValues = {
    tripName: '',
    location: '',
    price: 0,
    description: '',
    fullAgenda: '',
    startDate: null,
    endDate: null,
    registrationDeadline: null,
    capacity: 0,
  };

  const handleClose = () => {
    onClose();
    setActiveTab('general');
  };

  const onSubmit = async (values: any, actions: any) => {
    onClose();
    const startDateObj = values.startDate; // dayjs object
    const endDateObj = values.endDate;
    const registrationDeadlineObj = values.registrationDeadline;

    const payload = {
      type: "trip",
      eventName: values.tripName,
      location: values.location,
      price: values.price,
      description: values.description,
      eventStartDate: startDateObj ? startDateObj.toISOString() : null, // "2025-05-20T07:00:00Z"
      eventEndDate: endDateObj ? endDateObj.toISOString() : null,       // "2025-05-20T19:00:00Z"
      eventStartTime: startDateObj ? startDateObj.format("HH:mm") : null, // "07:00"
      eventEndTime: endDateObj ? endDateObj.format("HH:mm") : null,       // "19:00"
      registrationDeadline: registrationDeadlineObj ? registrationDeadlineObj.toISOString() : null, // "2025-05-15T23:59:59Z"
      capacity: values.capacity,
    };
    actions.resetForm();
    handleCallApi(payload);
  };

  const { handleSubmit, values, isSubmitting, handleChange, handleBlur, setFieldValue, errors, touched } = useFormik({
    initialValues,
    validationSchema: tripSchema,
    onSubmit: onSubmit,
  });

<<<<<<< fix/critical-ui-changes

  // Tab state for sections
  const tabSections = [
    { key: 'general', label: 'General Info', icon: <InfoOutlinedIcon /> },
    { key: 'description', label: 'Description', icon: <DescriptionOutlinedIcon /> },
    // { key: 'fullAgenda', label: 'Full Agenda', icon: <ListAltOutlinedIcon /> },
  ];
  const [activeTab, setActiveTab] = useState('general');
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  // Check if tabs have errors
  const generalHasErrors = !!(
    (errors.tripName && touched.tripName) ||
    (errors.startDate && touched.startDate) ||
    (errors.endDate && touched.endDate) ||
    (errors.registrationDeadline && touched.registrationDeadline) ||
    (errors.price && touched.price) ||
    (errors.capacity && touched.capacity) ||
    (errors.location && touched.location)
  );

  const descriptionHasErrors = !!(errors.description && touched.description);


=======
    // Check if tabs have errors
    const generalHasErrors = !!(
        (errors.tripName && touched.tripName) ||
        (errors.startDate && touched.startDate) ||
        (errors.endDate && touched.endDate) ||
        (errors.registrationDeadline && touched.registrationDeadline) ||
        (errors.price && touched.price) ||
        (errors.capacity && touched.capacity) ||
        (errors.location && touched.location)
    );

    const descriptionHasErrors = !!(errors.description && touched.description);

   
>>>>>>> main
  return (
    <CustomModalLayout open={open} borderColor={accentColor} title="Create Trip" onClose={handleClose} width="w-[95vw] xs:w-[80vw] lg:w-[60vw] xl:w-[60vw]">
      <Box sx={{
        background: '#fff',
        borderRadius: '32px',
        p: 3,
        height: '600px',
        display: 'flex',
        flexDirection: 'column'
      }}>

        <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            flex: 1,
            gap: 3,
            minHeight: 0,
          }}>
            {/* Sidebar - Fixed width */}
<<<<<<< fix/critical-ui-changes
            {/* Vertical Tabs on the left (Sidebar) */}
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

=======
           {/* Vertical Tabs on the left (Sidebar) */}
                                      <Box
                                        sx={{
                                          width: '250px', 
                                          flexShrink: 0,
                                          background: theme.palette.background.paper,
                                          borderRadius: '32px',
                                          border:`2px solid ${accentColor}`,
                                          p: 2,
                                          display: 'flex',
                                          flexDirection: 'column',
                                          alignItems: 'flex-start',
                                          boxShadow: '0 4px 24px 0 rgba(110, 138, 230, 0.08)',
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
          
>>>>>>> main

            {/* Content Area - Takes remaining space */}
            <Box sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
            }}>
              {/* General Info Tab */}
              {activeTab === 'general' && (
                <Paper elevation={0} sx={contentPaperStyles}>
                  <CustomTextField
                    name='tripName'
                    id='tripName'
                    label="Trip Name"
                    placeholder='Enter Trip Name'
                    value={values.tripName}
                    onChange={handleChange}
                    fullWidth
                    fieldType='text'
                    autoCapitalize='off'
                    autoCapitalizeName={false}
                    sx={{ mb: 2 }}
                  />
                  {errors.tripName && touched.tripName && (
                    <Typography sx={{ color: "#db3030", fontSize: '0.875rem', mt: -1.5, mb: 1 }}>
                      {errors.tripName}
                    </Typography>
                  )}

                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          name="startDate"
                          label="Start Date and Time"
                          slotProps={{
                            textField: {
                              variant: "standard",
                              fullWidth: true,
                              InputLabelProps: {
                                sx: {
                                  color: theme.palette.grey[500],
                                  '&.Mui-focused': { color: accentColor },
                                },
                              },
                              sx: {
                                color: accentColor,
                                '& .MuiInput-underline:before': {
                                  borderBottomColor: theme.palette.grey[400],
                                },
                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                  borderBottomColor: accentColor,
                                },
                                '& .MuiInput-underline:after': {
                                  borderBottomColor: accentColor,
                                },
                              },
                            },
                          }}
                          value={values.startDate}
                          onChange={(value) => setFieldValue("startDate", value)}
                        />
                      </LocalizationProvider>
                      {errors.startDate && touched.startDate && (
                        <Typography sx={{ color: "#db3030", fontSize: '0.875rem' }}>
                          {errors.startDate}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          name="endDate"
                          label="End Date and Time"
                          slotProps={{
                            textField: {
                              variant: "standard",
                              fullWidth: true,
                              InputLabelProps: {
                                sx: {
                                  color: theme.palette.grey[500],
                                  '&.Mui-focused': { color: accentColor },
                                },
                              },
                              sx: {
                                color: accentColor,
                                '& .MuiInput-underline:before': {
                                  borderBottomColor: theme.palette.grey[400],
                                },
                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                  borderBottomColor: accentColor,
                                },
                                '& .MuiInput-underline:after': {
                                  borderBottomColor: accentColor,
                                },
                              },
                            },
                          }}
                          value={values.endDate}
                          onChange={(value) => setFieldValue("endDate", value)}
                        />
                      </LocalizationProvider>
                      {errors.endDate && touched.endDate && (
                        <Typography sx={{ color: "#db3030", fontSize: '0.875rem' }}>
                          {errors.endDate}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      name='registrationDeadline'
                      label="Deadline to Register"
                      slotProps={{
                        textField: {
                          variant: "standard",
                          fullWidth: true,
                          InputLabelProps: {
                            sx: {
                              color: theme.palette.grey[500],
                              '&.Mui-focused': { color: accentColor },
                            },
                          },
                          sx: {
                            color: accentColor,
                            '& .MuiInput-underline:before': {
                              borderBottomColor: theme.palette.grey[400],
                            },
                            '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                              borderBottomColor: accentColor,
                            },
                            '& .MuiInput-underline:after': {
                              borderBottomColor: accentColor,
                            },
                          },
                        },
                      }}
                      value={values.registrationDeadline}
                      onChange={(value) => setFieldValue('registrationDeadline', value)}
                    />
                  </LocalizationProvider>
                  {errors.registrationDeadline && touched.registrationDeadline && (
                    <Typography sx={{ color: "#db3030", fontSize: '0.875rem', mb: 2 }}>
                      {errors.registrationDeadline}
                    </Typography>
                  )}

                  <Box sx={{ display: "flex", gap: 2, mt: 2, mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        name="price"
                        id="price"
                        label="Price"
                        type="number"
                        fullWidth
                        variant="standard"
                        placeholder="Enter Price"
                        value={values.price}
                        onChange={handleChange}
                        sx={tertiaryInputStyles}
                      />
                      {errors.price && touched.price && (
                        <Typography sx={{ color: "#db3030", fontSize: '0.875rem' }}>
                          {errors.price}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <TextField
                        name="capacity"
                        id="capacity"
                        label="Capacity"
                        type="number"
                        fullWidth
                        variant="standard"
                        placeholder="Enter Capacity"
                        value={values.capacity}
                        onChange={handleChange}
                        sx={tertiaryInputStyles}
                      />
                      {errors.capacity && touched.capacity && (
                        <Typography sx={{ color: "#db3030", fontSize: '0.875rem' }}>
                          {errors.capacity}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <TextField
                    name='location'
                    id='location'
                    label="Location"
                    placeholder='Enter Trip Destination'
                    type="text"
                    variant="standard"
                    value={values.location}
                    onChange={handleChange}
                    fullWidth
                    sx={tertiaryInputStyles}
                  />
                  {errors.location && touched.location && (
                    <Typography sx={{ color: "#db3030", fontSize: '0.875rem' }}>
                      {errors.location}
                    </Typography>
                  )}
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
              <Box sx={{ mt: 2, textAlign: "right" }}>
                <CustomButton
                  disabled={isSubmitting}
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
  );
};

export default CreateTrip;