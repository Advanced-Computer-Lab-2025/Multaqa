import React, { useState ,useEffect} from 'react'
import {useFormik, Formik} from 'formik'

import { Chip, Grid, InputAdornment, TextField, Typography, Box } from '@mui/material'
import { CustomSelectField, CustomTextField } from '@/components/shared/input-fields'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CustomIcon from '@/components/shared/Icons/CustomIcon';

import {workshopSchema} from "../CreateWorkshop/schemas/workshop";
import dayjs from 'dayjs';
import CustomButton from '@/components/shared/Buttons/CustomButton';

import {api} from "../../../api";
import { CustomModalLayout } from '@/components/shared/modals';
import { wrapperContainerStyles, horizontalLayoutStyles,step1BoxStyles, step2BoxStyles, modalFormStyles,modalHeaderStyles, detailTitleStyles, modalFooterStyles } from '../../shared/styles';
import RichTextField from '../../shared/TextField/TextField';
import theme from '@/themes/lightTheme';
import { Edit } from 'lucide-react';


interface ProfessorOption {
  label: string;
  value: string; // ideally, the professor _id
}

interface EditWorkshopProps {
  workshopId:string;
  workshopName?: string;
  budget?: number;
  capacity?: number;
  startDate: Date | null;
  endDate: Date | null;
  registrationDeadline: Date | null;  
  description?: string;
  agenda?: string;
  location?: string;
  faculty?: string;
  fundingSource?: string;
  extraResources?: string[];
  creatingProfessor:string;
  associatedProfs?:string[];
  open:boolean;
  onClose: () => void;
  setRefresh?:React.Dispatch<React.SetStateAction<boolean>>;
}

