import React, {useState} from 'react';
import {useFormik, Formik} from 'formik';


import { CustomTextField } from '@/components/shared/input-fields';
import { Box, Grid, TextField, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import theme from '@/themes/lightTheme';

import InputAdornment from '@mui/material/InputAdornment';
import CustomButton from '@/components/shared/Buttons/CustomButton';
import { themes } from 'storybook/internal/theming';

import {tripSchema} from "./schemas/trip";

import {api} from "../../../api";
import { CustomModalLayout } from '@/components/shared/modals';


interface CreateTripProps {
  open:boolean;
  onClose: () => void;
  setRefresh:React.Dispatch<React.SetStateAction<boolean>>;
 }

const CreateTrip = ({open, onClose, setRefresh}: CreateTripProps) => {
  const handleCallApi = async (payload:any) => {
    setLoading(true);
    setError(null);
    setResponse([]);
    try {
      // TODO: Replace with your API route
      const res = await api.post("/events", payload);
      setResponse(res.data);
      setRefresh((prev)=> !prev);
    } catch (err: any) {
      setError(err?.message || "API call failed");
      window.alert(err.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
    
  const initialValues = {
    tripName: '',
    location: '',
    price: 0,
    description: '',
    startDate: null,
    endDate: null,
    registrationDeadline: null,
    capacity: 0,
  };
  
  const onSubmit = async (values: any, actions: any) => {
    onClose();
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
    actions.resetForm();
    handleCallApi(payload);
  };

  const {handleSubmit, values, isSubmitting, handleChange, handleBlur, setFieldValue, errors, touched} = useFormik({
    initialValues,
    validationSchema: tripSchema,
    onSubmit: onSubmit,
  });

  return (
    <>
     <CustomModalLayout open={open} onClose={onClose} width='w-[95vw] md:w-[80vw] lg:w-[70vw] xl:w-[70vw]'>
        <form onSubmit={handleSubmit}>
        <Typography variant='h4' color='primary' className='text-center mb-3'>Create trip</Typography>
        <Grid container spacing={2}>
                <Grid size={4}>
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
                </Grid>    
                <Grid size={4}>
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
                </Grid>
                <Grid size={4}>
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
                </Grid>
                <Grid size={6}>
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
                </Grid>
                <Grid size={6}>
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
                </Grid>
                <Grid size={6}>
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
                </Grid>
                <Grid size={6}>
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
                </Grid>
                <Grid size={12}>
                    <CustomTextField 
                        name='description'
                        id='description'
                        label="Short Description" 
                        fullWidth   
                        fieldType='text' 
                        multiline 
                        minRows={3} 
                        neumorphicBox={true}
                        value={values.description}
                        onChange={handleChange}
                        autoCapitalize='off'
                        autoCapitalizeName={false}
                    />
                </Grid>
                { errors.description && touched.description ? <p style={{color:"#db3030"}}>{errors.description}</p> : <></>}
        </Grid>
        <Box sx={{width:'100%', display:'flex', justifyContent:'end', mt:2}}> 
            <CustomButton disabled={isSubmitting} label={isSubmitting ? "submitting":"Create Trip"} variant='contained' fullWidth type='submit'/>
        </Box>
        </form>
        </CustomModalLayout>
    </>
  )
}

export default CreateTrip
