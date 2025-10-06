import { Grid, Typography } from '@mui/material'
import { CustomTextField } from '../shared/input-fields'
import React from 'react'
import { C } from 'vitest/dist/chunks/reporters.d.BFLkQcL6.js'

const CreateBazaar = () => {
  return (
    <>
        <Typography variant='h4' color='primary' className='text-center'>Create Bazaar</Typography>
        <CustomTextField label="Bazaar Name" fullWidth margin="normal"  fieldType='text'/>
        <Grid container spacing={2}>
            <Grid size={6}>
                <CustomTextField label="Start Date" fullWidth margin="normal"  fieldType='text'/>
            </Grid>
            <Grid size={6}>
                <CustomTextField label="End Date" fullWidth margin="normal"  fieldType='text'/>
            </Grid>
            <Grid size={6}>
                <CustomTextField label="Deadline" fullWidth margin="normal"  fieldType='text'/>
            </Grid>
            <Grid size={6}>
                <CustomTextField label="Location" fullWidth margin="normal"  fieldType='text'/>
            </Grid>
        </Grid>
        <CustomTextField label="Short Description" fullWidth margin="normal"  fieldType='text' multiline minRows={3}/>
    </>
  )
}

export default CreateBazaar
