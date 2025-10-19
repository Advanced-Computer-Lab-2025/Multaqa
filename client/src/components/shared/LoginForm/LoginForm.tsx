import React from "react";
import { Formik } from "formik";
import NeumorphicBox from "../containers/NeumorphicBox";
import { CustomTextField } from "../input-fields";
import CustomButton from "../Buttons/CustomButton";
import { Link } from "@/i18n/navigation";
import { Box, Typography, CircularProgress } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles";
import * as Yup from "yup";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { useRouter } from "@/i18n/navigation";

const LoginForm: React.FC = () => {
  const theme = useTheme();
  const { login, user } = useAuth();
  const router = useRouter();

  const initialValues = {
    email: "",
    password: "",
  };

  // Function to determine where to redirect based on user role
  const getRedirectPath = (role: string) => {
    console.log("User role for redirection:", role);
    console.log(typeof role);
    switch (role) {
      case "admin":
        return `/admin/users`;
      case "student":
        return `/student`;
      case "staff":
        return `/staff`;
      case "ta":
        return `/ta/`;
      case "professor":
        return `/professor`;
      case "events-office":
        return `/events-office`;
      case "vendor":
        return `/vendor/opportunities/available`;
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        email: Yup.string()
          .email("Please enter a valid email address.")
          .required("Please enter your email address."),
        password: Yup.string().required("Please enter your password."),
      })}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          const response = await login(values);
          resetForm();

          // Get user info from login response
          const userRole = response?.user?.role;

          toast.success("Login successful! Redirecting...", {
            position: "bottom-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });

          // Short delay for toast to be visible before redirect
          setTimeout(() => {
            const redirectPath = getRedirectPath(String(userRole));
            console.log("Redirecting to:", redirectPath);
            router.push(redirectPath!);
          }, 1500);
        } catch (err) {
          console.error("Login error:", err);
          toast.error(
            err instanceof Error
              ? err.message
              : "Login failed. Please check your credentials.",
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
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {(formik) => (
        <form onSubmit={formik.handleSubmit}>
          <NeumorphicBox
            containerType="outwards"
            width={"550px"}
            borderRadius="20px"
            padding={"1px"}
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
              <div className="flex flex-col items-center justify-center gap-10">
                {/* Header */}
                <div className="text-center mb-6">
                  <h1
                    className={"text-4xl" + " font-bold"}
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
                    onChange={(e) => {
                      formik.setFieldValue("email", e.target.value);
                    } }
                    onBlur={() => {
                      formik.setFieldTouched("email", true);
                    } } name={""}                  />
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
                    } }
                    onBlur={() => {
                      formik.setFieldTouched("password", true);
                    } } name={""}                  />
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
            </Box>
          </NeumorphicBox>
        </form>
      )}
    </Formik>
  );
};

export default LoginForm;
