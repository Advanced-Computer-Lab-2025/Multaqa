import React, { useState } from "react";
import { Formik } from "formik";
import NeumorphicBox from "../containers/NeumorphicBox";
import { CustomTextField } from "../input-fields";
import CustomButton from "../Buttons/CustomButton";
import PlatformMap from "../PlatformMap/PlatformMap";
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useTheme } from "@mui/material/styles";
import { BoothFormValues } from "./types";
import { validationSchema } from "./utils";
import CustomSelectField from "../input-fields/CustomSelectField";
import CustomIcon from "../Icons/CustomIcon";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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
    startDate: null,
    endDate: null,
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
            className="max-w-[1500px] mx-auto"
          >
            <div className="flex flex-col lg:flex-row items-stretch justify-between gap-10">
              {/* Left Side: Form Fields */}
              <div className="flex flex-col flex-1 lg:w-1/2 gap-4">
                {/* Header */}
                <div className="text-center mb-6 w-full">
                  <h1
                    className="text-4xl font-bold mb-2"
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
                  {formik.values.attendees.map((attendee, index) => (
                    <Box key={index}>
                      <div className="flex items-start gap-5 w-full px-4 mb-5">
                        <div className="w-[300px]">
                          <CustomTextField
                            id={`attendees.${index}.name`}
                            label={`Attendee ${index + 1} name`}
                            fieldType="text"
                            width="300px"
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
                            label={`Attendee ${index + 1} email`}
                            fieldType="email"
                            width="300px"
                            stakeholderType="vendor"
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
                        <div className="w-10 flex items-center mt-6">
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
                                  if (formik.values.attendees.length >= 5)
                                    return; // Limit to 5 attendees
                                  formik.setFieldValue("attendees", [
                                    ...formik.values.attendees,
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

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div className="flex items-start gap-5 w-full px-4 mb-5">
                    <div>
                      <DatePicker
                        label="Start date"
                        value={formik.values.startDate}
                        onChange={(value) => {
                          formik.setFieldValue("startDate", value);
                          formik.setFieldTouched("startDate", true, true);
                        }}
                        onClose={() =>
                          formik.setFieldTouched("startDate", true, true)
                        }
                        slotProps={{
                          textField: {
                            id: "startDate",
                            error:
                              formik.touched.startDate &&
                              Boolean(formik.errors.startDate),
                            helperText:
                              formik.touched.startDate &&
                              (formik.errors.startDate as string),
                            sx: { width: "300px" },
                          },
                        }}
                      />
                    </div>
                    <div>
                      <DatePicker
                        label="End date"
                        value={formik.values.endDate}
                        onChange={(value) => {
                          formik.setFieldValue("endDate", value);
                          formik.setFieldTouched("endDate", true, false);
                        }}
                        onClose={() => formik.setFieldTouched("endDate", true)}
                        slotProps={{
                          textField: {
                            id: "endDate",
                            error:
                              formik.touched.endDate &&
                              Boolean(formik.errors.endDate),
                            helperText:
                              formik.touched.endDate &&
                              (formik.errors.endDate as string),
                            sx: { width: "300px" },
                          },
                        }}
                      />
                    </div>
                  </div>
                </LocalizationProvider>

                {/* Booth Size Select */}

                <div className="flex justify-center items-center w-full mb-4">
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
                </div>

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

              <Box className="w-full lg:w-1/2 flex flex-col items-center">
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
