import React from "react";
import { Formik } from "formik";
import { UserType, RegistrationFormProps } from "./types";
import { getValidationSchema } from "./utils";
import NeumorphicBox from "../containers/NeumorphicBox";
import { CustomTextField } from "../input-fields";
import CustomButton from "../Buttons/CustomButton";
import Link from "next/link";
import { Box, Typography, CircularProgress } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useTheme } from "@mui/material/styles";
import UploadField from "../UploadField/UploadField";
import DescriptionIcon from "@mui/icons-material/Description";
import BusinessIcon from "@mui/icons-material/Business";

const RegistrationForm: React.FC<RegistrationFormProps> = ({ UserType }) => {
  const theme = useTheme();

  const initialValues =
    UserType !== "vendor"
      ? {
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          gucId: "",
        }
      : {
          companyName: "",
          email: "",
          password: "",
          confirmPassword: "",
        };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getValidationSchema(UserType)}
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
            padding="30px"
            margin="20px"
            width="650px"
            borderRadius="20px"
          >
            <div className="flex flex-col items-center justify-center gap-6">
              {/* Header */}
              <div className="text-center mb-6">
                <h1
                  className="text-4xl font-bold"
                  style={{ color: theme.palette.text.primary }}
                >
                  Multaqa
                </h1>
                <p style={{ color: theme.palette.text.secondary }}>
                  Create your account to get started
                </p>
              </div>

              {/* Conditional Fields */}
              {UserType !== "vendor" ? (
                <>
                  <div className="flex gap-4 w-full flex-row">
                    <div className=" w-full">
                      <CustomTextField
                        id="firstName"
                        label="First Name"
                        fieldType="text"
                        {...formik.getFieldProps("firstName")}
                      />
                      {formik.touched.firstName && formik.errors.firstName && (
                        <Box display="flex" alignItems="center" mt={1}>
                          <ErrorOutlineIcon
                            color="error"
                            sx={{ fontSize: 16, mr: 0.5 }}
                          />
                          <Typography variant="caption" color="error">
                            {formik.errors.firstName}
                          </Typography>
                        </Box>
                      )}
                    </div>

                    <div className="w-full">
                      <CustomTextField
                        id="lastName"
                        label="Last Name"
                        fieldType="text"
                        {...formik.getFieldProps("lastName")}
                      />
                      {formik.touched.lastName && formik.errors.lastName && (
                        <Box display="flex" alignItems="center" mt={1}>
                          <ErrorOutlineIcon
                            color="error"
                            sx={{ fontSize: 16, mr: 0.5 }}
                          />
                          <Typography variant="caption" color="error">
                            {formik.errors.lastName}
                          </Typography>
                        </Box>
                      )}
                    </div>
                  </div>
                  <div className="w-full">
                    <CustomTextField
                      id="studentId"
                      label="Student/Staff ID"
                      fieldType="text"
                      {...formik.getFieldProps("gucId")}
                    />
                    {formik.touched.gucId && formik.errors.gucId && (
                      <Box display="flex" alignItems="center" mt={1}>
                        <ErrorOutlineIcon
                          color="error"
                          sx={{ fontSize: 16, mr: 0.5 }}
                        />
                        <Typography variant="caption" color="error">
                          {formik.errors.gucId}
                        </Typography>
                      </Box>
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full">
                  <CustomTextField
                    id="companyName"
                    label="Company Name"
                    fieldType="text"
                    {...formik.getFieldProps("companyName")}
                  />
                  {formik.touched.companyName && formik.errors.companyName && (
                    <Box display="flex" alignItems="center" mt={1}>
                      <ErrorOutlineIcon
                        color="error"
                        sx={{ fontSize: 16, mr: 0.5 }}
                      />
                      <Typography variant="caption" color="error">
                        {formik.errors.companyName}
                      </Typography>
                    </Box>
                  )}
                </div>
              )}

              {/* Common Fields */}
              <div className="w-full">
                <CustomTextField
                  id="email"
                  label="Email"
                  fieldType="email"
                  stakeholderType={UserType as UserType}
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email && (
                  <Box display="flex" alignItems="center" mt={1}>
                    <ErrorOutlineIcon
                      color="error"
                      sx={{ fontSize: 16, mr: 0.5 }}
                    />
                    <Typography variant="caption" color="error">
                      {formik.errors.email}
                    </Typography>
                  </Box>
                )}
              </div>

              <div className="w-full">
                <CustomTextField
                  id="password"
                  label="Password"
                  fieldType="password"
                  {...formik.getFieldProps("password")}
                />
                {formik.touched.password && formik.errors.password && (
                  <Box display="flex" alignItems="center" mt={1}>
                    <ErrorOutlineIcon
                      color="error"
                      sx={{ fontSize: 16, mr: 0.5 }}
                    />
                    <Typography variant="caption" color="error">
                      {formik.errors.password}
                    </Typography>
                  </Box>
                )}
              </div>

              <div className="w-full">
                <CustomTextField
                  id="confirmPassword"
                  label="Confirm Password"
                  fieldType="password"
                  {...formik.getFieldProps("confirmPassword")}
                />
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <Box display="flex" alignItems="center" mt={1}>
                      <ErrorOutlineIcon
                        color="error"
                        sx={{ fontSize: 16, mr: 0.5 }}
                      />
                      <Typography variant="caption" color="error">
                        {formik.errors.confirmPassword}
                      </Typography>
                    </Box>
                  )}
              </div>
              {/* File Upload Field */}
              {UserType === "vendor" && (
                <div
                  className="flex items-start justify-between gap-10 flex-row w-full"
                  style={{ marginTop: "30px", marginBottom: "20px" }}
                >
                  {/* Tax Card Upload */}
                  <div className="flex flex-col w-full">
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mb: 1,
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      }}
                    >
                      <DescriptionIcon
                        sx={{
                          fontSize: 20,
                          color: theme.palette.primary.main,
                          marginRight: "5px",
                        }}
                      />
                      Company Tax Card:
                    </Typography>
                    <UploadField
                      label="Upload Tax Card"
                      accept=".pdf,image/*"
                      showPreviewAs="file"
                    />
                  </div>

                  {/* Company Logo Upload */}
                  <div className="flex flex-col w-full">
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mb: 1,
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      }}
                    >
                      <BusinessIcon
                        sx={{
                          fontSize: 20,
                          color: theme.palette.primary.main,
                          marginRight: "5px",
                        }}
                      />
                      Company Logo:
                    </Typography>
                    <UploadField
                      label="Upload Company Logo"
                      accept="image/*"
                      showPreviewAs="image"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="w-full mt-4">
                <div style={{ position: "relative", width: "100%" }}>
                  <CustomButton
                    type="submit"
                    variant="contained"
                    width="100%"
                    disableElevation
                    label={formik.isSubmitting ? "" : "Create account"}
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
                </div>
              </div>

              {/* Login Link */}
              <div className="mt-4 text-center">
                <p
                  className="text-sm"
                  style={{ color: theme.palette.text.primary }}
                >
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium hover:underline"
                    style={{ color: theme.palette.primary.main }}
                  >
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </NeumorphicBox>
        </form>
      )}
    </Formik>
  );
};

export default RegistrationForm;
