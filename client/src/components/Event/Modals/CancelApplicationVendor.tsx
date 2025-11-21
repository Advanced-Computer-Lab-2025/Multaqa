import { CustomModal, CustomModalLayout } from '@/components/shared/modals'
import { Box, Typography } from '@mui/material'
import theme from "@/themes/lightTheme";
import {api} from "../../../api";
import React , {useState}from 'react'
import { toast } from "react-toastify";

interface CancelEventApplicationVendorProps {
    eventId: string;
    open: boolean;
    onClose: () => void;
    setRefresh:React.Dispatch<React.SetStateAction<boolean>>;
}

const CancelApplicationVendor = ({eventId, open, onClose, setRefresh}: CancelEventApplicationVendorProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


   const handleCallApi = async (eventId:string) => {
        setLoading(true);
        setError(null);
        try {
          // TODO: Replace with your API route
          const res = await api.delete("/vendorEvents/" + eventId + "/cancel");
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
          setRefresh((prev)=> !prev);
        } catch (err: any) {
          setError(err?.message || "API call failed");
          toast.error(err?.message || "Failed to cancel application",
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
   
   const handleCancelApplication = async () => {
    // Logic to cancel application
    console.log("Canceling application for event ID:", eventId);
    // await handleCallApi(eventId);
    onClose();
  }

  return (
    <CustomModal
        open={open}
        onClose={onClose}
        title="Cancel Application"
        modalType='error'
        borderColor={theme.palette.error.main}
        buttonOption2={{
            label: "Yes",
            variant: "contained",
            color: "error",
            onClick: handleCancelApplication,
        }}
        buttonOption1={{
            label: "No",
            variant: "outlined",
            color: "error",
            onClick: onClose,
        }}
    >
        <Box sx={{ textAlign: "center", mt: 1 , mb: 1}}>
            <Typography
            sx={{
                fontFamily: "var(--font-poppins), system-ui, sans-serif",
                color: theme.palette.error.main,
                fontSize: "1.1rem",
                fontWeight: 600,
            }}
            >
            Are you sure you want to cancel your application for this event?
            </Typography>
        </Box>
    </CustomModal>     
  )
};

export default CancelApplicationVendor;
