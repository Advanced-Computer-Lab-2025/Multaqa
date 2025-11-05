import React, { useState } from "react";
import { Formik } from "formik";
import { CustomTextField } from "../input-fields";
import CustomButton from "../Buttons/CustomButton";
import PlatformMap from "../PlatformMap/PlatformMap";
import { Box, Typography, CircularProgress, Divider } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useTheme } from "@mui/material/styles";
import { BoothFormValues } from "./types";
import { validationSchema } from "./utils";
import CustomSelectField from "../input-fields/CustomSelectField";
import CustomIcon from "../Icons/CustomIcon";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { submitBoothForm } from "./utils";
import { useAuth } from "../../../context/AuthContext";

const BoothForm: React.FC = () => {
  const theme = useTheme();
  const [selectedBooth, setSelectedBooth] = useState<number | null>(null);
  const { user } = useAuth();
  const handleBoothSelection = (
    boothId: number,
    setFieldValue: (field: string, value: unknown) => void
  ) => {
    setSelectedBooth(boothId);
    setFieldValue("boothLocation", `Booth ${boothId}`);
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
        backgroundColor: theme.palette.background.paper,
        padding: { xs: 3, md: 5 },
        maxWidth: "1200px",
        margin: "auto",
        mt: 4,
      }}
    >
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
            <div className="flex flex-row lg:flex-row items-stretch justify-between gap-10 padding-10">
              {/* Left Side: Form Fields */}
              <div className="flex flex-col flex-1 lg:w-1/2 gap-4">
                {/* Header */}
                <div className="text-center mb-6 w-full">
                  <h1
                    className="text-2xl font-bold mb-2"
                    style={{ color: theme.palette.text.primary }}
                  >
                    Booth Application
                  </h1>
                  <p style={{ color: theme.palette.text.secondary }}>
                    Apply for a booth space at our platform
                  </p>
                </div>

                <Divider sx={{ width: "100%", mb: 4 }} />

                {/* Attendee Info */}
                <Box>
                  {formik.values.boothAttendees.map((attendee, index) => (
                    <Box key={index}>
                      <div className="flex items-start gap-5 w-full px-4 mb-5">
                        <div className="flex-1">
                          <CustomTextField
                            name={`boothAttendees.${index}.name`}
                            id={`boothAttendees.${index}.name`}
                            label={`Attendee ${index + 1} name`}
                            fieldType="text"
                            width="100%"
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
                          {formik.touched.boothAttendees?.[index]?.name &&
                            typeof formik.errors.boothAttendees?.[index] !==
                              "string" &&
                            formik.errors.boothAttendees?.[index]?.name && (
                              <Box display="flex" alignItems="center" mt={1}>
                                <ErrorOutlineIcon
                                  color="error"
                                  sx={{ fontSize: 16, mr: 0.5 }}
                                />
                                <Typography variant="caption" color="error">
                                  {typeof formik.errors.boothAttendees?.[
                                    index
                                  ] !== "string"
                                    ? formik.errors.boothAttendees?.[index]
                                        ?.name
                                    : formik.errors.boothAttendees?.[index]}
                                </Typography>
                              </Box>
                            )}
                        </div>
                        <div className="flex-1">
                          <CustomTextField
                            name={`boothAttendees.${index}.email`}
                            id={`boothAttendees.${index}.email`}
                            label={`Attendee ${index + 1} email`}
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
                          {formik.touched.boothAttendees?.[index]?.email &&
                            typeof formik.errors.boothAttendees?.[index] !==
                              "string" &&
                            formik.errors.boothAttendees?.[index]?.email && (
                              <Box display="flex" alignItems="center" mt={1}>
                                <ErrorOutlineIcon
                                  color="error"
                                  sx={{ fontSize: 16, mr: 0.5 }}
                                />
                                <Typography variant="caption" color="error">
                                  {typeof formik.errors.boothAttendees?.[
                                    index
                                  ] !== "string"
                                    ? formik.errors.boothAttendees?.[index]
                                        ?.email
                                    : formik.errors.boothAttendees?.[index]}
                                </Typography>
                              </Box>
                            )}
                        </div>
                        <div className="w-10 flex items-center mt-6">
                          {index > 0 ? (
                            <CustomIcon
                              icon="delete"
                              size="medium"
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
                              containerType="inwards"
                              sx={{
                                cursor: "pointer",
                                color: theme.palette.error.main,
                              }}
                            />
                          ) : (
                            <div className="w-10">
                              <CustomIcon
                                icon="add"
                                size="medium"
                                onClick={() => {
                                  if (formik.values.boothAttendees.length >= 5)
                                    return; // Limit to 5 attendees
                                  formik.setFieldValue("boothAttendees", [
                                    ...formik.values.boothAttendees,
                                    { name: "", email: "" },
                                  ]);
                                }}
                                sx={{
                                  cursor: "pointer",
                                  color: theme.palette.primary.main,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </Box>
                  ))}
                </Box>

                {/* Booth Size Select */}

                <div className="flex items-center justify-center gap-10 flex-col mt-5 mb-10">
                  <div className="w-full max-w-md">
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
                      onBlur={() => formik.setFieldTouched("boothSize", true)}
                      onFocus={() => formik.setFieldTouched("boothSize", true)}
                    />
                    {formik.touched.boothSize && formik.errors.boothSize && (
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
                  </div>
                  {/* Duration Select */}
                  <div className="w-full max-w-md">
                    <CustomSelectField
                      name="boothSetupDuration"
                      label="Booth Duration"
                      fieldType="single"
                      neumorphicBox
                      options={[
                        { label: "1 week", value: 1 },
                        { label: "2 weeks", value: 2 },
                        { label: "3 weeks", value: 3 },
                        { label: "4 weeks", value: 4 },
                      ]}
                      value={formik.values.boothSetupDuration}
                      onChange={(value) =>
                        formik.setFieldValue("boothSetupDuration", value || 0)
                      }
                      onBlur={() =>
                        formik.setFieldTouched("boothSetupDuration", true)
                      }
                      onFocus={() =>
                        formik.setFieldTouched("boothSetupDuration", true)
                      }
                    />
                    {formik.touched.boothSetupDuration &&
                      formik.errors.boothSetupDuration && (
                        <Box display="flex" alignItems="center" mt={1}>
                          <ErrorOutlineIcon
                            color="error"
                            sx={{ fontSize: 16, mr: 0.5 }}
                          />
                          <Typography variant="caption" color="error">
                            {formik.errors.boothSetupDuration}
                          </Typography>
                        </Box>
                      )}
                  </div>
                </div>

                {/* Submit */}

                <Box className="w-full mt-auto ">
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      maxWidth: "400px",
                      margin: "0 auto",
                    }}
                  >
                    <CustomButton
                      type="submit"
                      variant="contained"
                      width="100%"
                      disableElevation
                      label={formik.isSubmitting ? "" : "Submit Application"}
                      disabled={formik.isSubmitting}
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

              <Divider
                orientation="vertical"
                flexItem
                sx={{ mr: 2, display: { xs: "none", lg: "block" } }}
              />

              {/* Right Side: Booth Map */}

              <div className="flex flex-col flex-1 lg:w-1/2 gap-4">
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{ color: theme.palette.text.primary }}
                >
                  Select Booth Location
                </Typography>
                <Typography
                  variant="body2"
                  style={{
                    color: theme.palette.text.secondary,
                    marginBottom: 8,
                  }}
                >
                  Click on an available booth (blue) to select your preferred
                  location
                </Typography>

                <Box
                  sx={{
                    width: "100%",
                    maxWidth: "500px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {/* Booth Map with conditional red border + glow */}
                  <Box
                    sx={{
                      width: "100%",
                      height: { xs: "310px", md: "490px" },
                      border:
                        formik.touched.boothLocation &&
                        formik.errors.boothLocation
                          ? `2px solid ${theme.palette.error.main}`
                          : `2px solid transparent`,
                      borderRadius: "30px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <PlatformMap
                      onBoothSelect={(boothId) =>
                        handleBoothSelection(boothId, formik.setFieldValue)
                      }
                      selectedBooth={selectedBooth}
                    />
                  </Box>

                  {/* Error Message Below the Map */}
                  {formik.touched.boothLocation &&
                    formik.errors.boothLocation && (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        mt={1.5}
                        sx={{ textAlign: "center" }}
                      >
                        <ErrorOutlineIcon
                          color="error"
                          sx={{ fontSize: 16, mr: 0.5 }}
                        />
                        <Typography variant="caption" color="error">
                          {formik.errors.boothLocation}
                        </Typography>
                      </Box>
                    )}
                </Box>
              </div>
            </div>
          </form>
        )}
      </Formik>
      <ToastContainer />
    </Box>
  );
};

export default BoothForm;
