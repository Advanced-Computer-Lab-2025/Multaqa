"use client";

import React, { useMemo, useState } from "react";
import { Box, Typography, Alert, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useFormik } from "formik";
import { capitalizeName } from "../shared/input-fields/utils";
import * as Yup from "yup";
import CustomButton from "../shared/Buttons/CustomButton";
import { CustomTextField, CustomSelectField } from "../shared/input-fields";
import { CustomModalLayout } from "../shared/modals";
import { formatDuration } from "../shared/DateTimePicker/utils";
import { GymSessionType, SESSION_LABEL } from "./types";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { toast } from "react-toastify";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from "dayjs";
import { editGymSession } from "./utils";

// Define the form data structure
interface GymSessionFormData {
  startDateTime: Dayjs | null;
  duration: string;
  // NOTE: These fields are required for initialValues/UI but disabled/excluded from payload
  type: GymSessionType | string; 
  maxParticipants: string;
  trainer: string;
}

interface EditGymSessionProps {
  sessionId: string; 
  open: boolean;
  onClose: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  initialStartDateTime: Date;
  initialDuration: string;
  initialType: GymSessionType;
  initialMaxParticipants: number;
  initialTrainer: string;
}

// 🎯 EDITED: Only validate editable fields (startDateTime and duration)
const gymSessionValidationSchema = Yup.object({
  startDateTime: Yup.date()
    .nullable()
    .required("Start date and time is required")
    .min(dayjs().subtract(1, 'minute').toDate(), "Date and time cannot be in the past"), // Added past check validation
  duration: Yup.number()
    .typeError("Duration must be a number")
    .required("Duration is required")
    .positive("Duration must be a positive number")
    .integer("Duration must be an integer")
    .min(10, "Minimum duration is 10 minutes")
    .max(180, "Maximum duration is 180 minutes"),
  // Disabled fields are excluded from validation or are only minimally validated
  type: Yup.string(), 
  maxParticipants: Yup.string(),
  trainer: Yup.string(),
});

const sessionTypeOptions = Object.entries(SESSION_LABEL).map(
  ([key, label]) => ({
    label,
    value: key,
  })
);

