import React, { useState } from "react";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import { CustomTextField } from "@/components/shared/input-fields";
import { CustomModalLayout } from "@/components/shared/modals";
import { Typography, Box } from "@mui/material";
import { api } from "@/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { capitalizeName } from "@/components/shared/input-fields/utils";
import { toast } from "react-toastify";

interface EmailDevProps {
  bugreportId?: string;
  open: boolean;
  onClose: () => void;
  color:string;
}

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const EmailDevForm = ({bugreportId, open, onClose, color}: EmailDevProps) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);  
  
  const initialValues = {
    email:  ""
  };

  const handleCallApi = async (payload: any) => {
      try {
        setLoading(true);
        console.log("Payload being sent:", payload); 
        
        const res = await api.post(`/bugreports/send-email/` + bugreportId, payload);
        
        // Success case
        toast.success("Email sent successfully!", {
          position: "bottom-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        
        return res;
        
      } catch (err: any) {
        console.log("Registration error:", err);
        toast.error(
            err.response?.data?.error || "Failed to send email. Please try again.",
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
        setLoading(false);
      }
    };

    const onSubmit = async (values: any, actions: any) => {
        const payload = {
          recipientEmail: values.email,
        };
        await handleCallApi(payload);
        actions.resetForm();
        onClose();
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
      borderColor={color}
      title={`Email Developer`}
    >
      <form onSubmit={handleSubmit}>
        <Box sx={{ p: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <CustomTextField
              id={`email`}
              label="Email"
              fieldType="text"
              placeholder={"Enter developer's email"}
              name="email"
              value={values.email}
              onChange={handleChange('email')}
              onBlur={handleBlur}
              required
              neumorphicBox
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: color,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: color,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: color,
                  '&.Mui-focused': {
                    color:color,
                  },
                },
              }}
            />

            {errors.email && touched.email ? <p style={{color:"#db3030"}}>{errors.email}</p> : <></>}
          </Box>

          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}
          >
            <CustomButton
              label="Cancel"
              variant="outlined"
              onClick={onClose}
              sx={{color:color, borderColor:color,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
              },
              }}
              
            />
            <CustomButton
              disabled={isSubmitting}
              label={isSubmitting ? "Sending" : "Send"}
              type="submit"
              variant="contained"
              color="primary"
             sx={{
                      borderRadius: 999,
                      border: `1px solid ${color}`,
                      backgroundColor: `${color}`,
                       color: "background.default",
                      fontWeight: 600,
                      px: 3,
                      textTransform: "none",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                      },
                    }}
            />
          </Box>
        </Box>
      </form>
    </CustomModalLayout>
  )
}

export default EmailDevForm
