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
  Card,
  CardContent,
  Avatar,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Radio,
} from "@mui/material";
import { CustomTextField } from "@/components/shared/input-fields";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import { getOverlappingVendors, createPoll, getAllPolls, VendorClashGroup } from "@/services/pollService";
import { toast } from "react-toastify";
import theme from "@/themes/lightTheme";
import { Store, Info, MapPin } from "lucide-react";
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
}

const CreatePollForm: React.FC<CreatePollFormProps> = ({ open, onClose, onSuccess }) => {
  // Use primary color consistently as accent
  const accentColor = theme.palette.primary.main;

  // Create styles with the accent color
  const tertiaryInputStyles = createTertiaryInputStyles(accentColor);
  const contentPaperStyles = createContentPaperStyles(accentColor);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [clashGroups, setClashGroups] = useState<VendorClashGroup[]>([]);

  // Tab state for sections
  const tabSections = [
    { key: "details", label: "Poll Details", icon: <InfoOutlinedIcon /> },
    { key: "vendors", label: "Select Vendors", icon: <HowToVoteOutlinedIcon /> },
  ];
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both clash groups and active polls in parallel
        const [overlappingGroups, allPolls] = await Promise.all([
          getOverlappingVendors().catch(() => []),
          getAllPolls().catch(() => []),
        ]);
        
        setClashGroups(overlappingGroups);
      } catch (error: any) {
        console.error("Failed to fetch data", error);
        if (!error.message?.includes("No conflicting")) {
          toast.error("Failed to fetch vendors with overlapping booth requests");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClose = () => {
    onClose();
    setActiveTab("details");
  };

  // Logic to find the first error and switch tab
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getFirstErrorTab = (errors: any): "details" | "vendors" | null => {
    const detailsFields = ["title", "notes", "endDate"];
    
    // Check Poll Details tab
    for (const field of detailsFields) {
      if (errors[field]) {
        return "details";
      }
    }
    
    // Check Vendors tab
    if (errors.selectedClashLocation) {
      return "vendors";
    }

    return null;
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      notes: "",
      endDate: null as dayjs.Dayjs | null,
      selectedClashLocation: "" as string,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      notes: Yup.string(),
      endDate: Yup.mixed()
        .required("End date is required")
        .nullable()
        .test("is-in-future", "End date must be in the future", function (value) {
          if (!value) return true;
          return dayjs(value).isAfter(dayjs());
        }),
      selectedClashLocation: Yup.string().required("Please select a booth location clash"),
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

      if (!values.endDate) return;
      
      // Get vendor data from the selected clash group
      const selectedClash = clashGroups.find(g => g.location === values.selectedClashLocation);
      if (!selectedClash) {
        toast.error("Please select a valid booth location clash.");
        return;
      }
      const vendorData = selectedClash.vendors.map(v => ({
        vendorId: v.vendorId,
        boothId: v.eventId
      }));
      
      setSubmitting(true);
      try {
        await createPoll({
          title: values.title,
          description: values.notes || "",
          endDate: values.endDate.toDate(),
          vendorData: vendorData,
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

  const handleClashSelect = (location: string) => {
    // Toggle selection - if same location is clicked, deselect; otherwise select new one
    const newValue = formik.values.selectedClashLocation === location ? "" : location;
    formik.setFieldValue("selectedClashLocation", newValue);
  };

  // Check if tabs have errors
  const detailsHasErrors = !!(
    (formik.errors.title && formik.touched.title) ||
    (formik.errors.notes && formik.touched.notes) ||
    (formik.errors.endDate && formik.touched.endDate)
  );

  const vendorsHasErrors = !!(formik.errors.selectedClashLocation && formik.touched.selectedClashLocation);

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
                <Paper elevation={0} sx={{ ...contentPaperStyles, justifyContent: "space-between" }}>
                  <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
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
                    />
                    {formik.errors.title && formik.touched.title && (
                      <Typography sx={{ color: "#db3030", fontSize: "0.875rem", mt: 0.5 }}>{formik.errors.title}</Typography>
                    )}
                  </Box>

                  <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <CustomTextField 
                      name="notes"
                      id="notes"
                      label="Notes" 
                      fullWidth 
                      placeholder="Add any additional notes (optional)" 
                      fieldType="text"
                      value={formik.values.notes}
                      onChange={formik.handleChange}
                      autoCapitalizeName={false}
                      multiline
                      minRows={1}
                      maxRows={6}
                      sx={{ 
                        '& .MuiInputBase-root': {
                          overflow: 'hidden',
                        },
                        '& textarea': {
                          resize: 'none',
                          overflow: 'hidden !important',
                        }
                      }}
                    />
                    {formik.errors.notes && formik.touched.notes && (
                      <Typography sx={{ color: "#db3030", fontSize: "0.875rem", mt: 0.5 }}>{formik.errors.notes}</Typography>
                    )}
                  </Box>
                  
                  {/* End Date/Time Picker */}
                  <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
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
                </Paper>
              )}

              {/* Select Vendors Tab */}
              {activeTab === "vendors" && (
                <Paper elevation={0} sx={contentPaperStyles}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Select a booth location clash. All vendors competing for the same location will be included in the poll.
                    </Typography>
                  </Box>

                  {formik.touched.selectedClashLocation && formik.errors.selectedClashLocation && (
                    <Typography sx={{ color: "#db3030", fontSize: "0.875rem", mb: 2 }}>
                      {formik.errors.selectedClashLocation as string}
                    </Typography>
                  )}

                  <Box
                    sx={{
                      flex: 1,
                      maxHeight: "400px",
                      overflowY: "auto",
                      pr: 1,
                      "&::-webkit-scrollbar": { width: "6px" },
                      "&::-webkit-scrollbar-track": { background: "#f1f1f1" },
                      "&::-webkit-scrollbar-thumb": { background: "#888", borderRadius: "3px" },
                      "&::-webkit-scrollbar-thumb:hover": { background: "#555" },
                    }}
                  >
                    {clashGroups.length === 0 ? (
                      <Box sx={{ textAlign: "center", py: 8, bgcolor: "grey.50", borderRadius: 2 }}>
                        <Info size={48} color="#9e9e9e" style={{ marginBottom: 16 }} />
                        <Typography color="textSecondary">No booth location clashes found.</Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: "block" }}>
                          Clashes with active polls are not shown.
                        </Typography>
                      </Box>
                    ) : (
                      <Stack spacing={2}>
                        {clashGroups.map((clashGroup) => {
                          const isSelected = formik.values.selectedClashLocation === clashGroup.location;
                          return (
                            <Card
                              key={clashGroup.location}
                              variant="outlined"
                              onClick={() => handleClashSelect(clashGroup.location)}
                              sx={{
                                cursor: "pointer",
                                borderColor: isSelected ? theme.palette.primary.main : "divider",
                                bgcolor: isSelected ? `${theme.palette.primary.light}30` : "background.paper",
                                transition: "all 0.2s",
                                borderRadius: "16px",
                                borderWidth: isSelected ? "2px" : "1px",
                                "&:hover": {
                                  borderColor: theme.palette.primary.main,
                                  boxShadow: 1,
                                },
                              }}
                            >
                              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                                  <Radio
                                    checked={isSelected}
                                    onChange={() => {}}
                                    sx={{ 
                                      mr: 1.5, 
                                      mt: -0.5,
                                      color: theme.palette.primary.main,
                                      "&.Mui-checked": { color: theme.palette.primary.main },
                                    }}
                                  />
                                  
                                  <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                      <MapPin size={16} color={theme.palette.primary.main} style={{ marginRight: 6 }} />
                                      <Typography variant="subtitle1" fontWeight="bold">
                                        {clashGroup.location}
                                      </Typography>
                                      <Typography 
                                        variant="caption" 
                                        sx={{ 
                                          ml: 1.5, 
                                          px: 1, 
                                          py: 0.25, 
                                          bgcolor: `${theme.palette.primary.light}50`, 
                                          borderRadius: "8px",
                                          color: theme.palette.primary.dark,
                                          fontWeight: 600,
                                        }}
                                      >
                                        {clashGroup.vendorCount} vendors
                                      </Typography>
                                    </Box>
                                    
                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                      {clashGroup.vendors.map((vendor) => (
                                        <Box 
                                          key={vendor.vendorId}
                                          sx={{ 
                                            display: "flex", 
                                            alignItems: "center", 
                                            bgcolor: `${theme.palette.primary.light}30`, 
                                            borderRadius: "12px",
                                            px: 1.5,
                                            py: 0.5,
                                            mb: 0.5,
                                          }}
                                        >
                                          {vendor.logo?.url ? (
                                            <Avatar src={vendor.logo.url} sx={{ width: 24, height: 24, mr: 1 }} />
                                          ) : (
                                            <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: theme.palette.primary.main, fontSize: 12 }}>
                                              <Store size={14} />
                                            </Avatar>
                                          )}
                                          <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                                            {vendor.companyName}
                                          </Typography>
                                        </Box>
                                      ))}
                                    </Stack>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </Stack>
                    )}
                  </Box>
                </Paper>
              )}

              {/* Submit Button */}
              <Box sx={{ mt: 2, mb: 2, textAlign: "right", width: "100%", display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <CustomButton 
                  disabled={submitting || clashGroups.length === 0} 
                  label={submitting ? "Creating..." : "Create Poll"} 
                  variant="contained" 
                  color="primary" 
                  type="submit" 
                  sx={{ 
                    px: 3, 
                    width: "180px", 
                    height: "40px", 
                    fontWeight: 700, 
                    fontSize: "16px", 
                    borderRadius: "20px", 
                    boxShadow: `0 2px 8px 0 ${theme.palette.primary.main}30`,
                    background: theme.palette.primary.main,
                    "&:hover": {
                      background: theme.palette.primary.dark,
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