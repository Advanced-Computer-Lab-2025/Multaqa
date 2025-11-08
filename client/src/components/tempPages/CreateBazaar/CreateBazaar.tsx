import React, { useState } from 'react';
import {useFormik, Formik} from 'formik';

import { Grid, Typography , Box,  Collapse, IconButton} from '@mui/material';
import { CustomSelectField, CustomTextField } from '../../shared/input-fields';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CustomButton from '../../shared/Buttons/CustomButton';
import RichTextField from '../../shared/TextField/TextField';
import theme from '@/themes/lightTheme';
import { wrapperContainerStyles, detailTitleStyles, modalFooterStyles,horizontalLayoutStyles,step1BoxStyles,step2BoxStyles,modalHeaderStyles,modalFormStyles} from '@/components/shared/styles';


import { bazaarSchema } from "./schemas/bazaar";

import {api} from "../../../api";
import { CustomModalLayout } from '@/components/shared/modals';

const initialValues = {
    bazaarName: '',
    location: '',
    description: '',
    startDate: null,
    endDate: null,
    registrationDeadline: null,
};

interface CreateBazaarProps {
    open:boolean;
    onClose: () => void;
    setRefresh:React.Dispatch<React.SetStateAction<boolean>>;
 }

const CreateBazaar = ({open, onClose, setRefresh}: CreateBazaarProps) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

    const handleCallApi = async (payload:any) => {    
    setLoading(true);
    setError(null);
    setResponse([]);
    try {
        // TODO: Replace with your API route
        const res = await api.post("/events", payload);
        setResponse(res.data);
        setRefresh((prev)=> !prev);
    } catch (err: any) {
        setError(err?.message || "API call failed");
        window.alert(err.response.data.error);
    } finally {
        setLoading(false);
    }
    };

  const onSubmit = async (values: any, actions: any) => {
    onClose();
    const startDateObj = values.startDate; // dayjs object
    const endDateObj = values.endDate;
    const registrationDeadlineObj = values.registrationDeadline;

    const payload = {
        type:"bazaar",
        eventName: values.bazaarName,
        location: values.location,
        description: values.description,
        eventStartDate: startDateObj ? startDateObj.toISOString() : null, // "2025-05-20T07:00:00Z"
        eventEndDate: endDateObj ? endDateObj.toISOString() : null,       // "2025-05-20T19:00:00Z"
        eventStartTime: startDateObj ? startDateObj.format("HH:mm") : null, // "07:00"
        eventEndTime: endDateObj ? endDateObj.format("HH:mm") : null,       // "19:00"
        registrationDeadline: registrationDeadlineObj ? registrationDeadlineObj.toISOString() : null, // "2025-05-15T23:59:59Z"
    };
    actions.resetForm();
    handleCallApi(payload);
  };

  const [infoOpen, setInfoOpen] = useState(true);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const {handleSubmit, values, isSubmitting, handleChange, handleBlur, setFieldValue, errors, touched} = useFormik({
    initialValues,
    validationSchema: bazaarSchema,
    onSubmit: onSubmit,
  });

