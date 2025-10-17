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
}

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Session title is required")
    .min(3, "Title must be at least 3 characters"),
  type: Yup.string().required("Session type is required"),
  instructor: Yup.string().required("Instructor name is required"),
  location: Yup.string().required("Location is required"),
  date: Yup.date()
    .required("Date is required")
    .min(new Date(), "Date cannot be in the past"),
  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string()
    .required("End time is required")
    .test(
      "is-after-start",
      "End time must be after start time",
      function (value) {
        const { startTime } = this.parent;
        if (!startTime || !value) return true;
        return (
          new Date(`2000-01-01 ${value}`) > new Date(`2000-01-01 ${startTime}`)
        );
      }
    ),
  spotsTotal: Yup.number()
    .required("Total spots is required")
    .min(1, "Must have at least 1 spot")
    .max(100, "Cannot exceed 100 spots"),
});

const sessionTypeOptions = Object.entries(SESSION_LABEL).map(
  ([key, label]) => ({
    label,
    value: key,
  })
);

const locationOptions = [
  { label: "Studio A", value: "Studio A" },
  { label: "Studio B", value: "Studio B" },
  { label: "Main Hall", value: "Main Hall" },
  { label: "Outdoor Court", value: "Outdoor Court" },
];

export default function CreateGymSession({
  open,
  onClose,
  onSubmit,
}: CreateGymSessionProps) {
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      type: "",
      instructor: "",
      location: "",
      date: "",
      startTime: "",
      endTime: "",
      spotsTotal: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        // Combine date and time for start/end ISO strings
        const startDateTime = new Date(
          `${values.date}T${values.startTime}:00.000Z`
        );
        const endDateTime = new Date(
          `${values.date}T${values.endTime}:00.000Z`
        );

        const sessionData = {
          title: values.title,
          type: values.type,
          instructor: values.instructor,
          location: values.location,
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString(),
          spotsTotal: parseInt(values.spotsTotal),
          spotsTaken: 0,
          description: values.description,
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
            {/* Session Title */}
            <CustomTextField
              label="Session Title"
              fieldType="text"
              placeholder="e.g., Morning Flow, High Energy"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title ? formik.errors.title : ""}
              neumorphicBox
              required
              fullWidth
            />

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

            {/* Instructor */}
            <CustomTextField
              label="Instructor"
              fieldType="text"
              placeholder="Instructor's full name"
              name="instructor"
              value={formik.values.instructor}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.instructor && Boolean(formik.errors.instructor)
              }
              helperText={
                formik.touched.instructor ? formik.errors.instructor : ""
              }
              neumorphicBox
              required
              fullWidth
            />

            {/* Location */}
            <CustomSelectField
              label="Location"
              fieldType="single"
              options={locationOptions}
              value={formik.values.location}
              onChange={(value) => formik.setFieldValue("location", value)}
              onBlur={() => formik.setFieldTouched("location", true)}
              isError={
                formik.touched.location
                  ? Boolean(formik.errors.location)
                  : false
              }
              helperText={formik.touched.location ? formik.errors.location : ""}
              placeholder="Select location"
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
              <Box sx={{ flex: 1 }}>
                <CustomTextField
                  label="End Time"
                  fieldType="time"
                  name="endTime"
                  value={formik.values.endTime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.endTime && Boolean(formik.errors.endTime)
                  }
                  helperText={
                    formik.touched.endTime ? formik.errors.endTime : ""
                  }
                  neumorphicBox
                  required
                  fullWidth
                />
              </Box>
            </Box>

            {/* Total Spots */}
            <CustomTextField
              label="Total Spots Available"
              fieldType="number"
              placeholder="Maximum number of participants"
              name="spotsTotal"
              value={formik.values.spotsTotal}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.spotsTotal && Boolean(formik.errors.spotsTotal)
              }
              helperText={
                formik.touched.spotsTotal ? formik.errors.spotsTotal : ""
              }
              neumorphicBox
              required
              fullWidth
              inputProps={{ min: 1, max: 100 }}
            />

            {/* Description */}
            <CustomTextField
              label="Description (Optional)"
              fieldType="textarea"
              placeholder="Brief description of the session..."
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description ? formik.errors.description : ""
              }
              neumorphicBox
              fullWidth
              multiline
              rows={3}
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
