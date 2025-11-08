import React, { useState , useEffect, use } from 'react'
import {useFormik, Formik} from 'formik'

import { Chip, Grid, InputAdornment, TextField, Typography, Box } from '@mui/material'
import { CustomSelectField, CustomTextField } from '@/components/shared/input-fields'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CustomIcon from '@/components/shared/Icons/CustomIcon';

import {workshopSchema} from "./schemas/workshop";
import CustomButton from '@/components/shared/Buttons/CustomButton';
import { eventNames } from 'node:process';
import dayjs from 'dayjs';

import {api} from "../../../api"
import { CustomModalLayout } from '@/components/shared/modals';

interface ProfessorOption {
  label: string;
  value: string; // ideally, the professor _id
}

interface CreateWorkshopProps {
  professors: [];
  creatingProfessor:string;
  open:boolean;
  onClose: () => void;
  setRefresh?:React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateWorkshop = ({ professors, creatingProfessor, open, onClose, setRefresh}: CreateWorkshopProps) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingProfessors, setLoadingProfessors] = useState(true);

  const [selectedProf, setSelectedProf] = useState<string>("");
  const [resourceInput, setResourceInput] = useState<string>("");
  const [availableProfessors, setAvailableProfessors] = useState<ProfessorOption[]>([]);

  useEffect(() => {
    //Runs only on the first render
    handleLoadProfessors();
  }, []);

  const handleLoadProfessors = async () => {
    setLoading(true);
    setError(null);
    setResponse([]);
    try {
      setLoadingProfessors(true);
      const res = await api.get("/users/professors");
      
      const options = res.data.data
        .filter((prof: any) => prof._id !== creatingProfessor)
        .map((prof: any) => ({
          label: `${prof.firstName} ${prof.lastName}`,
          value: prof._id, // use ID, not name
      }));

      setAvailableProfessors(options);
    } catch (err: any) {
        setError(err?.message || "API call failed");
    } finally {
        setLoadingProfessors(false);
    }
  };

  const initialValues ={
      workshopName: "",
      budget: 0,
      capacity: 0,
      startDate: null,
      endDate: null, 
      registrationDeadline: null,
      description:"",
      agenda: "",
      professors: [] as ProfessorOption[],
      location: "",
      faculty: "",
      fundingSource: "",
      extraResources: [] as string[],
  };

  const handleCallApi = async (payload:any) => {
    setLoading(true);
    setError(null);
    setResponse([]);
    try {
        // TODO: Replace with your API route
        const res = await api.post("/workshops/", payload);
        setResponse(res.data);
        // setRefresh((prev) => !prev);
    } catch (err: any) {
        setError(err?.message || "API call failed");
        window.alert(err.response.data.error);
    } finally {
        setLoading(false);
    }
  };

  // Function to find professor by value
  const findProfessorByID = (value: string) => {
    return response.find(prof => prof.label === value);
  };

  const onSubmit = async (values: any, actions: any) => {
    const payload ={
      type: "workshop",
      eventName: values.workshopName,
      location: values.location,
      eventStartDate: values.startDate.format("YYYY-MM-DD"),
      eventEndDate: values.endDate.format("YYYY-MM-DD"), 
      description: values.description,
      fullAgenda:values.agenda,
      associatedFaculty:values.faculty,
      associatedProfs: values.professors.map((p: { label: string; value: string }) => p.value),
      requiredBudget:values.budget,
      extraRequiredResources:values.extraResources,
      capacity:values.capacity,
      registrationDeadline:values.registrationDeadline.format("YYYY-MM-DD"),
      eventStartTime:values.startDate.format("HH:mm"),
      eventEndTime:values.endDate.format("HH:mm"),
      fundingSource:values.fundingSource,
      price:5,
    };
    actions.resetForm();
    handleCallApi(payload);
    onClose();
  };

  const {handleSubmit, values, isSubmitting, handleChange, handleBlur, setFieldValue, errors, touched} = useFormik({
    initialValues,
    validationSchema: workshopSchema,
    onSubmit: onSubmit,
  });

  return (
    <>
     <CustomModalLayout open={open} onClose={onClose} width='w-[95vw] md:w-[80vw] lg:w-[70vw] xl:w-[70vw]'>
      <form onSubmit={handleSubmit}>
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
                        value={values.workshopName}
                        onChange={handleChange}
                    />
                    { errors.workshopName && touched.workshopName ? <p style={{color:"#db3030"}}>{errors.workshopName}</p> : <></>}
                </Grid>
                                <Grid size={4}>
                    <TextField
                        name="budget"
                        id='budget'
                        label="Budget"
                        type="number"
                        fullWidth
                        variant='standard'
                        placeholder="Enter Budget"
                        slotProps={{
                            input: {
                                startAdornment:(
                                    <InputAdornment position="start">EGP</InputAdornment>
                                )
                            }
                        }}
                        value={values.budget}
                        onChange={handleChange}
                    />
                    { errors.budget && touched.budget ? <p style={{color:"#db3030"}}>{errors.budget}</p> : <></>}
                </Grid>
                <Grid size={4}>
                    <TextField
                      name="capacity"
                      id='capacity'
                      label="Capacity"
                      type="number"
                      fullWidth
                      variant='standard'
                      placeholder='Enter Capacity'
                      slotProps={{
                            input: {
                                startAdornment:(
                                    <InputAdornment position="start"></InputAdornment>
                                )
                            }
                        }}
                      value={values.capacity}
                      onChange={handleChange}
                    /> 
                    { errors.capacity && touched.capacity ? <p style={{color:"#db3030"}}>{errors.capacity}</p> : <></>}
                </Grid>
        </Grid>
        <Grid container spacing={2} sx={{mb:2}}>
          <Grid size={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                          name='startDate'
                          label="Start Date and Time"
                          slotProps={{
                              textField: {
                                  fullWidth: true,
                                  variant:"standard",                              
                              },
                              popper: {
                                  disablePortal: true, // <-- Add this line
                                  placement: 'right',
                              },
                          }}
                          value={values.startDate}
                          onChange={(value) => setFieldValue('startDate', value)}
                      />
                      {errors.startDate && touched.startDate ? <p style={{color:"#db3030"}}>{errors.startDate}</p> : <></>}
              </LocalizationProvider>
          </Grid>
          <Grid size={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker 
                          label="End Date and Time"
                          name='endDate'
                          slotProps={{
                              textField: {
                                  fullWidth: true,
                                  variant:"standard",
                              },
                              popper: {
                                  disablePortal: true, // <-- Add this line
                                  placement: 'left',
                              }
                          }}
                          value={values.endDate}
                          onChange={(value) => setFieldValue('endDate', value)}
                  />
                  {errors.endDate && touched.endDate ? <p style={{color:"#db3030"}}>{errors.endDate}</p> : <></>}
               </LocalizationProvider>
          </Grid>
          <Grid size={4}>
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
                                  placement: 'right',
                                  sx: { zIndex: 1500 },
                              }                       
                          }}
                          value={values.registrationDeadline}
                          onChange={(value) => setFieldValue('registrationDeadline', value)}
                      />
                      {errors.registrationDeadline && touched.registrationDeadline ? <p style={{color:"#db3030"}}>{errors.registrationDeadline}</p> : <></>}
              </LocalizationProvider>
          </Grid>
          <Grid size={4}>
                  <CustomSelectField
              label="Location"
              fieldType="single"
              options={[
                { label: 'GUC Cairo', value: 'GUC Cairo' },
                { label: 'GUC Berlin', value: 'GUC Berlin' },
              ]}
              value={values.location}
              onChange={(e: any) => setFieldValue('location', e.target ? e.target.value : e)} name={''}                  />
                  {errors.location && touched.location && (<p style={{ color: "#db3030" }}>{errors.location}</p>)}    
                </Grid>
                <Grid size={4}>
                  <CustomSelectField
              label="Faculty"
              fieldType="single"
              options={[
                { label: 'MET', value: 'MET' },
                { label: 'IET', value: 'IET' },
                { label: 'EMS', value: 'EMS' },
                { label: 'Management', value: 'MNGT' },
                { label: 'Applied Arts', value: 'AA' },
                { label: 'Architecture', value: 'ARCH' },
                { label: 'Law', value: 'LAW' },
                { label: 'DMET', value: 'DMET' }
              ]}
              value={values.faculty}
              onChange={(e: any) => setFieldValue('faculty', e.target ? e.target.value : e)} name={''}                  />
                  {errors.faculty && touched.faculty && (<p style={{ color: "#db3030" }}>{errors.faculty}</p>)}    
                </Grid>
                <Grid size={4}>
                  <CustomSelectField
              label="Funding Source"
              fieldType="single"
              options={[
                { label: 'GUC', value: 'GUC' },
                { label: 'External', value: 'External' },
              ]}
              value={values.fundingSource}
              onChange={(e: any) => setFieldValue('fundingSource', e.target ? e.target.value : e)} name={''}                  />
                  {errors.fundingSource && touched.fundingSource && (<p style={{ color: "#db3030" }}>{errors.fundingSource}</p>)}    
                </Grid>
        </Grid>
        <Grid container spacing={2} sx={{mb:2}}>
          <Grid size={5}>
                <CustomSelectField
              label="Participating Professors"
              fieldType="single"
              options={availableProfessors}
              value={selectedProf}
              onChange={(e: any) => {
                const val = e.target ? e.target.value : e;
                setSelectedProf(val);
              } } name={''}                />
                { errors.professors && touched.professors ? <p style={{color:"#db3030"}}>{errors.professors.toString()}</p> : <></>}
          </Grid>
          <Grid size={1}>
            <CustomIcon 
              icon='add' 
              size='medium' 
              containerType='outwards'
              onClick={() => {
                const profToAdd = availableProfessors.find(p => p.value === selectedProf)
                if (profToAdd && !values.professors.some(p => p.value === profToAdd.value)) {
                  setFieldValue("professors", [...values.professors, profToAdd]);
                  setSelectedProf("");
                }
              }}
            />
          </Grid>
          <Grid size={5}>
            <CustomTextField 
              label='Extra Resources'
              name='extraResources'
              id = 'extraResources' 
              fieldType='text' 
              neumorphicBox
              value={resourceInput}
              onChange={(e: any) => setResourceInput(e.target.value)}
              placeholder="e.g., Lab Equipment"
              autoCapitalize='off'
              autoCapitalizeName={false}
            />
          </Grid>
          <Grid size={1}>
            <CustomIcon
              icon="add"
              size="medium"
              containerType="outwards"
              onClick={() => {
                const trimmed = resourceInput.trim();
                if (trimmed && !values.extraResources.includes(trimmed)) {
                  setFieldValue("extraResources", [...values.extraResources, trimmed]);
                  setResourceInput("");
                }
              }}
            />
          </Grid>
          <Grid size={6}>
            <Typography variant='h6'>Participating Professors:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1}}>
              {values.professors.map((prof) => (
                <Chip
                  key={prof.value}
                  label={prof.label}
                  onDelete={() =>
                    setFieldValue(
                      'professors',
                      values.professors.filter((p) => p.value !== prof.value)
                    )
                  }
                  color="primary"
                  variant="outlined"
                  sx={{m:0.5}}
                />
              ))}
            </Box>
          </Grid>
          <Grid size={6}>
            <Typography variant="h6">Extra Resources:</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {values.extraResources.map((res) => (
                <Chip
                  key={res}
                  label={res}
                  onDelete={() =>
                    setFieldValue(
                      "extraResources",
                      values.extraResources.filter((r) => r !== res)
                    )
                  }
                  color="primary"
                  variant="outlined"
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{mb:2}}>
          <Grid size={6}>
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
                value={values.description}
                onChange={handleChange}
              />
              { errors.description && touched.description ? <p style={{color:"#db3030"}}>{errors.description}</p> : <></>}
          </Grid>
          <Grid size={6}>
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
                value={values.agenda}
                onChange={handleChange}
              />
              { errors.agenda && touched.agenda ? <p style={{color:"#db3030"}}>{errors.agenda}</p> : <></>}
          </Grid>
        </Grid>
        <Box sx={{width:'100%', display:'flex', justifyContent:'end', mt:3}}> 
            <CustomButton disabled={isSubmitting  || loadingProfessors} label={isSubmitting ? "Submitting" : 'Create Workshop'} variant='contained' color='primary' fullWidth  type='submit'/>
        </Box>
      </form>  
      </CustomModalLayout>     
    </>
  )
}

export default CreateWorkshop
