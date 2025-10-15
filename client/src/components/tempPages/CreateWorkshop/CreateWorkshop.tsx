import React, { useState } from 'react'

import { Chip, Grid, InputAdornment, TextField, Typography, Box } from '@mui/material'
import { CustomSelectField, CustomTextField } from '@/components/shared/input-fields'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CustomIcon from '@/components/shared/Icons/CustomIcon';

import {workshopSchema} from "./schemas/workshop";


interface Professor {
  label: string;
  value: string;
}

const CreateWorkshop = () => {
  const [selectedProf, setSelectedProf] = useState<string>("");
  const [selectedProfs, setSelectedProfs] = useState<Professor[]>([]);

  const [location, setLocation] = useState<string>("");
  const [faculty, setFaculty] = useState<string>("");
  const [fundingSource, setFundingSource] = useState<string>("");

  const professors = [
  { label: 'Prof. Ahmed Ali', value: 'ahmed-ali' },
  { label: 'Prof. Mona Hassan', value: 'mona-hassan' },
  { label: 'Prof. Samir Youssef', value: 'samir-youssef' },
  // ...add more
  ];

  // Function to find professor by value
  const findProfessorByValue = (value: string) => {
    return professors.find(prof => prof.value === value);
  };


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
                    value={location}
                    onChange={(e: any) => {
                      setLocation(e.target ? e.target.value : e);
                    }}
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
                    value={faculty}
                    onChange={(e: any) => {
                      setFaculty(e.target ? e.target.value : e);
                    }}
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
                    value={fundingSource}
                    onChange={(e: any) => {
                      setFundingSource(e.target ? e.target.value : e);
                    }}
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
                  label="Participating Professors"
                  fieldType="single"
                  options={professors}
                  value={selectedProf}
                  onChange={(e: any) => {
                    // If your CustomSelectField returns the value directly:
                    setSelectedProf(e.target ? e.target.value : e);
                  }}
                />
          </Grid>
          <Grid size={1}>
            <CustomIcon 
              icon='add' 
              size='medium' 
              containerType='outwards'
              onClick={() => {
                const profToAdd = findProfessorByValue(selectedProf);
                if (
                  profToAdd && 
                  !selectedProfs.some(p => p.value === selectedProf)
                ) {
                  setSelectedProfs(prev => [...prev, profToAdd]);
                  setSelectedProf(""); // Clear selection after adding
                }
              }}
            />
          </Grid>
          <Grid size={12}>
            <Typography variant='h6'>Participating Professors:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1}}>
              {selectedProfs.map((prof) => (
                <Chip
                  key={prof.value}
                  label={prof.label}
                  onDelete={() =>
                    setSelectedProfs((prev) =>
                      prev.filter((p) =>p.value !== prof.value)
                    )
                  }
                  color="primary"
                  variant="outlined"
                  sx={{m:0.5}}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{mb:2}}>
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
