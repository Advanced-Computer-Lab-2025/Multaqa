"use client";

import React, { useState, useMemo, useEffect, useCallback} from 'react';
import { Box, Container, Typography } from '@mui/material';
import VendorCard from '../../../components/shared/Vendor/vendorCard'; // Adjust path
import { ContentWrapper } from '../containers';
import { IFileInfo } from '../../../../../backend/interfaces/fileData.interface';
import { api } from '@/api';


interface Vendor {
      companyName: string;
      logo: IFileInfo;
      loyaltyProgram?: {
        discountRate: number;
        promoCode: string;
        termsAndConditions: string;
      };
}


// 2. VENDOR LIST COMPONENT (The main view)

const VendorsList: React.FC = () => {
    // In production, this would be where API fetching and state management occurs:
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Placeholder function to satisfy the VendorCardProps interface
    const handleNoOpViewTNC = () => {};

    // Use useMemo to prevent unnecessary re-renders of the list if the component re-renders
const handleCallAPI = useCallback(async () => {
  console.log("Fetching vendors..."); // ← DO YOU SEE THIS?

  try {
    setLoading(true);
    setError(null);

    console.log("Making request to: /vendorEvents/loyalty-partners");
    const res = await api.get("/vendorEvents/loyalty-partners");

    console.log("Success! Data:", res.data); // ← DO YOU SEE THIS?

    setVendors(res.data.data || []);
  } catch (err: any) {
    console.error("API CALL FAILED:", err); // ← This will now show
    console.error("Error response:", err.response?.data);
    console.error("Status:", err.response?.status);

    setError(
      err.response?.data?.message ||
      err.message ||
      "Failed to load vendors."
    );
  } finally {
    setLoading(false);
  }
}, []);

    useEffect(() => {
    handleCallAPI();
    }, [handleCallAPI]);

        const vendorCards = useMemo(() => 
        (vendors || []).map((vendor) => (
            <VendorCard 
                key={vendor.companyName}
                vendor={vendor}
            />
        )), 
        [vendors]
    );


    return (
        // The outer container handles page alignment and padding
        <ContentWrapper
        title="Loyalty Program Partners"
        description="Enjoy exclusive discounts and offers at selected partners as part of the GUC Loyalty Program."
        >
        <Container maxWidth="lg" sx={{ py: 5, minHeight: '100vh' }}>
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
        </ContentWrapper>
    );
};

export default VendorsList;
