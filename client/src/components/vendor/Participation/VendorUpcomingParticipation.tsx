"use client";

import React, { useState, useEffect } from "react";
import { Typography, Stack, Chip, Alert } from "@mui/material";
import VendorItemCard from "./VendorItemCard";
import { VendorRequestItem } from "./types";
import { api } from "@/api";
import { useAuth } from "@/context/AuthContext";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import CancelApplicationVendor from "@/components/Event/Modals/CancelApplicationVendor";
import VendorPaymentDrawer from "@/components/Event/helpers/VendorPaymentDrawer";
import ContentWrapper from "../../shared/containers/ContentWrapper";
import theme from "@/themes/lightTheme";
import { toast } from "react-toastify";
import BazarView from "@/components/Event/BazarView";
import BoothView from "@/components/Event/BoothView";
import { frameData } from "@/components/BrowseEvents/utils";
import SellIcon from "@mui/icons-material/Sell";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { EventCardsListSkeleton } from "@/components/BrowseEvents/utils/EventCardSkeleton";
import EmptyState from "@/components/shared/states/EmptyState";

const STATUS_MAP: Record<string, VendorRequestItem["status"]> = {
  pending: "PENDING",
  approved: "ACCEPTED",
  rejected: "REJECTED",
  pending_payment: "PENDING_PAYMENT",
};

export default function VendorRequestsList() {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [cancelApplication, setCancelApplication] = useState(false);
  const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  // track which request (vendorEvent) was selected
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedParticipationFee, setSelectedParticipationFee] = useState<number>(0);
  const vendorId = user?._id;
  
  // toggle to trigger refetch after cancel or payment
  const [refreshToggle, setRefreshToggle] = useState(false);
  const fetchRequests = async () => {
     setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/vendorEvents`);
        const requestedEventsRaw = response.data?.data || [];
        const framedData = requestedEventsRaw.map(item => {
        const framed = frameData([item.event], vendorId);
      return {
        ...framed[0], // Spread the framed event data
        hasPaid: item.hasPaid,
        participationFee: item.participationFee,
        status: item.status
      };
    });

   const filteredRequests = framedData.filter((item) => item.status === "approved" && item.hasPaid === true);
   setRequests(filteredRequests);
        console.log(framedData);
        console.log("Fetched vendor events:", requestedEventsRaw);
      } catch (err: any) {
        toast.error(err?.response?.data?.error, {
                         position: "bottom-right",
                         autoClose: 3000,
                         theme: "colored",
                       });
        setRequests([]);
      }
      finally{
        setLoading(false);
      }
    };

  useEffect(() => {
    if (!vendorId) {
      setError("Unable to find vendor information. Please sign in again.");
      return;
    }
    fetchRequests();
   // refetch when user or refreshToggle change
  }, [user, refreshToggle]);

  const renderActionButton = (item:any) => {
    // If approved and not paid -> show Pay button
    if (item.status === "approved" && !item.hasPaid) {
      return (
        <CustomButton
          size="small"
          variant="contained"
          sx={{
            borderRadius: 999,
            border: `1px solid ${theme.palette.success.dark}`,
            backgroundColor: `${theme.palette.success.main}`,
            color: theme.palette.primary.contrastText,
            fontWeight: 600,
            px: 3,
            textTransform: "none",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
            },
          }}
          onClick={() => {
            setSelectedEventId(item.eventId ?? null);
            setSelectedParticipationFee(item.participationFee ?? 0);
            setPaymentDrawerOpen(true);
          }}
        >
          Pay
        </CustomButton>
      );
    }

    // If pending (not approved) and not paid -> show Cancel Application
    if (item.status === "pending" && !item.hasPaid) {
      return (
        <CustomButton
          size="small"
          variant="outlined"
          sx={{
            borderRadius: 999,
            border: `1px solid ${theme.palette.error.dark}`,
            backgroundColor: `${theme.palette.error.main}`,
            color: "background.paper",
            fontWeight: 600,
            px: 3,
            textTransform: "none",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
            },
            width: 'fit-content'
          }}
          onClick={() => {
            setSelectedEventId(item.eventId ?? null);
            setCancelApplication(true);
          }}
        >
          Cancel Application
        </CustomButton>
      );
    }

    // If paid or rejected, render nothing
    return null;
  };

  return (
    <ContentWrapper
      title="My Requests"
      description="Review the status of your requests for upcoming bazaars or booth setups."
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Stack spacing={2}>
       {!loading&&(requests.length ? requests : []).filter((item) => (item.status === "approved" && item.hasPaid === true)).map((item) => {
  switch(item.type) {
    case "bazaar":
      return (
        <BazarView 
          id={item.id} 
          background={"#e91e63"} 
          details={item.details} 
          name={item.name} 
          description={item.description} 
          payButton={renderActionButton(item)} 
          vendorStatus={item.status}
          vendors={item.vendors} 
          icon={SellIcon} 
          attended={item.attended} 
          archived={item.archived} 
          registrationDeadline={item.details?.["Registration Deadline"]}
          userInfo={user}
          user={"vendor"}
          isRequested={true}
        />
      );
    case "booth":
      return (
        <BoothView 
          id={item.id} 
          background={"#2196f3"} 
          icon={StorefrontIcon} 
          company={item.company} 
          description={item.description} 
          details={item.details}
          payButton={renderActionButton(item)} 
          vendorStatus={item.status}
          attended={item.attended} 
          archived={item.archived}  
          userInfo={user}
          user={"vendor"}
          isRequested={true}
        />
      );
    default:
      return null;
  }
})}
   {loading && (
      <EventCardsListSkeleton />
    )}
       {!loading && requests.length === 0 && (
        <EmptyState
         title = "No vendor requests found"
         description = "Browse upcoming bazaars and platform booths to submit your requests!"
        />
       )}
        <CancelApplicationVendor
          eventId={selectedEventId ?? ""}
          open={cancelApplication}
          onClose={() => {
            setCancelApplication(false);
            setSelectedEventId(null);
          }}
          setRefresh={setRefreshToggle}
        />
        <VendorPaymentDrawer
          open={paymentDrawerOpen}
          onClose={() => {
            setPaymentDrawerOpen(false);
            setSelectedEventId(null);
          }}
          eventId={selectedEventId ?? ""}
          totalAmount={selectedParticipationFee}
          email={user?.email ?? ""}
        />
      </Stack>
    </ContentWrapper>
  );
}
