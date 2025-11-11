import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { CustomTextField } from "../input-fields";
import CustomButton from "../Buttons/CustomButton";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Tooltip,
  AccordionDetails,
  Chip,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AspectRatioIcon from "@mui/icons-material/AspectRatio"; // Icon for Booth Size
import { useTheme } from "@mui/material/styles";

import { BazarFormValues} from "./types";
import { validationSchema, submitBazarForm } from "./utils";
import CustomSelectField from "../input-fields/CustomSelectField";
import { BazarApplicationFormProps } from "./types";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/context/AuthContext";
import { UploadID } from "../FileUpload";
import { createDocumentHandler } from "../RegistrationForm/utils";
import StyledAccordion from "../Accordion/StyledAccordion";
import StyledAccordionSummary from "../Accordion/StyledAccordionSummary";
import type { UploadStatus } from "../FileUpload/types";

const BazarForm: React.FC<BazarApplicationFormProps> = ({ eventId }) => {
  const theme = useTheme();
  const { user } = useAuth();

  const [attendeeIdStatuses, setAttendeeIdStatuses] = useState<UploadStatus[]>([
    "idle",
  ]);
  const [attendeeIdFiles, setAttendeeIdFiles] = useState<(File | null)[]>([
    null,
  ]);
  const [attendeeCount, setAttendeeCount] = useState(1);

  // Add 'configuration' to the default expanded set
  const [expandedAccordions, setExpandedAccordions] = useState<Set<string>>(
    new Set(["attendees", "configuration"])
  );

  const initialValues: BazarFormValues = {
    bazaarAttendees: [{ name: "", email: "", nationalId: null }],
    boothSize: "",
  };

  useEffect(() => {
    const ensureArrayLength = <T,>(arr: T[], defaultValue: T): T[] => {
      if (arr.length < attendeeCount) {
        return [
          ...arr,
          ...Array(attendeeCount - arr.length).fill(defaultValue),
        ];
      }
      return arr.slice(0, attendeeCount);
    };

    setAttendeeIdStatuses((prev) => ensureArrayLength(prev, "idle"));
    setAttendeeIdFiles((prev) => ensureArrayLength(prev, null));
  }, [attendeeCount]);

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedAccordions((prev) => {
        const newSet = new Set(prev);
        if (isExpanded) {
          newSet.add(panel);
        } else {
          newSet.delete(panel);
        }
        return newSet;
      });
    };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          const vendorId = String(user?._id);
          if (!vendorId || vendorId === "undefined") {
            console.error("No valid vendor ID found!", { user });
            setSubmitting(false);
            return;
          }
          submitBazarForm(
            values,
            { setSubmitting, resetForm },
            eventId,
            attendeeIdStatuses
          );
        }}
      >
        {(formik) => {
          if (attendeeCount !== formik.values.bazaarAttendees.length) {
            setAttendeeCount(formik.values.bazaarAttendees.length);
          }

          const hasAttendeesError = !!(
            formik.errors.bazaarAttendees && formik.touched.bazaarAttendees
          );

          // Check for booth size error
          const hasConfigError = !!(
            formik.errors.boothSize && formik.touched.boothSize
          );

          const createAttendeeIdHandler = (index: number) =>
            createDocumentHandler(
              (file) => {
                const newFiles = [...attendeeIdFiles];
                newFiles[index] = file;
                setAttendeeIdFiles(newFiles);
              },
              (status) => {
                const newStatuses = [...attendeeIdStatuses];
                newStatuses[index] = status;
                setAttendeeIdStatuses(newStatuses);
              },
              formik.setFieldValue,
              `bazaarAttendees.${index}.nationalId`,
              formik
            );

          return (
            <form onSubmit={formik.handleSubmit}>
              <Box className="max-w-[600px] mx-auto">
                <div className="flex flex-col flex-1 gap-4">
                  {/* Header */}
                  <div className="text-center mb-4 w-full">
                    <h1
                      className="text-2xl font-bold mb-2"
                      style={{ color: theme.palette.text.primary }}
                    >
                      Bazar Application
                    </h1>
                    <p style={{ color: theme.palette.text.secondary }}>
                      Join a Bazar event by filling out the application form
                      below
                    </p>
                  </div>

                  {/* === Attendee Info Section === */}
                  <StyledAccordion
                    expanded={expandedAccordions.has("attendees")}
                    onChange={handleAccordionChange("attendees")}
                  >
                    <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
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
                              label={`${
                                formik.values.bazaarAttendees.length
                              } attendee${
                                formik.values.bazaarAttendees.length !== 1
                                  ? "s"
                                  : ""
                              }`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            {hasAttendeesError &&
                              !expandedAccordions.has("attendees") && (
                                <Chip
                                  icon={<ErrorOutlineIcon />}
                                  label="Missing Fields"
                                  size="small"
                                  color="error"
                                  variant="outlined"
                                />
                              )}
                          </Box>
                        </Box>
                      </Box>
                    </StyledAccordionSummary>
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
                              color="text.primary"
                            >
                              Attendees Added
                            </Typography>
                            <Typography variant="h6" color="primary.main">
                              {`${
                                formik.values.bazaarAttendees.length
                              } attendee${
                                formik.values.bazaarAttendees.length !== 1
                                  ? "s"
                                  : ""
                              } added (up to 5 allowed)`}
                            </Typography>
                          </Box>
                          <Tooltip
                            title={
                              formik.values.bazaarAttendees.length >= 5
                                ? "Maximum 5 attendees allowed"
                                : "Add another attendee"
                            }
                          >
                            <span>
                              <IconButton
                                onClick={() => {
                                  if (formik.values.bazaarAttendees.length >= 5)
                                    return;
                                  formik.setFieldValue("bazaarAttendees", [
                                    ...formik.values.bazaarAttendees,
                                    { name: "", email: "", nationalId: "" },
                                  ]);
                                }}
                                disabled={
                                  formik.values.bazaarAttendees.length >= 5
                                }
                                sx={{
                                  backgroundColor: theme.palette.primary.main,
                                  color: "white",
                                  "&:hover": {
                                    backgroundColor: theme.palette.primary.dark,
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
                        {formik.values.bazaarAttendees.map(
                          (attendee, index) => (
                            <Card
                              key={index}
                              sx={{
                                mb: 2,
                                borderRadius: 2,
                                border: `1px solid ${theme.palette.divider}`,
                                backgroundColor: theme.palette.background.paper,
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
                                        {attendee.email || "No email provided"}
                                      </Typography>
                                    </Box>
                                  </Box>

                                  {index > 0 && (
                                    <Tooltip title="Remove attendee">
                                      <IconButton
                                        size="small"
                                        onClick={() => {
                                          const newAttendees =
                                            formik.values.bazaarAttendees.filter(
                                              (_, i) => i !== index
                                            );
                                          formik.setFieldValue(
                                            "bazaarAttendees",
                                            newAttendees
                                          );
                                        }}
                                        sx={{
                                          color: theme.palette.error.main,
                                          "&:hover": {
                                            backgroundColor:
                                              theme.palette.error.light + "20",
                                          },
                                        }}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                </Box>

                                {/* Form Fields - Name, Email, and ID Upload */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 2,
                                    alignItems: "flex-start",
                                  }}
                                >
                                  {/* Left side: Name and Email stacked */}
                                  <Box
                                    sx={{
                                      flex: 1,
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 2,
                                    }}
                                  >
                                    <Box>
                                      <CustomTextField
                                        name={`bazaarAttendees.${index}.name`}
                                        id={`bazaarAttendees.${index}.name`}
                                        label="Full Name"
                                        fieldType="text"
                                        width="100%"
                                        value={attendee.name}
                                        onChange={(e) => {
                                          formik.setFieldValue(
                                            `bazaarAttendees.${index}.name`,
                                            e.target.value
                                          );
                                        }}
                                        onBlur={() =>
                                          formik.setFieldTouched(
                                            `bazaarAttendees.${index}.name`,
                                            true
                                          )
                                        }
                                      />
                                      {formik.touched.bazaarAttendees?.[index]
                                        ?.name &&
                                        typeof formik.errors.bazaarAttendees?.[
                                          index
                                        ] !== "string" &&
                                        formik.errors.bazaarAttendees?.[index]
                                          ?.name && (
                                          <Box
                                            display="flex"
                                            alignItems="center"
                                            mt={1}
                                          >
                                            <ErrorOutlineIcon
                                              color="error"
                                              sx={{
                                                fontSize: 16,
                                                mr: 0.5,
                                              }}
                                            />
                                            <Typography
                                              variant="caption"
                                              color="error"
                                            >
                                              {typeof formik.errors
                                                .bazaarAttendees?.[index] !==
                                              "string"
                                                ? formik.errors
                                                    .bazaarAttendees?.[index]
                                                    ?.name
                                                : formik.errors
                                                    .bazaarAttendees?.[index]}
                                            </Typography>
                                          </Box>
                                        )}
                                    </Box>
                                    <Box>
                                      <CustomTextField
                                        name={`bazaarAttendees.${index}.email`}
                                        id={`bazaarAttendees.${index}.email`}
                                        label="Email Address"
                                        fieldType="email"
                                        width="100%"
                                        stakeholderType="vendor"
                                        onChange={(e) => {
                                          formik.setFieldValue(
                                            `bazaarAttendees.${index}.email`,
                                            e.target.value
                                          );
                                        }}
                                        onBlur={() =>
                                          formik.setFieldTouched(
                                            `bazaarAttendees.${index}.email`,
                                            true
                                          )
                                        }
                                      />
                                      {formik.touched.bazaarAttendees?.[index]
                                        ?.email &&
                                        typeof formik.errors.bazaarAttendees?.[
                                          index
                                        ] !== "string" &&
                                        formik.errors.bazaarAttendees?.[index]
                                          ?.email && (
                                          <Box
                                            display="flex"
                                            alignItems="center"
                                            mt={1}
                                          >
                                            <ErrorOutlineIcon
                                              color="error"
                                              sx={{
                                                fontSize: 16,
                                                mr: 0.5,
                                              }}
                                            />
                                            <Typography
                                              variant="caption"
                                              color="error"
                                            >
                                              {typeof formik.errors
                                                .bazaarAttendees?.[index] !==
                                              "string"
                                                ? formik.errors
                                                    .bazaarAttendees?.[index]
                                                    ?.email
                                                : formik.errors
                                                    .bazaarAttendees?.[index]}
                                            </Typography>
                                          </Box>
                                        )}
                                    </Box>
                                  </Box>

                                  {/* Right side: ID Upload */}
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      minWidth: "120px",
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{
                                        mb: 1,
                                        textAlign: "center",
                                      }}
                                    >
                                      ID Document
                                    </Typography>
                                    <UploadID
                                      label="Upload ID"
                                      onFileSelected={createAttendeeIdHandler(
                                        index
                                      )}
                                      uploadStatus={
                                        attendeeIdStatuses[index] || "idle"
                                      }
                                    />
                                    {formik.touched.bazaarAttendees?.[index]
                                      ?.nationalId &&
                                      typeof formik.errors.bazaarAttendees?.[
                                        index
                                      ] !== "string" &&
                                      formik.errors.bazaarAttendees?.[index]
                                        ?.nationalId && (
                                        <Box
                                          display="flex"
                                          alignItems="center"
                                          mt={0.5}
                                        >
                                          <ErrorOutlineIcon
                                            color="error"
                                            sx={{
                                              fontSize: 12,
                                              mr: 0.5,
                                            }}
                                          />
                                          <Typography
                                            variant="caption"
                                            color="error"
                                            sx={{
                                              fontSize: "0.65rem",
                                            }}
                                          >
                                            {typeof formik.errors
                                              .bazaarAttendees?.[index] !==
                                            "string"
                                              ? formik.errors.bazaarAttendees?.[
                                                  index
                                                ]?.nationalId
                                              : formik.errors.bazaarAttendees?.[
                                                  index
                                                ]}
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
                        {formik.values.bazaarAttendees.length === 0 && (
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
                                formik.setFieldValue("bazaarAttendees", [
                                  { name: "", email: "", nationalId: "" },
                                ]);
                              }}
                            >
                              Add First Attendee
                            </CustomButton>
                          </Box>
                        )}
                      </CardContent>
                    </AccordionDetails>
                  </StyledAccordion>

                  {/* === Booth Configuration Section === */}
                  <StyledAccordion
                    expanded={expandedAccordions.has("configuration")}
                    onChange={handleAccordionChange("configuration")}
                  >
                    <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <AspectRatioIcon
                          sx={{
                            color: theme.palette.primary.main,
                            mr: 2,
                            fontSize: 28,
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight="600">
                            Booth Configuration
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mt: 0.5,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Size: {formik.values.boothSize || "Not selected"}
                            </Typography>
                            {hasConfigError &&
                              !expandedAccordions.has("configuration") && (
                                <Chip
                                  icon={<ErrorOutlineIcon />}
                                  label="Missing Fields"
                                  size="small"
                                  color="error"
                                  variant="outlined"
                                />
                              )}
                          </Box>
                        </Box>
                      </Box>
                    </StyledAccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            w: "100%",
                          }}
                        >
                          <Box sx={{ width: "300px" }}>
                            <CustomSelectField
                              name="boothSize"
                              label="Booth Size"
                              fieldType="single"
                              neumorphicBox
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
                                <Box display="flex" alignItems="center" mt={1}>
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
                        </Box>
                      </CardContent>
                    </AccordionDetails>
                  </StyledAccordion>

                  {/* Submit */}
                  <Box className="w-full mt-auto ">
                    <Box
                      sx={{
                        position: "relative",
                        width: "400px",
                        margin: "0 auto",
                      }}
                    >
                      <CustomButton
                        type="submit"
                        variant="contained"
                        width="100%"
                        disableElevation
                        label={formik.isSubmitting ? "" : "Submit Application"}
                        disabled={formik.isSubmitting || !formik.isValid}
                        className="w-full"
                      />
                      {formik.isSubmitting && (
                        <span
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            pointerEvents: "none",
                          }}
                        >
                          <CircularProgress size={24} sx={{ color: "white" }} />
                        </span>
                      )}
                    </Box>
                  </Box>
                </div>
              </Box>
            </form>
          );
        }}
      </Formik>
      <ToastContainer />
    </>
  );
};

export default BazarForm;
