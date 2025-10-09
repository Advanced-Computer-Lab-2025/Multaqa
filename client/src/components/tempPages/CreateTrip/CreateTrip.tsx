import { CustomTextField } from '@/components/shared/input-fields'
import { Grid, Typography } from '@mui/material'
import React from 'react'


const CreateTrip = () => {
  return (
    <>
        <Typography variant='h4' color='primary' className='text-center mb-3'>Create Bazaar</Typography>
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
                    />
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
                    />
                </Grid>
                <Grid size={4}>
                    <CustomTextField
                        name='price'
                        id='price' 
                        label="Price (EGP)" 
                        fullWidth 
                        margin="normal"  
                        fieldType='numeric'
                        placeholder='Enter Price'
                    />
                </Grid>
        </Grid>
    </>
  )
}

export default CreateTrip
