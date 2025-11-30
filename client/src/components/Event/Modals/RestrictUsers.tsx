import React , {useState, useEffect}from "react";
import {api} from "../../../api";
import { CustomModalLayout } from "@/components/shared/modals";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import CustomCheckboxGroup from "@/components/shared/input-fields/CustomCheckboxGroup";
import { Box, Typography, useTheme, lighten } from "@mui/material";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

interface RestrictUsersProps {
  eventId?: string;
  eventName?: string;
  eventType: string;
  open: boolean;
  allowedUsers?: string[];
  onClose: () => void;
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
}

const RestrictUsers: React.FC<RestrictUsersProps> = ({
  eventId,
  eventName,
  eventType,
  open,
  allowedUsers,
  onClose,
  setRefresh,
}) => {
   const theme = useTheme();
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const tertiary = (theme.palette as unknown as { tertiary?: { main?: string } }).tertiary;
   const baseBorderColor = tertiary?.main ?? theme.palette.primary.main;
   
   let accentColor = baseBorderColor;
   try {
     accentColor = lighten(String(baseBorderColor), 0.35);
   } catch {
     // keep baseBorderColor if lighten isn't applicable
   }

   const handleCallApi = async (payload:any) => {
          setLoading(true);
          setError(null);
          try {
          const res = await api.patch("/events/" + eventId, payload);
           // Success case
          toast.success("Event Updated Successfully", {
            position: "bottom-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          if (setRefresh) setRefresh((p) => !p);
          } catch (err: any) {
          setError(err?.message || "API call failed");
          toast.error(err?.response?.data?.error || err?.response?.data?.message ||"Updating Allowed Users Failed",
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

  // new allowed users values and order
  const options = [
    { label: "staff", value: "staff" },
    { label: "TA", value: "TA" },
    { label: "professor", value: "professor" },
    { label: "student", value: "student" },
  ];

  // Initialize formik with allowedUsers from props if available, otherwise all options
  const formik = useFormik({
    initialValues: { 
      allowedUsers: (allowedUsers && allowedUsers.length > 0) 
        ? allowedUsers 
        : options.map(o => o.value) as string[] 
    },
    validationSchema: Yup.object({
      allowedUsers: Yup.array()
        .test(
          "not-all-restricted",
          "allowedUsers is invalid — you cannot restrict all users",
          function (value) {
            return value && value.length > 0;
          }
        )
    }),
    onSubmit: async (values) => {
      // call API with the allowedUsers array (server expects allowedUsers)
      await handleCallApi({ allowedUsers: values.allowedUsers , type: eventType });
      onClose();
    },
  });

  // Update formik values when allowedUsers prop changes
  useEffect(() => {
    if (allowedUsers && allowedUsers.length > 0) {
      formik.setFieldValue("allowedUsers", allowedUsers);
    }
  }, [allowedUsers]);

  // Flip logic: CustomCheckboxGroup 'selected' will represent the items the user CHOSE TO REMOVE.
  // So checked state passed to the checkbox group is the inverse of allowedUsers.
  const checkedValuesForComponent = options
    .filter(o => !formik.values.allowedUsers.includes(o.value))
    .map(o => o.value);

  const handleCheckboxChange = (selectedValues: string[]) => {
    // selectedValues are the ones chosen by the user to REMOVE
    const newAllowed = options
      .map(o => o.value)
      .filter(v => !selectedValues.includes(v));
    formik.setFieldValue("allowedUsers", newAllowed);
  };

  return (
    <CustomModalLayout 
      title={`Restrict Users for ${eventName ?? ""}`} 
      open={open} 
      onClose={onClose} 
      width='w-[95vw] md:w-[80vw] lg:w-[70vw] xl:w-[50vw]'
    >
      <Box sx={{ px: 4, py: 3 }}>
        {/* Styled Header similar to CustomModalLayout */}
        <Box sx={{ mt: 3 }}>
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Typography
              variant="h6"
              sx={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#1a1a1a',
                fontFamily: 'var(--font-jost), system-ui, sans-serif',
                letterSpacing: '0.02em',
                paddingBottom: '8px',
              }}
            >
              <Box component="span" sx={{ color: '#1a1a1a' }}>
                Select which users to restrict from viewing this {eventType}
              </Box>
            </Typography>
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '3px',
                width: '40%',
                background: `linear-gradient(135deg, grey, grey)`,
                borderRadius: '2px',
                transition: 'width 0.3s ease-in-out',
                '&:hover': {
                  width: '100%',
                },
              }}
            />
          </Box>
        </Box>
        <Box sx={{ mb: 5 }}>
          {/* CustomCheckboxGroup expects selected values; we pass the inverted checkedValuesForComponent */}
          <CustomCheckboxGroup
            key={formik.values.allowedUsers.join(",")}
            label=""
            options={options.map((o) => ({ ...o, checked: checkedValuesForComponent.includes(o.value) }))}
            onChange={(newSelected: string[]) => handleCheckboxChange(newSelected)}
            helperText={formik.touched.allowedUsers && formik.errors.allowedUsers ? String(formik.errors.allowedUsers) : undefined}
            error={Boolean(formik.touched.allowedUsers && formik.errors.allowedUsers)}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, pt: 2 }}>
          <CustomButton
            label="Submit"
            variant="contained"
            onClick={() => formik.handleSubmit()}
            sx={{ width: 160, height: 44 }}
            disabled={loading}
          />
          <CustomButton
            label="Cancel"
            variant="outlined"
            onClick={onClose}
            sx={{ width: 160, height: 44 }}
          />
        </Box>
      </Box>
    </CustomModalLayout>
  );
};

export default RestrictUsers;
