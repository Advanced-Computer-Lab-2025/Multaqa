// ./BookingDetailsView.tsx

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Fade } from '@mui/material'; // Added Fade for smooth transition
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { InterviewSlot } from './types'; 

const CUSTOM_BLUE = '#2563EB'; 
const SUCCESS_GREEN = '#4CAF50'; 
const SUCCESS_LIGHT_GREEN = 'rgba(76, 175, 80, 0.1)'; 

interface BookingDetailsViewProps {
    booking: InterviewSlot;
    onCancel: () => void;
}

export default function BookingDetailsView({ booking, onCancel }: BookingDetailsViewProps) {
    // NEW STATE: Controls whether to show the animation or the details
    const [showDetails, setShowDetails] = useState(false); 
    
    // Hook to manage the transition timing
    useEffect(() => {
        // Start timer to transition to details after 2.5 seconds
        const timer = setTimeout(() => {
            setShowDetails(true);
        }, 2500); // 2.5 seconds for animation display

        return () => clearTimeout(timer); // Cleanup timer on unmount
    }, []);


    const interviewDate = new Date(booking.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    const interviewTime = `${booking.start} - ${booking.end}`;

    return (
        <Box 
            sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                textAlign: 'center',
                fontFamily: 'Poppins, sans-serif',
                p: 3, 
                // Ensure the Box takes up the full panel height for the effect
                minHeight: '400px' 
            }}
        >
            {/* SUCCESS ANIMATION PHASE (Full Panel) */}
            <Fade in={!showDetails} timeout={500}>
                {/* Use a wrapper Box that is conditionally rendered to hide the animation content */}
                <Box sx={{ 
                    // Ensures the animation phase content is centered vertically and horizontally
                    display: showDetails ? 'none' : 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexGrow: 1, 
                    width: '100%',
                    py: 10 // Add vertical padding to fill the space
                }}>
                    <Box sx={{ position: 'relative', width: 150, height: 150, mb: 4 }}>
                        {/* Rings Mockup */}
                        {[1, 2, 3].map((i) => (
                            <Box
                                key={i}
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: 50 + i * 30,
                                    height: 50 + i * 30,
                                    borderRadius: '50%',
                                    backgroundColor: SUCCESS_LIGHT_GREEN,
                                    opacity: 0.8 - i * 0.2,
                                    zIndex: 0
                                }}
                            />
                        ))}

                        {/* Checkmark Icon (Center) */}
                        <Box sx={{ 
                            position: 'absolute', 
                            top: '50%', 
                            left: '50%', 
                            transform: 'translate(-50%, -50%)',
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            backgroundColor: SUCCESS_GREEN,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1
                        }}>
                            <CheckCircleIcon sx={{ fontSize: 40, color: 'white' }} />
                        </Box>
                    </Box>

                    {/* Animation Text */}
                    <Typography variant="h5" sx={{ mb: 1, fontWeight: 700, color: 'text.primary' }}>
                        Booking Successful!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Your interview slot has been confirmed.
                    </Typography>
                </Box>
            </Fade>

            {/* DETAILS PHASE (Fades in after animation) */}
            <Fade in={showDetails} timeout={1000}>
                <Box sx={{ 
                    // Hide details until state is updated, ensuring the Box doesn't take space
                    display: showDetails ? 'flex' : 'none', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    width: '100%' 
                }}>
                    <Typography variant="h6" color={CUSTOM_BLUE} sx={{ mb: 4, fontWeight: 700 }}>
                        Interview Slot Details
                    </Typography>
                    
                    <Paper 
                        variant="outlined" 
                        sx={{ p: 3, width: '100%', maxWidth: 450, borderColor: CUSTOM_BLUE, mb: 4, textAlign: 'left' }}
                    >
                        {/* Date Information */}
                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Date:
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5 }}>
                            {interviewDate}
                        </Typography>
                        
                        {/* Time Information */}
                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Time:
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                            {interviewTime}
                        </Typography>

                        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '16px 0' }} />
                        
                        {/* Student Details */}
                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Your Details:
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Email: {booking.studentEmail}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                            Student ID: {booking.studentId}
                        </Typography>

                        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '16px 0' }} />

                        {/* Contact Details */}
                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Contact Email:
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                            {booking.contactEmail}
                        </Typography>
                        
                        <Typography variant="caption" display="block" color="error" sx={{ mt: 2 }}>
                            *You must cancel this slot before reserving another.
                        </Typography>
                    </Paper>

                    <Box sx={{ maxWidth: 240, mx: 'auto', width: '100%' }}>
                        <Button
                            variant="contained" 
                            color="error" 
                            fullWidth
                            onClick={onCancel}
                            sx={{ py: '14px', fontWeight: 600, fontSize: '1.1rem', borderRadius: '8px', whiteSpace: 'nowrap' }}
                        >
                            Cancel Slot
                        </Button>
                    </Box>
                </Box>
            </Fade>
        </Box>
    );
}