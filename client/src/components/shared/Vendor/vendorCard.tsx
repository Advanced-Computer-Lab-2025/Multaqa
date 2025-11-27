import React, { useState } from 'react';
import logoPlaceholder from './logo.jpeg';
import {
    Box,
    Typography,
    Paper,
    Divider,
    IconButton,
    Tooltip,
    useTheme,
    Collapse, // Imported for the Inline Collapse
} from '@mui/material';
import {
    LocalOffer as DiscountIcon,
    Code as CodeIcon,
    ContentCopy as CopyIcon,
    CheckCircle as CheckIcon,
    Info as InfoIcon,
    Close as CloseIcon, // Used to close the collapse panel
} from '@mui/icons-material';

// Assume Vendor interface is imported
interface Vendor {
    id: string;
    name: string;
    discountRate: string;
    promoCode: string;
    termsAndConditions: string;
    logoURL: string
}

interface VendorCardProps {
    vendor: Vendor;
    // onViewTNC is now optional, as the main display is handled internally
    onViewTNC: (tnc: string) => void;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor, onViewTNC }) => {
    const theme = useTheme();
    const [copySuccess, setCopySuccess] = useState<'Copy' | 'Copied!' | 'Failed!'>('Copy');
    const [showTncDrawer, setShowTncDrawer] = useState(false); 

    // --- Helper Functions (Stubs) ---
     const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess('Copy'), 2000); 
        } catch (err) {
            setCopySuccess('Failed!');
        }
    };
    // ---------------------------------

    return (
        <Paper
            elevation={3}
            sx={{
                borderRadius: '24px', 
                padding: 3,
                maxWidth: 300,
                pt: 6, 
                boxShadow: `0px 4px 20px rgba(0, 0, 0, 0.05)`,
            }}
        >
            {/* 1. TITLE & LOGO */}
            <Box sx={{ position: 'relative', mb:1}}>
                {/* Logo/Category Indicator */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: -85, 
                        left:10, 
                        width: 65, 
                        height: 65, 
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1,
                        color: 'white',
                        boxShadow: `0px 3px 10px rgba(0, 0, 0, 0.2)`, 
                    }}
                >
                    <img 
                        src={logoPlaceholder.src} // Assumes logo.jpeg is in the public folder
                        alt={`${vendor.name} logo placeholder`}
                        style={{
                            width: '100%', 
                            height: '100%',
                            objectFit: 'cover', // Ensures image covers the circle
                            borderRadius: '50%', // Ensures image is cropped to a circle
                        }}
                    />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                    {vendor.name}
                </Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* 2. DISCOUNT RATE & T&C TRIGGER */}
            <Box sx={{ mb: 2 }}>
                {/* DISCOUNT RATE (The Primary Value) */}
                <Box display="flex" alignItems="center" mb={1}>
                    <DiscountIcon color="action" sx={{ mr: 1, fontSize: 18 }} />
                    <Typography variant="body2" color="#666666" mr={1}>
                        Discount Rate
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            fontWeight: 700,
                            ml: 'auto',
                            color: theme.palette.error.main,
                            fontSize: '18'
                        }}
                    >
                        {vendor.discountRate}
                    </Typography>
                </Box>

                {/* TERMS AND CONDITIONS TRIGGER (Simplified) */}
                <Box display="flex" alignItems="center" justifyContent="flex-start">
                    <InfoIcon color="action" sx={{ mr: 1, fontSize: 18 }} />
                    
                    {/* T&C Text acting as the hyperlink trigger */}
                    <Typography 
                        variant="body2" 
                        color="#666666"
                        onClick={() => setShowTncDrawer(!showTncDrawer)} // Toggle the collapse
                        sx={{
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            '&:hover': {
                                color: theme.palette.primary.main,
                            }
                        }}
                    >
                        Terms & Conditions
                    </Typography>
                </Box>
            </Box>

            {/* INLINE T&C COLLAPSE*/}
            <Collapse in={showTncDrawer}>
                <Box 
                    sx={{ 
                        mt: 1, 
                        mb: 2, 
                        p: 1.5, 
                        borderRadius: '8px', 
                        backgroundColor: theme.palette.grey[50],
                        border: `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Box display="flex" alignItems="flex-start" mb={0.5}>
                        <Box sx={{ flexGrow: 1 }} /> 
                        
                        <IconButton 
                            size="small" 
                            onClick={() => setShowTncDrawer(false)}
                            sx={{ mt: -1, mr: -1 }} 
                        >
                            <CloseIcon fontSize="small" color="action" />
                        </IconButton>
                    </Box>
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            whiteSpace: 'pre-wrap', 
                            color: "theme.palette.text.primary",
                            mt: -1.0, 
                        }}
                    >
                        {vendor.termsAndConditions}
                    </Typography>
                </Box>
            </Collapse>
            
            <Divider sx={{ mb: 1 }} />

            {/* 3. PROMO CODE */}
            <Box sx={{ pt: 1 }}> 
                <Typography
                    variant="caption"
                    color='#666666'
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1
                    }}
                >
                    <CodeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    Promo Code:
                </Typography>

                {/* Promo Code Box */}
                <Box
                    sx={{
                        p: 1.5,
                        backgroundColor: theme.palette.grey[100],
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: `1px dashed ${theme.palette.divider}`
                    }}
                >
                    <Typography
                        variant="body1"
                        sx={{
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            color: theme.palette.text.primary
                        }}
                    >
                        {vendor.promoCode}
                    </Typography>
                    <Tooltip title={copySuccess === 'Copied!' ? 'Copied!' : 'Copy to Clipboard'}>
                        <IconButton
                            size="small"
                            onClick={() => handleCopy(vendor.promoCode)}
                            color={copySuccess === 'Copied!' ? 'success' : 'primary'}
                            sx={{ ml: 1 }}
                        >
                            {copySuccess === 'Copied!' ? <CheckIcon /> : <CopyIcon />}
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Paper>
    );
};

export default VendorCard;