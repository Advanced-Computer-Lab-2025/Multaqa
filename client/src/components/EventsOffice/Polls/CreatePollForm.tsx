"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
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
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { CustomTextField } from "@/components/shared/input-fields";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import CustomCheckbox from "@/components/shared/input-fields/CustomCheckbox";
import { getRegisteredVendors, createPoll, RegisteredVendor } from "@/services/pollService";
import { toast } from "react-toastify";
import theme from "@/themes/lightTheme";
import { Store, Info } from "lucide-react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HowToVoteOutlinedIcon from "@mui/icons-material/HowToVoteOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { CustomModalLayout } from "@/components/shared/modals";

// Style factory functions
const createTertiaryInputStyles = (accentColor: string) => ({
  "& .MuiInputLabel-root": {
    color: theme.palette.grey[500],
    "&.Mui-focused": { color: accentColor },
  },
  "& .MuiInputBase-input": {
    color: "#000000",
    "&::placeholder": {
      color: theme.palette.grey[400],
      opacity: 1,
    },
  },
  "& .MuiInput-underline:before": {
    borderBottomColor: theme.palette.grey[400],
  },
  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
    borderBottomColor: accentColor,
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: accentColor,
  },
});

const createContentPaperStyles = (accentColor: string) => ({
  p: { xs: 1, md: 3 },
  borderRadius: "32px",
  background: theme.palette.background.paper,
  border: `1.5px solid ${accentColor}`,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "auto",
  boxShadow: `0 4px 24px 0 ${accentColor}14`,
  transition: "box-shadow 0.2s",
});

interface CreatePollFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  color?: string;
}

