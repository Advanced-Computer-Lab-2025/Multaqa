"use client";

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomButton from "../shared/Buttons/CustomButton";
import { CustomTextField, CustomSelectField } from "../shared/input-fields";
import { CustomModalLayout } from "../shared/modals";
import { GymSessionType, SESSION_LABEL } from "./types";

interface CreateGymSessionProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (sessionData: any) => void;
  preselectedType?: GymSessionType;
}

const validationSchema = Yup.object({
  date: Yup.date()
    .required("Date is required")
    .min(new Date(), "Date cannot be in the past"),
  startTime: Yup.string().required("Start time is required"),
  duration: Yup.number()
    .required("Duration is required")
    .min(15, "Minimum duration is 15 minutes")
    .max(180, "Maximum duration is 3 hours"),
  type: Yup.string().required("Session type is required"),
  maxParticipants: Yup.number()
    .required("Max participants is required")
    .min(1, "Must have at least 1 participant")
    .max(100, "Cannot exceed 100 participants"),
});

const sessionTypeOptions = Object.entries(SESSION_LABEL).map(
  ([key, label]) => ({
    label,
    value: key,
  })
);

const durationOptions = [
  { label: "15 minutes", value: 15 },
  { label: "30 minutes", value: 30 },
  { label: "45 minutes", value: 45 },
  { label: "1 hour", value: 60 },
  { label: "1.5 hours", value: 90 },
  { label: "2 hours", value: 120 },
];

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
      date: "",
      startTime: "",
      duration: "",
      type: preselectedType || "",
      maxParticipants: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        // Calculate end time based on start time and duration
        const startDateTime = new Date(
          `${values.date}T${values.startTime}:00.000Z`
        );
        const endDateTime = new Date(
          startDateTime.getTime() + parseInt(values.duration) * 60000
        );

        const sessionData = {
          title: `${SESSION_LABEL[values.type as GymSessionType]} Session`,
          type: values.type,
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString(),
          spotsTotal: parseInt(values.maxParticipants),
          spotsTaken: 0,
        };

        if (onSubmit) {
          await onSubmit(sessionData);
        }

        // TODO: Make API call to create session
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
            />

            {/* Date and Time Row */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <CustomTextField
                  label="Date"
                  fieldType="date"
                  name="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date ? formik.errors.date : ""}
                  neumorphicBox
                  required
                  fullWidth
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <CustomTextField
                  label="Start Time"
                  fieldType="time"
                  name="startTime"
                  value={formik.values.startTime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.startTime && Boolean(formik.errors.startTime)
                  }
                  helperText={
                    formik.touched.startTime ? formik.errors.startTime : ""
                  }
                  neumorphicBox
                  required
                  fullWidth
                />
              </Box>
            </Box>

            {/* Duration */}
            <CustomSelectField
              label="Duration"
              fieldType="single"
              options={durationOptions}
              value={formik.values.duration}
              onChange={(value) => formik.setFieldValue("duration", value)}
              onBlur={() => formik.setFieldTouched("duration", true)}
              isError={
                formik.touched.duration
                  ? Boolean(formik.errors.duration)
                  : false
              }
              helperText={formik.touched.duration ? formik.errors.duration : ""}
              placeholder="Select duration"
              neumorphicBox
              required
              fullWidth
            />

            {/* Max Participants */}
            <CustomTextField
              label="Max Participants"
              fieldType="number"
              placeholder="Maximum number of participants"
              name="maxParticipants"
              value={formik.values.maxParticipants}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
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
              inputProps={{ min: 1, max: 100 }}
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
                borderRadius: "12px",
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
                borderRadius: "12px",
                fontWeight: 700,
              }}
            />
          </Box>
        </Box>
      </form>
    </CustomModalLayout>
  );
}
