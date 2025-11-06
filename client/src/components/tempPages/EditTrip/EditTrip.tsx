import React , {useState}from 'react';
import {useFormik} from 'formik';
import dayjs from 'dayjs';


import { CustomTextField } from '@/components/shared/input-fields';
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
        return res.data;
        } catch (err: any) {
        setError(err?.message || "API call failed");
        window.alert(err.response.data.error);
        } finally {
        setLoading(false);
        }
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
                            Edit Trip
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
                        />   
                        {errors.tripName && touched.tripName ? <p style={{color:"#db3030"}}>{errors.tripName}</p> : <></>}

                        <Box sx={{ mt: 3 }}>
                            <RichTextField
                                label="Description" 
                                placeholder="Provide a short description of the trip"
                                onContentChange={handleDescriptionChange} 
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
                    <CustomTextField
                        name='location'
                        id='location' 
                        label="Location"   
                        fieldType='text'
                        placeholder='e.g. Berlin, Germany'
                        value={values.location}
                        onChange={handleChange}
                        autoCapitalize='off'
                        autoCapitalizeName={false}
                        fullWidth
                    />
                    {errors.location && touched.location ? <p style={{color:"#db3030"}}>{errors.location}</p> : <></>}
                    <TextField
                        name="price"
                        label="Price"
                        type="number"
                        fullWidth
                        variant='standard'
                        placeholder="Enter price"
                        slotProps={{
                            input: {
                                startAdornment:(
                                    <InputAdornment position="start">EGP</InputAdornment>
                                )
                            }
                        }}
                        sx={{marginTop: "6px"}}
                        value={values.price}
                        onChange={handleChange}
                    />
                    {errors.price && touched.price ? <p style={{color:"#db3030"}}>{errors.price}</p> : <></>}
                    <TextField
                        name="capacity"
                        label="Capacity"
                        type="number"
                        fullWidth
                        variant='standard'
                        placeholder="Enter Capacity"
                        value={values.capacity}
                        onChange={handleChange}
                    />
                    {errors.capacity && touched.capacity ? <p style={{color:"#db3030"}}>{errors.capacity}</p> : <></>}
                <Box sx={{display:"flex", gap:1, mt:0}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                name='startDate'
                                label="Start Date and Time"
                                slotProps={{
                                    textField: {
                                        variant: "standard", // <-- this makes it look like standard TextField
                                        fullWidth: true,                              
                                    },
                                    popper: {
                                        disablePortal: true, // <-- Add this line
                                        placement: 'right',
                                        sx: { zIndex: 1500 },
                                    }
                                }}
                                value={values.startDate}
                                onChange={(value) => setFieldValue('startDate', value)}
                            />
                            {errors.startDate && touched.startDate ? <p style={{color:"#db3030"}}>{errors.startDate}</p> : <></>}
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker 
                                label="End Date and Time"
                                name='endDate'
                                slotProps={{
                                    textField: {
                                        variant: "standard", // <-- this makes it look like standard TextField
                                        fullWidth: true,
                                    },
                                    popper: {
                                        disablePortal: true, // <-- Add this line
                                        placement: 'left',
                                        sx: { zIndex: 1500 },
                                    }
                                }}
                                 value={values.endDate}
                                onChange={(value) => setFieldValue('endDate', value)}
                            />
                            {errors.endDate && touched.endDate ? <p style={{color:"#db3030"}}>{errors.endDate}</p> : <></>}
                    </LocalizationProvider>
                </Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                name='registrationDeadline'
                                label="Deadline to Register"
                                slotProps={{
                                    textField: {
                                        variant: "standard",
                                        fullWidth:true // <-- this makes it look like standard TextField
                                    },
                                    popper: {
                                        disablePortal: true, // <-- Add this line
                                        placement: 'right',
                                        sx: { zIndex: 1500 },
                                    }                       
                                }}
                                 value={values.registrationDeadline}
                                onChange={(value) => setFieldValue('registrationDeadline', value)}
                            />
                            {errors.registrationDeadline && touched.registrationDeadline ? <p style={{color:"#db3030"}}>{errors.registrationDeadline}</p> : <></>}
                    </LocalizationProvider>
                    </Box>
                </Box>
            </Box>
        <Box sx={modalFooterStyles}> 
            <CustomButton color='tertiary' disabled={isSubmitting} label={isSubmitting ? "submitting":"Edit"} variant='contained' fullWidth type='submit' sx={{px: 1.5, width:"100px", height:"32px" ,fontWeight: 600, padding:"12px", fontSize:"14px"}}/>
        </Box>
        </form>
        </Box>
        </CustomModalLayout>
    </>
  )
}

export default EditTrip;

