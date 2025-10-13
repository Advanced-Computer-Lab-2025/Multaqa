import React, { useState } from 'react'

import { Grid, InputAdornment, TextField, Typography } from '@mui/material'
import { CustomSelectField, CustomTextField } from '@/components/shared/input-fields'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';


const CreateWorkshop = () => {
  const professors = [
  { label: 'Prof. Ahmed Ali', value: 'ahmed-ali' },
  { label: 'Prof. Mona Hassan', value: 'mona-hassan' },
  { label: 'Prof. Samir Youssef', value: 'samir-youssef' },
  // ...add more
  ];
  const [selectedProfs, setSelectedProfs] = useState([]);
  return (
    <>
        <Typography variant='h4' color='primary' className='text-center'sx={{mb:2}}>Create Workshop</Typography>
        <Grid container spacing={2} sx={{mb:2}}>
                <Grid size={4}>
                    <CustomTextField
                        name='workshopName'
                        id='workshopName'
                        label="Workshop Name" 
                        fullWidth 
                        placeholder='Enter Workshop Name' 
                        fieldType="text"
                        autoCapitalize='off'
                        autoCapitalizeName={false}
                        neumorphicBox
                    />

                </Grid>
                <Grid size={4}>
                  <CustomSelectField
                    label="Location"
                    fieldType="single"
                    options={[
                      { label: 'GUC Cairo', value: 'GUC Cairo' },
                      { label: 'GUC Berlin', value: 'GUC Berlin' },
                    ]}
                  />    
                </Grid>
                <Grid size={4}>
                  <CustomSelectField
                    label="Faculty"
                    fieldType="single"
                    options={[
                      { label: 'MET', value: 'MET' },
                      { label: 'IET', value: 'IET' },
                      { label: 'EMS', value: 'EMS' },
                      { label: 'Pharmacy', value: 'pharmacy' },
                      { label: 'Management', value: 'management' },
                      { label: 'Applied Arts', value: 'applied arts' },
                      { label: 'Law', value: 'Law' },
                      { label: 'Dentistry', value: 'dentistry' },
                    ]}
                  />    
                </Grid>
        </Grid>
        <Grid container spacing={2} sx={{mb:2}}>
                <Grid size={4}>
                  <CustomSelectField
                    label="Funding Source"
                    fieldType="single"
                    options={[
                      { label: 'GUC', value: 'GUC' },
                      { label: 'External', value: 'external' },
                    ]}
                  />    
                </Grid>
                <Grid size={4}>
                    <TextField
                        name="budget"
                        label="Budget"
                        type="number"
                        fullWidth
                        variant='outlined'
                        placeholder="Enter Budget"
                        slotProps={{
                            input: {
                                startAdornment:(
                                    <InputAdornment position="start">EGP</InputAdornment>
                                )
                            }
                        }}
                    />
                </Grid>
                <Grid size={4}>
                    <TextField
                      name="capacity"
                      label="Capacity"
                      type="number"
                      fullWidth
                      variant='outlined'
                      placeholder="Enter Capacity"
                  /> 
                </Grid>
        </Grid>
        <Grid container spacing={2} sx={{mb:2}}>
          <Grid size={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                          name='startDate'
                          label="Start Date and Time"
                          slotProps={{
                              textField: {
                                  fullWidth: true,                              
                              },
                              popper: {
                                  disablePortal: true, // <-- Add this line
                                  placement: 'right',
                                  sx: { zIndex: 1500 },
                              }
                          }}
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
                                  fullWidth: true,
                              },
                              popper: {
                                  disablePortal: true, // <-- Add this line
                                  placement: 'left',
                                  sx: { zIndex: 1500 },
                              }
                          }}
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
                                  fullWidth:true 
                              },
                              popper: {
                                  disablePortal: true, // <-- Add this line
                                  placement: 'right',
                                  sx: { zIndex: 1500 },
                              }                       
                          }}
                      />
              </LocalizationProvider>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{mb:2}}>
          <Grid size={6}>
              <CustomSelectField
                label="Professors"
                fieldType="multiple"
                options={professors}
                value={selectedProfs}
              />
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
                autoCapitalize='off'
                autoCapitalizeName={false}
              />
          </Grid>
          <Grid size={12}>
              <CustomTextField 
                name='agenda'
                id='agenda'
                label="Full Agenda" 
                fullWidth  
                fieldType="text" 
                multiline 
                minRows={3} 
                neumorphicBox={true}
                autoCapitalize='off'
                autoCapitalizeName={false}
              />
          </Grid>
        </Grid>        
    </>
  )
}

export default CreateWorkshop
