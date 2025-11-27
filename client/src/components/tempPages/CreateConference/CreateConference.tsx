// components/Create/Create.tsx
"use client";
import React, { useState } from 'react';
import { Box, Typography, useTheme, Paper, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Chip, IconButton } from '@mui/material';
import { useFormik } from 'formik';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AddIcon from '@mui/icons-material/Add';
import { CustomSelectField, CustomTextField } from '../../shared/input-fields';
import { detailTitleStyles } from '../../shared/styles';
import { EventFormData } from './types';
import { api } from "../../../api";
import CustomButton from '../../shared/Buttons/CustomButton';
import { CustomModalLayout } from '../../shared/modals';
import { validationSchema } from './schemas/conference';
import { toast } from 'react-toastify';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const initialFormData: EventFormData = {
    eventName: '',
    eventStartDate: null,
    location: '',
    eventEndDate: null,
    description: '',
    fullAgenda: '',
    websiteLink: '',
    requiredBudget: '',
    fundingSource: '',
    extraRequiredResources: [],
    registrationDeadline: ''
}

// Create tertiaryInputStyles as a function that accepts accentColor
const createTertiaryInputStyles = (accentColor: string, theme: any) => ({
    '& .MuiInputLabel-root': {
        accentColor: theme.palette.grey[500],
        '&.Mui-focused': { accentColor: accentColor },
    },
    '& .MuiInputBase-input': {
        accentColor: '#000000',
        '&::placeholder': {
            accentColor: theme.palette.grey[400],
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

// Create contentPaperStyles as a function that accepts accentColor
const createContentPaperStyles = (accentColor: string, theme: any) => ({
    p: { xs: 1, md: 3 },
    borderRadius: '32px',
    background: theme.palette.background.paper,
    border:`2px solid ${accentColor}`,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    boxShadow: `0 4px 24px 0 ${accentColor}14`,
    transition: 'box-shadow 0.2s',                     
});

interface CreateConferenceProps {
    open: boolean;
    onClose: () => void;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
    color:string
}

const Create: React.FC<CreateConferenceProps> = ({ open, onClose, setRefresh, color }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const accentColor= color;
    // // Create styles with the accent accentColor
    const tertiaryInputStyles = createTertiaryInputStyles(accentColor, theme);
    const contentPaperStyles = createContentPaperStyles(accentColor, theme);

    // Tab sections for sidebar
    const tabSections = [
        { key: 'general', label: 'General', icon: <InfoOutlinedIcon /> },
        { key: 'description', label: 'Description', icon: <DescriptionOutlinedIcon /> },
        { key: 'fullAgenda', label: 'Full Agenda', icon: <CalendarTodayOutlinedIcon /> },
    ];
    const [activeTab, setActiveTab] = useState('general');
    const [resourceInput, setResourceInput] = useState<string>("");

    const handleCallApi = async (payload: any) => {
        setLoading(true);
        setError(null);
        setResponse([]);
        try {
            const res = await api.post("/events", payload);
            setResponse(res.data);
            setRefresh((prev) => !prev);
            toast.success("Conference created successfully", {
                position: "bottom-right",
                autoClose: 3000,
                theme: "colored",
            })
        } catch (err: any) {
            setError(err?.message || "API call failed");
            window.alert(err.response.data.error);
            toast.error("Failed to create conference. Please try again.", {
                position: "bottom-right",
                autoClose: 3000,
                theme: "colored",
            });
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (values: any, actions: any) => {

        onClose();
        const startDateObj = values.eventStartDate;
        const endDateObj = values.eventEndDate;
        const payload = {
            type: "conference",
            eventName: values.eventName,
            eventStartDate: startDateObj ? startDateObj.toISOString() : null,
            eventEndDate: endDateObj ? endDateObj.toISOString() : null,
            eventStartTime: startDateObj ? startDateObj.format("HH:mm") : null,
            eventEndTime: endDateObj ? endDateObj.format("HH:mm") : null,
            location: "GUC",
            description: values.description,
            fullAgenda: values.fullAgenda,
            websiteLink: values.websiteLink,
            requiredBudget: values.requiredBudget,
            fundingSource: values.fundingSource,
            extraRequiredResources: values.extraRequiredResources,
            registrationDeadline: "2025-1-1"
        }
        await handleCallApi(payload);
    }

    const formik = useFormik<EventFormData>({
        initialValues: initialFormData,
        validationSchema: validationSchema,
        onSubmit: onSubmit,
        validateOnChange: true,
        validateOnBlur: true,
    });

    const { handleSubmit, values, isSubmitting, handleChange, handleBlur, setFieldValue, errors, touched } = formik;
    
     // Check if tabs have errors
    const generalHasErrors = !!(
        (errors.eventName && touched.eventName) ||
        (errors.eventStartDate && touched.eventStartDate) ||
        (errors.eventEndDate && touched.eventEndDate) ||
        (errors.registrationDeadline && touched.registrationDeadline) ||
        (errors.websiteLink && touched.websiteLink) ||
        (errors.requiredBudget && touched.requiredBudget) ||
        (errors.location && touched.location)||  (errors.fundingSource && touched.fundingSource)||  (errors.extraRequiredResources && touched.extraRequiredResources)
    );

    const descriptionHasErrors = !!(errors.description && touched.description);
    const agendaHasErrors = !!(errors.fullAgenda && touched.fullAgenda);

    const handleClose = () => {
        onClose();
        setActiveTab('general');
    };

    return (
        <CustomModalLayout open={open} borderColor={accentColor} title="Create Conference" onClose={handleClose} width="w-[95vw] xs:w-[80vw] lg:w-[70vw] xl:w-[70vw]">
            <Box sx={{
                background: '#fff',
                borderRadius: '32px',
                p: 3,
                height: '650px',
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
                                                  const hasError = section.key === 'general' ? generalHasErrors : section.key === 'description' ? descriptionHasErrors : section.key === 'fullAgenda' ? agendaHasErrors : false;
                                                  
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
                        {/* Content Area */}
                        <Box sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: 0,
                            height: '100%',
                        }}>
                            {/* General Tab */}
                            {activeTab === 'general' && (
                                <Paper elevation={0} sx={contentPaperStyles}>
                                    <CustomTextField
                                        name='eventName'
                                        id='eventName'
                                        label="Conference Name"
                                        fullWidth
                                        placeholder='Enter Conference Name'
                                        fieldType="text"
                                        value={values.eventName}
                                        onChange={handleChange('eventName')}
                                        onBlur={handleBlur('eventName')}
                                        autoCapitalize='off'
                                        autoCapitalizeName={false}
                                        sx={{ mt: 1, mb: 2 }}
                                    />
                                    {errors.eventName && touched.eventName ?
                                        <Typography sx={{ color: "#db3030", fontSize: '0.875rem', mt: -1.5, mb: 1 }}>{errors.eventName}</Typography>
                                        : <></>}

                                    {/* Date/Time Pickers section */}
                                    <Box sx={{ display: "flex", gap: 2, marginBottom: "12px" }}>
                                        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DateTimePicker
                                                    name="eventStartDate"
                                                    label="Start Date and Time"
                                                    slotProps={{
                                                        textField: { 
                                                            variant: "standard", 
                                                            fullWidth: true, 
                                                            sx: tertiaryInputStyles,
                                                            InputLabelProps: {
                                                                sx: {
                                                                    color: theme.palette.grey[500],
                                                                    '&.Mui-focused': {
                                                                        color: accentColor,
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    }}
                                                    value={values.eventStartDate}
                                                    onChange={(value) => setFieldValue("eventStartDate", value)}
                                                />
                                            </LocalizationProvider>
                                            {errors.eventStartDate && touched.eventStartDate && (
                                                <Typography sx={{ color: "#db3030", fontSize: '0.875rem', mt: 0.5 }}>{errors.eventStartDate}</Typography>
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
                                                            sx: tertiaryInputStyles,
                                                            InputLabelProps: {
                                                                sx: {
                                                                    color: theme.palette.grey[500],
                                                                    '&.Mui-focused': {
                                                                       color: accentColor,
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    }}
                                                    value={values.eventEndDate}
                                                    onChange={(value) => setFieldValue("eventEndDate", value)}
                                                />
                                            </LocalizationProvider>
                                            {errors.eventEndDate && touched.eventEndDate && (
                                                <Typography sx={{ color: "#db3030", fontSize: '0.875rem', mt: 0.5 }}>{errors.eventEndDate}</Typography>
                                            )}
                                        </Box>
                                    </Box>

                                    <CustomTextField
                                        name='websiteLink'
                                        id='websiteLink'
                                        label="Website URL"
                                        fullWidth
                                        placeholder='https://example.guc.edu.eg'
                                        fieldType="text"
                                        value={values.websiteLink}
                                        onChange={handleChange('websiteLink')}
                                        error={touched.websiteLink && Boolean(errors.websiteLink)}
                                        autoCapitalize='off'
                                        autoCapitalizeName={false}
                                        sx={{ mb: 2, mt: 1 }}
                                    />
                                    {errors.websiteLink && touched.websiteLink ?
                                        <Typography sx={{ color: "#db3030", fontSize: '0.875rem', mt: -1.5, mb: 1 }}>{errors.websiteLink}</Typography>
                                        : <></>}

                                    <CustomTextField
                                        name='requiredBudget'
                                        id='requiredBudget'
                                        label="Budget Amount (EGP)"
                                        fullWidth
                                        placeholder='Enter required budget'
                                        fieldType="numeric"
                                        value={values.requiredBudget}
                                        onChange={handleChange('requiredBudget')}
                                        onBlur={handleBlur('requiredBudget')}
                                        error={touched.requiredBudget && Boolean(errors.requiredBudget)}
                                        autoCapitalize='off'
                                        autoCapitalizeName={false}
                                        sx={{ mb: 2 }}
                                    />
                                    {errors.requiredBudget && touched.requiredBudget ?
                                        <Typography sx={{ color: "#db3030", fontSize: '0.875rem', mt: -1.5, mb: 1 }}>{errors.requiredBudget}</Typography>
                                        : <></>}

                                    <Box sx={{ display: "flex", flexDirection: "column", flex: 1, marginBottom: "16px" }}>
                                        <CustomSelectField
                                            label="Funding"
                                            fieldType="single"
                                            options={[
                                                { label: 'GUC', value: 'GUC' },
                                                { label: 'External', value: 'External' },
                                            ]}
                                            value={values.fundingSource}
                                            onChange={(e: any) => setFieldValue('fundingSource', e.target ? e.target.value : e)}
                                            name="fundingSource"
                                        />
                                        {errors.fundingSource && touched.fundingSource && (
                                            <Typography sx={{ color: "#db3030", fontSize: '0.875rem', mt: 0.5 }}>{errors.fundingSource}</Typography>
                                        )}
                                    </Box>

                                    <Typography sx={{ ...detailTitleStyles(theme), fontSize: '16px', mb: 1 }}>Extra Required Resources</Typography>
                                    <Box sx={{ display: "flex", gap: 1, marginBottom: "12px", alignItems: "center" }}>
                                        <CustomTextField
                                            label='Extra Required Resources'
                                            name='extraResources'
                                            id='extraResources'
                                            fieldType='text'
                                            value={resourceInput}
                                            onChange={(e: any) => setResourceInput(e.target.value)}
                                            placeholder="e.g., Lab Equipment"
                                            autoCapitalize='off'
                                            autoCapitalizeName={false}
                                            fullWidth
                                        />
                                        <IconButton
                                            onClick={() => {
                                                const trimmed = resourceInput.trim();
                                                if (trimmed && !values.extraRequiredResources.includes(trimmed)) {
                                                    setFieldValue("extraRequiredResources", [...values.extraRequiredResources, trimmed]);
                                                    setResourceInput("");
                                                }
                                            }}
                                            sx={{
                                                backgroundColor: accentColor,
                                                color: 'white',
                                                width: '40px',
                                                height: '40px',
                                                '&:hover': {
                                                    backgroundColor: `${accentColor}E6`,
                                                }
                                            }}
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    </Box>

                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginBottom: "12px" }}>
                                    {values.extraRequiredResources.map((res: string) => (
                                        <Chip
                                            key={res}
                                            label={res}
                                            onDelete={() =>
                                                setFieldValue(
                                                    "extraRequiredResources",
                                                    values.extraRequiredResources.filter((r: string) => r !== res)
                                                )
                                            }
                                            sx={{
                                                m: 0.5,
                                                borderColor: accentColor,
                                                color: accentColor,
                                                '& .MuiChip-deleteIcon': {
                                                    color: accentColor,
                                                    '&:hover': {
                                                        color: `${accentColor}CC`,
                                                    }
                                                }
                                            }}
                                            variant="outlined"
                                        />
                                    ))}
                                </Box>
                                </Paper>
                            )}

                            {/* Description Tab */}
                            {activeTab === 'description' && (
                                <Paper elevation={0} sx={contentPaperStyles}>
                                    <TextField
                                        name="description"
                                        placeholder="Provide a short description of the conference"
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

                            {/* Full Agenda Tab */}
                            {activeTab === 'fullAgenda' && (
                                <Paper elevation={0} sx={contentPaperStyles}>
                                    <TextField
                                        name="fullAgenda"
                                        placeholder="Provide the full agenda"
                                        value={values.fullAgenda}
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
                                    {errors.fullAgenda && touched.fullAgenda && (
                                        <Typography sx={{ color: "#db3030", fontSize: '0.875rem', mt: 1 }}>
                                            {errors.fullAgenda}
                                        </Typography>
                                    )}
                                </Paper>
                            )}

                            {/* Submit Button */}
                            <Box sx={{ mt: 2, textAlign: "right", width: '100%', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <CustomButton
                                    disabled={isSubmitting}
                                    label={isSubmitting ? "Creating..." : 'Create'}
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

export default Create;