const EditWorkshop = ({
    workshopId,
    workshopName = "",
    budget = 0,
    capacity = 0,
    startDate = null,
    endDate = null,
    registrationDeadline = null,
    description = "",
    agenda = "",
    location = "",
    faculty,
    fundingSource = "",
    extraResources = [],
    creatingProfessor,
    associatedProfs,
    open, 
    setRefresh,
    onClose
  }: EditWorkshopProps) => {
  const [selectedProf, setSelectedProf] = useState<string>("");
  const [resourceInput, setResourceInput] = useState<string>("");
  const [loadingProfessors, setLoadingProfessors] = useState(true);
  const [availableProfessors, setAvailableProfessors] = useState<ProfessorOption[]>([]);

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleLoadProfessors();
  }, []);

  useEffect(() => {
    if (associatedProfs &&availableProfessors.length > 0 && associatedProfs.length > 0) {
      const matchingProfs = availableProfessors.filter(prof =>
        associatedProfs.includes(prof.value)
      );
      setFieldValue('professors', matchingProfs);
    }
  }, [availableProfessors, associatedProfs]);

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
      workshopName,
      budget,
      capacity,
      startDate: startDate? dayjs(startDate) : null,
      endDate: endDate ? dayjs(endDate) : null,
      registrationDeadline: registrationDeadline ? dayjs(registrationDeadline) : null,
      description,
      agenda,
      professors: [] as ProfessorOption[],
      location,
      faculty,
      fundingSource,
      extraResources,
  };

  const handleCallApi = async (payload:any) => {
    setLoading(true);
    setError(null);
    setResponse([]);
    try {
        // TODO: Replace with your API route
        const res = await api.patch("/workshops/" + workshopId, payload);
        setResponse(res.data);
    } catch (err: any) {
        setError(err?.message || "API call failed");
        window.alert(err.response.data.error);
    } finally {
        setLoading(false);
    }
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
      associatedProfs:values.professors.map((p: { label: string; value: string }) => p.value),
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

  const handleDescriptionChange = (htmlContent: string) => {
      setFieldValue('description', htmlContent);
    };
  
    return (
      <>
      <CustomModalLayout open={open} onClose={onClose} width="w-[95vw] xs:w-[80vw] lg:w-[70vw] xl:w-[70vw]">
        <Box sx={{
        ...wrapperContainerStyles,    
        }}>
          <Typography sx={{...detailTitleStyles(theme),fontSize: '26px', fontWeight:[950], alignSelf: 'flex-start', paddingLeft:'26px'}}>
          Create Workshop
          </Typography>
            <form onSubmit={handleSubmit}>
              <Box 
              sx={horizontalLayoutStyles(theme)}
              >
              <Box sx={{...step1BoxStyles(theme),width:'400px',height:'560px'}}>
                <Box sx={modalHeaderStyles}>
                    <Typography sx={detailTitleStyles(theme)}>
                      General Information
                    </Typography>      
                  </Box>
                <Box sx={modalFormStyles}>
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
                          sx={{mt:2}}
                      />
                      { errors.workshopName && touched.workshopName ? <p style={{color:"#db3030"}}>{errors.workshopName}</p> : <></>}
                    <Box sx={{ mt: 3 }}>
                      <RichTextField
                          label="Description" 
                          value={values.description}
                          placeholder="Provide a short description of the trip"
                          onChange={handleDescriptionChange}
                      />
                      { errors.description && touched.description ? <p style={{color:"#db3030"}}>{errors.description}</p> : <></>}
                    </Box>
                    <Box sx={{ mt: 3 }}>
                        <RichTextField
                            label="Full Agenda" 
                            value={values.agenda}
                            placeholder="Provide the full agenda of the workshop"
                            onChange={(htmlContent: string) => setFieldValue('agenda', htmlContent)}
                        />
                        { errors.agenda && touched.agenda ? <p style={{color:"#db3030"}}>{errors.agenda}</p> : <></>}
                    </Box>
  
                </Box>
              </Box>
              <Box sx={{...step2BoxStyles(theme),width:'580px',height:'580px'}}>
                      <Box sx={modalHeaderStyles}>
                          <Typography sx={detailTitleStyles(theme)}>
                              Workshop Details
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
  <Box sx={{ display: "flex", gap: 1, marginTop: "12px", marginBottom:"18px" }}>
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <TextField
        name="budget"
        id="budget"
        label="Budget"
        type="number"
        fullWidth
        variant="standard"
        placeholder="Enter Budget"
        value={values.budget}
        onChange={handleChange}
      />
      {errors.budget && touched.budget ? <p style={{ color: "#db3030", marginTop: "4px" }}>{errors.budget}</p> : <></>}
    </Box>
  
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <TextField
        name="capacity"
        id="capacity"
        label="Capacity"
        type="number"
        fullWidth
        variant="standard"
        placeholder="Enter Capacity"
        value={values.capacity}
        onChange={handleChange}
      />
      {errors.capacity && touched.capacity ? <p style={{ color: "#db3030", marginTop: "4px" }}>{errors.capacity}</p> : <></>}
    </Box>
  </Box>
  <Box sx={{ display: "flex", gap: 2, marginTop: "20px", marginBottom: "16px" }}>
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <CustomSelectField
      label="Funding"
      fieldType="single"
      options={[
        { label: 'GUC', value: 'GUC' },
        { label: 'External', value: 'External' },
      ]}
      value={values.fundingSource}
      onChange={(e: any) => setFieldValue('fundingSource', e.target ? e.target.value : e)} name={''}            />
    {errors.fundingSource && touched.fundingSource && (<p style={{ color: "#db3030" }}>{errors.fundingSource}</p>)}    
    </Box>
    
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
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
  
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <CustomSelectField
        label="Faculty"
        fieldType="single"
        options={[
          { label: "MET", value: "MET" },
          { label: "IET", value: "IET" },
          { label: "EMS", value: "EMS" },
          { label: "Management", value: "MNGT" },
          { label: "Applied Arts", value: "AA" },
          { label: "Architecture", value: "ARCH" },
          { label: "Law", value: "LAW" },
          { label: "DMET", value: "DMET" },
        ]}
        value={values.faculty}
        onChange={(e: any) => setFieldValue("faculty", e.target ? e.target.value : e)}
        name={""}
      />
      {errors.faculty && touched.faculty && (
        <p style={{ color: "#db3030", marginTop: "4px" }}>{errors.faculty}</p>
      )}
    </Box>
  </Box>
              <Typography sx={{...detailTitleStyles(theme), mb:"6px"}}> Participating Professors </Typography> 
               <CustomSelectField
                label="Participating Professors"
                fieldType="single"
                options={availableProfessors}
                value={selectedProf}
                onChange={(e: any) => {
                  const val = e.target ? e.target.value : e;
                  setSelectedProf(val);
                  // Find the selected option object and add it to formik values.professors if not already present
                  const opt = availableProfessors.find((o) => o.value === val);
                  if (opt) {
                    const already = values.professors.some((p: any) => p.value === opt.value);
                    if (!already) {
                      setFieldValue('professors', [...values.professors, opt]);
                    }
                  }
                  // clear the select state so the UI can be used to add another
                  setSelectedProf('');
                }}
                name={''}
              />
              {errors.professors && touched.professors ? <p style={{color:"#db3030"}}>{errors.professors.toString()}</p> : <></>} 
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: '8px', marginBottom: '12px' }}>
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
            <Typography sx={detailTitleStyles(theme)}> Extra Resources </Typography>
            <Box sx={{display:"flex", gap:1, marginTop: "6px",marginBottom:"12px", alignItems: "center" }}>
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
              <CustomIcon
                icon="add"
                size="small"
                containerType="outwards"
                onClick={() => {
                  const trimmed = resourceInput.trim();
                  if (trimmed && !values.extraResources.includes(trimmed)) {
                    setFieldValue("extraResources", [...values.extraResources, trimmed]);
                    setResourceInput("");
                  }
                }}
              />
             </Box> 
            
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginBottom: "12px" }}>
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
              </Box>
         </Box>
      </Box>
          <Box sx={modalFooterStyles}> 
              <CustomButton color='tertiary' disabled={isSubmitting} label={isSubmitting ? "submitting":"Edit"} variant='contained' fullWidth type='submit' sx={{px: 1.5, width:"100px", height:"32px" ,fontWeight: 600, padding:"12px", fontSize:"14px"}}/>
          </Box>
        </form>  
        </Box>
        </CustomModalLayout>     
      </>
    )
  }
  
  export default EditWorkshop;
  