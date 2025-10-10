import React, { useState } from "react";
import { Formik, FieldArray } from "formik";
import NeumorphicBox from "../containers/NeumorphicBox";
import { CustomTextField } from "../input-fields";
import CustomButton from "../Buttons/CustomButton";
import PlatformMap from "../PlatformMap/PlatformMap";
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Divider,
  Grid,
  Alert,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useTheme } from "@mui/material/styles";
import { BoothFormValues } from "./types";
import { validationSchema } from "./utils";
import CustomSelectField from "../input-fields/CustomSelectField";

const BoothForm: React.FC = () => {
  const theme = useTheme();
  const [selectedBooth, setSelectedBooth] = useState<number | null>(null);

  const initialValues: BoothFormValues = {
    //attendees: [{ name: "", email: "" }],
    //setupDuration: "",
    boothSize: "",
    selectedBoothId: null,
  };

  const handleBoothSelection = (
    boothId: number,
    setFieldValue: (field: string, value: unknown) => void
  ) => {
    setSelectedBooth(boothId);
    setFieldValue("selectedBoothId", boothId);
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
            padding="60px"
            borderRadius="20px"
          >
            <div className="flex flex-col lg:flex-row items-start justify-center gap-10">
              {/* Left Side: Form Fields */}
              <div className="flex flex-col items-center justify-center gap-6 w-full lg:w-2/5">
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

                {/* Duration Select */}
                {/* <div className="w-[300px]">
                  <CustomSelectField
                    label="Duration"
                    fieldType="single"
                    neumorphicBox
                    options={[
                      { label: "1 week", value: "1week" },
                      { label: "2 weeks", value: "2weeks" },
                      { label: "3 weeks", value: "3weeks" },
                      { label: "4 weeks", value: "4weeks" },
                    ]}
                    value={formik.values.setupDuration}
                    onChange={(value) =>
                      formik.setFieldValue("setupDuration", value || "")
                    }
                    onBlur={() => formik.setFieldTouched("setupDuration", true)}
                  />
                  {formik.touched.setupDuration &&
                    formik.errors.setupDuration && (
                      <Box display="flex" alignItems="center" mt={1}>
                        <ErrorOutlineIcon
                          color="error"
                          sx={{ fontSize: 16, mr: 0.5 }}
                        />
                        <Typography variant="caption" color="error">
                          {formik.errors.setupDuration}
                        </Typography>
                      </Box>
                    )}
                </div> */}

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
                sx={{ mx: 4, display: { xs: "none", lg: "block" } }}
              />
              {/* Right Side: Booth Map */}
              <Box className="w-full lg:w-3/5">
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
