import React, { useState } from 'react';
import {useFormik, Formik} from 'formik';
import { Grid, Typography , TextField, Box,  Collapse, IconButton} from '@mui/material';
import { CustomTextField } from '../shared/input-fields';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CustomButton from '../shared/Buttons/CustomButton';

const initialValues = {
    bazaarName: '',
    location: '',
    description: '',
    startDate: null,
    endDate: null,
    registrationDeadline: null,
};

const CreateBazaar = () => {
  const [infoOpen, setInfoOpen] = useState(true);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      // handle submit
      alert(values.bazaarName);
    },
  });
  return (
    <>
        <form onSubmit={formik.handleSubmit}>
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
                        value={formik.values.bazaarName}
                        onChange={formik.handleChange("bazaarName")}
                    />
                </Grid>    
                <Grid size={6}>
                    <CustomTextField
                    name='location'
                    id='location' 
                    label="Location" fullWidth margin="normal"  fieldType='text'
                    value={formik.values.location}
                    onChange={formik.handleChange("location")}
                    />            
                </Grid>
                <Grid size={12}>
                    <CustomTextField 
                    name='description'
                    id='description'
                    label="Short Description" fullWidth margin="normal"  fieldType='text' multiline minRows={3} 
                    neumorphicBox={true}
                    value={formik.values.description}
                    onChange={formik.handleChange("description")}
                    />
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
                                value={formik.values.startDate}
                                onChange={(value) => formik.setFieldValue('startDate', value)}
                            />
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
                                value={formik.values.endDate}
                                onChange={(value) => formik.setFieldValue('endDate', value)}
                            />
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
                                value={formik.values.registrationDeadline}
                                onChange={(value) => formik.setFieldValue('registrationDeadline', value)}
                            />
                    </LocalizationProvider>
                </Grid>
            </Grid>
        </Collapse>
        <Box sx={{width:'100%', display:'flex', justifyContent:'end'}}>
            <CustomButton label='Create Bazaar' variant='contained' color='primary' fullWidth sx={{mt:2}} type='submit'/>
        </Box>
        </form>
    </>
  )
}

export default CreateBazaar






