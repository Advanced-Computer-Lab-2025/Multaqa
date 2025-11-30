import React, { useState } from 'react';
import { useFormik } from 'formik';
import dayjs from 'dayjs';

import { CustomSelectField, CustomTextField } from '@/components/shared/input-fields';
import { Box, Grid, TextField, Typography, Paper, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import CustomButton from '@/components/shared/Buttons/CustomButton';

import { tripSchema } from "../CreateTrip/schemas/trip";

import { api } from "../../../api";
import { CustomModalLayout } from '@/components/shared/modals';
import RichTextField from '@/components/shared/TextField/TextField';
import { wrapperContainerStyles, detailTitleStyles, modalFooterStyles, horizontalLayoutStyles, step1BoxStyles, step2BoxStyles, modalHeaderStyles, modalFormStyles } from '@/components/shared/styles';
import theme from '@/themes/lightTheme';
import { Edit } from 'lucide-react';
import { toast } from 'react-toastify';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

const tertiaryInputStyles = {
  '& .MuiInputLabel-root': {
    color: theme.palette.grey[500],
    '&.Mui-focused': { color: theme.palette.tertiary.main },
  },
  '& .MuiInputBase-input': {
    color: '#000000',
    '&::placeholder': {
      color: theme.palette.grey[400],
      opacity: 1,
    },
  },
  '& .MuiInput-underline:before': {
    borderBottomColor: theme.palette.tertiary.main,
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    borderBottomColor: theme.palette.tertiary.main,
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: theme.palette.tertiary.main,
  },
};

// Shared Paper styles for all tabs (content area) - Adjusted to match CreateTrip more closely 
const contentPaperStyles = {
  p: { xs: 1, md: 3 }, // Using xs: 1, md: 3 from CreateTrip
  borderRadius: '32px',
  background: theme.palette.background.paper,
  border:`1.5px solid ${theme.palette.tertiary.main}`,
  height: '100%', // Crucial for taking up full height
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto', // Allows content to scroll if it overflows
  boxShadow: '0 4px 24px 0 rgba(80, 80, 180, 0.08)',
  transition: 'box-shadow 0.2s',
};

interface EditTripProps {
  tripId: string;
  tripName: string;
  location: string;
  price: number;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  registrationDeadline: Date | null;
  capacity: number;
  open: boolean;
  onClose: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  color?: string;
}

const EditTrip = ({ tripId, tripName, location, price,
  description, startDate, endDate, registrationDeadline, capacity, open, onClose, setRefresh, color }: EditTripProps) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const initialValues = {
    tripName: tripName,
    location: location,
    price: price,
    description: description,
    startDate: startDate ? dayjs(startDate) : null,
    endDate: endDate ? dayjs(endDate) : null,
    registrationDeadline: registrationDeadline ? dayjs(registrationDeadline) : null,
    capacity: capacity,
  };

  const handleCallApi = async (payload: any) => {
    setLoading(true);
    setError(null);
    setResponse([]);
    try {
      console.log("payload in call");
      console.log(payload);
      const res = await api.patch("/events/" + tripId, payload);
      setResponse(res.data);
      setRefresh((refresh) => !refresh);
      toast.success("Trip edited successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return res.data;
    } catch (err: any) {
      setError(err?.message || "API call failed");
      toast.error(
        err.response.data.error || "Failed to edit trip. Please try again.",
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setActiveTab('general');
  };

  const onSubmit = async (values: any, actions: any) => {
    const startDateObj = values.startDate;
    const endDateObj = values.endDate;
    const registrationDeadlineObj = values.registrationDeadline;

    const payload = {
      type: "trip",
      eventName: values.tripName,
      location: values.location,
      price: values.price,
      description: values.description,
      eventStartDate: startDateObj ? startDateObj.toISOString() : null,
      eventEndDate: endDateObj ? endDateObj.toISOString() : null,
      eventStartTime: startDateObj ? startDateObj.format("HH:mm") : null,
      eventEndTime: endDateObj ? endDateObj.format("HH:mm") : null,
      registrationDeadline: registrationDeadlineObj ? registrationDeadlineObj.toISOString() : null,
      capacity: values.capacity,
    };
    console.log("payload before call");
    console.log(payload)
    const res = await handleCallApi(payload);
    console.log("response");
    console.log(res);
    onClose();
  };

  const { handleSubmit, values, isSubmitting, handleChange, handleBlur, setFieldValue, errors, touched } = useFormik({
    initialValues,
    validationSchema: tripSchema,
    onSubmit: onSubmit,
  });

  const handleDescriptionChange = (htmlContent: string) => {
    setFieldValue('description', htmlContent);
  };

  // Tab state for sections
  const tabSections = [
    { key: 'general', label: 'General Info', icon: <InfoOutlinedIcon /> },
    { key: 'description', label: 'Description', icon: <DescriptionOutlinedIcon /> },
  ];
  const [activeTab, setActiveTab] = useState('general');
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
  return (
    <CustomModalLayout open={open} title="Edit Trip" onClose={handleClose} width="w-[95vw] xs:w-[80vw] lg:w-[60vw] xl:w-[60vw]">
      {/* Outer Box matching CreateTrip's structure for consistent sizing */}
      <Box sx={{ 
        background: '#fff',
        borderRadius: '32px',
        p: 3,
        height: '600px', // Fixed height for consistent modal size
        display: 'flex',
        flexDirection: 'column'
      }}>

        
        {/* Form taking remaining vertical space */}
        <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            flex: 1, // Allows this container to grow and take all available space
            gap: 3,
            minHeight: 0, // Important for flex container with nested scrolling content
          }}>
            {/* Vertical Tabs on the left (Sidebar) - Fixed width, dynamic height */}
            {/* Vertical Tabs on the left (Sidebar) */}
                                       <Box
                                         sx={{
                                           width: '250px', 
                                           flexShrink: 0,
                                           background: theme.palette.background.paper,
                                           borderRadius: '32px',
                                           border:`2px solid ${color}`,
                                           p: 2,
                                           display: 'flex',
                                           flexDirection: 'column',
                                           alignItems: 'flex-start',
                                           boxShadow: '0 4px 24px 0 rgba(80, 80, 180, 0.08)',
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
                                                              color: activeTab === section.key ? color : theme.palette.text.primary,
                                                              boxShadow: activeTab === section.key ? '0 2px 8px 0 rgba(110, 138, 230, 0.15)' : 'none',
                                                              transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
                                                              '&:hover': {
                                                                  background: 'rgba(110, 138, 230, 0.05)',
                                                                  color: color,
                                                              },
                                                          }}
                                                      >
                                                          <ListItemIcon sx={{ minWidth: 36, color: activeTab === section.key ? color : theme.palette.text.primary, '&:hover': {
                                                                color: color
                                                              }, }}>{section.icon}</ListItemIcon>
                                                          <ListItemText primary={section.label} primaryTypographyProps={{ fontWeight:700 }} />
                                                          {hasError && (
                                                              <ErrorOutlineIcon 
                                                                  sx={{ 
                                                                      color: '#db3030', 
                                                                      fontSize: '20px',
                                                                      ml: '2'
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
              height: '100%', // Take full height of parent flex item
            }}>
              {/* Content Area - Fixed height from modal, scrolls internally */}
              {activeTab === 'general' && (
                <Paper elevation={0} sx={contentPaperStyles}>
                  {/* <Typography variant="h6" fontWeight={700} mb={2}>General Information</Typography> - Removed to match CreateTrip */}
                  
                  {/* Form fields in General Info */}
                  <CustomTextField
                    name='tripName'
                    id='tripName'
                    label="Trip Name"
                    fieldType='text'
                    placeholder='Enter Trip Name'
                    value={values.tripName}
                    onChange={handleChange}
                    fullWidth
                    autoCapitalize='off'
                    autoCapitalizeName={false}
                    sx={{ marginTop: "6px", mb: 2 }} // Added mb: 2 for spacing
                  />
                  {errors.tripName && touched.tripName ? <p style={{ color: "#db3030", fontSize: '0.875rem', marginTop: "-1.5", marginBottom: 1 }}>{errors.tripName}</p> : <></>}

                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}> {/* gap: 2 from CreateTrip */}
                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
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
                                  '&.Mui-focused': { color: theme.palette.tertiary.main },
                                },
                              },
                              sx: tertiaryInputStyles, // Applied tertiaryInputStyles for consistency
                            },
                          }}
                          value={values.startDate}
                          onChange={(value) => setFieldValue("startDate", value)}
                        />
                      </LocalizationProvider>
                      {errors.startDate && touched.startDate && (
                        <p style={{ color: "#db3030", fontSize: '0.875rem' }}>{errors.startDate}</p>
                      )}
                    </Box>
                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
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
                                  '&.Mui-focused': { color: theme.palette.tertiary.main },
                                },
                              },
                              sx: tertiaryInputStyles, // Applied tertiaryInputStyles for consistency
                            },
                          }}
                          value={values.endDate}
                          onChange={(value) => setFieldValue("endDate", value)}
                        />
                      </LocalizationProvider>
                      {errors.endDate && touched.endDate && (
                        <p style={{ color: "#db3030", fontSize: '0.875rem' }}>{errors.endDate}</p>
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
                              '&.Mui-focused': { color: theme.palette.tertiary.main },
                            },
                          },
                          sx: tertiaryInputStyles, // Applied tertiaryInputStyles for consistency
                        },
                      }}
                      value={values.registrationDeadline}
                      onChange={(value) => setFieldValue('registrationDeadline', value)}
                    />
                    {errors.registrationDeadline && touched.registrationDeadline ? <p style={{ color: "#db3030", fontSize: '0.875rem', marginBottom: 2 }}>{errors.registrationDeadline}</p> : <></>}
                  </LocalizationProvider>

                  <Box sx={{ display: "flex", gap: 2, mt: 2, mb: 2 }}> {/* mt: 2, mb: 2 from CreateTrip */}
                    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
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
                      {errors.price && touched.price ? <p style={{ color: "#db3030", fontSize: '0.875rem' }}>{errors.price}</p> : <></>}
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
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
                      {errors.capacity && touched.capacity ? <p style={{ color: "#db3030", fontSize: '0.875rem' }}>{errors.capacity}</p> : <></>}
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
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
                      sx={{ ...tertiaryInputStyles, border: "none" }}
                    />
                    {errors.location && touched.location && (
                      <p style={{ color: "#db3030", fontSize: '0.875rem' }}>{errors.location}</p>
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
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderRadius: '16px',
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
              
              {/* Edit/Submit Button at the bottom */}
              <Box sx={{ mt: 2, textAlign: "right", width: '100%', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <CustomButton
                  label={isSubmitting ? "Submitting" : "Edit"}
                  color='tertiary'
                  disabled={isSubmitting}
                  variant='contained'
                  type='submit'
                  sx={{ px: 3, width: "180px", height: "40px", fontWeight: 700, fontSize: "16px", borderRadius: '20px', boxShadow: '0 2px 8px 0 rgba(80, 80, 180, 0.10)' }}
                />
              </Box>
            </Box>
          </Box>
        </form>
      </Box>
    </CustomModalLayout>
  )
}

export default EditTrip;