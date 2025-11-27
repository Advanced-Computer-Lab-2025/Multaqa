import React from "react";
import { Formik } from "formik";
import { CustomTextField } from "../input-fields";
import CustomButton from "../Buttons/CustomButton";
import { Box, Typography, CircularProgress } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "@/i18n/navigation";
import {
  handleLoginSubmit,
  getRedirectPath,
  getValidationSchema,
} from "./utils";

const LoginForm: React.FC = () => {
  const theme = useTheme();
  const { login } = useAuth();
  const router = useRouter();
  const initialValues = {
    email: "",
    password: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getValidationSchema()}
      onSubmit={(values, formikBag) =>
        handleLoginSubmit(values, formikBag, login, router, getRedirectPath)
      }
    >
      {(formik) => (
        <form onSubmit={formik.handleSubmit}>
          <Box
            sx={{
              width: "100%",
              maxWidth: "550px",
              mx: "auto",
              px: { xs: 2, sm: 3 },
              py: { xs: 3, sm: 4 },
            }}
          >
            <Box>
              <div className="flex flex-col items-center justify-center gap-10">
                {/* Header */}
                <div className="text-center mb-6">
                  <h1
                    className={"text-4xl" + " font-bold"}
                    style={{ color: theme.palette.text.primary }}
                  >
                    Log in to your account to continue
                  </h1>
                </div>

                {/* Common Fields */}
                <div className="w-full">
                  <CustomTextField
                    id="email"
                    label="Email"
                    fieldType="email"
                    neumorphicBox
                    stakeholderType={"vendor"} //to always render the normal email field
                    onChange={(e) => {
                      formik.setFieldValue("email", e.target.value);
                    }}
                    onBlur={() => {
                      formik.setFieldTouched("email", true);
                    }}
                    name={""}
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
                    neumorphicBox
                    onChange={(e) => {
                      formik.setFieldValue("password", e.target.value);
                    }}
                    onBlur={() => {
                      formik.setFieldTouched("password", true);
                    }}
                    name={""}
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

                {/* Submit Button */}
                <div className="w-full mt-4">
                  <div style={{ position: "relative", width: "100%" }}>
                    <CustomButton
                      type="submit"
                      variant="contained"
                      width="100%"
                      disableElevation
                      label={formik.isSubmitting ? "" : "Login"}
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
              </div>
            </Box>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default LoginForm;
