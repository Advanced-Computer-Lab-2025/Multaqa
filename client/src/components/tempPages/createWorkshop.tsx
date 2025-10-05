"use client";
import React, { useState } from "react";
import CustomButton from "../shared/Buttons/CustomButton";
import FilterChip from "../shared/Chip/Chip";
import NeumorphicBox from "../shared/containers/NeumorphicBox";
import {
  Box,
  Container,
  Divider,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@/components/shared/mui";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type Faculty = 'MET' | 'IET' | 'CET' | 'Other';

interface AgendaItem {
  id: string;
  title: string;
  start: string; // ISO datetime
  end: string; // ISO datetime
  description?: string;
}

export default function CreateWorkshopPage() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState<'GUC Cairo' | 'GUC Berlin'>('GUC Cairo');
  const [startDateTime, setStartDateTime] = useState<string>("");
  const [endDateTime, setEndDateTime] = useState<string>("");
  const [shortDesc, setShortDesc] = useState("");
  const [faculty, setFaculty] = useState<Faculty>('MET');
  const [profInput, setProfInput] = useState("");
  const [professors, setProfessors] = useState<string[]>([]);
  const [budget, setBudget] = useState<number | ''>('');
  const [fundingSource, setFundingSource] = useState<'External' | 'GUC'>('GUC');
  const [extraResources, setExtraResources] = useState("");
  const [capacity, setCapacity] = useState<number | ''>('');
  const [registrationDeadline, setRegistrationDeadline] = useState<string>("");

  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [agendaInput, setAgendaInput] = useState<string>("");

  const addProfessor = () => {
    const val = profInput.trim();
    if (!val) return;
    if (!professors.includes(val)) setProfessors(prev => [...prev, val]);
    setProfInput("");
  };

  const removeProfessor = (name: string) => {
    setProfessors(prev => prev.filter(p => p !== name));
  };

  const addAgendaItem = (titleFromInput?: string) => {
    const id = String(Date.now());
    const title = (titleFromInput ?? '').trim();
    setAgenda(prev => [...prev, { id, title, start: '', end: '', description: '' }]);
    setAgendaInput('');
  };

  const updateAgendaItem = (id: string, patch: Partial<AgendaItem>) => {
    setAgenda(prev => prev.map(item => item.id === id ? { ...item, ...patch } : item));
  };

  const removeAgendaItem = (id: string) => {
    setAgenda(prev => prev.filter(a => a.id !== id));
  };

  const saveWorkshop = () => {
    // simple client-side validation
    const errors: string[] = [];
    if (!title.trim()) errors.push('Workshop title is required');
    if (!startDateTime) errors.push('Start date/time is required');
    if (!endDateTime) errors.push('End date/time is required');
    if (startDateTime && endDateTime && startDateTime > endDateTime) errors.push('Start must be before end');
    if (!registrationDeadline) errors.push('Registration deadline is required');

    if (errors.length) {
      alert('Please fix: \n' + errors.join('\n'));
      return;
    }

    const payload = {
      title, location, startDateTime, endDateTime, shortDesc,
      fullAgenda: agenda,
      facultyResponsible: faculty,
      professors,
      budget: budget === '' ? null : budget,
      fundingSource,
      extraResources,
      capacity: capacity === '' ? null : capacity,
      registrationDeadline,
    };

    // For prototype we just log. In real app we'd call an API.
    console.log('Saving workshop', payload);
    alert('Workshop saved (console.log)');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <NeumorphicBox containerType="outwards" padding="20px" borderRadius="16px" margin="0 0 0px 0">
        <Box className="mb-3">
          <Typography variant="h4" fontWeight={700} color="primary" className="text-center">Create Workshop</Typography>
        </Box>
        <Accordion defaultExpanded sx={{ mb: 0 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="basics-content" id="basics-header">
            <Typography variant="h6" fontWeight={600}>Basics</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Workshop Title" value={title} onChange={e => setTitle(e.target.value)} />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel id="location-label">Location</InputLabel>
                  <Select
                    labelId="location-label"
                    value={location}
                    label="Location"
                    onChange={(e) => setLocation(e.target.value as 'GUC Cairo' | 'GUC Berlin')}
                  >
                    <MenuItem value={'GUC Cairo'}>GUC Cairo</MenuItem>
                    <MenuItem value={'GUC Berlin'}>GUC Berlin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Short Description" value={shortDesc} onChange={e => setShortDesc(e.target.value)} multiline rows={1} fullWidth />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded sx={{ mb: 0 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="schedule-content" id="schedule-header">
            <Typography variant="h6" fontWeight={600}>Schedule</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  type="datetime-local"
                  label="Start Date & Time"
                  InputLabelProps={{ shrink: true }}
                  value={startDateTime}
                  onChange={e => setStartDateTime(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  type="datetime-local"
                  label="End Date & Time"
                  InputLabelProps={{ shrink: true }}
                  value={endDateTime}
                  onChange={e => setEndDateTime(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  type="datetime-local"
                  label="Registration Deadline"
                  InputLabelProps={{ shrink: true }}
                  value={registrationDeadline}
                  onChange={e => setRegistrationDeadline(e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded sx={{ mb: 0 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="people-content" id="people-header">
            <Typography variant="h6" fontWeight={600}>People</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel id="faculty-label">Faculty Responsible</InputLabel>
                  <Select labelId="faculty-label" value={faculty} label="Faculty Responsible" onChange={e => setFaculty(e.target.value as Faculty)}>
                    <MenuItem value={'MET'}>MET</MenuItem>
                    <MenuItem value={'IET'}>IET</MenuItem>
                    <MenuItem value={'CET'}>CET</MenuItem>
                    <MenuItem value={'Other'}>Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Professors Participating</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  {professors.map(p => (
                    <FilterChip key={p} label={p} deletable onDelete={() => removeProfessor(p)} />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField value={profInput} onChange={e => setProfInput(e.target.value)} placeholder="Add professor name" size="small" fullWidth />
                  <CustomButton onClick={addProfessor}>Add</CustomButton>
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded sx={{ mb: 0 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="logistics-content" id="logistics-header">
            <Typography variant="h6" fontWeight={600}>Logistics</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Required Budget (USD)"
                  type="number"
                  value={budget}
                  onChange={e => setBudget(e.target.value === '' ? '' : Number(e.target.value))}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Funding Source</Typography>
                  <RadioGroup row value={fundingSource} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFundingSource(e.target.value as 'External' | 'GUC')}>
                    <FormControlLabel value="GUC" control={<Radio />} label="GUC" />
                    <FormControlLabel value="External" control={<Radio />} label="External" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField label="Capacity" type="number" value={capacity} onChange={e => setCapacity(e.target.value === '' ? '' : Number(e.target.value))} fullWidth />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField label="Extra Required Resources" value={extraResources} onChange={e => setExtraResources(e.target.value)} multiline rows={2} fullWidth />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded sx={{ mb: 0 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="agenda-content" id="agenda-header">
            <Typography variant="h6" fontWeight={600}>Agenda</Typography>
          </AccordionSummary>
          <AccordionDetails>
          </AccordionDetails>
        </Accordion>
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 2 }}>
          <CustomButton onClick={() => window.history.back()} variant="contained">Cancel</CustomButton>
          <CustomButton onClick={saveWorkshop} variant="contained">Save Workshop</CustomButton>
        </Box>
      </NeumorphicBox>
    </Container>
  );
}
