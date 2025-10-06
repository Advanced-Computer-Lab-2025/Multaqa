import { Grid, Typography } from '@mui/material'
import { CustomTextField } from '../shared/input-fields'
import React from 'react'

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
        </Grid>
    </>
  )
}

export default CreateBazaar
