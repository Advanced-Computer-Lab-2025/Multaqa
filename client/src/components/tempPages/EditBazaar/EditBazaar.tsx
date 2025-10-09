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

import { bazaarSchema } from "../CreateBazaar/schemas/bazaar";
import dayjs from 'dayjs';

interface EditBazaarProps {
  bazaarId: string;
  bazaarName: string;
  location: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  registrationDeadline: Date | null;   
  setOpenEditBazaar: (open: boolean) => void;
 }

const EditBazaar = ({setOpenEditBazaar, bazaarId, bazaarName, location, description, startDate, endDate, registrationDeadline}: EditBazaarProps) => {

  const initialValues = {
    bazaarName: bazaarName,
    location: location,
    description: description,
    startDate: startDate ? dayjs(startDate) : null,
    endDate: endDate ? dayjs(endDate) : null,
    registrationDeadline: registrationDeadline ? dayjs(registrationDeadline) : null,
  };
  

  const onSubmit = async (values: any, actions: any) => {
    console.log(values);
    await new Promise((resolve) => setTimeout(resolve, 1000)); 
    actions.resetForm();
    setOpenEditBazaar(false);
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
        <Typography variant='h4' color='primary' className='text-center mb-3'>Create Bazaar</Typography>
        <Box sx={{borderBottom: 1, pb:1, mb:2, mt:3, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <Typography variant='body1' color='textSecondary' className='h6'>Basic Information</Typography>
            <IconButton onClick={() => setInfoOpen((prev) => !prev)} size="small">
                {infoOpen ? <ArrowUpwardIcon fontSize='medium' /> : <ArrowDownwardIcon fontSize='medium' />}
            </IconButton>
        </Box>
        <Collapse in={infoOpen}>
            <Grid container spacing={2}>
                <Grid size={6}>
                    <CustomTextField 
                        name='bazaarName'
                        id='bazaarName'
                        label="Bazaar Name" fullWidth margin="normal"  fieldType='text'
                        value={values.bazaarName}
                        onChange={handleChange("bazaarName")}
                    />
                    { errors.bazaarName && touched.bazaarName ? <p style={{color:"#db3030"}}>{errors.bazaarName}</p> : <></>}
                </Grid>    
                <Grid size={6}>
                    <CustomTextField
                    name='location'
                    id='location' 
                    label="Location" fullWidth margin="normal"  fieldType='text'
                    value={values.location}
                    onChange={handleChange("location")}
                    />
                    { errors.location && touched.location ? <p style={{color:"#db3030"}}>{errors.location}</p> : <></>}          
                </Grid>
                <Grid size={12}>
                    <CustomTextField 
                    name='description'
                    id='description'
                    label="Short Description" fullWidth margin="normal"  fieldType='text' multiline minRows={3} 
                    neumorphicBox={true}
                    value={values.description}
                    onChange={handleChange("description")}
                    />
                    { errors.description && touched.description ? <p style={{color:"#db3030"}}>{errors.description}</p> : <></>}
                </Grid>
            </Grid>
        </Collapse>
        <Box sx={{borderBottom: 1, pb:1, mb:2, mt:3, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <Typography variant='body1' color='textSecondary' className='h6'>Schedule</Typography>
            <IconButton onClick={() => setScheduleOpen((prev) => !prev)} size="small">
                {scheduleOpen ? <ArrowUpwardIcon fontSize='medium' /> : <ArrowDownwardIcon fontSize='medium' />}
            </IconButton>
        </Box>
        <Collapse in={scheduleOpen}>
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
            </Grid>
        </Collapse>
        <Box sx={{width:'100%', display:'flex', justifyContent:'end'}}> 
            <CustomButton disabled={isSubmitting } label={isSubmitting ? "submitting" : 'Create Bazaar'} variant='contained' color='primary' fullWidth sx={{mt:2}} type='submit'/>
        </Box>
        </form>
    </>
  )
}

export default EditBazaar;






