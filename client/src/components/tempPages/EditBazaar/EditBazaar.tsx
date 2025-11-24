import React, { useState } from 'react';
import { useFormik, Formik } from 'formik';

import { Grid, Typography, Box, Collapse, IconButton } from '@mui/material';
import { CustomSelectField, CustomTextField } from '../../shared/input-fields';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CustomButton from '../../shared/Buttons/CustomButton';

import { bazaarSchema } from "../CreateBazaar/schemas/bazaar";
import dayjs from 'dayjs';
import { api } from "../../../api";
import { CustomModalLayout } from '@/components/shared/modals';
import RichTextField from '@/components/shared/TextField/TextField';
import { wrapperContainerStyles, detailTitleStyles, modalFooterStyles,horizontalLayoutStyles,step1BoxStyles,step2BoxStyles,modalHeaderStyles,modalFormStyles} from '@/components/shared/styles';
import theme from '@/themes/lightTheme';
import { toast } from 'react-toastify';

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
}

const EditBazaar = ({ bazaarId, bazaarName, location, description, startDate, endDate, registrationDeadline, open, onClose, setRefresh }: EditBazaarProps) => {

  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [response, setResponse] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

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
      // TODO: Replace with your API route
      const res = await api.patch("/events/" + bazaarId, payload);
      setResponse(res.data);
      // Only call setRefresh if it exists
      if (setRefresh) {
        setRefresh((refresh) => !refresh);
      }
      toast.success("Bazaar edited successfully", {
          position:"bottom-right",
          autoClose:3000,
          theme: "colored",
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message || "API call failed");
      window.alert(err.response.data.error);
      toast.error("Failed to edit bazaar. Please try again.", {
                  position:"bottom-right",
                  autoClose:3000,
                  theme: "colored",
                  });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
  onClose();
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (values: any, actions: any) => {
    onClose();
    const startDateObj = values.startDate; // dayjs object
    const endDateObj = values.endDate;
    const registrationDeadlineObj = values.registrationDeadline;

    const payload = {
      type: "bazaar",
      eventName: values.bazaarName,
      location: values.location,
      description: values.description,
      eventStartDate: startDateObj ? startDateObj.toISOString() : null, // "2025-05-20T07:00:00Z"
      eventEndDate: endDateObj ? endDateObj.toISOString() : null,       // "2025-05-20T19:00:00Z"
      eventStartTime: startDateObj ? startDateObj.format("HH:mm") : null, // "07:00"
      eventEndTime: endDateObj ? endDateObj.format("HH:mm") : null,       // "19:00"
      registrationDeadline: registrationDeadlineObj ? registrationDeadlineObj.toISOString() : null, // "2025-05-15T23:59:59Z"
    };
    await new Promise((resolve) => setTimeout(resolve, 1000));
    actions.resetForm();
    handleCallApi(payload);
  };


  const [infoOpen, setInfoOpen] = useState(true);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const { handleSubmit, values, isSubmitting, handleChange, handleBlur, setFieldValue, errors, touched } = useFormik({
    initialValues,
    validationSchema: bazaarSchema,
    onSubmit: onSubmit,
  });
  const handleDescriptionChange = (htmlContent: string) => {
    setFieldValue('description', htmlContent);
    };
  return (
    <>
     <CustomModalLayout open={open} onClose={onClose} width="w-[95vw] xs:w-[80vw] lg:w-[70vw] xl:w-[60vw]">
        <Box sx={{
            ...wrapperContainerStyles,    
        }}>
        <Typography sx={{...detailTitleStyles(theme),fontSize: '26px', fontWeight:[950], alignSelf: 'flex-start', paddingLeft:'26px'}}>
        Edit Bazaar
        </Typography>  
               <form onSubmit={handleSubmit}>
            <Box 
                sx={horizontalLayoutStyles(theme)}
                >
                    <Box sx={{...step1BoxStyles(theme)}}>
                        <Box sx={modalHeaderStyles}>
                            <Typography sx={detailTitleStyles(theme)}>
                                General Information
                            </Typography>      
                        </Box>
                        <Box sx={modalFormStyles}>
                    <CustomTextField 
                        name='bazaarName'
                        id='bazaarName'
                        label="Bazaar Name" 
                        fullWidth 
                        margin="normal" 
                        placeholder='Enter Bazaar Name' 
                        fieldType="text"
                        value={values.bazaarName}
                        onChange={handleChange}
                        autoCapitalize='off'
                        autoCapitalizeName={false}
                    />
                    { errors.bazaarName && touched.bazaarName ? <p style={{color:"#db3030"}}>{errors.bazaarName}</p> : <></>}
                        <Box sx={{ mt: 3 }}>
                            <RichTextField
                                label="Description" 
                                value={values.description}
                                onChange={handleDescriptionChange}
                                placeholder="Provide a short description of the trip"
                            />
                        </Box>
                    { errors.description && touched.description ? <p style={{color:"#db3030"}}>{errors.description}</p> : <></>}
                
              </Box>
            </Box>

            <Box sx={{...step2BoxStyles(theme)}}>
                <Box sx={modalHeaderStyles}>
                    <Typography sx={detailTitleStyles(theme)}>
                        Bazaar Details
                    </Typography>      
                </Box>
                <Box sx={modalFormStyles}>
                        <Box sx={{ display: "flex", gap: 1, marginTop: "12px", marginBottom: "12px" }}>
                        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
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
                                color: theme.palette.tertiary.main,
                                '&.Mui-focused': {
                                color: theme.palette.tertiary.main,
                                },
                            },
                            },
                            sx: {
                            // Input text color
                            color: theme.palette.tertiary.main,
                            // Underline (before focus)
                            '& .MuiInput-underline:before': {
                                borderBottomColor: theme.palette.tertiary.main,
                            },
                            // Underline (on hover)
                            '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                borderBottomColor: theme.palette.tertiary.main,
                            },
                            // Underline (after focus)
                            '& .MuiInput-underline:after': {
                                borderBottomColor: theme.palette.tertiary.main,
                            },
                            },
                        },
                        popper: {
                            disablePortal: true,
                            placement: "right",
                            sx: {
                            zIndex: 1500,
                            },
                        },
                        }}
                        value={values.startDate}
                        onChange={(value) => setFieldValue("startDate", value)}
                    />
                    </LocalizationProvider>
                            {errors.startDate && touched.startDate && (
                            <p style={{ color: "#db3030", marginTop: "4px" }}>{errors.startDate}</p>
                            )}
                        </Box>
        
                        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="End Date and Time"
                                name="endDate"
                                slotProps={{
                        textField: {
                            variant: "standard",
                            fullWidth: true,
                            InputLabelProps: {
                            sx: {
                                color: theme.palette.tertiary.main,
                                '&.Mui-focused': {
                                color: theme.palette.tertiary.main,
                                },
                            },
                            },
                            sx: {
                            // Input text color
                            color: theme.palette.tertiary.main,
                            // Underline (before focus)
                            '& .MuiInput-underline:before': {
                                borderBottomColor: theme.palette.tertiary.main,
                            },
                            // Underline (on hover)
                            '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                borderBottomColor: theme.palette.tertiary.main,
                            },
                            // Underline (after focus)
                            '& .MuiInput-underline:after': {
                                borderBottomColor: theme.palette.tertiary.main,
                            },
                            },
                        },
                                    popper: {
                                    disablePortal: true,
                                    placement: "left",
                                    sx: {
                                    zIndex: 1500,
                                    },
                                },
                                }}
                                value={values.endDate}
                                onChange={(value) => setFieldValue("endDate", value)}
                            />
                            </LocalizationProvider>
                            {errors.endDate && touched.endDate && (
                            <p style={{ color: "#db3030", marginTop: "4px" }}>{errors.endDate}</p>
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
                                color: theme.palette.tertiary.main,
                                '&.Mui-focused': {
                                color: theme.palette.tertiary.main,
                                },
                            },
                            },
                            sx: {
                            // Input text color
                            color: theme.palette.tertiary.main,
                            // Underline (before focus)
                            '& .MuiInput-underline:before': {
                                borderBottomColor: theme.palette.tertiary.main,
                            },
                            // Underline (on hover)
                            '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                borderBottomColor: theme.palette.tertiary.main,
                            },
                            // Underline (after focus)
                            '& .MuiInput-underline:after': {
                                borderBottomColor: theme.palette.tertiary.main,
                            },
                            },
                        },
                                    popper: {
                                    disablePortal: true,
                                    placement: "left",
                                    sx: {
                                    zIndex: 1500,
                                    },
                                },
                                }}
                                value={values.registrationDeadline}
                                onChange={(value) => setFieldValue('registrationDeadline', value)}
                            />
                            {errors.registrationDeadline && touched.registrationDeadline ? <p style={{color:"#db3030"}}>{errors.registrationDeadline}</p> : <></>}
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
      onChange={(e: any) => setFieldValue("location", e.target ? e.target.value : e)} name={""}
    />
    {errors.location && touched.location && (
      <p style={{ color: "#db3030", marginTop: "4px" }}>{errors.location}</p>
    )}
  </Box>
            </Box>
            </Box>
            </Box>
        <Box sx={modalFooterStyles}> 
            <CustomButton label="Cancel" variant="outlined" color="primary" onClick={handleClose} disabled={isSubmitting} sx={{ width: "150px", height: "32px", }} />
            <CustomButton disabled={isSubmitting } label={isSubmitting ? "submitting" : 'Edit'} variant='contained' color='tertiary' fullWidth  type='submit' sx={{px: 1.5, width:"100px", height:"32px" ,fontWeight: 600, padding:"12px", fontSize:"14px"}}/>
        </Box>
        </form>
        </Box>
        </CustomModalLayout>
    </>
  )
}

export default EditBazaar






