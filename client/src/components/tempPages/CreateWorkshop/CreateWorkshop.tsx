import React from 'react'

import { Grid, Typography } from '@mui/material'
import { CustomTextField } from '@/components/shared/input-fields'


const CreateWorkshop = () => {
  return (
    <>
        <Typography variant='h4' color='primary' className='text-center'sx={{mb:2}}>Create Workshop</Typography>
        <Grid container spacing={2} sx={{mb:2}}>
                <Grid size={6}>
                    <CustomTextField
                        name='workshopName'
                        id='workshopName'
                        label="Workshop Name" 
                        fullWidth 
                        margin="normal" 
                        placeholder='Enter Workshop Name' 
                        fieldType="text"
                        autoCapitalize='off'
                        autoCapitalizeName={false}
                    />
                </Grid>    
            </Grid>
    </>
  )
}

export default CreateWorkshop
