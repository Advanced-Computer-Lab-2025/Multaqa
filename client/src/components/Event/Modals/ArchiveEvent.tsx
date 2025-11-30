import React , {useState}from "react";
import {api} from "../../../api";
import { CustomModal, CustomModalLayout } from "@/components/shared/modals";
import {Typography, Checkbox, FormControlLabel } from "@mui/material";
import theme from "@/themes/lightTheme";
import { toast } from "react-toastify";

interface ArchiveEventProps {
  eventId?: string;
  eventName?: string;
  eventType: string;
  open: boolean;
  onClose: () => void;
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ArchiveEvent = ({eventId, eventName, eventType, open, onClose, setRefresh} : ArchiveEventProps) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);  
  const handleCallApi = async (payload:any) => {
    setLoading(true);
    setError(null);
    try {
    // TODO: Replace with your API route
    const res = await api.patch("/events/" + eventId, payload);
    // Success case
    toast.success("Event Archived Successfully", {
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
    toast.error(
      err?.response?.data?.error || err?.response?.data?.message || "Event Archiving Failed",
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

  const handleArchiveEvent = async () =>{
    await handleCallApi({type:eventType, archived:true});
    onClose();
  };

  return (
    <CustomModal
      open={open} 
      onClose={onClose}
      title={"Archive " + eventType}
        modalType='warning'
        borderColor='warning.main'
        buttonOption2={{
          label: "Yes",
          variant: "contained",
            color: "warning",
            onClick: handleArchiveEvent,
        }}
        buttonOption1={{
            label: "No",
            variant: "outlined",
            color: "warning",
            onClick: onClose,
        }}
    >
        <Typography
          sx={{
            fontFamily: "var(--font-poppins), system-ui, sans-serif",
            color: theme.palette.warning.main,
            mb: 2,  
            fontSize: "1.1rem",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Are you sure you want to archive this event?
        </Typography>
    </CustomModal>    
  )
}

export default ArchiveEvent
