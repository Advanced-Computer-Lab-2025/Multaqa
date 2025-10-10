import React from "react";
import { Formik } from "formik";
import NeumorphicBox from "../containers/NeumorphicBox";
import { CustomTextField } from "../input-fields";
import CustomButton from "../Buttons/CustomButton";
import Link from "next/link";
import { Box, Typography, CircularProgress } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useTheme } from "@mui/material/styles";
import * as Yup from "yup";
import { api } from "../../../api";
import { useCallback } from "react";
import { LoginResponse } from "../../../../../backend/interfaces/responses/authResponses.interface";

const LoginForm: React.FC = () => {
  const theme = useTheme();

  const initialValues = {
          email: "",
          password: "",    
  }
  
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const res = await api.post<{ data: LoginResponse }>("/auth/login", { email, password });
    //DO NOT use local storage
    localStorage.setItem("token", res.data.accessToken);
    //TODO
    // redirect to home page
    //error handling
    console.log(res.data.user);
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        email: Yup.string()
          .email("Please enter a valid email address.")
          .required("Please enter your email address."),
        password: Yup.string().required("Please enter your password."),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          setSubmitting(false);
        }, 400);
        login(values.email, values.password);
      }}
    >
      {(formik) => (
        <form onSubmit={formik.handleSubmit}>
          <NeumorphicBox
            containerType="outwards"
            padding="30px"
            margin="20px"
            width="550px"
            borderRadius="20px"
          >
            <div className="flex flex-col items-center justify-center gap-10">
              {/* Header */}
              <div className="text-center mb-6">
                <h1
                  className="text-4xl font-bold"
                  style={{ color: theme.palette.text.primary }}
                >
                  Multaqa
                </h1>
                <p style={{ color: theme.palette.text.secondary }}>
                  Log in to your account to continue
                </p>
              </div>

              {/* Common Fields */}
              <div className="w-full">
                <CustomTextField
                  id="email"
                  label="Email"
                  fieldType="email"
                  neumorphicBox
                  stakeholderType={"vendor"} //to always render the normal email field
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
                  neumorphicBox
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

              {/* Login Link */}
              <div className="mt-4 text-center">
                <p
                  className="text-sm"
                  style={{ color: theme.palette.text.primary }}
                >
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-medium hover:underline"
                    style={{ color: theme.palette.primary.main }}
                  >
                    Create an account
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

export default LoginForm;
