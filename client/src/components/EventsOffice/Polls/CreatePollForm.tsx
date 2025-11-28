"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Chip,
} from "@mui/material";
import CustomTextField from "@/components/shared/input-fields/CustomTextField";
import DateTimePicker from "@/components/shared/DateTimePicker/DateTimePicker";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import CustomCheckbox from "@/components/shared/input-fields/CustomCheckbox";
import { getRegisteredVendors, createPoll, RegisteredVendor } from "@/services/pollService";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";
import { Store, Info } from "lucide-react";

interface CreatePollFormProps {
  onSuccess?: () => void;
}

const CreatePollForm: React.FC<CreatePollFormProps> = ({ onSuccess }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [vendors, setVendors] = useState<RegisteredVendor[]>([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const registeredVendors = await getRegisteredVendors();
        setVendors(registeredVendors);
      } catch (error) {
        console.error("Failed to fetch registered vendors", error);
        toast.error("Failed to fetch registered vendors");
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      startDate: null as Date | null,
      endDate: null as Date | null,
      vendorIds: [] as string[],
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      startDate: Yup.date().required("Start date is required").nullable(),
      endDate: Yup.date()
        .required("End date is required")
        .nullable()
        .min(Yup.ref("startDate"), "End date must be after start date"),
      vendorIds: Yup.array()
        .min(2, "Select at least 2 vendors for the poll")
        .required("Vendors are required"),
    }),
    onSubmit: async (values) => {
      if (!values.startDate || !values.endDate) return;
      
      setSubmitting(true);
      try {
        await createPoll({
          title: values.title,
          description: values.description,
          startDate: values.startDate,
          endDate: values.endDate,
          vendorRequestIds: values.vendorIds, // Now using vendor IDs directly
        });
        toast.success("Poll created successfully!");
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload();
        }
      } catch (error: any) {
        console.error("Failed to create poll", error);
        const errorMessage = error.message || "Failed to create poll";
        toast.error(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleVendorToggle = (id: string) => {
    const currentIds = formik.values.vendorIds;
    const newIds = currentIds.includes(id)
      ? currentIds.filter((vendorId) => vendorId !== id)
      : [...currentIds, id];
    formik.setFieldValue("vendorIds", newIds);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          background: "#fff",
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={6}>
            {/* Left Column: Poll Details */}
            <Grid item xs={12} md={5}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight="700" gutterBottom>
                  Poll Details
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Define the poll information and duration.
                </Typography>
              </Box>
              
              <Stack spacing={3}>
                <CustomTextField
                  name="title"
                  label="Poll Title"
                  placeholder="e.g., Best Food Vendor 2025"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  fullWidth
                  fieldType="text"
                />

                <CustomTextField
                  name="description"
                  label="Description"
                  placeholder="What is this poll about?"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  fullWidth
                  multiline
                  rows={4}
                  fieldType="text"
                />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Box sx={{ flex: 1 }}>
                    <DateTimePicker
                      id="startDate"
                      name="startDate"
                      label="Start Date"
                      value={formik.values.startDate}
                      onChange={(date) => formik.setFieldValue("startDate", date)}
                      onBlur={() => formik.setFieldTouched("startDate", true)}
                      error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                      errorMessage={formik.errors.startDate as string}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <DateTimePicker
                      id="endDate"
                      name="endDate"
                      label="End Date"
                      value={formik.values.endDate}
                      onChange={(date) => formik.setFieldValue("endDate", date)}
                      onBlur={() => formik.setFieldTouched("endDate", true)}
                      error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                      errorMessage={formik.errors.endDate as string}
                      minDate={formik.values.startDate || undefined}
                    />
                  </Box>
                </Stack>
              </Stack>
            </Grid>

            {/* Right Column: Vendor Selection */}
            <Grid item xs={12} md={7}>
              <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <Box>
                  <Typography variant="h5" fontWeight="700" gutterBottom>
                    Select Vendors
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose at least 2 vendors for the poll.
                  </Typography>
                </Box>
                <Chip 
                  label={`${formik.values.vendorIds.length} Selected`} 
                  color={formik.values.vendorIds.length >= 2 ? "primary" : "default"}
                  variant={formik.values.vendorIds.length >= 2 ? "filled" : "outlined"}
                />
              </Box>

              {formik.touched.vendorIds && formik.errors.vendorIds && (
                <Typography color="error" variant="caption" sx={{ display: "block", mb: 2 }}>
                  {formik.errors.vendorIds as string}
                </Typography>
              )}

              <Box
                sx={{
                  maxHeight: "600px",
                  overflowY: "auto",
                  pr: 1,
                  // Custom scrollbar styling
                  "&::-webkit-scrollbar": { width: "6px" },
                  "&::-webkit-scrollbar-track": { background: "#f1f1f1" },
                  "&::-webkit-scrollbar-thumb": { background: "#888", borderRadius: "3px" },
                  "&::-webkit-scrollbar-thumb:hover": { background: "#555" },
                }}
              >
                {vendors.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 8, bgcolor: "grey.50", borderRadius: 2 }}>
                    <Info size={48} color="#9e9e9e" style={{ marginBottom: 16 }} />
                    <Typography color="textSecondary">No registered vendors found.</Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {vendors.map((vendor) => {
                      const isSelected = formik.values.vendorIds.includes(vendor.vendorId);
                      return (
                        <Grid item xs={12} key={vendor.vendorId}>
                          <Card
                            variant="outlined"
                            onClick={() => handleVendorToggle(vendor.vendorId)}
                            sx={{
                              cursor: "pointer",
                              borderColor: isSelected ? "primary.main" : "divider",
                              bgcolor: isSelected ? "primary.lighter" : "background.paper",
                              transition: "all 0.2s",
                              position: "relative",
                              overflow: "visible",
                              "&:hover": {
                                borderColor: "primary.main",
                                boxShadow: 1,
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <CustomCheckbox
                                  checked={isSelected}
                                  onChange={() => {}} // Handled by Card onClick
                                  sx={{ mr: 2 }}
                                />
                                
                                {vendor.logo?.url ? (
                                  <Avatar src={vendor.logo.url} sx={{ width: 48, height: 48, mr: 2 }} />
                                ) : (
                                  <Avatar sx={{ width: 48, height: 48, mr: 2, bgcolor: "secondary.main" }}>
                                    <Store size={24} />
                                  </Avatar>
                                )}
                                
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="subtitle1" fontWeight="bold">
                                    {vendor.companyName}
                                  </Typography>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 6, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            {onSuccess && (
              <CustomButton
                onClick={onSuccess}
                variant="outlined"
                label="Cancel"
                disabled={submitting}
              />
            )}
            <CustomButton
              type="submit"
              variant="contained"
              width="200px"
              disabled={submitting || vendors.length < 2}
              label={submitting ? "Creating..." : "Create Poll"}
            />
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CreatePollForm;