// ./DetailEntryForm.tsx

import React, { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CUSTOM_BLUE = '#2563EB'; 

// Extended interface to include new fields
interface DetailEntryFormProps {
  slotId: string | null;
  onBack: () => void;
  onFinalizeBooking: (studentDetails: { 
    email: string, 
    id: string, 
    firstName: string, // NEW
    lastName: string // NEW
}) => void;
}

export default function DetailEntryForm({onBack, onFinalizeBooking }: DetailEntryFormProps) {
    // NEW state variables
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');

  const handleSubmit = () => {
    if (email && studentId && firstName && lastName) {
      onFinalizeBooking({ 
        email, 
        id: studentId, 
        firstName, // NEW
        lastName // NEW
    });
    }
  };
  
  // Updated validation to include new fields
  const isFormValid = (
    email.includes('@') && 
    studentId.length > 0 &&
    firstName.length > 0 && // NEW
    lastName.length > 0 // NEW
);

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap:0 }}>
          <Box sx={{display: 'flex', flexDirection: 'column', gap:1, mt:-1}}>
            <Box sx={{ ml: -1 }}> 
                <Button 
                    onClick={onBack} 
                    startIcon={<ArrowBackIcon />}
                    sx={{ 
                        textTransform: 'none', 
                        color: 'text.secondary', 
                        fontWeight: 600,
                        px: 0, // Remove horizontal padding
                        minWidth: '0px', // Collapse default button minimum width
                        justifyContent: 'flex-start' // Ensure content starts at the left
                    }}
                />
            </Box>
        <Typography 
                variant="subtitle1" // Small font size, often slightly larger than body text
                sx={{ 
                    fontWeight: 600, // Matches 'font-semibold'
                    fontFamily: 'var(--font-poppins), system-ui, sans-serif',
                    color: 'text.primary', // Matches the prominent color of a primary label
                    mt: 1, 
                    ml: 0,
                    mb: 0.5 // Add a small bottom margin for separation from the text below
                }}
            >
                Confirm Details for Slot
            </Typography>
        <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Please enter your details to finalize the reservation for slot
        </Typography>
            </Box>        
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 0}}>
        {/* NEW: First Name */}
        <TextField
          label="First Name *"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
          required
        />
        {/* NEW: Last Name */}
        <TextField
          label="Last Name *"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
          required
        />
        
        {/* Student Email */}
        <TextField
          label="Student Email *"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
        />
        {/* Student ID */}
        <TextField
          label="Student ID *"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          fullWidth
          required
        />
      </Box>

      {/* Action Button */}
      <Box sx={{ width: '100%', maxWidth: 280, mx: 'auto', mt: 'auto'}}>
        <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        sx={{
            py: "14px",
            fontWeight: 600,
            fontSize: "1.1rem",
            borderRadius: "8px",
            width: "100%",
            backgroundColor: CUSTOM_BLUE,
            color: "white",
            "&:hover": { backgroundColor: "#1D4ED8" },
        }}
        >
        Confirm Booking
        </Button>
      </Box>
    </Box>
  );
}