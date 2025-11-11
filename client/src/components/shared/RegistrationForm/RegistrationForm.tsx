import React from "react";
import { Formik } from "formik";
import { RegistrationFormProps } from "./types";
import {
  getValidationSchema,
  createDocumentHandler,
  createRetryHandler,
} from "./utils";
import NeumorphicBox from "../containers/NeumorphicBox";
import { CustomTextField } from "../input-fields";
import CustomButton from "../Buttons/CustomButton";
import { Link } from "@/i18n/navigation";
import { Box, Typography, CircularProgress } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useTheme } from "@mui/material/styles";
import { FileUpload } from "../FileUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { SignupResponse } from "../../../../../backend/interfaces/responses/authResponses.interface";
import { useState } from "react";
import type { UploadStatus } from "../FileUpload/types";
import { Button } from "@mui/material";
import { IFileInfo } from "../../../../../backend/interfaces/fileData.interface";

const RegistrationForm: React.FC<RegistrationFormProps> = ({ UserType }) => {
  const theme = useTheme();
  const { signup } = useAuth();
  const [taxCardStatus, setTaxCardStatus] = useState<UploadStatus>("idle");
  const [logoStatus, setLogoStatus] = useState<UploadStatus>("idle");
  const [currentTaxCardFile, setCurrentTaxCardFile] = useState<File | null>(
    null
  );
  const [currentLogoFile, setCurrentLogoFile] = useState<File | null>(null);

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRegistration = async (data: any) => {
    const result = await signup(data);
    return result as unknown as SignupResponse;
  };
  interface StudentSignupData {
    type: "studentOrStaff";
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    gucId: string;
  }
  
  interface VendorSignupData {
    type: "vendor";
    companyName: string;
    email: string;
    password: string;
    taxCard: IFileInfo | null; 
    logo: IFileInfo | null; 
  }
type SignupData = StudentSignupData | VendorSignupData;

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
          taxCard: null,
          logo: null,
        };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getValidationSchema(UserType)}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          // Prepare data for signup based on user type
          const signupData: SignupData =
            UserType !== "vendor"
              ? ({
                  firstName: values.firstName as string,
                  lastName: values.lastName as string,
                  email: values.email,
                  password: values.password,
                  gucId: values.gucId as string,
                  type: "studentOrStaff",
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any)
              : ({
                  companyName: values.companyName as string,
                  email: values.email,
                  password: values.password,
                  taxCard: taxCardStatus === "success" ? values.taxCard : null,
                  logo: logoStatus === "success" ? values.logo : null,
                  type: "vendor",
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any);

          await handleRegistration(signupData);

          resetForm();

          toast.success(
            "Registration successful! Please check your email for verification.",
            {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            }
          );

          //eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          const message =
            error?.response?.data?.error ||
            error?.message ||
            "Something went wrong. Please try again.";

          toast.error(message, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {(formik) => (
        <form onSubmit={formik.handleSubmit}>
          <NeumorphicBox
            containerType="outwards"
            padding="1px"
            margin="20px"
            width="700px"
            borderRadius="20px"
          >
            <Box sx={{ position: "relative" }}>
              <Link
                href="/"
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "16px",
                  textDecoration: "none",
                  color: theme.palette.primary.main,
                  cursor: "pointer",
                  zIndex: 10,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                  borderRadius: "50%",
                  transition: "background-color 0.2s ease",
                }}
              >
                <ArrowBackIcon
                  fontSize="large"
                  sx={{
                    "&:hover": {
                      color: theme.palette.primary.dark,
                    },
                  }}
                />
              </Link>
            </Box>
            <Box
              sx={{
                border: `2px solid ${theme.palette.primary.main}`,
                borderRadius: "20px",
                padding: "30px",
              }}
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
                          name="firstName"
                          id="firstName"
                          label="First Name"
                          fieldType="text"
                          onChange={(e) => {
                            formik.setFieldValue("firstName", e.target.value);
                          }}
                          onBlur={() => {
                            formik.setFieldTouched("firstName", true);
                          }}
                        />
                        {formik.touched.firstName &&
                          formik.errors.firstName && (
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
                          name="lastName"
                          id="lastName"
                          label="Last Name"
                          fieldType="text"
                          onChange={(e) => {
                            formik.setFieldValue("lastName", e.target.value);
                          }}
                          onBlur={() => {
                            formik.setFieldTouched("lastName", true);
                          }}
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
                        name="gucId"
                        id="gucId"
                        label="Student/Staff ID"
                        fieldType="text"
                        onChange={(e) => {
                          formik.setFieldValue("gucId", e.target.value);
                        }}
                        onBlur={() => {
                          formik.setFieldTouched("gucId", true);
                        }}
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
                      name="companyName"
                      id="companyName"
                      label="Company Name"
                      fieldType="text"
                      onChange={(e) => {
                        formik.setFieldValue("companyName", e.target.value);
                      }}
                      onBlur={() => {
                        formik.setFieldTouched("companyName", true);
                      }}
                    />
                    {formik.touched.companyName &&
                      formik.errors.companyName && (
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
                    name="email"
                    id="email"
                    label="Email"
                    fieldType="email"
                    stakeholderType="vendor"
                    onChange={(e) => {
                      formik.setFieldValue("email", e.target.value);
                    }}
                    onBlur={() => {
                      formik.setFieldTouched("email", true);
                    }}
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
                    name="password"
                    id="password"
                    label="Password"
                    fieldType="password"
                    onChange={(e) => {
                      formik.setFieldValue("password", e.target.value);
                    }}
                    onBlur={() => {
                      formik.setFieldTouched("password", true);
                    }}
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
                    name="confirmPassword"
                    id="confirmPassword"
                    label="Confirm Password"
                    fieldType="password"
                    onChange={(e) => {
                      formik.setFieldValue("confirmPassword", e.target.value);
                    }}
                    onBlur={() => {
                      formik.setFieldTouched("confirmPassword", true);
                    }}
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
                    <div className="flex flex-col w-full">
                      <FileUpload
                        label="Upload Tax Card"
                        accept=".pdf,.doc,.docx,image/*"
                        variant="tax-card"
                        uploadStatus={taxCardStatus}
                        onFileSelected={createDocumentHandler(
                          setCurrentTaxCardFile,
                          setTaxCardStatus,
                          formik.setFieldValue,
                          "taxCard",
                          formik
                        )}
                        width={300}
                      />
                      {formik.touched.taxCard && formik.errors.taxCard && (
                        <Box display="flex" alignItems="center" mt={1}>
                          <ErrorOutlineIcon
                            color="error"
                            sx={{ fontSize: 16, mr: 0.5 }}
                          />
                          <Typography variant="caption" color="error">
                            {formik.errors.taxCard}
                          </Typography>
                        </Box>
                      )}
                      {taxCardStatus === "error" && (
                        <Button
                          onClick={createRetryHandler(
                            currentTaxCardFile,
                            createDocumentHandler(
                              setCurrentTaxCardFile,
                              setTaxCardStatus,
                              formik.setFieldValue,
                              "taxCard",
                              formik
                            )
                          )}
                          variant="outlined"
                          color="error"
                          sx={{ mt: 2 }}
                        >
                          Retry Upload
                        </Button>
                      )}
                    </div>

                    <div className="flex flex-col w-full">
                      <FileUpload
                        label="Upload Company Logo"
                        accept="image/*,.pdf,.doc,.docx"
                        variant="logo"
                        uploadStatus={logoStatus}
                        onFileSelected={createDocumentHandler(
                          setCurrentLogoFile,
                          setLogoStatus,
                          formik.setFieldValue,
                          "logo",
                          formik
                        )}
                        width={300}
                      />
                      {formik.touched.logo && formik.errors.logo && (
                        <Box display="flex" alignItems="center" mt={1}>
                          <ErrorOutlineIcon
                            color="error"
                            sx={{ fontSize: 16, mr: 0.5 }}
                          />
                          <Typography variant="caption" color="error">
                            {formik.errors.logo}
                          </Typography>
                        </Box>
                      )}
                      {logoStatus === "error" && (
                        <Button
                          onClick={createRetryHandler(
                            currentLogoFile,
                            createDocumentHandler(
                              setCurrentLogoFile,
                              setLogoStatus,
                              formik.setFieldValue,
                              "logo",
                              formik
                            )
                          )}
                          variant="outlined"
                          color="error"
                          sx={{ mt: 2 }}
                        >
                          Retry Upload
                        </Button>
                      )}
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

                {/* Error messages are now shown via toast notifications */}

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
            </Box>
          </NeumorphicBox>
        </form>
      )}
    </Formik>
  );
};

export default RegistrationForm;
