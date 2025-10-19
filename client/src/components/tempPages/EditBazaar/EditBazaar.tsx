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
  return (
    <>
      <CustomModalLayout open={open} onClose={onClose}>
        <form onSubmit={handleSubmit}>
          <Typography variant='h4' color='primary' className='text-center mb-3'>Edit Bazaar</Typography>
          <Grid container spacing={2}>
            <Grid size={6}>
              <CustomTextField
                name='bazaarName'
                id='bazaarName'
                label="Bazaar Name" fullWidth margin="normal" fieldType='text'
                value={values.bazaarName}
                onChange={handleChange}
                autoCapitalize='off'
                autoCapitalizeName={false}
              />
              {errors.bazaarName && touched.bazaarName ? <p style={{ color: "#db3030" }}>{errors.bazaarName}</p> : <></>}
            </Grid>
            <Grid size={6}>
              <CustomTextField
                name='location'
                id='location'
                label="Location" fullWidth margin="normal" fieldType='text'
                value={values.location}
                onChange={handleChange}
                autoCapitalize='off'
                autoCapitalizeName={false}
              />
              {errors.location && touched.location ? <p style={{ color: "#db3030" }}>{errors.location}</p> : <></>}
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid size={6}>
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
                {errors.startDate && touched.startDate ? <p style={{ color: "#db3030" }}>{errors.startDate}</p> : <></>}
              </LocalizationProvider>
            </Grid>
            <Grid size={6}>
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
                {errors.endDate && touched.endDate ? <p style={{ color: "#db3030" }}>{errors.endDate}</p> : <></>}
              </LocalizationProvider>
            </Grid>
            <Grid size={6}>
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
                />
                {errors.registrationDeadline && touched.registrationDeadline ? <p style={{ color: "#db3030" }}>{errors.registrationDeadline}</p> : <></>}
              </LocalizationProvider>
            </Grid>
            <Grid size={12}>
              <CustomTextField
                name='description'
                id='description'
                label="Short Description"
                fieldType='text'
                multiline
                minRows={3}
                neumorphicBox={true}
                fullWidth
                value={values.description}
                onChange={handleChange}
                autoCapitalize='off'
                autoCapitalizeName={false}
              />
              {errors.description && touched.description ? <p style={{ color: "#db3030" }}>{errors.description}</p> : <></>}
            </Grid>
          </Grid>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 2 }}>
            <CustomButton disabled={isSubmitting} label={isSubmitting ? "submitting" : 'Confirm Edits'} variant='contained' color='primary' fullWidth sx={{ mt: 2 }} type='submit' />
          </Box>
        </form>
      </CustomModalLayout>
    </>
  )
}

export default EditBazaar;






