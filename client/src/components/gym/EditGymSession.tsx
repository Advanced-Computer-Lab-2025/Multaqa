"use client";

import React, { useState, useMemo } from "react";
import { Box, Typography, Alert, useTheme } from "@mui/material";
import { useFormik } from "formik";
import { capitalizeName } from "../shared/input-fields/utils";
import * as Yup from "yup";
import CustomButton from "../shared/Buttons/CustomButton";
import { CustomTextField, CustomSelectField } from "../shared/input-fields";
import { CustomModalLayout } from "../shared/modals";
import { DateTimePicker } from "../shared/DateTimePicker";
import { formatDuration } from "../shared/DateTimePicker/utils";
import { GymSessionType, SESSION_LABEL } from "./types";
import { modalFooterStyles } from "../shared/styles";
import { editGymSession } from './utils';
import { toast } from "react-toastify";

// Define the form data structure
interface GymSessionFormData {
  startDateTime: Date | null;
  duration: string;
  type: GymSessionType | string;
  maxParticipants: string;
  trainer: string;
}

interface EditGymSessionProps {
  sessionId: string; // ID for the PATCH request
  open: boolean;
  onClose: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>; // For refreshing parent data after edit
  // Initial values for the session
  initialStartDateTime: Date; // Should be a Date object
  initialDuration: string;
  initialType: GymSessionType;
  initialMaxParticipants: number;
  initialTrainer: string;
}

// Validation schema (copied from CreateGymSession, but fields that are not editable
// are essentially validated on load, and editing is restricted by 'disabled' prop)
const gymSessionValidationSchema = Yup.object({
  startDateTime: Yup.date()
    .nullable()
    .required("Start date and time is required"),
    //.min(new Date(), "Date and time cannot be in the past"),
  duration: Yup.number()
    .typeError("Duration must be a number")
    .required("Duration is required")
    .positive("Duration must be a positive number")
    .integer("Duration must be an integer")
    .min(10, "Minimum duration is 10 minutes")
    .max(180, "Maximum duration is 180 minutes"),
  // These fields are pre-filled and disabled, but validation ensures initial state is correct
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

  // Memoize initial values to prevent unnecessary re-initialization
  const initialValues: GymSessionFormData = useMemo(() => ({
    startDateTime: initialStartDateTime,
    duration: String(initialDuration), // Convert number to string for text field
    type: initialType,
    maxParticipants: String(initialMaxParticipants), // Convert number to string for text field
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

        // Construct the payload for the utility function
        const payload = {
          startDateTime: values.startDateTime!, // Date object is fine, utils handles ISO
          duration: parseInt(values.duration),
          type: values.type as GymSessionType,
          maxParticipants: parseInt(values.maxParticipants),
          trainer: trainerName || undefined,
        };

        // 🎯 NEW LOGIC: Use the dedicated utility function
        await editGymSession(sessionId, payload);

        // Close modal and show success toast only upon success
        onClose(); 
        toast.success("Gym session edited successfully", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
        });

        // Notify parent to refresh data
        setRefresh((prev) => !prev);
        formik.resetForm();

      } catch (err: any) {
        // Keep the modal open for the user to retry or see the error
        // Re-open the modal if you closed it before the try/catch
        // NOTE: Since you call onClose() before the try/catch, you should probably remove that line.
        
        const errorMessage =
          err?.message || "Failed to update gym session"; // The utils function throws a clean Error object

        setError(errorMessage);
        window.alert(errorMessage);
        toast.error(errorMessage, { // Use the actual error message in the toast
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

  return (
    <CustomModalLayout
      open={open}
      onClose={handleClose}
      width="w-[90vw] sm:w-[80vw] md:w-[700px]"
      borderColor={theme.palette.primary.main}
    >
      <form onSubmit={formik.handleSubmit}>
        
        <Box sx={{ p: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "var(--font-jost), system-ui, sans-serif",
              fontWeight: 700,
              color: theme.palette.tertiary.main,
              textAlign: "center",
              mb: 3,
            }}
          >
            Edit Gym Session
          </Typography>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}
        
          <Box sx={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: 3,
            borderRadius: '6px',
            borderColor:theme.palette.tertiary.main,
            borderWidth:'1px',
            padding: '32px',
            boxShadow: theme.shadows[5],
            minHeight:'450px',
            }}>
            
            {/* Session Type (Read-Only) */}
            <CustomSelectField
              label="Session Type"
              fieldType="single"
              options={sessionTypeOptions}
              name="type"
              value={formik.values.type}
              onChange={(value) => formik.setFieldValue("type", value)}
              onBlur={() => formik.setFieldTouched("type", true)}
              isError={
                formik.touched.type ? Boolean(formik.errors.type) : false
              }
              helperText={formik.touched.type ? formik.errors.type : "Session type cannot be changed"}
              placeholder="Select session type"
              neumorphicBox
              required
              fullWidth
              size="small"
              disabled // Field is not editable
              />

            {/* Trainer Name (Optional) (Read-Only) */}
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
                  : "Trainer name cannot be changed"
              }
              placeholder="Enter trainer name"
              neumorphicBox
              fullWidth
              disabled // Field is not editable
            />

          {/* Start Date and Time (Editable) */}
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
              labelColor={theme.palette.tertiary.main}
            />

            {/* Duration (Editable) */}
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

            {/* Max Participants (Read-Only) */}
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
                  : "Max participants cannot be changed"
              }
              neumorphicBox
              required
              fullWidth
              disabled // Field is not editable
              inputProps={{
                min: 1,
                max: 100,
                pattern: "[0-9]*",
                inputMode: "numeric",
              }}
            />

          </Box>
          </Box>

          {/* Action Buttons (using modalFooterStyles for consistency) */}
          <Box sx={modalFooterStyles}>
            <CustomButton
              label="Cancel"
              variant="outlined"
              color="primary"
              onClick={handleClose}
              disabled={isSubmitting}
              sx={{
                width: "150px",
                height: "32px",
              }}
            />
            <CustomButton
              label={isSubmitting ? "Updating..." : "Edit Session"}
              type="submit"
              variant="contained"
              color="tertiary" // Using tertiary from conference edit button
              disabled={!(formik.isValid && formik.dirty) || isSubmitting}
              sx={{
                width: "150px",
                height: "32px",
                fontWeight: 600,
                padding: "12px",
                fontSize: "14px"
              }}
            />
          </Box>
      </form>
    </CustomModalLayout>
  );
}