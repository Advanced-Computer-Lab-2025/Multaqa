/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import { CustomTextField } from "@/components/shared/input-fields";
import { CustomModalLayout } from "@/components/shared/modals";
import theme from "@/themes/lightTheme";
import { Typography, Box } from "@mui/material";
import { api } from "@/api";
import { useFormik } from "formik";
import * as Yup from "yup";

interface RegisterEventModalProps {
  userInfo: { id: string; name: string; email: string };
  open: boolean;
  onClose: () => void;
  eventType: string;
  isReady: boolean;
  eventId: string;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be 50 characters or less")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const RegisterEventModal: React.FC<RegisterEventModalProps> = ({
  userInfo,
  open,
  onClose,
  eventType,
  isReady,
  eventId,
}) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const initialValues = {
    name: isReady ? userInfo.name : "",
    email: isReady ? userInfo.email : "",
  };

  const handleCallApi = async (payload: any) => {
    try {
      console.log("Payload being sent:", payload); // ✅ Debug payload
      const res = await api.post(
        `/users/${userInfo.id}/register/${eventId}`,
        payload
      );
    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        // Specific handling for 404
        window.alert("You already registered for this event");
      } else {
        // Generic error message
        setError(err?.message || "API call failed");
      }
    } finally {
      setLoading(false);
    }
  };
  const onSubmit = async (values: any, actions: any) => {
    onClose();
    const payload = {
      name: values.name,
      email: values.email,
    };
    actions.resetForm();
    await handleCallApi(payload); // ✅ Await the API call
  };
  const {
    handleSubmit,
    values,
    isSubmitting,
    handleChange,
    handleBlur,
    setFieldValue,
    errors,
    touched,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: onSubmit,
  });

  return (
    <CustomModalLayout
      open={open}
      onClose={onClose}
      width="w-[90vw] sm:w-[80vw] md:w-[600px]"
      borderColor={theme.palette.primary.main}
    >
      <form onSubmit={handleSubmit}>
        <Box sx={{ p: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "var(--font-jost), system-ui, sans-serif",
              fontWeight: 700,
              color: theme.palette.primary.main,
              textAlign: "center",
              mb: 3,
            }}
          >
            {`Register for ${eventType}`}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                 <CustomTextField
                id={`name-${eventId}`}
                label="Name"
                fieldType="text"
                placeholder={userInfo.name}
                name="name"
                value={values.name}
                onChange={handleChange('name')}
                onBlur={handleBlur}
                neumorphicBox
                required
                fullWidth
              />

               {errors.name && touched.name ? <p style={{color:"#db3030"}}>{errors.name}</p> : <></>}

              <CustomTextField
                id={`email-${eventId}`}
                label="Email"
                fieldType="text"
                placeholder={userInfo.email}
                name="email"
                value={values.email}
                onChange={handleChange('email')}
                onBlur={handleBlur}
                required
                neumorphicBox
                fullWidth
              />

              {errors.email && touched.email ? <p style={{color:"#db3030"}}>{errors.email}</p> : <></>}

          </Box>

          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}
          >
            <CustomButton
              label="Cancel"
              variant="outlined"
              color="primary"
              onClick={onClose}
              sx={{ width: "160px", height: "44px" }}
            />
            <CustomButton
              disabled={isSubmitting}
              label={isSubmitting ? "Registering" : "Register"}
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                width: "160px",
                height: "44px",
                fontWeight: 700,
              }}
            />
          </Box>
        </Box>
      </form>
    </CustomModalLayout>
  );
};

export default RegisterEventModal;
