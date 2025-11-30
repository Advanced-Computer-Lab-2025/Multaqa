import React, { useState } from "react";
import { Formik } from "formik";
import { RegistrationFormProps } from "./types";
import {
  getValidationSchema,
  createDocumentHandler,
  createRetryHandler,
} from "./utils";
import { CustomTextField } from "../input-fields";
import CustomButton from "../Buttons/CustomButton";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Stack,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useTheme } from "@mui/material/styles";
import { FileUpload } from "../FileUpload";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import type { UploadStatus } from "../FileUpload/types";
import { IFileInfo } from "../../../../../backend/interfaces/fileData.interface";
import { capitalizeName } from "../input-fields/utils";
import { useRouter } from "@/i18n/navigation";

const RegistrationForm: React.FC<RegistrationFormProps> = ({ UserType }) => {
  const theme = useTheme();
  const { signup } = useAuth();
  const router = useRouter();
  const [taxCardStatus, setTaxCardStatus] = useState<UploadStatus>("idle");
  const [logoStatus, setLogoStatus] = useState<UploadStatus>("idle");
  const [currentTaxCardFile, setCurrentTaxCardFile] = useState<File | null>(
    null
  );
  const [currentLogoFile, setCurrentLogoFile] = useState<File | null>(null);

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
      onSubmit={async (values, { setSubmitting }) => {
        try {
          let signupData: SignupData;

          if (UserType !== "vendor") {
            const firstName = capitalizeName(
              String(values.firstName ?? ""),
              false
            );
            const lastName = capitalizeName(
              String(values.lastName ?? ""),
              false
            );

            signupData = {
              firstName,
              lastName,
              email: values.email,
              password: values.password,
              gucId: String(values.gucId ?? ""),
              type: "studentOrStaff",
            } as SignupData;
          } else {
            const companyName = capitalizeName(
              String(values.companyName ?? ""),
              false
            );

            signupData = {
              companyName,
              email: values.email,
              password: values.password,
              taxCard: taxCardStatus === "success" ? values.taxCard : null,
              logo: logoStatus === "success" ? values.logo : null,
              type: "vendor",
            } as SignupData;
          }

          await signup(signupData);
          const message =
            UserType !== "vendor"
              ? "Registration successful! Please wait for your verification email."
              : "Registration successful! redirecting to login page...";

          toast.success(message, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          if (UserType === "vendor") {
            router.replace("/login");
          }
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
          <Box
            sx={{
              width: "100%",
              maxWidth: "600px",
              mx: "auto",
              px: { xs: 3, sm: 5 },
              py: { xs: 4, sm: 3 },
            }}
          >
            <Stack spacing={4}>
              {/* Header */}
              <Box textAlign="center" mb={2}>
                <h1
                  className={"text-2xl" + " font-bold"}
                  style={{ color: theme.palette.text.primary }}
                >
                  Create your account to get started
                </h1>
              </Box>

              <Stack spacing={4}>
                {/* Conditional Fields */}
                {UserType !== "vendor" ? (
                  <>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                      <Box width="100%">
                        <CustomTextField
                          name="firstName"
                          id="firstName"
                          label="First Name"
                          fieldType="name"
                          onChange={(e) =>
                            formik.setFieldValue("firstName", e.target.value)
                          }
                          onBlur={() =>
                            formik.setFieldTouched("firstName", true)
                          }
                          neumorphicBox
                        />
                        {formik.touched.firstName &&
                          formik.errors.firstName && (
                            <Stack direction="row" alignItems="center" mt={0.5}>
                              <ErrorOutlineIcon
                                color="error"
                                sx={{ fontSize: 16, mr: 0.5 }}
                              />
                              <Typography variant="caption" color="error">
                                {formik.errors.firstName}
                              </Typography>
                            </Stack>
                          )}
                      </Box>

                      <Box width="100%">
                        <CustomTextField
                          name="lastName"
                          id="lastName"
                          label="Last Name"
                          fieldType="name"
                          onChange={(e) =>
                            formik.setFieldValue("lastName", e.target.value)
                          }
                          onBlur={() =>
                            formik.setFieldTouched("lastName", true)
                          }
                          neumorphicBox
                        />
                        {formik.touched.lastName && formik.errors.lastName && (
                          <Stack direction="row" alignItems="center" mt={0.5}>
                            <ErrorOutlineIcon
                              color="error"
                              sx={{ fontSize: 16, mr: 0.5 }}
                            />
                            <Typography variant="caption" color="error">
                              {formik.errors.lastName}
                            </Typography>
                          </Stack>
                        )}
                      </Box>
                    </Stack>

                    <Box width="100%">
                      <CustomTextField
                        name="gucId"
                        id="gucId"
                        label="Student/Staff ID"
                        fieldType="text"
                        onChange={(e) =>
                          formik.setFieldValue("gucId", e.target.value)
                        }
                        onBlur={() => formik.setFieldTouched("gucId", true)}
                        neumorphicBox
                      />
                      {formik.touched.gucId && formik.errors.gucId && (
                        <Stack direction="row" alignItems="center" mt={0.5}>
                          <ErrorOutlineIcon
                            color="error"
                            sx={{ fontSize: 16, mr: 0.5 }}
                          />
                          <Typography variant="caption" color="error">
                            {formik.errors.gucId}
                          </Typography>
                        </Stack>
                      )}
                    </Box>
                  </>
                ) : (
                  <Box width="100%">
                    <CustomTextField
                      name="companyName"
                      id="companyName"
                      label="Company Name"
                      fieldType="text"
                      onChange={(e) =>
                        formik.setFieldValue("companyName", e.target.value)
                      }
                      onBlur={() => formik.setFieldTouched("companyName", true)}
                      neumorphicBox
                    />
                    {formik.touched.companyName &&
                      formik.errors.companyName && (
                        <Stack direction="row" alignItems="center" mt={0.5}>
                          <ErrorOutlineIcon
                            color="error"
                            sx={{ fontSize: 16, mr: 0.5 }}
                          />
                          <Typography variant="caption" color="error">
                            {formik.errors.companyName}
                          </Typography>
                        </Stack>
                      )}
                  </Box>
                )}

                {/* Common Fields */}
                <Box width="100%">
                  <CustomTextField
                    name="email"
                    id="email"
                    label="Email"
                    fieldType="email"
                    stakeholderType="vendor"
                    onChange={(e) =>
                      formik.setFieldValue("email", e.target.value)
                    }
                    onBlur={() => formik.setFieldTouched("email", true)}
                    neumorphicBox
                  />
                  {formik.touched.email && formik.errors.email && (
                    <Stack direction="row" alignItems="center" mt={0.5}>
                      <ErrorOutlineIcon
                        color="error"
                        sx={{ fontSize: 16, mr: 0.5 }}
                      />
                      <Typography variant="caption" color="error">
                        {formik.errors.email}
                      </Typography>
                    </Stack>
                  )}
                </Box>

                <Box width="100%">
                  <CustomTextField
                    name="password"
                    id="password"
                    label="Password"
                    fieldType="password"
                    onChange={(e) =>
                      formik.setFieldValue("password", e.target.value)
                    }
                    onBlur={() => formik.setFieldTouched("password", true)}
                    neumorphicBox
                  />
                  {formik.touched.password && formik.errors.password && (
                    <Stack direction="row" alignItems="center" mt={0.5}>
                      <ErrorOutlineIcon
                        color="error"
                        sx={{ fontSize: 16, mr: 0.5 }}
                      />
                      <Typography variant="caption" color="error">
                        {formik.errors.password}
                      </Typography>
                    </Stack>
                  )}
                </Box>

                <Box width="100%">
                  <CustomTextField
                    name="confirmPassword"
                    id="confirmPassword"
                    label="Confirm Password"
                    fieldType="password"
                    onChange={(e) =>
                      formik.setFieldValue("confirmPassword", e.target.value)
                    }
                    onBlur={() =>
                      formik.setFieldTouched("confirmPassword", true)
                    }
                    neumorphicBox
                  />
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <Stack direction="row" alignItems="center" mt={0.5}>
                        <ErrorOutlineIcon
                          color="error"
                          sx={{ fontSize: 16, mr: 0.5 }}
                        />
                        <Typography variant="caption" color="error">
                          {formik.errors.confirmPassword}
                        </Typography>
                      </Stack>
                    )}
                </Box>

                {/* File Upload Field */}
                {UserType === "vendor" && (
                  <Box
                    sx={{
                      mt: 8,
                      width: "100%",
                    }}
                  >
                    <Stack direction="row" spacing={4} alignItems="flex-start">
                      {/* Tax Card Column */}
                      <Box flex={1}>
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
                          width={"100%"}
                        />
                        {formik.touched.taxCard && formik.errors.taxCard && (
                          <Stack direction="row" alignItems="center" mt={0.5}>
                            <ErrorOutlineIcon
                              color="error"
                              sx={{ fontSize: 14, mr: 0.5 }}
                            />
                            <Typography variant="caption" color="error">
                              {formik.errors.taxCard}
                            </Typography>
                          </Stack>
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
                            size="small"
                            sx={{ mt: 1, fontSize: "0.75rem", py: 0.2 }}
                          >
                            Retry
                          </Button>
                        )}
                      </Box>

                      {/* Logo Column */}
                      <Box flex={1}>
                        <FileUpload
                          label="Upload Logo"
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
                          width={"100%"}
                        />
                        {formik.touched.logo && formik.errors.logo && (
                          <Stack direction="row" alignItems="center" mt={0.5}>
                            <ErrorOutlineIcon
                              color="error"
                              sx={{ fontSize: 14, mr: 0.5 }}
                            />
                            <Typography variant="caption" color="error">
                              {formik.errors.logo}
                            </Typography>
                          </Stack>
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
                            size="small"
                            sx={{ mt: 1, fontSize: "0.75rem", py: 0.2 }}
                          >
                            Retry
                          </Button>
                        )}
                      </Box>
                    </Stack>
                  </Box>
                )}
              </Stack>

              {/* Submit Button - Increased margin to 4 */}
              <Box sx={{ position: "relative" }}>
                <CustomButton
                  type="submit"
                  variant="contained"
                  width="100%"
                  disableElevation
                  label={formik.isSubmitting ? "" : "Create account"}
                  disabled={formik.isSubmitting}
                />
                {formik.isSubmitting && (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      pointerEvents: "none",
                    }}
                  >
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  </Box>
                )}
              </Box>
            </Stack>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default RegistrationForm;
