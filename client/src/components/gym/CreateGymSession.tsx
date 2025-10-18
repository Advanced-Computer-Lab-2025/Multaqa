"use client";

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomButton from "../shared/Buttons/CustomButton";
import { CustomTextField, CustomSelectField } from "../shared/input-fields";
import { CustomModalLayout } from "../shared/modals";
import { DateTimePicker } from "../shared/DateTimePicker";
import { formatDuration } from "../shared/DateTimePicker/utils";
import { GymSession, GymSessionType, SESSION_LABEL } from "./types";

interface CreateGymSessionProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (sessionData: Partial<GymSession>) => void;
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
    .min(15, "Minimum duration is 15 minutes")
    .max(360, "Maximum duration is 6 hours"),
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

  const formik = useFormik({
    initialValues: {
      startDateTime: null as Date | null,
      duration: "",
      type: preselectedType || "",
      maxParticipants: "",
    },
    validationSchema: gymSessionValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const startDateTime = values.startDateTime!;
        const endDateTime = new Date(
          startDateTime.getTime() + parseInt(values.duration) * 60000
        );

        const sessionData = {
          title: `${SESSION_LABEL[values.type as GymSessionType]} Session`,
          type: values.type as GymSessionType,
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString(),
          spotsTotal: parseInt(values.maxParticipants),
          spotsTaken: 0,
        };

        if (onSubmit) {
          await onSubmit(sessionData);
        }

        console.log("Creating session:", sessionData);

        formik.resetForm();
        onClose();
      } catch (error) {
        console.error("Error creating session:", error);
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
              color: theme.palette.primary.main,
              textAlign: "center",
              mb: 3,
            }}
          >
            Create New Gym Session
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Session Type */}
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
              helperText={formik.touched.type ? formik.errors.type : ""}
              placeholder="Select session type"
              neumorphicBox
              required
              fullWidth
              size="small"
            />

            {/* Start Date and Time */}
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
            />

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
                  : "Enter duration in minutes"
              }
              placeholder="Enter duration in minutes"
              neumorphicBox
              required
              fullWidth
              inputProps={{
                min: 15,
                max: 360,
                pattern: "[0-9]*",
                inputMode: "numeric",
              }}
            />

            {/* Max Participants */}
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
                  : ""
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

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mt: 4,
            }}
          >
            <CustomButton
              label="Cancel"
              variant="outlined"
              color="primary"
              onClick={handleClose}
              disabled={isSubmitting}
              sx={{
                width: "160px",
                height: "44px",
              }}
            />
            <CustomButton
              label={isSubmitting ? "Creating..." : "Create Session"}
              type="submit"
              variant="contained"
              color="primary"
              disabled={!(formik.isValid && formik.dirty) || isSubmitting}
              sx={{
                width: "160px",
                height: "44px",
                fontWeight: 700,
              }}
            />
          </Box>
        </Box>
      </form>
    </CustomModalLayout>
  );
}
