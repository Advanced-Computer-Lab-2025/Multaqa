import React, { useState } from 'react';
import {useFormik, Formik} from 'formik';

import { Grid, Typography , Box,  Collapse, IconButton} from '@mui/material';
import { CustomTextField } from '../../shared/input-fields';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CustomButton from '../../shared/Buttons/CustomButton';

import { bazaarSchema } from "./schemas/bazaar";

const initialValues = {
    bazaarName: '',
    location: '',
    description: '',
    startDate: null,
    endDate: null,
    registrationDeadline: null,
};

interface CreateBazaarProps {
  setOpenCreateBazaar: (open: boolean) => void;
 }

const CreateBazaar = ({setOpenCreateBazaar}: CreateBazaarProps) => {

  const onSubmit = async (values: any, actions: any) => {
    const payload = {
        bazaarName: values.bazaarName,
        location: values.location,
        description: values.description,
        startDate: values.startDate.toDate(),
        endDate: values.endDate.toDate(),
        registrationDeadline: values.registrationDeadline.toDate()
    };
    await new Promise((resolve) => setTimeout(resolve, 1000)); 
    actions.resetForm();
    setOpenCreateBazaar(false);
    console.log(JSON.stringify(payload))
  };

  const [infoOpen, setInfoOpen] = useState(true);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const {handleSubmit, values, isSubmitting, handleChange, handleBlur, setFieldValue, errors, touched} = useFormik({
    initialValues,
    validationSchema: bazaarSchema,
    onSubmit: onSubmit,
  });
  return (
    <>
        <form onSubmit={handleSubmit}>
        <Typography variant='h4' color='primary' className='text-center' sx={{mb:2}}>Create Bazaar</Typography>
            <Grid container spacing={2} sx={{mb:2}}>
                <Grid size={6}>
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
                </Grid>    
                <Grid size={6}>
                    <CustomTextField
                    name='location'
                    id='location' 
                    label="Location"
                    placeholder='e.g., GUC Cairo' 
                    fullWidth 
                    margin="normal"  
                    fieldType="text"
                    value={values.location}
                    onChange={handleChange}
                    autoCapitalize='off'
                    autoCapitalizeName={false}
                    />
                    { errors.location && touched.location ? <p style={{color:"#db3030"}}>{errors.location}</p> : <></>}          
                </Grid>
            </Grid>
            <Grid container spacing={2}>
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
                <Grid size={12}>
                    <CustomTextField 
                    name='description'
                    id='description'
                    label="Short Description" 
                    fullWidth  
                    fieldType="text" 
                    multiline 
                    minRows={3} 
                    neumorphicBox={true}
                    value={values.description}
                    onChange={handleChange}
                    autoCapitalize='off'
                    autoCapitalizeName={false}
                    />
                    { errors.description && touched.description ? <p style={{color:"#db3030"}}>{errors.description}</p> : <></>}
                </Grid>
            </Grid>
        <Box sx={{width:'100%', display:'flex', justifyContent:'end', mt:3}}> 
            <CustomButton disabled={isSubmitting } label={isSubmitting ? "submitting" : 'Create Bazaar'} variant='contained' color='primary' fullWidth  type='submit'/>
        </Box>
        </form>
    </>
  )
}

export default CreateBazaar






