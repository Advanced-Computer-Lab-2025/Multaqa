import React from "react";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import {
  CustomTextField,  
} from "@/components/shared/input-fields";
import { CustomModalLayout } from "@/components/shared/modals";
import theme from "@/themes/lightTheme";
import { Typography, Box } from "@mui/material";

interface RegisterEventModalProps {
  open: boolean;
  onClose: () => void;
  eventType: string;
}

const RegisterEventModal: React.FC<RegisterEventModalProps> = ({
  open,
  onClose,
  eventType,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add registration logic here (e.g., API call)
  };

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
              label="ID"
              fieldType="text"
              placeholder="Enter your GUC ID"
              name="id"
              required
              neumorphicBox
              fullWidth
            />
            <CustomTextField
              label="Name"
              fieldType="text"
              placeholder="Enter your name"
              name="name"
              neumorphicBox
              required
              fullWidth
            />

            <CustomTextField
              label="Email"
              fieldType="email"
              placeholder="Enter your GUC email"
              name="email"
              required
              neumorphicBox
              fullWidth
            />

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
              label="Register"
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
