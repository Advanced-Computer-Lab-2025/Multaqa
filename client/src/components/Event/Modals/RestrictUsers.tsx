import React from "react";
import { CustomModalLayout } from "@/components/shared/modals";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import CustomCheckboxGroup from "@/components/shared/input-fields/CustomCheckboxGroup";
import { Box, Typography, Checkbox, FormControlLabel } from "@mui/material";
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
  const options = [
    { label: "student", value: "student" },
    { label: "professor", value: "professor" },
    { label: "TA", value: "ta" },
    { label: "staff", value: "staff" },
  ];

  const formik = useFormik({
    initialValues: { allowedUsers: [] as string[] },
    validationSchema: Yup.object({
      allowedUsers: Yup.array().min(1, "Select at least one user type"),
    }),
    onSubmit: (values) => {
      alert(JSON.stringify(values.allowedUsers));
      if (setRefresh) setRefresh((p) => !p);
      onClose();
    },
  });

  const allChecked = formik.values.allowedUsers.length === options.length;

  return (
    <CustomModalLayout open={open} onClose={onClose} width='w-[95vw] md:w-[80vw] lg:w-[70vw] xl:w-[45vw]'>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }} color="primary.dark" className="text-center">
          {`Restrict Users for ${eventName ?? ""}`}
      </Typography>
      <Box sx={{ p: 3, width: { xs: "90vw", sm: 560 } }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 , borderBottom:"2px solid #E0E0E0", pb:1}}>
          <Typography variant="body1" sx={{ fontWeight: 600 , mr:2}}>
            Select which users can view this event:
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={allChecked}
                onChange={(e) => {
                  if (e.target.checked) {
                    formik.setFieldValue("allowedUsers", options.map((o) => o.value));
                  } else {
                    formik.setFieldValue("allowedUsers", []);
                  }
                }}
                size="small"
              />
            }
            label="Check all"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          {/* use key to keep CustomCheckboxGroup in sync with formik values */}
          <CustomCheckboxGroup
            key={formik.values.allowedUsers.join(",")}
            label=""
            options={options.map((o) => ({ ...o, checked: formik.values.allowedUsers.includes(o.value) }))}
            onChange={(newSelected: string[]) => formik.setFieldValue("allowedUsers", newSelected)}
            helperText={formik.touched.allowedUsers && formik.errors.allowedUsers ? String(formik.errors.allowedUsers) : undefined}
            error={Boolean(formik.touched.allowedUsers && formik.errors.allowedUsers)}
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
        <CustomButton
          label="Submit"
          variant="contained"
          onClick={() => formik.handleSubmit()}
          sx={{ width: 160, height: 44 }}
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
