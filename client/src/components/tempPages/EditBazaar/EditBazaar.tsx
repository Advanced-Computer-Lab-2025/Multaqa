import React, { useState } from 'react';
import { useFormik, Formik } from 'formik';

import { Grid, Typography, Box, Collapse, IconButton } from '@mui/material';
import { CustomTextField } from '../../shared/input-fields';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CustomButton from '../../shared/Buttons/CustomButton';

import { bazaarSchema } from "../CreateBazaar/schemas/bazaar";
import dayjs from 'dayjs';
import { api } from "../../../api";
import { CustomModalLayout } from '@/components/shared/modals';
import RichTextField from '@/components/shared/TextField/TextField';
import { wrapperContainerStyles, detailTitleStyles, modalFooterStyles,horizontalLayoutStyles,step1BoxStyles,step2BoxStyles,modalHeaderStyles,modalFormStyles} from '@/components/shared/styles';
import theme from '@/themes/lightTheme';

interface EditBazaarProps {
  bazaarId: string;
  bazaarName: string;
  location: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  registrationDeadline: Date | null;
  open: boolean;
  onClose: () => void;
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditBazaar = ({ bazaarId, bazaarName, location, description, startDate, endDate, registrationDeadline, open, onClose, setRefresh }: EditBazaarProps) => {

  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [response, setResponse] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const initialValues = {
    bazaarName: bazaarName,
    location: location,
    description: description,
    startDate: startDate ? dayjs(startDate) : null,
    endDate: endDate ? dayjs(endDate) : null,
    registrationDeadline: registrationDeadline ? dayjs(registrationDeadline) : null,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCallApi = async (payload: any) => {
    setLoading(true);
    setError(null);
    setResponse([]);
    try {
      // TODO: Replace with your API route
      const res = await api.patch("/events/" + bazaarId, payload);
      setResponse(res.data);
      // Only call setRefresh if it exists
      if (setRefresh) {
        setRefresh((refresh) => !refresh);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message || "API call failed");
      window.alert(err.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (values: any, actions: any) => {
    onClose();
    const startDateObj = values.startDate; // dayjs object
    const endDateObj = values.endDate;
    const registrationDeadlineObj = values.registrationDeadline;

    const payload = {
      type: "bazaar",
      eventName: values.bazaarName,
      location: values.location,
      description: values.description,
      eventStartDate: startDateObj ? startDateObj.toISOString() : null, // "2025-05-20T07:00:00Z"
      eventEndDate: endDateObj ? endDateObj.toISOString() : null,       // "2025-05-20T19:00:00Z"
      eventStartTime: startDateObj ? startDateObj.format("HH:mm") : null, // "07:00"
      eventEndTime: endDateObj ? endDateObj.format("HH:mm") : null,       // "19:00"
      registrationDeadline: registrationDeadlineObj ? registrationDeadlineObj.toISOString() : null, // "2025-05-15T23:59:59Z"
    };
    await new Promise((resolve) => setTimeout(resolve, 1000));
    actions.resetForm();
    handleCallApi(payload);
  };


  const [infoOpen, setInfoOpen] = useState(true);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const { handleSubmit, values, isSubmitting, handleChange, handleBlur, setFieldValue, errors, touched } = useFormik({
    initialValues,
    validationSchema: bazaarSchema,
    onSubmit: onSubmit,
  });
  const handleDescriptionChange = (htmlContent: string) => {
    setFieldValue('description', htmlContent);
    };
  return (
    <>
     <CustomModalLayout open={open} onClose={onClose} width="w-[95vw] xs:w-[70vw] lg:w-[70vw] xl:w-[60vw]">
        <Box sx={{
            ...wrapperContainerStyles,    
        }}>
        <Typography sx={{...detailTitleStyles(theme),fontSize: '26px', fontWeight:[950], alignSelf: 'flex-start', paddingLeft:'26px'}}>
        Edit Bazaar
        </Typography>  
        <form onSubmit={handleSubmit}>
            <Box 
                sx={horizontalLayoutStyles(theme)}
                >
                    <Box sx={step1BoxStyles(theme)}>
                        <Box sx={modalHeaderStyles}>
                            <Typography sx={detailTitleStyles(theme)}>
                                General Information
                            </Typography>      
                        </Box>
                        <Box sx={modalFormStyles}>
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
                        <Box sx={{ mt: 3 }}>
                            <RichTextField
                                label="Description" 
                                placeholder="Provide a short description of the trip"
                                onContentChange={handleDescriptionChange} 
                            />
                        </Box>
                    { errors.description && touched.description ? <p style={{color:"#db3030"}}>{errors.description}</p> : <></>}
                
              </Box>
            </Box>

            <Box sx={step2BoxStyles(theme)}>
                <Box sx={modalHeaderStyles}>
                    <Typography sx={detailTitleStyles(theme)}>
                        Bazaar Details
                    </Typography>      
                </Box>
                <Box sx={modalFormStyles}>
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
                   <Box sx={{display:"flex", gap:1,marginTop: "8px"}}>
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
                   </Box>
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
                                sx={{marginTop: "10px"}}
                            />
                            {errors.registrationDeadline && touched.registrationDeadline ? <p style={{color:"#db3030"}}>{errors.registrationDeadline}</p> : <></>}
                    </LocalizationProvider>
            </Box>
            </Box>
            </Box>
        <Box sx={modalFooterStyles}> 
            <CustomButton disabled={isSubmitting } label={isSubmitting ? "submitting" : 'Edit'} variant='contained' color='tertiary' fullWidth  type='submit' sx={{px: 1.5, width:"100px", height:"32px" ,fontWeight: 600, padding:"12px", fontSize:"14px"}}/>
        </Box>
        </form>
        </Box>
        </CustomModalLayout>
    </>
  )
}

export default EditBazaar