const handleDescriptionChange = (htmlContent: string) => {
    setFieldValue('description', htmlContent);
    };
  return (
    <>
     <CustomModalLayout open={open} onClose={onClose} width="w-[95vw] xs:w-[80vw] lg:w-[70vw] xl:w-[60vw]">
        <Box sx={{
            ...wrapperContainerStyles,    
        }}>
        <Typography sx={{...detailTitleStyles(theme),fontSize: '26px', fontWeight:[950], alignSelf: 'flex-start', paddingLeft:'26px'}}>
        Create Bazaar
        </Typography>  
        <form onSubmit={handleSubmit}>
            <Box 
                sx={horizontalLayoutStyles(theme)}
                >
                    <Box sx={{...step1BoxStyles(theme)}}>
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
                                value={values.description}
                                onChange={handleDescriptionChange}
                                placeholder="Provide a short description of the trip"
                            />
                        </Box>
                    { errors.description && touched.description ? <p style={{color:"#db3030"}}>{errors.description}</p> : <></>}
                
              </Box>
            </Box>

            <Box sx={{...step2BoxStyles(theme)}}>
                <Box sx={modalHeaderStyles}>
                    <Typography sx={detailTitleStyles(theme)}>
                        Bazaar Details
                    </Typography>      
                </Box>
                <Box sx={modalFormStyles}>         
                   <Box sx={{ display: "flex", gap: 1, marginTop: "12px",marginBottom:"12px" }}>
                                           <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                             <LocalizationProvider dateAdapter={AdapterDayjs}>
                                               <DateTimePicker
                                                 name="startDate"
                                                 label="Start Date and Time"
                                                 slotProps={{
                                                   textField: {
                                                     variant: "standard",
                                                     fullWidth: true,
                                                   },
                                                   popper: {
                                                     disablePortal: true,
                                                     placement: "right",
                                                     sx: { zIndex: 1500 },
                                                   },
                                                 }}
                                                 value={values.startDate}
                                                 onChange={(value) => setFieldValue("startDate", value)}
                                               />
                                             </LocalizationProvider>
                                             {errors.startDate && touched.startDate && (
                                               <p style={{ color: "#db3030", marginTop: "4px" }}>{errors.startDate}</p>
                                             )}
                                           </Box>
                   
                                           <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                             <LocalizationProvider dateAdapter={AdapterDayjs}>
                                               <DateTimePicker
                                                 label="End Date and Time"
                                                 name="endDate"
                                                 slotProps={{
                                                   textField: {
                                                     variant: "standard",
                                                     fullWidth: true,
                                                   },
                                                   popper: {
                                                     disablePortal: true,
                                                     placement: "left",
                                                     sx: { zIndex: 1500 },
                                                   },
                                                 }}
                                                 value={values.endDate}
                                                 onChange={(value) => setFieldValue("endDate", value)}
                                               />
                                             </LocalizationProvider>
                                             {errors.endDate && touched.endDate && (
                                               <p style={{ color: "#db3030", marginTop: "4px" }}>{errors.endDate}</p>
                                             )}
                                           </Box>
                                         </Box>
                                       <LocalizationProvider dateAdapter={AdapterDayjs}>
                                         <DateTimePicker
                                             name='registrationDeadline'
                                             label="Deadline to Register"
                                             slotProps={{
                                                 textField: {
                                                     fullWidth:true,
                                                     variant:"standard", 
                                                 },
                                                 popper: {
                                                     disablePortal: true, // <-- Add this line
                                                     placement: 'left',
                                                     sx: { zIndex: 1500 },
                                                 }                       
                                             }}
                                             sx={{marginTop: "6px"}}
                                             value={values.registrationDeadline}
                                             onChange={(value) => setFieldValue('registrationDeadline', value)}
                                         />
                                         {errors.registrationDeadline && touched.registrationDeadline ? <p style={{color:"#db3030"}}>{errors.registrationDeadline}</p> : <></>}
                                 </LocalizationProvider>
  <Box sx={{ display: "flex", flexDirection: "column", flex: 1, marginTop: "24px" }}>
    <CustomSelectField
      label="Location"
      fieldType="single"
      options={[
        { label: "GUC Cairo", value: "GUC Cairo" },
        { label: "GUC Berlin", value: "GUC Berlin" },
      ]}
      value={values.location}
      onChange={(e: any) => setFieldValue("location", e.target ? e.target.value : e)} name={""}
    />
    {errors.location && touched.location && (
      <p style={{ color: "#db3030", marginTop: "4px" }}>{errors.location}</p>
    )}
  </Box>
            </Box>
            </Box>
            </Box>
        <Box sx={modalFooterStyles}> 
            <CustomButton disabled={isSubmitting } label={isSubmitting ? "submitting" : 'Create'} variant='contained' color='tertiary' fullWidth  type='submit' sx={{px: 1.5, width:"150px", height:"32px" ,fontWeight: 600, padding:"12px", fontSize:"14px"}}/>
        </Box>
        </form>
        </Box>
        </CustomModalLayout>
    </>
  )
}

export default CreateBazaar






