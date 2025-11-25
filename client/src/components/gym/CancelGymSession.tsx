"use client";

import React, { useState } from 'react';
import { CustomModal } from '@/components/shared/modals';
import { Box, Typography } from '@mui/material';
import theme from "@/themes/lightTheme"; // Ensure this import path is correct
import { toast } from 'react-toastify'; 
import { cancelGymSession } from './utils'; 

interface CancelGymSessionProps {
    sessionId: string; // The ID of the gym session to delete
    open: boolean;
    onClose: () => void;
    // SetRefresh is now a generic state setter to toggle refresh in the parent
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>; 
}

const CancelGymSession = ({ sessionId, open, onClose, setRefresh }: CancelGymSessionProps) => {
    const [loading, setLoading] = useState(false);

    const handleDeleteSession = async () => {
        setLoading(true);
        
        try {
            await cancelGymSession(sessionId); // Call the utility function

            // Success feedback
            toast.success("Gym session permanently canceled.", {
                position: "bottom-right",
                autoClose: 3000,
                theme: "colored",
            });
            
            // Close modal and refresh the parent list
            onClose(); 
            setRefresh((prev) => !prev);
            
        } catch (err: any) {
            // Error feedback: The utility function throws a clean Error object
            const errorMessage = err?.message || "Failed to cancel gym session.";
            
            toast.error(errorMessage, {
                position: "bottom-right",
                autoClose: 5000,
                theme: "colored",
            });
            // Keep the modal open for user to acknowledge or retry
            
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomModal
            open={open} 
            onClose={onClose} 
            title="Cancel Gym Session"
            modalType='error'
            borderColor={theme.palette.error.main}
            
            // Button for Confirmation (YES, DELETE IT)
            buttonOption2={{
                label: loading ? "Canceling..." : "Cancel Session",
                variant: "contained",
                color: "error",
                onClick: handleDeleteSession,
            }}
            
            // Button for Denial (NO, KEEP IT)
            buttonOption1={{
                label: "Keep Session",
                variant: "outlined",
                color: "error",
                onClick: onClose,
            }}  
        >
            <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography
                    sx={{
                        fontFamily: "var(--font-poppins), system-ui, sans-serif",
                        color: theme.palette.error.main,
                        mb: 2,  
                        fontSize: "1.1rem",
                        fontWeight: 600,
                    }}
                >
                    Are you sure you want to permanently cancel this gym session?
                </Typography>
                <Typography
                    sx={{
                        fontFamily: "var(--font-poppins), system-ui, sans-serif",
                        color: "gray",
                        mb: 1,
                        fontSize: "0.95rem",
                    }}
                >
                    This action will remove the session for all participants and cannot be undone.
                </Typography>
            </Box>
        </CustomModal> 
    );
}

export default CancelGymSession;