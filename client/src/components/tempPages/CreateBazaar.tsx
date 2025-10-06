import { Grid, Typography , TextField} from '@mui/material';
import { CustomTextField } from '../shared/input-fields';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import React from 'react'
import CustomButton from '../shared/Buttons/CustomButton';

const CreateBazaar = () => {
  return (
    <>
        <Typography variant='h4' color='primary' className='text-center'>Create Bazaar</Typography>
        <CustomTextField label="Bazaar Name" fullWidth margin="normal"  fieldType='text'/>
        <Grid container spacing={2}>
            <Grid size={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker 
                            label="Start Date and Time"
                            slotProps={{
                                textField: {
                                    variant: "standard", // <-- this makes it look like standard TextField
                                    fullWidth: true,                                
                                },
                                popper: {
                                    disablePortal: true, // <-- Add this line
                                    placement: 'left-start',
                                    sx: { zIndex: 1500 },
                                }
                            }}
                        />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                       <DateTimePicker 
                            label="End Date and Time"
                            slotProps={{
                                textField: {
                                    variant: "standard", // <-- this makes it look like standard TextField
                                    fullWidth: true,   
                                },
                                popper: {
                                    disablePortal: true, // <-- Add this line
                                    placement: 'left-start',
                                    sx: { zIndex: 1500 },
                                }
                            }}
                        />
                </LocalizationProvider>
            </Grid>
            <Grid size={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker 
                            label="Deadline to Register"
                            slotProps={{
                                textField: {
                                    variant: "standard", // <-- this makes it look like standard TextField
                                    fullWidth: true,
                                },
                                popper: {
                                    disablePortal: true, // <-- Add this line
                                    placement: 'left-start',
                                    sx: { zIndex: 1500 },
                                }                       
                            }}
                        />
                </LocalizationProvider>
                <CustomTextField label="Location" fullWidth margin="normal"  fieldType='text'/>
            </Grid>
        </Grid>
        <CustomTextField label="Short Description" fullWidth margin="normal"  fieldType='text' multiline minRows={3}/>
        <CustomButton label='Create Bazaar' variant='contained' color='primary' fullWidth sx={{mt:2}}/>
    </>
  )
}

export default CreateBazaar






