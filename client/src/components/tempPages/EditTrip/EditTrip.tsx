import React , {useState}from 'react';
import {useFormik} from 'formik';
import dayjs from 'dayjs';


import { CustomSelectField, CustomTextField } from '@/components/shared/input-fields';
import { Box, Grid, TextField, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import InputAdornment from '@mui/material/InputAdornment';
import CustomButton from '@/components/shared/Buttons/CustomButton';

import {tripSchema} from "../CreateTrip/schemas/trip";

import {api} from "../../../api";
import { CustomModalLayout } from '@/components/shared/modals';
import RichTextField from '@/components/shared/TextField/TextField';
import { wrapperContainerStyles, detailTitleStyles, modalFooterStyles,horizontalLayoutStyles,step1BoxStyles,step2BoxStyles,modalHeaderStyles,modalFormStyles} from '@/components/shared/styles';
import theme from '@/themes/lightTheme';
import { Edit } from 'lucide-react';
import { toast } from 'react-toastify';


 const tertiaryInputStyles = {
   '& .MuiInputLabel-root': {
     color: theme.palette.tertiary.main,
     '&.Mui-focused': { color: theme.palette.tertiary.main },
   },
   '& .MuiInputBase-input': {
     color: '#000000', // user-entered text is black
     '&::placeholder': {
       color:theme.palette.grey[400], // placeholder text color
       opacity: 1, // ensures color is visible
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
  setRefresh:React.Dispatch<React.SetStateAction<boolean>>;
 }
const EditTrip = ({tripId, tripName, location, price, 
  description, startDate, endDate, registrationDeadline, capacity, open, onClose, setRefresh}: EditTripProps) => {
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

    const handleCallApi = async (payload:any) => {
        setLoading(true);
        setError(null);
        setResponse([]);
        try {
        // TODO: Replace with your API route
        console.log("payload in call");
        console.log(payload);
        const res = await api.patch("/events/" + tripId, payload);
        setResponse(res.data);
        setRefresh((refresh) => !refresh);
        toast.success("Trip edited successfully", {
        position:"bottom-right",
        autoClose:3000,
        theme: "colored",
         })
        return res.data;
        } catch (err: any) {
        setError(err?.message || "API call failed");
        window.alert(err.response.data.error);
        toast.error("Failed to edit trip. Please try again.", {
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
  
  
  const onSubmit = async (values: any, actions: any) => {
    const startDateObj = values.startDate; // dayjs object
    const endDateObj = values.endDate;
    const registrationDeadlineObj = values.registrationDeadline;

    const payload ={
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
    console.log("payload before call");
    console.log(payload)
    const res = await handleCallApi(payload);
    console.log("response");
    console.log(res.data);
    onClose();
  };

  const {handleSubmit, values, isSubmitting, handleChange, handleBlur, setFieldValue, errors, touched} = useFormik({
    initialValues,
    validationSchema: tripSchema,
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
        Edit Trip
        </Typography>   
                             <form onSubmit={handleSubmit}>
                <Box 
                sx={horizontalLayoutStyles(theme)}
                >
                <Box sx={step1BoxStyles(theme)}>
                    <Box sx={modalHeaderStyles}>
                        <Typography sx={detailTitleStyles(theme)}>
                            General Information
                        </Typography>      
                    </Box>
                    <Box sx={modalFormStyles}>
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
                            sx={{marginTop: "6px"}}
                        />   
                        {errors.tripName && touched.tripName ? <p style={{color:"#db3030"}}>{errors.tripName}</p> : <></>}

                        <Box sx={{ mt: 3 }}>
                            <RichTextField 
                                label="Description" 
                                value={values.description}
                                onChange={handleDescriptionChange}
                                placeholder="Provide a short description of the trip"
                            />
                            { errors.description && touched.description ? <p style={{color:"#db3030"}}>{errors.description}</p> : <></>}
                        </Box>
                    </Box>
                </Box>
                <Box sx={step2BoxStyles(theme)}>
                    <Box sx={modalHeaderStyles}>
                        <Typography sx={detailTitleStyles(theme)}>
                            Trip Details
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
                                    placement: "right",
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
                                    placement: "right",
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
                        <Box sx={{ display: "flex", gap: 1, marginTop: "18px", marginBottom:"24px" }}>
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
                                {errors.price && touched.price ? <p style={{ color: "#db3030", marginTop: "4px" }}>{errors.price}</p> : <></>}
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
                            {errors.capacity && touched.capacity ? <p style={{ color: "#db3030", marginTop: "4px" }}>{errors.capacity}</p> : <></>}
                        </Box>
                        </Box>
                          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
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
            <CustomButton color='tertiary' disabled={isSubmitting} label={isSubmitting ? "submitting":"Edit"} variant='contained' fullWidth type='submit' sx={{px: 1.5, width:"100px", height:"32px" ,fontWeight: 600, padding:"12px", fontSize:"14px"}}/>
        </Box>
        </form>
        </Box>
        </CustomModalLayout>
    </>
  )
}

export default EditTrip;

