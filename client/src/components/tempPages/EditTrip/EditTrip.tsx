import React from 'react';
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
  setOpenEditTrip: (open: boolean) => void;
 }

const EditTrip = ({setOpenEditTrip, tripId, tripName, location, price, 
    description, startDate, endDate, registrationDeadline, capacity}: EditTripProps) => {
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
  
  const onSubmit = async (values: any, actions: any) => {
    const payload ={
        tripName: values.tripName,
        location: values.location,
        price: values.price,
        description: values.description,
        startDate: values.startDate.toDate(),
        endDate: values.endDate.toDate(),
        registrationDeadline: values.registrationDeadline.toDate(),
        capacity: values.capacity,
    };
    await new Promise((resolve) => setTimeout(resolve, 1000)); 
    actions.resetForm();
    setOpenEditTrip(false);
    console.log(JSON.stringify(payload))
  };

  const {handleSubmit, values, isSubmitting, handleChange, handleBlur, setFieldValue, errors, touched} = useFormik({
    initialValues,
    validationSchema: tripSchema,
    onSubmit: onSubmit,
  });

  return (
    <>
        <form onSubmit={handleSubmit}>
        <Typography variant='h4' color='primary' className='text-center mb-3'>Edit trip</Typography>
        <Grid container spacing={2}>
                <Grid size={4}>
                    <CustomTextField 
                        name='tripName'
                        id='tripName'
                        label="Trip Name" 
                        fullWidth 
                        margin="normal"  
                        fieldType='text'
                        placeholder='Enter Trip Name'
                        value={values.tripName}
                        onChange={handleChange}
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
                        fullWidth 
                        margin="normal"  
                        fieldType='text'
                        placeholder='e.g. Berlin, Germany'
                        value={values.location}
                        onChange={handleChange}
                        autoCapitalize='off'
                        autoCapitalizeName={false}
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
                        sx={{marginTop: '23px'}}
                        value={values.price}
                        onChange={handleChange}
                    />
                    {errors.price && touched.price ? <p style={{color:"#db3030"}}>{errors.price}</p> : <></>}
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
                                        variant: "standard", // <-- this makes it look like standard TextField
                                        fullWidth: true,
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
                <Grid size={12}>
                    <CustomTextField 
                        name='description'
                        id='description'
                        label="Short Description" fullWidth margin="normal"  fieldType='text' multiline minRows={3} 
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
    </>
  )
}

export default EditTrip;
