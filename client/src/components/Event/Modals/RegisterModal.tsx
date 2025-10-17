import React, { useState } from "react";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import {
  CustomTextField,  
} from "@/components/shared/input-fields";
import { CustomModalLayout } from "@/components/shared/modals";
import theme from "@/themes/lightTheme";
import { Typography, Box } from "@mui/material";
import { api } from "@/api";

interface RegisterEventModalProps {
  userInfo:{ id: string; name: string; email:string };
  open: boolean;
  onClose: () => void;
  eventType: string;
  isReady:boolean;
  eventId:string;
}

const RegisterEventModal: React.FC<RegisterEventModalProps> = ({
  userInfo,
  open,
  onClose,
  eventType,
  isReady,
  eventId
}) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (payload: React.FormEvent) => {
    payload.preventDefault();
    try {
      // TODO: Replace with your API route
      const res = await api.post(`/users/:${userInfo.id}/register/:${eventId}`, payload);
      setResponse(res.data);
    } catch (err: any) {
      setError(err?.message || "API call failed");
    } finally {
      setLoading(false);
    }
  };
console.log(userInfo);
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
              label="Name"
              fieldType="text"
              placeholder={isReady?userInfo.name:""}
              name="name"
              value={isReady?userInfo.name:""}
              neumorphicBox
              required
              fullWidth
            />

            <CustomTextField
              label="Email"
              fieldType="email"
              placeholder={isReady?userInfo.email:""}
              value={isReady?userInfo.email:""}
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
