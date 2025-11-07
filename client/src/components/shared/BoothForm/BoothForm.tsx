import React, { useState } from "react";
import { Formik } from "formik";
import { CustomTextField } from "../input-fields";
import CustomButton from "../Buttons/CustomButton";
import PlatformMap from "../PlatformMap/PlatformMap";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import { useTheme } from "@mui/material/styles";
import { BoothFormValues } from "./types";
import { validationSchema } from "./utils";
import CustomSelectField from "../input-fields/CustomSelectField";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { submitBoothForm } from "./utils";
import { useAuth } from "../../../context/AuthContext";

const BoothForm: React.FC = () => {
  const theme = useTheme();
  const [selectedBooth, setSelectedBooth] = useState<number | null>(null);
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(
    "attendees"
  );
  const { user } = useAuth();

  const handleBoothSelection = (
    boothId: number,
    setFieldValue: (field: string, value: unknown) => void
  ) => {
    setSelectedBooth(boothId);
    setFieldValue("boothLocation", `Booth ${boothId}`);
  };

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedAccordion(isExpanded ? panel : false);
    };

  const initialValues: BoothFormValues = {
    boothAttendees: [{ name: "", email: "" }],
    boothSize: "",
    boothSetupDuration: null,
    boothLocation: "",
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Box
        sx={{
          maxWidth: "1400px",
          margin: "0 auto",
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="600"
            gutterBottom
            sx={{
              fontSize: { xs: "1.75rem", md: "2.125rem" },
              color: theme.palette.primary.main,
              mb: 1,
            }}
          >
            Booth Application
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            Reserve your perfect spot and showcase your brand
          </Typography>
        </Box>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            const vendorId = String(user?._id);
            submitBoothForm(values, { setSubmitting, resetForm }, vendorId);
          }}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                  gap: 4,
                }}
              >
                {/* Left Side: Form Fields */}
                <Box>
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 2, md: 3 },
                      borderRadius: 4,
                      background: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      height: "100%",
                    }}
                  >
                    {/* Attendee Information Accordion */}
                    <Accordion
                      expanded={expandedAccordion === "attendees"}
                      onChange={handleAccordionChange("attendees")}
                      sx={{
                        mb: 3,
                        borderRadius: "12px !important",
                        border: `1px solid ${theme.palette.divider}`,
                        "&:before": { display: "none" },
                        boxShadow: "none",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          backgroundColor: theme.palette.background.default,
                          borderRadius: "12px",
                          minHeight: "68px",
                          "&.Mui-expanded": {
                            minHeight: "68px",
                            borderBottom: `1px solid ${theme.palette.divider}`,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <PeopleIcon
                            sx={{
                              color: theme.palette.primary.main,
                              mr: 2,
                              fontSize: 28,
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight="600">
                              Attendee Information
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mt: 0.5,
                              }}
                            >
                              <Chip
                                label={`${formik.values.boothAttendees.length} attendee(s)`}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                              {formik.values.boothAttendees.some(
                                (attendee) => attendee.name && attendee.email
                              ) && (
                                <Chip
                                  label="Complete"
                                  size="small"
                                  color="success"
                                  variant="filled"
                                />
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 0 }}>
                        <CardContent sx={{ p: 3 }}>
                          {/* Quick Stats */}
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 3,
                              p: 2,
                              backgroundColor: theme.palette.background.default,
                              borderRadius: 2,
                              border: `1px solid ${theme.palette.divider}`,
                            }}
                          >
                            <Box>
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                Attendees Added
                              </Typography>
                              <Typography variant="h6" color="primary.main">
                                {formik.values.boothAttendees.length}/5
                              </Typography>
                            </Box>
                            <Tooltip
                              title={
                                formik.values.boothAttendees.length >= 5
                                  ? "Maximum 5 attendees allowed"
                                  : "Add another attendee"
                              }
                            >
                              <span>
                                <IconButton
                                  onClick={() => {
                                    if (
                                      formik.values.boothAttendees.length >= 5
                                    )
                                      return;
                                    formik.setFieldValue("boothAttendees", [
                                      ...formik.values.boothAttendees,
                                      { name: "", email: "" },
                                    ]);
                                  }}
                                  disabled={
                                    formik.values.boothAttendees.length >= 5
                                  }
                                  sx={{
                                    backgroundColor: theme.palette.primary.main,
                                    color: "white",
                                    "&:hover": {
                                      backgroundColor:
                                        theme.palette.primary.dark,
                                    },
                                    "&.Mui-disabled": {
                                      backgroundColor:
                                        theme.palette.action.disabled,
                                    },
                                  }}
                                >
                                  <AddIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Box>

                          {/* Attendee Cards */}
                          {formik.values.boothAttendees.map(
                            (attendee, index) => (
                              <Card
                                key={index}
                                sx={{
                                  mb: 2,
                                  borderRadius: 2,
                                  border: `1px solid ${theme.palette.divider}`,
                                  backgroundColor:
                                    theme.palette.background.paper,
                                  transition: "all 0.2s ease-in-out",
                                  "&:hover": {
                                    borderColor: theme.palette.primary.main,
                                    boxShadow: 1,
                                  },
                                }}
                              >
                                <CardContent sx={{ p: 2 }}>
                                  {/* Attendee Header */}
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      mb: 2,
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Avatar
                                        sx={{
                                          width: 32,
                                          height: 32,
                                          mr: 2,
                                          backgroundColor:
                                            theme.palette.primary.main,
                                          fontSize: "0.875rem",
                                        }}
                                      >
                                        {index + 1}
                                      </Avatar>
                                      <Box>
                                        <Typography
                                          variant="subtitle1"
                                          fontWeight="600"
                                        >
                                          {attendee.name ||
                                            `Attendee ${index + 1}`}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                        >
                                          {attendee.email ||
                                            "No email provided"}
                                        </Typography>
                                      </Box>
                                    </Box>

                                    {index > 0 && (
                                      <Tooltip title="Remove attendee">
                                        <IconButton
                                          size="small"
                                          onClick={() => {
                                            const newAttendees =
                                              formik.values.boothAttendees.filter(
                                                (_, i) => i !== index
                                              );
                                            formik.setFieldValue(
                                              "boothAttendees",
                                              newAttendees
                                            );
                                          }}
                                          sx={{
                                            color: theme.palette.error.main,
                                            "&:hover": {
                                              backgroundColor:
                                                theme.palette.error.light +
                                                "20",
                                            },
                                          }}
                                        >
                                          <DeleteIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                  </Box>

                                  {/* Form Fields */}
                                  <Box
                                    sx={{
                                      display: "grid",
                                      gridTemplateColumns: "1fr 1fr",
                                      gap: 2,
                                    }}
                                  >
                                    <Box>
                                      <CustomTextField
                                        name={`boothAttendees.${index}.name`}
                                        id={`boothAttendees.${index}.name`}
                                        label="Full Name"
                                        fieldType="text"
                                        width="100%"
                                        value={attendee.name}
                                        onChange={(e) => {
                                          formik.setFieldValue(
                                            `boothAttendees.${index}.name`,
                                            e.target.value
                                          );
                                        }}
                                        onBlur={() =>
                                          formik.setFieldTouched(
                                            `boothAttendees.${index}.name`,
                                            true
                                          )
                                        }
                                      />
                                      {formik.touched.boothAttendees?.[index]
                                        ?.name &&
                                        typeof formik.errors.boothAttendees?.[
                                          index
                                        ] !== "string" &&
                                        formik.errors.boothAttendees?.[index]
                                          ?.name && (
                                          <Box
                                            display="flex"
                                            alignItems="center"
                                            mt={1}
                                          >
                                            <ErrorOutlineIcon
                                              color="error"
                                              sx={{ fontSize: 16, mr: 0.5 }}
                                            />
                                            <Typography
                                              variant="caption"
                                              color="error"
                                            >
                                              {typeof formik.errors
                                                .boothAttendees?.[index] !==
                                              "string"
                                                ? formik.errors
                                                    .boothAttendees?.[index]
                                                    ?.name
                                                : formik.errors
                                                    .boothAttendees?.[index]}
                                            </Typography>
                                          </Box>
                                        )}
                                    </Box>
                                    <Box>
                                      <CustomTextField
                                        name={`boothAttendees.${index}.email`}
                                        id={`boothAttendees.${index}.email`}
                                        label="Email Address"
                                        fieldType="email"
                                        width="100%"
                                        stakeholderType="vendor"
                                        onChange={(e) => {
                                          formik.setFieldValue(
                                            `boothAttendees.${index}.email`,
                                            e.target.value
                                          );
                                        }}
                                        onBlur={() =>
                                          formik.setFieldTouched(
                                            `boothAttendees.${index}.email`,
                                            true
                                          )
                                        }
                                      />
                                      {formik.touched.boothAttendees?.[index]
                                        ?.email &&
                                        typeof formik.errors.boothAttendees?.[
                                          index
                                        ] !== "string" &&
                                        formik.errors.boothAttendees?.[index]
                                          ?.email && (
                                          <Box
                                            display="flex"
                                            alignItems="center"
                                            mt={1}
                                          >
                                            <ErrorOutlineIcon
                                              color="error"
                                              sx={{ fontSize: 16, mr: 0.5 }}
                                            />
                                            <Typography
                                              variant="caption"
                                              color="error"
                                            >
                                              {typeof formik.errors
                                                .boothAttendees?.[index] !==
                                              "string"
                                                ? formik.errors
                                                    .boothAttendees?.[index]
                                                    ?.email
                                                : formik.errors
                                                    .boothAttendees?.[index]}
                                            </Typography>
                                          </Box>
                                        )}
                                    </Box>
                                  </Box>
                                </CardContent>
                              </Card>
                            )
                          )}

                          {/* Empty State */}
                          {formik.values.boothAttendees.length === 0 && (
                            <Box
                              sx={{
                                textAlign: "center",
                                p: 4,
                                border: `2px dashed ${theme.palette.divider}`,
                                borderRadius: 2,
                              }}
                            >
                              <PersonIcon
                                sx={{
                                  fontSize: 48,
                                  color: theme.palette.text.secondary,
                                  mb: 2,
                                }}
                              />
                              <Typography
                                variant="h6"
                                color="text.secondary"
                                gutterBottom
                              >
                                No Attendees Added
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 2 }}
                              >
                                Add at least one attendee to manage your booth
                              </Typography>
                              <CustomButton
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={() => {
                                  formik.setFieldValue("boothAttendees", [
                                    { name: "", email: "" },
                                  ]);
                                }}
                              >
                                Add First Attendee
                              </CustomButton>
                            </Box>
                          )}
                        </CardContent>
                      </AccordionDetails>
                    </Accordion>

                    {/* Booth Configuration Accordion */}
                    <Accordion
                      expanded={expandedAccordion === "configuration"}
                      onChange={handleAccordionChange("configuration")}
                      sx={{
                        mb: 3,
                        borderRadius: "12px !important",
                        border: `1px solid ${theme.palette.divider}`,
                        "&:before": { display: "none" },
                        boxShadow: "none",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          backgroundColor: theme.palette.background.default,
                          borderRadius: "12px",
                          minHeight: "68px",
                          "&.Mui-expanded": {
                            minHeight: "68px",
                            borderBottom: `1px solid ${theme.palette.divider}`,
                          },
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <AspectRatioIcon
                            sx={{
                              color: theme.palette.primary.main,
                              mr: 2,
                              fontSize: 28,
                            }}
                          />
                          <Box>
                            <Typography variant="h6" fontWeight="600">
                              Booth Configuration
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Size: {formik.values.boothSize || "Not selected"}{" "}
                              | Duration:{" "}
                              {formik.values.boothSetupDuration
                                ? `${formik.values.boothSetupDuration} week(s)`
                                : "Not selected"}
                            </Typography>
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 0 }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                              gap: 3,
                            }}
                          >
                            {/* Booth Size */}
                            <Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: 2,
                                }}
                              >
                                <AspectRatioIcon
                                  sx={{
                                    fontSize: 20,
                                    mr: 1,
                                    color: theme.palette.text.secondary,
                                  }}
                                />
                                <Typography
                                  variant="subtitle2"
                                  fontWeight="500"
                                >
                                  Booth Size
                                </Typography>
                              </Box>
                              <CustomSelectField
                                name="boothSize"
                                label="Select size"
                                fieldType="single"
                                options={[
                                  { label: "2x2m", value: "2x2" },
                                  { label: "4x4m", value: "4x4" },
                                ]}
                                value={formik.values.boothSize}
                                onChange={(value) =>
                                  formik.setFieldValue("boothSize", value || "")
                                }
                                onBlur={() =>
                                  formik.setFieldTouched("boothSize", true)
                                }
                                onFocus={() =>
                                  formik.setFieldTouched("boothSize", true)
                                }
                              />
                              {formik.touched.boothSize &&
                                formik.errors.boothSize && (
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    mt={1}
                                  >
                                    <ErrorOutlineIcon
                                      color="error"
                                      sx={{ fontSize: 16, mr: 0.5 }}
                                    />
                                    <Typography variant="caption" color="error">
                                      {formik.errors.boothSize}
                                    </Typography>
                                  </Box>
                                )}
                            </Box>

                            {/* Duration Select */}
                            <Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: 2,
                                }}
                              >
                                <ScheduleIcon
                                  sx={{
                                    fontSize: 20,
                                    mr: 1,
                                    color: theme.palette.text.secondary,
                                  }}
                                />
                                <Typography
                                  variant="subtitle2"
                                  fontWeight="500"
                                >
                                  Duration
                                </Typography>
                              </Box>
                              <CustomSelectField
                                name="boothSetupDuration"
                                label="Select duration"
                                fieldType="single"
                                options={[
                                  { label: "1 week", value: 1 },
                                  { label: "2 weeks", value: 2 },
                                  { label: "3 weeks", value: 3 },
                                  { label: "4 weeks", value: 4 },
                                ]}
                                value={formik.values.boothSetupDuration}
                                onChange={(value) =>
                                  formik.setFieldValue(
                                    "boothSetupDuration",
                                    value || 0
                                  )
                                }
                                onBlur={() =>
                                  formik.setFieldTouched(
                                    "boothSetupDuration",
                                    true
                                  )
                                }
                                onFocus={() =>
                                  formik.setFieldTouched(
                                    "boothSetupDuration",
                                    true
                                  )
                                }
                              />
                              {formik.touched.boothSetupDuration &&
                                formik.errors.boothSetupDuration && (
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    mt={1}
                                  >
                                    <ErrorOutlineIcon
                                      color="error"
                                      sx={{ fontSize: 16, mr: 0.5 }}
                                    />
                                    <Typography variant="caption" color="error">
                                      {formik.errors.boothSetupDuration}
                                    </Typography>
                                  </Box>
                                )}
                            </Box>
                          </Box>
                        </CardContent>
                      </AccordionDetails>
                    </Accordion>

                    {/* Submit Button - Always visible */}
                    <Box sx={{ mt: 4, textAlign: "center" }}>
                      <Box
                        sx={{
                          position: "relative",
                          maxWidth: "400px",
                          margin: "0 auto",
                        }}
                      >
                        <CustomButton
                          type="submit"
                          variant="contained"
                          size="large"
                          width="100%"
                          disableElevation
                          label={
                            formik.isSubmitting
                              ? "Processing..."
                              : "Submit Application"
                          }
                          disabled={formik.isSubmitting || !formik.isValid}
                          sx={{
                            py: 1.5,
                            fontSize: "1.1rem",
                            fontWeight: "600",
                            borderRadius: 3,
                            background: `linear(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            "&:hover": {
                              transform: "translateY(-1px)",
                              boxShadow: 4,
                            },
                            transition: "all 0.2s ease-in-out",
                          }}
                        />
                        {formik.isSubmitting && (
                          <CircularProgress
                            size={24}
                            sx={{
                              color: "white",
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              marginTop: "-12px",
                              marginLeft: "-12px",
                            }}
                          />
                        )}
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: 2,
                          color: theme.palette.text.secondary,
                        }}
                      >
                        By submitting, you agree to our terms and conditions
                      </Typography>
                    </Box>
                  </Paper>
                </Box>

                {/* Right Side: Booth Map */}
                <Box>
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 2, md: 3 },
                      borderRadius: 4,
                      background: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Location Accordion */}
                    <Accordion
                      expanded={expandedAccordion === "location"}
                      onChange={handleAccordionChange("location")}
                      sx={{
                        mb: 3,
                        borderRadius: "12px !important",
                        border: `1px solid ${theme.palette.divider}`,
                        "&:before": { display: "none" },
                        boxShadow: "none",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          backgroundColor: theme.palette.background.default,
                          borderRadius: "12px",
                          minHeight: "68px",
                          "&.Mui-expanded": {
                            minHeight: "68px",
                            borderBottom: `1px solid ${theme.palette.divider}`,
                          },
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LocationOnIcon
                            sx={{
                              color: theme.palette.primary.main,
                              mr: 2,
                              fontSize: 28,
                            }}
                          />
                          <Box>
                            <Typography variant="h6" fontWeight="600">
                              Select Booth Location
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {selectedBooth
                                ? `Booth ${selectedBooth} selected`
                                : "Choose your preferred spot"}
                            </Typography>
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails
                        sx={{
                          p: 0,
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Box
                          sx={{
                            p: 3,
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          {/* Map content remains the same as before */}
                          <Box
                            sx={{
                              flex: 1,
                              display: "flex",
                              flexDirection: "column",
                              minHeight: "400px",
                            }}
                          >
                            {/* Map container and legend*/}
                            <Card
                              elevation={0}
                              sx={{
                                flex: 1,
                                border:
                                  formik.touched.boothLocation &&
                                  formik.errors.boothLocation
                                    ? `2px solid ${theme.palette.error.main}`
                                    : `2px solid ${theme.palette.divider}`,
                                borderRadius: 3,
                                overflow: "hidden",
                                backgroundColor:
                                  theme.palette.background.default,
                                transition: "all 0.2s ease-in-out",
                                "&:hover": {
                                  borderColor:
                                    formik.touched.boothLocation &&
                                    formik.errors.boothLocation
                                      ? theme.palette.error.main
                                      : theme.palette.primary.main,
                                },
                              }}
                            >
                              <Box sx={{ height: "100%", minHeight: "350px" }}>
                                <PlatformMap
                                  onBoothSelect={(boothId) =>
                                    handleBoothSelection(
                                      boothId,
                                      formik.setFieldValue
                                    )
                                  }
                                  selectedBooth={selectedBooth}
                                />
                              </Box>
                            </Card>

                            {/* Selection status and legend */}
                            <Box sx={{ mt: 2 }}>
                              {selectedBooth ? (
                                <Box
                                  sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor:
                                      theme.palette.success.light + "20",
                                    border: `1px solid ${theme.palette.success.main}30`,
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <LocationOnIcon
                                    sx={{
                                      color: theme.palette.success.main,
                                      mr: 1,
                                    }}
                                  />
                                  <Typography
                                    variant="body2"
                                    color="success.main"
                                  >
                                    <strong>Selected:</strong> Booth{" "}
                                    {selectedBooth}
                                  </Typography>
                                </Box>
                              ) : formik.touched.boothLocation &&
                                formik.errors.boothLocation ? (
                                <Box
                                  sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor:
                                      theme.palette.error.light + "20",
                                    border: `1px solid ${theme.palette.error.main}30`,
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <ErrorOutlineIcon
                                    color="error"
                                    sx={{ mr: 1 }}
                                  />
                                  <Typography variant="body2" color="error">
                                    {formik.errors.boothLocation}
                                  </Typography>
                                </Box>
                              ) : (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    textAlign: "center",
                                    color: theme.palette.text.secondary,
                                    fontStyle: "italic",
                                  }}
                                >
                                  Click on an available booth (blue) to select
                                  your location
                                </Typography>
                              )}
                            </Box>

                            {/* Legend */}
                            <Box
                              sx={{
                                mt: 3,
                                p: 2,
                                backgroundColor:
                                  theme.palette.background.default,
                                borderRadius: 2,
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                fontWeight="600"
                                gutterBottom
                              >
                                Map Legend
                              </Typography>
                              <Box
                                sx={{
                                  display: "grid",
                                  gridTemplateColumns: "1fr 1fr",
                                  gap: 1,
                                }}
                              >
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Box
                                    sx={{
                                      width: 16,
                                      height: 16,
                                      backgroundColor:
                                        theme.palette.primary.main,
                                      borderRadius: 1,
                                      mr: 1,
                                    }}
                                  />
                                  <Typography variant="caption">
                                    Available
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Box
                                    sx={{
                                      width: 16,
                                      height: 16,
                                      backgroundColor:
                                        theme.palette.success.main,
                                      borderRadius: 1,
                                      mr: 1,
                                    }}
                                  />
                                  <Typography variant="caption">
                                    Selected
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Box
                                    sx={{
                                      width: 16,
                                      height: 16,
                                      backgroundColor: theme.palette.grey[400],
                                      borderRadius: 1,
                                      mr: 1,
                                    }}
                                  />
                                  <Typography variant="caption">
                                    Occupied
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Paper>
                </Box>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default BoothForm;