export default function EditGymSession({
  sessionId,
  open,
  onClose,
  setRefresh,
  initialStartDateTime,
  initialDuration,
  initialType,
  initialMaxParticipants,
  initialTrainer,
}: EditGymSessionProps) {
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accentColor = theme.palette.primary.main;
  const [activeTab, setActiveTab] = useState('general');

  // Memoize initial values - 🎯 CONVERT Date to Dayjs here
  const initialValues: GymSessionFormData = useMemo(() => ({
    startDateTime: dayjs(initialStartDateTime), // ✅ Conversion here
    duration: String(initialDuration),
    type: initialType,
    maxParticipants: String(initialMaxParticipants),
    trainer: initialTrainer || "",
  }), [initialStartDateTime, initialDuration, initialType, initialMaxParticipants, initialTrainer]);

  const formik = useFormik<GymSessionFormData>({
    initialValues: initialValues,
    validationSchema: gymSessionValidationSchema,
    enableReinitialize: true, 
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const trainerName = values.trainer
          ? capitalizeName(String(values.trainer), false)
          : undefined;
        const payload = {
          startDateTime: values.startDateTime!.toDate(), 
          duration: parseInt(values.duration),
          type: values.type as GymSessionType,
          maxParticipants: parseInt(values.maxParticipants),
          trainer: trainerName || undefined,
        };
        await editGymSession(sessionId, payload);

        // Close modal and show success toast only upon success
        onClose(); 
        toast.success("Gym session updated successfully", { // Changed text from 'created' to 'updated'
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
        });

        setRefresh((prev) => !prev);
        formik.resetForm();

      } catch (err: any) {
        const errorMessage =
          err?.message || "Failed to update gym session";

        setError(errorMessage);
        window.alert(errorMessage);
        toast.error(errorMessage, {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const tabSections = [
    { key: 'general', label: 'General Info', icon: <InfoOutlinedIcon /> },
    { key: 'details', label: 'Details', icon: <DescriptionOutlinedIcon /> },
  ];
  
  // Check if tabs have errors
  const generalHasErrors = !!(
    (formik.errors.startDateTime && formik.touched.startDateTime) ||
    (formik.errors.duration && formik.touched.duration)
    // Note: Type is excluded as it's not editable, but kept for UI structure
  );
  
  const detailsHasErrors = !!(
    (formik.errors.maxParticipants && formik.touched.maxParticipants) ||
    (formik.errors.trainer && formik.touched.trainer)
  );

  const contentPaperStyles = {
    p: { xs: 1, md: 3 },
    borderRadius: '32px',
    background: theme.palette.background.paper,
    border: `1.5px solid ${accentColor}`,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    boxShadow: '0 4px 24px 0 rgba(110, 138, 230, 0.08)',
    transition: 'box-shadow 0.2s',
  };


  return (
    <CustomModalLayout
      open={open}
      onClose={handleClose}
      width="w-[95vw] xs:w-[80vw] lg:w-[60vw] xl:w-[60vw]"
      borderColor={accentColor}
      title="Edit Gym Session"
    >
      <Box sx={{ 
        background: '#fff',
        borderRadius: '32px',
        p: 3,
        height: '450px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        <form onSubmit={formik.handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2, borderRadius: '16px' }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            flex: 1,
            gap: 3,
            minHeight: 0,
          }}>
            {/* Sidebar - Fixed width */}
            <Box
              sx={{
                width: '220px', 
                flexShrink: 0,
                background: theme.palette.background.paper,
                borderRadius: '32px',
                border: `2px solid ${accentColor}`,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                boxShadow: '0 4px 24px 0 rgba(110, 138, 230, 0.08)',
                transition: 'box-shadow 0.2s',
                height: 'fit-content', 
                alignSelf: 'flex-start', 
              }}
            >
              <List sx={{ width: '100%', height: '100%' }}>
                {tabSections.map((section) => {
                  const hasError = section.key === 'general' ? generalHasErrors : section.key === 'details' ? detailsHasErrors : false;
                  
                  return (
                    <ListItem key={section.key} disablePadding>
                      <ListItemButton
                        selected={activeTab === section.key}
                        onClick={() => setActiveTab(section.key)}
                        sx={{
                          borderRadius: '24px',
                          mb: 1.5,
                          px: 2.5,
                          py: 1.5,
                          fontWeight: 600,
                          fontSize: '1.08rem',
                          background: activeTab === section.key ? 'rgba(110, 138, 230, 0.08)' : 'transparent',
                          color: activeTab === section.key ? accentColor : theme.palette.text.primary,
                          boxShadow: activeTab === section.key ? '0 2px 8px 0 rgba(110, 138, 230, 0.15)' : 'none',
                          transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
                          '&:hover': {
                            background: 'rgba(110, 138, 230, 0.05)',
                            color: accentColor,
                          },
                        }}
                      >
                        <ListItemIcon sx={{ 
                          minWidth: 36, 
                          color: activeTab === section.key ? accentColor : theme.palette.text.primary, 
                          '&:hover': { color: accentColor } 
                        }}>
                          {section.icon}
                        </ListItemIcon>
                        <ListItemText primary={section.label} primaryTypographyProps={{ fontWeight: 700 }} />
                        {hasError && (
                          <ErrorOutlineIcon 
                            sx={{ 
                              color: '#db3030', 
                              fontSize: '20px',
                              ml: 'auto'
                            }} 
                          />
                        )}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>

            {/* Content Area - Takes remaining space */}
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              minWidth: 0,
            }}>
              {/* General Info Tab */}
              {activeTab === 'general' && (
                <Paper elevation={0} sx={contentPaperStyles}>
                  {/* Session Type (DISABLED) */}
                  <Box sx={{ mb: 3 }}>
                    <CustomSelectField
                      label="Session Type"
                      fieldType="single"
                      options={sessionTypeOptions}
                      name="type"
                      value={formik.values.type}
                      onChange={(value) => formik.setFieldValue("type", value)}
                      onBlur={() => formik.setFieldTouched("type", true)}
                      isError={formik.touched.type ? Boolean(formik.errors.type) : false}
                      helperText={formik.touched.type ? formik.errors.type : "Session type cannot be changed."}
                      placeholder="Select session type"
                      neumorphicBox
                      required
                      fullWidth
                      size="small"
                      disabled // 🎯 DISABLED
                    />
                  </Box>

                  {/* Start Date and Time (EDITABLE) */}
                  <Box sx={{ mb: 3 , ml:1}}>
                  <Box sx={{ flex: 1 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        name="startDateTime"
                        label="Start Date & Time"
                        slotProps={{
                          textField: {
                            variant: "standard",
                            fullWidth: true,
                            // ✅ Correct error handling
                            error: formik.touched.startDateTime && Boolean(formik.errors.startDateTime),
                            helperText: formik.touched.startDateTime ? formik.errors.startDateTime : "",
                            InputLabelProps: {
                              sx: {
                                color: theme.palette.grey[500],
                                '&.Mui-focused': { color: accentColor },
                              },
                            },
                            sx: {
                              color: accentColor,
                              '& .MuiInput-underline:before': {
                                borderBottomColor: theme.palette.grey[400],
                              },
                              '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                borderBottomColor: accentColor,
                              },
                              '& .MuiInput-underline:after': {
                                borderBottomColor: accentColor,
                              },
                            },
                          },
                        }}
                        minDate={dayjs(new Date())}
                        value={formik.values.startDateTime}
                        onChange={(dateTime) =>
                          formik.setFieldValue("startDateTime", dateTime, true)
                        } 
                        onClose={() => formik.setFieldTouched("startDateTime", true)}
                      />
                    </LocalizationProvider>
                    {/* ❌ REMOVED: Redundant Typography error display */}
                  </Box>
                  </Box>

                  {/* Duration (EDITABLE) */}
                  <CustomTextField
                    label="Duration (minutes)"
                    fieldType="numeric"
                    name="duration"
                    value={formik.values.duration}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    onKeyPress={(event) => {
                      const char = String.fromCharCode(event.which);
                      if (!/[0-9]/.test(char)) {
                        event.preventDefault();
                      }
                    }}
                    error={formik.touched.duration && Boolean(formik.errors.duration)}
                    helperText={
                      formik.touched.duration
                        ? formik.errors.duration
                        : formik.values.duration
                        ? `Duration: ${formatDuration(formik.values.duration)}`
                        : "Enter duration in minutes (10-180 min)"
                    }
                    placeholder="Enter duration in minutes"
                    neumorphicBox
                    required
                    fullWidth
                    inputProps={{
                      min: 10,
                      max: 180,
                      pattern: "[0-9]*",
                      inputMode: "numeric",
                    }}
                  />
                </Paper>
              )}

              {/* Details Tab */}
              {activeTab === 'details' && (
                <Paper elevation={0} sx={contentPaperStyles}>
                  {/* Max Participants (DISABLED) */}
                  <Box sx={{ mb: 3 }}>
                    <CustomTextField
                      label="Max Participants"
                      fieldType="numeric"
                      placeholder="Maximum number of participants"
                      name="maxParticipants"
                      value={formik.values.maxParticipants}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      onKeyPress={(event) => {
                        const char = String.fromCharCode(event.which);
                        if (!/[0-9]/.test(char)) {
                          event.preventDefault();
                        }
                      }}
                      error={
                        formik.touched.maxParticipants &&
                        Boolean(formik.errors.maxParticipants)
                      }
                      helperText={
                        formik.touched.maxParticipants
                          ? formik.errors.maxParticipants
                          : "Max participants cannot be changed."
                      }
                      neumorphicBox
                      required
                      fullWidth
                      inputProps={{
                        min: 1,
                        max: 100,
                        pattern: "[0-9]*",
                        inputMode: "numeric",
                      }}
                      disabled // 🎯 DISABLED
                    />
                  </Box>

                  {/* Trainer Name (DISABLED) */}
                  <CustomTextField
                    label="Trainer Name (Optional)"
                    fieldType="text"
                    name="trainer"
                    value={formik.values.trainer}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.trainer && Boolean(formik.errors.trainer)}
                    helperText={
                      formik.touched.trainer
                        ? formik.errors.trainer
                        : "Trainer name cannot be changed."
                    }
                    placeholder="Enter trainer name"
                    neumorphicBox
                    fullWidth
                    disabled // 🎯 DISABLED
                  />
                </Paper>
              )}

              {/* Submit Button */}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <CustomButton 
                  // Renamed to 'Edit' from 'Create'
                  disabled={!(formik.isValid && formik.dirty) || isSubmitting} 
                  label={isSubmitting ? "Editing..." : 'Edit'} 
                  variant='contained' 
                  color='primary' 
                  type='submit' 
                  sx={{ 
                    px: 3, 
                    width: "180px", 
                    height: "40px", 
                    fontWeight: 700, 
                    fontSize: "16px", 
                    borderRadius: '20px', 
                    boxShadow: '0 2px 8px 0 rgba(110, 138, 230, 0.15)',
                    background: accentColor,
                    '&:hover': {
                      background: '#5a7ae0',
                    }
                  }}
                />
              </Box>
            </Box>
          </Box>
        </form>
      </Box>
    </CustomModalLayout>
  );
}