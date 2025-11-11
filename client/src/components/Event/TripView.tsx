"use client";

import React, { useState } from "react";
import { Box, Drawer, IconButton, Tooltip, Typography } from "@mui/material";
// import { Drawer } from '@heroui/react'; // Adjust import based on your HeroUI version
import CustomButton from "../shared/Buttons/CustomButton";
import { BazarViewProps } from "./types";
import theme from "@/themes/lightTheme";
import { Trash2 } from "lucide-react";
import { CustomModal, CustomModalLayout } from "../shared/modals";
import Utilities from "../shared/Utilities";
import RegisterEventModal from "./Modals/RegisterModal";
import EditTrip from "../tempPages/EditTrip/EditTrip";
import EventCard from "../shared/cards/EventCard";
import BazarFormModalWrapper from "./helpers/BazarFormModalWrapper";
import EventDetails from "./Modals/EventDetails";
import PaymentDrawer from "./helpers/PaymentDrawer";

const TripView: React.FC<BazarViewProps> = ({
  id,
  details,
  name,
  description,
  user,
  registered,
  icon: IconComponent, 
  background,
  onDelete,
  setRefresh,
  userInfo,
  isReady,
  attended
}) => {
  const [expanded, setExpanded] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<boolean>(false);
  const [register, setRegister] = useState(false);
  const [edit, setEdit] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false);
  

  const handlePaymentSuccess = (paymentDetails:any) => {
    console.log('Payment successful:', paymentDetails);
    setPaymentDrawerOpen(false);
    
    // Handle successful payment - redirect, show confirmation, etc.
    alert(`Payment successful! Transaction ID: ${paymentDetails.transactionId}`);
  };


  const finalPrice = parseInt(details["Cost"], 10); // base 10
  const handleOpenDeleteModal = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setTripToDelete(true);
  };

  const handleCloseDeleteModal = () => {
    setTripToDelete(false);
  };

  const deleteTripHandler = () => {
    // Call the onDelete callback to remove from parent state
    onDelete?.();
    handleCloseDeleteModal();
  };


  return (
    <>
     <EventCard 
        title={name} 
        startDate={details["Start Date"]} 
        endDate={details["End Date"]} 
        startTime={details["Start Time"]} 
        endTime={details["End Time"]} 
        color={background} 
        leftIcon={<IconComponent />} 
        eventType={"Trip"}
        onOpenDetails={() => setDetailsModalOpen(true)}
        utilities={
          user === "admin" ? (
            <Tooltip title="Delete">
            <IconButton
                    size="medium"
                    onClick={handleOpenDeleteModal}
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 0, 0, 0.1)",
                        color: "error.main",
                      },
                    }}
                  >
                    <Trash2 size={16} />
                  </IconButton>
            </Tooltip>
          ) : (user==="events-office" || user==="events-only"?<Utilities onEdit={() => setEdit(true)} onDelete={handleOpenDeleteModal} event={"Trip"} color={background}/>:null)
        }
          registerButton={
            (user == "staff" || user == "student" || user == "ta" || user == "professor") && (
              <>
                {!registered ? (
                  <CustomButton
                    size="small"
                    variant="contained"
                    sx={{ 
                      borderRadius: 999,
                      backgroundColor: `${background}40`,
                      color: background,
                      borderColor: background,
                      fontWeight: 600,
                      px: 3,
                      textTransform: "none",
                      boxShadow: `0 4px 14px ${background}40`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: `${background}50`,
                        transform: "translateY(-2px)",
                        boxShadow: `0 6px 20px ${background}50`,
                      },
                    }}
                    onClick={() => setRegister(true)}
                  >
                    Register
                  </CustomButton>
                ) : (
                  <CustomButton
                    size="small"
                    variant="outlined"
                    sx={{ 
                      borderRadius: 999,
                      backgroundColor: `${background}40`,
                      color: background,
                      borderColor: background,
                      fontWeight: 600,
                      px: 3,
                      textTransform: "none",
                      boxShadow: `0 4px 14px ${background}40`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: `${background}50`,
                        transform: "translateY(-2px)",
                        boxShadow: `0 6px 20px ${background}50`,
                      },
                      width: 'fit-content'
                    }}
                    onClick={() => {
                      // Add cancel registration logic here
                      console.log("Cancel registration clicked");
                    }}
                  >
                    Cancel Registration
                  </CustomButton>
                )}
              </>
            )
          }
        expanded={expanded} location={details["Location"]} cost={details["Cost"]} spotsLeft={details["Spots Left"]}/>
    
      {/* Modal - Always render when tripToDelete is true */}
      <CustomModal
        open={tripToDelete}
        onClose={handleCloseDeleteModal}
        title="Delete Trip"
        modalType="delete"
        borderColor={theme.palette.error.main}
        buttonOption1={{
          label: "Delete",
          variant: "contained",
          color: "error",
          onClick: deleteTripHandler,
        }}
        buttonOption2={{
          label: "Cancel",
          variant: "outlined",
          color: "error",
          onClick: handleCloseDeleteModal,
        }}
      >
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography
            sx={{
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
              color: "text.primary",
              mb: 2,
              fontSize: "1.1rem",
              fontWeight: 600,
            }}
          >
            {name}
          </Typography>

          <Typography
            sx={{
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
              color: "#666",
              mb: 1,
              fontSize: "0.95rem",
            }}
          >
            {details["Start Date"] === details["End Date"]
              ? details["Start Date"] || "TBD"
              : `${details["Start Date"] || "TBD"} - ${
                  details["End Date"] || "TBD"
                }`}
          </Typography>

          <Typography
            sx={{
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
              color: theme.palette.error.main,
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            Are you sure you want to delete this trip? This action cannot be
            undone.
          </Typography>
        </Box>
      </CustomModal>
      <EditTrip setRefresh={setRefresh} tripId={id} tripName={name} location={details["Location"]} price={finalPrice} description={description} startDate={new Date(details['Start Date'])} endDate={new Date (details['End Date'])} registrationDeadline={new Date(details['Registration Deadline'])} capacity={parseInt(details["Capacity"], 10)} open={edit} onClose={()=> {setEdit(false)}}/>
      <RegisterEventModal isReady={isReady} open={register} onClose={() => { setRegister(false); } }
      eventType={"Trip"} userInfo={userInfo} eventId={id} color={background} paymentOpen={() => setPaymentDrawerOpen(true)}/>


       <CustomModalLayout
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        width="w-[95vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw]"
        borderColor={background}
      >
        <EventDetails
          title={name}
          description={description}
          eventType="Trip"
          details={details}
          color={background}
          button={!registered &&
            (user == "staff" ||
              user == "student" ||
              user == "ta" ||
              user == "professor") && (
              <CustomButton
                size="small"
                variant="contained"
                   sx={{ 
                        borderRadius: 999 , backgroundColor: `${background}40`,
                        color:background, borderColor:background,
                        fontWeight: 600,
                        px: 3,
                        textTransform: 'none',
                        boxShadow: `0 4px 14px ${background}40`,
                        transition: 'all 0.3s ease',
                        "&:hover": {
                          backgroundColor: `${background}50`,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 6px 20px ${background}50`,
                        }
                      }}
                onClick={() => { setRegister(true); } }
              >
                Register
              </CustomButton>
            )}
          sections={user == "vendor" ? ['general', 'details'] : ['general', 'details',
            'reviews']}
          user={user ? user : ""}
          attended={attended}  />
      </CustomModalLayout>
     
      <PaymentDrawer
        open={paymentDrawerOpen}
        onClose={() => setPaymentDrawerOpen(false)}
        totalAmount={parseInt(details["Cost"])}
        walletBalance={100} //user.wallet or whatever 
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default TripView;