const CreatePollForm: React.FC<CreatePollFormProps> = ({ open, onClose, onSuccess, color }) => {
  // Use the color prop as accent color, fallback to theme if not provided
  const accentColor = color || theme.palette.primary.main;

  // Create styles with the accent color
  const tertiaryInputStyles = createTertiaryInputStyles(accentColor);
  const contentPaperStyles = createContentPaperStyles(accentColor);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [vendors, setVendors] = useState<RegisteredVendor[]>([]);

  // Tab state for sections
  const tabSections = [
    { key: "details", label: "Poll Details", icon: <InfoOutlinedIcon /> },
    { key: "vendors", label: "Select Vendors", icon: <HowToVoteOutlinedIcon /> },
  ];
  const [activeTab, setActiveTab] = useState("details");

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

  const handleClose = () => {
    onClose();
    setActiveTab("details");
  };

  // Logic to find the first error and switch tab
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getFirstErrorTab = (errors: any): "details" | "vendors" | null => {
    const detailsFields = ["title", "description", "startDate", "endDate"];
    
    // Check Poll Details tab
    for (const field of detailsFields) {
      if (errors[field]) {
        return "details";
      }
    }
    
    // Check Vendors tab
    if (errors.vendorIds) {
      return "vendors";
    }

    return null;
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      startDate: null as dayjs.Dayjs | null,
      endDate: null as dayjs.Dayjs | null,
      vendorIds: [] as string[],
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      startDate: Yup.mixed().required("Start date is required").nullable(),
      endDate: Yup.mixed()
        .required("End date is required")
        .nullable()
        .test("is-after-start", "End date must be after start date", function (value) {
          const { startDate } = this.parent;
          if (!startDate || !value) return true;
          return dayjs(value).isAfter(dayjs(startDate));
        }),
      vendorIds: Yup.array()
        .min(2, "Select at least 2 vendors for the poll")
        .required("Vendors are required"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSubmit: async (values, actions: any) => {
      // Manually run validation before proceeding
      const validationErrors = await actions.validateForm();
      
      if (Object.keys(validationErrors).length > 0) {
        const errorTab = getFirstErrorTab(validationErrors);
        
        if (errorTab) {
          setActiveTab(errorTab);
          toast.error("Please fill out all required fields.", {
            position: "bottom-right",
            autoClose: 3000,
            theme: "colored",
          });
        }
        return;
      }

      if (!values.startDate || !values.endDate) return;
      
      setSubmitting(true);
      try {
        await createPoll({
          title: values.title,
          description: values.description,
          startDate: values.startDate.toDate(),
          endDate: values.endDate.toDate(),
          vendorRequestIds: values.vendorIds,
        });
        toast.success("Poll created successfully!", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
        });
        actions.resetForm();
        handleClose();
        if (onSuccess) {
          onSuccess();
        }
      } catch (error: any) {
        console.error("Failed to create poll", error);
        const errorMessage = error.message || "Failed to create poll";
        toast.error(errorMessage, {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
        });
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

  // Check if tabs have errors
  const detailsHasErrors = !!(
    (formik.errors.title && formik.touched.title) ||
    (formik.errors.description && formik.touched.description) ||
    (formik.errors.startDate && formik.touched.startDate) ||
    (formik.errors.endDate && formik.touched.endDate)
  );

  const vendorsHasErrors = !!(formik.errors.vendorIds && formik.touched.vendorIds);

  if (loading) {
    return (
      <CustomModalLayout open={open} borderColor={accentColor} title="Create Poll" onClose={handleClose} width="w-[95vw] xs:w-[80vw] lg:w-[70vw] xl:w-[65vw]">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      </CustomModalLayout>
    );
  }

  return (
    <CustomModalLayout open={open} borderColor={accentColor} title="Create Poll" onClose={handleClose} width="w-[95vw] xs:w-[80vw] lg:w-[70vw] xl:w-[65vw]">
      {/* Outer Box matching CreateBazaar's structure for consistent sizing */}
      <Box sx={{ 
        background: "#fff",
        borderRadius: "32px",
        p: 3,
        height: "480px",
        display: "flex",
        flexDirection: "column"
      }}>
        
        <form onSubmit={formik.handleSubmit} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Box sx={{
            display: "flex",
            flexDirection: "row",
            flex: 1,
            gap: 3,
            minHeight: 0,
          }}>
            {/* Left Sidebar - Tab Navigation */}
            <Box
              sx={{
                width: "250px", 
                flexShrink: 0,
                background: theme.palette.background.paper,
                borderRadius: "32px",
                border: `1.5px solid ${accentColor}`,
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                boxShadow: `0 4px 24px 0 ${accentColor}14`,
                transition: "box-shadow 0.2s",
                height: "fit-content", 
                alignSelf: "flex-start", 
              }}
            >
              <List sx={{ width: "100%", height: "100%" }}>
                {tabSections.map((section) => {
                  const hasError = section.key === "details" ? detailsHasErrors : section.key === "vendors" ? vendorsHasErrors : false;
                  
                  return (
                    <ListItem key={section.key} disablePadding>
                      <ListItemButton
                        selected={activeTab === section.key}
                        onClick={() => setActiveTab(section.key)}
                        sx={{
                          borderRadius: "24px",
                          mb: 1.5,
                          px: 2.5,
                          py: 1.5,
                          fontWeight: 600,
                          fontSize: "1.08rem",
                          background: activeTab === section.key ? "rgba(110, 138, 230, 0.08)" : "transparent",
                          color: activeTab === section.key ? accentColor : theme.palette.text.primary,
                          boxShadow: activeTab === section.key ? "0 2px 8px 0 rgba(110, 138, 230, 0.15)" : "none",
                          transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            background: "rgba(110, 138, 230, 0.05)",
                            color: accentColor,
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36, color: activeTab === section.key ? accentColor : theme.palette.text.primary, "&:hover": { color: accentColor }, }}>{section.icon}</ListItemIcon>
                        <ListItemText primary={section.label} primaryTypographyProps={{ fontWeight: 700, mr: 2 }} />
                        {hasError && (
                          <ErrorOutlineIcon 
                            sx={{ 
                              color: "#db3030", 
                              fontSize: "20px",
                              ml: "auto"
                            }} 
                          />
                        )}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>

            {/* Section Content on the right */}
            <Box sx={{ 
              flex: 1, 
              display: "flex", 
              flexDirection: "column", 
              minHeight: 0, 
              height: "100%", 
            }}>
              {/* Poll Details Tab */}
              {activeTab === "details" && (
                <Paper elevation={0} sx={contentPaperStyles}>
                  <CustomTextField 
                    name="title"
                    id="title"
                    label="Poll Title" 
                    fullWidth 
                    placeholder="e.g., Best Food Vendor 2025" 
                    fieldType="text"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    autoCapitalizeName={false}
                    sx={{ mt: 1, mb: 2 }}
                  />
                  {formik.errors.title && formik.touched.title && (
                    <Typography sx={{ color: "#db3030", fontSize: "0.875rem", mt: -1.5, mb: 1 }}>{formik.errors.title}</Typography>
                  )}

                  <CustomTextField 
                    name="description"
                    id="description"
                    label="Description" 
                    fullWidth 
                    placeholder="What is this poll about?" 
                    fieldType="text"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    autoCapitalizeName={false}
                    multiline
                    rows={3}
                    sx={{ mb: 2 }}
                  />
                  {formik.errors.description && formik.touched.description && (
                    <Typography sx={{ color: "#db3030", fontSize: "0.875rem", mt: -1.5, mb: 1 }}>{formik.errors.description}</Typography>
                  )}
                  
                  {/* Date/Time Pickers section */}
                  <Box sx={{ display: "flex", gap: 2, marginBottom: "12px" }}> 
                    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          name="startDate"
                          label="Start Date and Time"
                          slotProps={{
                            textField: { variant: "standard", fullWidth: true, sx: tertiaryInputStyles },
                          }}
                          value={formik.values.startDate}
                          onChange={(value) => formik.setFieldValue("startDate", value)}
                        />
                      </LocalizationProvider>
                      {formik.errors.startDate && formik.touched.startDate && (
                        <Typography sx={{ color: "#db3030", fontSize: "0.875rem", mt: 0.5 }}>{formik.errors.startDate as string}</Typography>
                      )}
                    </Box>
      
                    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          label="End Date and Time"
                          name="endDate"
                          slotProps={{
                            textField: { variant: "standard", fullWidth: true, sx: tertiaryInputStyles },
                          }}
                          value={formik.values.endDate}
                          onChange={(value) => formik.setFieldValue("endDate", value)}
                        />
                      </LocalizationProvider>
                      {formik.errors.endDate && formik.touched.endDate && (
                        <Typography sx={{ color: "#db3030", fontSize: "0.875rem", mt: 0.5 }}>{formik.errors.endDate as string}</Typography>
                      )}
                    </Box>
                  </Box>
                </Paper>
              )}

              {/* Select Vendors Tab */}
              {activeTab === "vendors" && (
                <Paper elevation={0} sx={contentPaperStyles}>
                  <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Choose at least 2 vendors for the poll.
                    </Typography>
                    <Chip 
                      label={`${formik.values.vendorIds.length} Selected`} 
                      color={formik.values.vendorIds.length >= 2 ? "primary" : "default"}
                      variant={formik.values.vendorIds.length >= 2 ? "filled" : "outlined"}
                      size="small"
                    />
                  </Box>

                  {formik.touched.vendorIds && formik.errors.vendorIds && (
                    <Typography sx={{ color: "#db3030", fontSize: "0.875rem", mb: 2 }}>
                      {formik.errors.vendorIds as string}
                    </Typography>
                  )}

                  <Box
                    sx={{
                      flex: 1,
                      overflowY: "auto",
                      pr: 1,
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
                            <Grid item xs={12} sm={6} key={vendor.vendorId}>
                              <Card
                                variant="outlined"
                                onClick={() => handleVendorToggle(vendor.vendorId)}
                                sx={{
                                  cursor: "pointer",
                                  borderColor: isSelected ? accentColor : "divider",
                                  bgcolor: isSelected ? `${accentColor}10` : "background.paper",
                                  transition: "all 0.2s",
                                  position: "relative",
                                  overflow: "visible",
                                  borderRadius: "16px",
                                  "&:hover": {
                                    borderColor: accentColor,
                                    boxShadow: 1,
                                    transform: "translateY(-2px)",
                                  },
                                }}
                              >
                                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                                  <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <CustomCheckbox
                                      checked={isSelected}
                                      onChange={() => {}}
                                      sx={{ mr: 1.5 }}
                                    />
                                    
                                    {vendor.logo?.url ? (
                                      <Avatar src={vendor.logo.url} sx={{ width: 40, height: 40, mr: 1.5 }} />
                                    ) : (
                                      <Avatar sx={{ width: 40, height: 40, mr: 1.5, bgcolor: accentColor }}>
                                        <Store size={20} />
                                      </Avatar>
                                    )}
                                    
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                      <Typography variant="subtitle2" fontWeight="bold" noWrap>
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
                </Paper>
              )}

              {/* Submit Button */}
              <Box sx={{ mt: 2, textAlign: "right", width: "100%", display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <CustomButton 
                  disabled={submitting || vendors.length < 2} 
                  label={submitting ? "Creating..." : "Create Poll"} 
                  variant="contained" 
                  color="tertiary" 
                  type="submit" 
                  sx={{ 
                    px: 3, 
                    width: "180px", 
                    height: "40px", 
                    fontWeight: 700, 
                    fontSize: "16px", 
                    borderRadius: "20px", 
                    boxShadow: `0 2px 8px 0 ${accentColor}20`,
                    background: accentColor,
                    "&:hover": {
                      background: `${accentColor}E6`,
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
};

export default CreatePollForm;