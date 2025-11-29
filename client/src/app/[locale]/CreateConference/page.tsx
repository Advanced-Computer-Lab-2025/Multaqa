"use client";

import React, { useState, useMemo } from 'react';
import { Box, Container, Typography } from '@mui/material';
import VendorCard from '../../../components/shared/Vendor/vendorCard'; // Adjust path
// ThemeProvider/createTheme/useTheme are generally handled in the root layout, 
// so they are commented out for a cleaner component file:
// import { ThemeProvider, createTheme } from '@mui/material/styles';

// 1. VENDOR DATA & TYPES

// Define the Vendor interface
interface Vendor {
    id: string;
    name: string;
    discountRate: string;
    promoCode: string;
    termsAndConditions: string;
    category: string; 
    logoURL: string;
}

const MOCK_VENDORS: Vendor[] = [
    {
        id: 'v1',
        name: 'The Fitness Hub',
        category: 'Fitness',
        discountRate: '25%',
        promoCode: 'GUCFIT25',
        termsAndConditions: 'Discount applies only to annual memberships. Cannot be combined with other promotions. Valid GUC ID required upon sign-up.',
        logoURL: ''
    },
    {
        id: 'v2',
        name: 'The Campus Cafe',
        category: 'Food',
        discountRate: '10%',
        promoCode: 'GUCFOOD10',
        termsAndConditions: 'Offer valid on purchases over 100 EGP. Excludes special promotional items and catering orders. Available Sunday - Thursday.',
        logoURL: ''
    },
    {
        id: 'v3',
        name: 'Bookworm Store',
        category: 'Retail',
        discountRate: '15%',
        promoCode: 'GUCBOOK15',
        termsAndConditions: 'Valid on non-textbook purchases only. Minimum spend 50 EGP. Offer cannot be combined with loyalty points.',
        logoURL: ''
    },
    {
        id: 'v4',
        name: 'Tech Repair Center',
        category: 'Service',
        discountRate: '20%',
        promoCode: 'GUCHARDWARE',
        termsAndConditions: 'Discount applies to labor costs only, parts excluded. Diagnostic fee is waived with successful repair. Warranty is limited to 90 days on repaired parts. The offer excludes data recovery services, custom builds, and liquid damage repairs. Please backup all data before submitting your device for repair. Any existing manufacturer warranties may be voided by third-party repair services.',
        logoURL: ''
    },
    {
        id: 'v5',
        name: 'Travel Agency',
        category: 'Travel',
        discountRate: '5%',
        promoCode: 'GUCFLY5',
        termsAndConditions: 'Applicable only to flights over 5,000 EGP. Cannot be used for accommodation or package deals.',
        logoURL: ''
    },
    {
        id: 'v6',
        name: 'Relax Spa',
        category: 'Wellness',
        discountRate: '30%',
        promoCode: 'GUCZEN',
        termsAndConditions: 'Valid for new clients on full-priced services only. Booking must be made 48 hours in advance. Not valid on weekends.',
        logoURL: ''
    },
    {
        id: 'v7',
        name: 'Art Supplies Depot',
        category: 'Retail',
        discountRate: '12%',
        promoCode: 'GUCART12',
        termsAndConditions: 'Discount is store-wide excluding canvas and easels. Minimum purchase of 150 EGP required. Must present physical coupon (to be provided separately).',
        logoURL: ''
    },
    {
        id: 'v8',
        name: 'The Car Wash',
        category: 'Service',
        discountRate: '10%',
        promoCode: 'GUCGLEAM',
        termsAndConditions: 'Free wash must be of equal or lesser value. Only applies to standard wash packages.',
        logoURL: ''
    },
    {
        id: 'v9',
        name: 'Photography Studio',
        category: 'Service',
        discountRate: '40% ',
        promoCode: 'GUCGRAD40',
        termsAndConditions: 'Offer valid only for Graduation photo packages booked by June 2026. Deposit is non-refundable. Final prints will be delivered within 4 weeks of selection. Rescheduling fees apply if cancelled within 7 days of the booking date.',
        logoURL: ''
    },
];

// 2. VENDOR LIST COMPONENT (The main view)

const VendorsList: React.FC = () => {
    // In production, this would be where API fetching and state management occurs:
    const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
    
    // Placeholder function to satisfy the VendorCardProps interface
    const handleNoOpViewTNC = () => {};

    // Use useMemo to prevent unnecessary re-renders of the list if the component re-renders
    const vendorCards = useMemo(() => 
        vendors.map((vendor) => (
            <VendorCard 
                key={vendor.id}
                vendor={vendor}
                onViewTNC={handleNoOpViewTNC} 
            />
        )), 
        [vendors]
    );

    return (
        // The outer container handles page alignment and padding
        <Container maxWidth="lg" sx={{ py: 5, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Box 
                sx={{ 
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 5, 
                    justifyContent: 'center',
                    alignItems: 'flex-start', 
                }}
            >
                {vendorCards}
            </Box>
            
        </Container>
    );
};

export default VendorsList;
