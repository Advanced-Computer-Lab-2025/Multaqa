import React , {useState}from "react";
import {api} from "../../../api";
import { CustomModalLayout } from "@/components/shared/modals";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import CustomCheckboxGroup from "@/components/shared/input-fields/CustomCheckboxGroup";
import { Box, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

interface RestrictUsersProps {
  eventId?: string;
  eventName?: string;
  eventType: string;
  open: boolean;
  onClose: () => void;
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
}

const RestrictUsers: React.FC<RestrictUsersProps> = ({
  eventId,
  eventName,
  eventType,
  open,
  onClose,
  setRefresh,
}) => {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

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
          toast.error(err?.message || "Updating Allowed Users Failed",
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
    { label: "vendor", value: "vendor" },
    { label: "administration", value: "administration" },
  ];

  // start with ALL options allowed so checkboxes are NOT checked in the UI (flip logic)
  const formik = useFormik({
    initialValues: { allowedUsers: options.map(o => o.value) as string[] },
    onSubmit: async (values) => {
      // call API with the allowedUsers array (server expects allowedUsers)
      // await handleCallApi({ allowedUsers: values.allowedUsers , type: eventType });
      // optional alert and close as before
      alert(JSON.stringify(values.allowedUsers) + eventType);
      onClose();
    },
  });

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
    <CustomModalLayout open={open} onClose={onClose} width='w-[95vw] md:w-[80vw] lg:w-[70vw] xl:w-[45vw]'>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }} color="primary.dark" className="text-center">
          {`Restrict Users for ${eventName ?? ""}`}
      </Typography>
      <Box sx={{ p: 3, width: { xs: "90vw", sm: 560 } }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 , borderBottom:"2px solid #E0E0E0", pb:1}}>
          <Typography variant="body1" sx={{ fontWeight: 600 , mr:2}}>
            Select which users to restrict from viewing this {eventType}:
          </Typography>
          {/* removed "Check all" control as requested */}
        </Box>

        <Box sx={{ mb: 2 }}>
          {/* CustomCheckboxGroup expects selected values; we pass the inverted checkedValuesForComponent */}
          <CustomCheckboxGroup
            key={formik.values.allowedUsers.join(",")}
            label=""
            options={options.map((o) => ({ ...o, checked: checkedValuesForComponent.includes(o.value) }))}
            onChange={(newSelected: string[]) => handleCheckboxChange(newSelected)}
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
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
    </CustomModalLayout>
  );
};

export default RestrictUsers;
