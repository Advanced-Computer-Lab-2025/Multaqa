"use client";

import React, { useState } from "react";
import { Box, Typography, Alert, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useFormik } from "formik";
import { capitalizeName } from "../shared/input-fields/utils";
import * as Yup from "yup";
import CustomButton from "../shared/Buttons/CustomButton";
import { CustomTextField, CustomSelectField } from "../shared/input-fields";
import { CustomModalLayout } from "../shared/modals";
import { DateTimePicker } from "../shared/DateTimePicker";
import { formatDuration } from "../shared/DateTimePicker/utils";
import { GymSessionType, SESSION_LABEL } from "./types";
import { createGymSession } from "./utils";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface CreateGymSessionProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void | Promise<void>;
  preselectedType?: GymSessionType;
}

// Create localized validation schema based on rigorousValidationSchema
const gymSessionValidationSchema = Yup.object({
  startDateTime: Yup.date()
    .nullable()
    .required("Start date and time is required")
    .min(new Date(), "Date and time cannot be in the past"),
  duration: Yup.number()
    .typeError("Duration must be a number")
    .required("Duration is required")
    .positive("Duration must be a positive number")
    .integer("Duration must be an integer")
    .min(10, "Minimum duration is 10 minutes")
    .max(180, "Maximum duration is 180 minutes"),
  type: Yup.string()
    .required("Session type is required")
    .oneOf(
      ["YOGA", "PILATES", "AEROBICS", "ZUMBA", "CROSS_CIRCUIT", "KICK_BOXING"],
      "Invalid session type"
    ),
  maxParticipants: Yup.number()
    .typeError("Max participants must be a number")
    .required("Max participants is required")
    .positive("Max participants must be a positive number")
    .integer("Max participants must be an integer")
    .min(1, "Must have at least 1 participant")
    .max(100, "Cannot exceed 100 participants"),
  trainer: Yup.string()
    .min(2, "Trainer name must be at least 2 characters long")
    .max(100, "Trainer name must be at most 100 characters long"),
});

const sessionTypeOptions = Object.entries(SESSION_LABEL).map(
  ([key, label]) => ({
    label,
    value: key,
  })
);

export default function CreateGymSession({
  open,
  onClose,
  onSubmit,
  preselectedType,
}: CreateGymSessionProps) {
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');

  const accentColor = theme.palette.primary.main;

  const formik = useFormik({
    initialValues: {
      startDateTime: null as Date | null,
      duration: "",
      type: preselectedType || "",
      maxParticipants: "",
      trainer: "",
    },
    validationSchema: gymSessionValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const trainerName = values.trainer
          ? capitalizeName(String(values.trainer), false)
          : undefined;
        // Create gym session via API
        await createGymSession({
          startDateTime: values.startDateTime!,
          duration: parseInt(values.duration),
          type: values.type as GymSessionType,
          maxParticipants: parseInt(values.maxParticipants),
          trainer: trainerName || undefined,
        });

        console.log("✅ Gym session created successfully");

        // Notify parent to refresh data
        if (onSubmit) {
          await onSubmit();
        }

        formik.resetForm();
        onClose();
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create gym session";
        setError(errorMessage);
        console.error("Error creating session:", err);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setActiveTab('general');
    onClose();
  };

  // Tab sections
  const tabSections = [
    { key: 'general', label: 'General Info', icon: <InfoOutlinedIcon /> },
    { key: 'details', label: 'Details', icon: <DescriptionOutlinedIcon /> },
  ];

  // Check if tabs have errors
  const generalHasErrors = !!(
    (formik.errors.type && formik.touched.type) ||
    (formik.errors.startDateTime && formik.touched.startDateTime) ||
    (formik.errors.duration && formik.touched.duration)
  );

  const detailsHasErrors = !!(
    (formik.errors.maxParticipants && formik.touched.maxParticipants) ||
    (formik.errors.trainer && formik.touched.trainer)
  );

  // Shared Paper styles for all tabs
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

  const tertiaryInputStyles = {
    '& .MuiInputLabel-root': {
      color: theme.palette.grey[500],
      '&.Mui-focused': { color: accentColor },
    },
    '& .MuiInputBase-input': {
      color: '#000000',
      '&::placeholder': {
        color: theme.palette.grey[400],
        opacity: 1,
      },
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: theme.palette.grey[400],
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottomColor: accentColor,
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: accentColor,
    },
  };

  return (
    <CustomModalLayout
      open={open}
      onClose={handleClose}
      width="w-[95vw] xs:w-[80vw] lg:w-[60vw] xl:w-[60vw]"
      borderColor={accentColor}
      title="Create Gym Session"
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
                  {/* Session Type */}
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
                      helperText={formik.touched.type ? formik.errors.type : ""}
                      placeholder="Select session type"
                      neumorphicBox
                      required
                      fullWidth
                      size="small"
                    />
                  </Box>

                  {/* Start Date and Time */}
                  <Box sx={{ mb: 3 }}>
                    <DateTimePicker
                      id="startDateTime"
                      label="Start Date & Time"
                      name="startDateTime"
                      value={formik.values.startDateTime}
                      onChange={(dateTime) =>
                        formik.setFieldValue("startDateTime", dateTime, true)
                      }
                      onBlur={() => formik.setFieldTouched("startDateTime", true)}
                      error={
                        formik.touched.startDateTime &&
                        Boolean(formik.errors.startDateTime)
                      }
                      errorMessage={
                        formik.touched.startDateTime ? formik.errors.startDateTime : ""
                      }
                      minDate={new Date()}
                      containerType="inwards"
                      touched={formik.touched.startDateTime}
                      labelColor={accentColor}
                    />
                  </Box>

                  {/* Duration */}
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
                  {/* Max Participants */}
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
                          : "Enter maximum number of participants (1-100)"
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
                    />
                  </Box>

                  {/* Trainer Name (Optional) */}
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
                        : "Leave empty if trainer is not assigned yet"
                    }
                    placeholder="Enter trainer name"
                    neumorphicBox
                    fullWidth
                  />
                </Paper>
              )}

              {/* Submit Button */}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <CustomButton 
                  disabled={!(formik.isValid && formik.dirty) || isSubmitting} 
                  label={isSubmitting ? "Creating..." : 'Create'} 
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