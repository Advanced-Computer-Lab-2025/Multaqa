import React, { useState } from "react";
import { Formik } from "formik";
import NeumorphicBox from "../containers/NeumorphicBox";
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

const BoothForm: React.FC = () => {
  const theme = useTheme();
  const [selectedBooth, setSelectedBooth] = useState<number | null>(null);
  const handleBoothSelection = (
    boothId: number,
    setFieldValue: (field: string, value: unknown) => void
  ) => {
    setSelectedBooth(boothId);
    setFieldValue("selectedBoothId", boothId);
  };

  const initialValues: BoothFormValues = {
    attendees: [{ name: "", email: "" }],
    boothSize: "",
    selectedBoothId: null,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      {(formik) => (
        <form onSubmit={formik.handleSubmit}>
          <NeumorphicBox
            containerType="outwards"
            padding="50px"
            borderRadius="20px"
          >
            <div className="flex flex-col lg:flex-row items-start justify-center gap-10">
              {/* Left Side: Form Fields */}
              <div className="flex flex-col items-center justify-center gap-6 w-full lg:w-1/2">
                {/* Header */}
                <div className="text-center mb-6">
                  <h1
                    className="text-4xl font-bold"
                    style={{ color: theme.palette.text.primary }}
                  >
                    Booth Application
                  </h1>
                  <p style={{ color: theme.palette.text.secondary }}>
                    Apply for a booth space at our platform
                  </p>
                </div>

                <Divider sx={{ width: "100%", my: 2 }} />
                {/* Attendee Info */}
                {formik.values.attendees.map((attendee, index) => (
                  <Box key={index}>
                    <Typography
                      variant="h6"
                      style={{ color: theme.palette.text.primary }}
                      mb={2}
                    >
                      Attendee {index + 1}:
                    </Typography>
                    <div className="flex items-start gap-5 w-full px-4">
                      <div className="w-[300px]">
                        <CustomTextField
                          id={`attendees.${index}.name`}
                          label="Name"
                          fieldType="text"
                          neumorphicBox
                          width="300px"
                          value={formik.values.attendees[index].name}
                          onChange={(e) => {
                            formik.setFieldValue(
                              `attendees.${index}.name`,
                              e.target.value
                            );
                          }}
                          onBlur={() =>
                            formik.setFieldTouched(
                              `attendees.${index}.name`,
                              true
                            )
                          }
                        />
                        {formik.touched.attendees?.[index]?.name &&
                          typeof formik.errors.attendees?.[index] !==
                            "string" &&
                          formik.errors.attendees?.[index]?.name && (
                            <Box display="flex" alignItems="center" mt={1}>
                              <ErrorOutlineIcon
                                color="error"
                                sx={{ fontSize: 16, mr: 0.5 }}
                              />
                              <Typography variant="caption" color="error">
                                {typeof formik.errors.attendees?.[index] !==
                                "string"
                                  ? formik.errors.attendees?.[index]?.name
                                  : formik.errors.attendees?.[index]}
                              </Typography>
                            </Box>
                          )}
                      </div>
                      <div className="w-[300px]">
                        <CustomTextField
                          id={`attendees.${index}.email`}
                          label="Email"
                          fieldType="email"
                          neumorphicBox
                          width="300px"
                          stakeholderType={"vendor"}
                          value={formik.values.attendees[index].email}
                          onChange={(e) => {
                            formik.setFieldValue(
                              `attendees.${index}.email`,
                              e.target.value
                            );
                          }}
                          onBlur={() =>
                            formik.setFieldTouched(
                              `attendees.${index}.email`,
                              true
                            )
                          }
                        />
                        {formik.touched.attendees?.[index]?.email &&
                          typeof formik.errors.attendees?.[index] !==
                            "string" &&
                          formik.errors.attendees?.[index]?.email && (
                            <Box display="flex" alignItems="center" mt={1}>
                              <ErrorOutlineIcon
                                color="error"
                                sx={{ fontSize: 16, mr: 0.5 }}
                              />
                              <Typography variant="caption" color="error">
                                {typeof formik.errors.attendees?.[index] !==
                                "string"
                                  ? formik.errors.attendees?.[index]?.email
                                  : formik.errors.attendees?.[index]}
                              </Typography>
                            </Box>
                          )}
                      </div>
                      <div className="w-10 flex items-center">
                        {index > 0 ? (
                          <CustomIcon
                            icon="delete"
                            size="medium"
                            onClick={() => {
                              const newAttendees =
                                formik.values.attendees.filter(
                                  (_, i) => i !== index
                                );
                              formik.setFieldValue("attendees", newAttendees);
                            }}
                            border={false}
                            containerType="outwards"
                            sx={{
                              cursor: "pointer",
                              color: theme.palette.error.main,
                            }}
                          />
                        ) : (
                          <div className="w-10"></div>
                        )}
                      </div>
                    </div>
                  </Box>
                ))}
                <CustomIcon
                  icon="add"
                  size="medium"
                  onClick={() => {
                    if (formik.values.attendees.length >= 5) return; // Limit to 5 attendees
                    formik.setFieldValue("attendees", [
                      ...formik.values.attendees,
                      { name: "", email: "" },
                    ]);
                  }}
                  sx={{ cursor: "pointer", color: theme.palette.primary.main }}
                />
                {/* Booth Size Select */}
                <div className="w-[300px]">
                  <CustomSelectField
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

                {/* Submit */}
                <Box className="w-full mt-4">
                  <Box sx={{ position: "relative", width: "100%" }}>
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
              <Box className="w-full lg:w-1/2">
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

                {formik.touched.selectedBoothId &&
                  formik.errors.selectedBoothId && (
                    <Box display="flex" alignItems="center" mt={3}>
                      <ErrorOutlineIcon
                        color="error"
                        sx={{ fontSize: 16, mr: 0.5 }}
                      />
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ fontSize: 16 }}
                      >
                        {formik.errors.selectedBoothId}
                      </Typography>
                    </Box>
                  )}
                <Box
                  {...(formik.touched.selectedBoothId &&
                    formik.errors.selectedBoothId && {
                      border: `2px solid ${theme.palette.error.main}`,
                      borderRadius: "30px",
                    })}
                >
                  <PlatformMap
                    onBoothSelect={(boothId) =>
                      handleBoothSelection(boothId, formik.setFieldValue)
                    }
                    selectedBooth={selectedBooth}
                  />
                </Box>
              </Box>
            </div>
          </NeumorphicBox>
        </form>
      )}
    </Formik>
  );
};

export default BoothForm;
