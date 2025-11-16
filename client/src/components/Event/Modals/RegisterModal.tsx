/* eslint-disable @typescript-eslint/no-explicit-any */
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

interface RegisterEventModalProps {
  userInfo: {firstName:string, lastName:string, email:string};
  open: boolean;
  onClose: () => void;
  eventType: string;
  eventId: string;
  color:string;
  paymentOpen:() => void;
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
  eventId,
  color,
  paymentOpen
}) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const name = (userInfo.firstName+" "+userInfo.lastName);

  const initialValues = {
    name: (userInfo.firstName+" "+userInfo.lastName),
    email:  userInfo.email
  };
 const handleCallApi = async (payload: any) => {
  try {
    setLoading(true);
    console.log("Payload being sent:", payload); 
    
    const res = await api.post(`/users/register/${eventId}`, payload);
    
    // Success case
    toast.success("You have registered for this event successfully!", {
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
    
    // Handle 409 Conflict (Already registered)
    if (err.response?.status === 409) {
      toast.error("You have already registered for this event!",
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
    } else {
      // Handle other errors
      toast.error(
        err.response?.data?.error || "Registration failed. Please try again.",
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
    }
    
    throw err; // Re-throw to handle in onSubmit
    
  } finally {
    setLoading(false);
  }
};

  const onSubmit = async (values: any, actions: any) => {
    const payload = {
      name: capitalizeName(String(values.name ?? ""), false),
      email: values.email,
    };
    paymentOpen();
    //await handleCallApi(payload); 

    actions.resetForm();
      setTimeout(() => {
           onClose()
     }, 400);
   
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
    >
      <form onSubmit={handleSubmit}>
        <Box sx={{ p: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "var(--font-jost), system-ui, sans-serif",
              fontWeight: 700,
              color: color,
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
                fieldType="name"
                placeholder={name}
                name="name"
                value={values.name}
                onChange={handleChange('name')}
                onBlur={handleBlur}
                neumorphicBox
                required
                fullWidth
                 sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: color, // Your variable name
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: color, // Your variable name
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: color, // Your variable name
                      '&.Mui-focused': {
                        color:color, // Your variable name
                      },
                    },
                  }}
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
                sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: color, // Your variable name
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: color, // Your variable name
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: color, // Your variable name
                      '&.Mui-focused': {
                        color:color, // Your variable name
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
              sx={{ width: "160px", height: "44px", color:color, borderColor:color}}
            />
            <CustomButton
              disabled={isSubmitting}
              label={isSubmitting ? "Registering" : "Register"}
              type="submit"
              variant="contained"
              color="primary"
               sx={{
                  width: "160px",
                  borderRadius: 999, backgroundColor: `${color}40`,
                  color: color, borderColor: color
                }}
            />
          </Box>
        </Box>
      </form>
    </CustomModalLayout>
  );
};

export default RegisterEventModal;