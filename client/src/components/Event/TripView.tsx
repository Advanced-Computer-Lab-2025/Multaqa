"use client";

import React, { useState, useMemo } from "react";
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
import CancelRegistration from "./Modals/CancelRegistration";
import PaymentDrawer from "./helpers/PaymentDrawer";
import RestrictUsers from "./Modals/RestrictUsers";
import ArchiveEvent from "./Modals/ArchiveEvent";
import JoinWaitlistModal from "./Modals/JoinWaitlistModal";
import LeaveWaitlistModal from "./Modals/LeaveWaitlistModal";

const TripView: React.FC<BazarViewProps> = ({
  id,
  details,
  name,
  description,
  user,
  registered,
  isRegisteredEvent,
  icon: IconComponent,
  background,
  onDelete,
  setRefresh,
  userInfo,
  attended,
  datePassed,
  registrationPassed,
  archived,
  registrationDeadline,
  allowedUsers,
  waitlist,
  isFull,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<boolean>(false);
  const [register, setRegister] = useState(false);
  const [cancelRegisteration, setCancelRegisteration] = useState(false);
  const [edit, setEdit] = useState(false);
  const [restrictUsers, setRestrictUsers] = useState(false);
  const [archive, setArchive] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false);
  const [joinWaitlistOpen, setJoinWaitlistOpen] = useState(false);
  const [leaveWaitlistOpen, setLeaveWaitlistOpen] = useState(false);
  
  const isFavorited = Boolean(userInfo?.favorites?.some((f: any) => {
    const fid = f?._id?.$oid || f?._id || f;
    return String(fid) === String(id);
  }));

  // Compute waitlist status for current user
  const waitlistInfo = useMemo(() => {
    if (!waitlist || !userInfo?._id) {
      return { isOnWaitlist: false, status: null, paymentDeadline: null };
    }
    // Handle various ID formats: string, ObjectId with $oid, or plain ObjectId
    const userId = userInfo._id?.$oid || userInfo._id?.toString?.() || userInfo._id;
    const userEntry = waitlist.find((entry) => {
      // Handle waitlist userId in various formats
      const entryUserId = entry.userId?.$oid || entry.userId?._id?.$oid || entry.userId?._id || entry.userId?.toString?.() || entry.userId;
      return String(entryUserId) === String(userId);
    });
    if (!userEntry) {
      return { isOnWaitlist: false, status: null, paymentDeadline: null };
    }
    return {
      isOnWaitlist: true,
      status: userEntry.status,
      paymentDeadline: userEntry.paymentDeadline,
    };
  }, [waitlist, userInfo?._id]);


  const handlePaymentSuccess = (paymentDetails: any) => {
    console.log('Payment successful:', paymentDetails);
    setPaymentDrawerOpen(false);
  };


  const startDate = new Date(details["Start Date"]);
  const now = new Date();
  const isRefundable = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) >= 14;

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
        eventId={id} isFavorite={isFavorited}
        title={name}
        startDate={details["Start Date"]}
        endDate={details["End Date"]}
        startTime={details["Start Time"]}
        endTime={details["End Time"]}
        color={background}
        leftIcon={<IconComponent />}
        eventType={"Trip"}
        spotsLeft={details['Spots Left']}
        totalSpots={details["Capacity"]}
        isUpcoming={!datePassed}
        registrationDeadline={user!=="events-office"&& user!=="vendor" && user!=="admin"?details["Registration Deadline"]:undefined}
        onOpenDetails={() => setDetailsModalOpen(true)}
        utilities={
          user === "admin" ? (
            <Tooltip title="Delete Trip">
              <IconButton
                size="medium"
                onClick={handleOpenDeleteModal}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "rgba(255, 0, 0, 0.1)",
                    borderColor: "error.main",
                    color: "error.main",
                  },
                }}
              >
                <Trash2 size={18} />
              </IconButton>
            </Tooltip>
          ) : (user === "events-office" || user === "events-only" ? <Utilities  renderEdit={!datePassed} archived={archived} onRestrict={() => setRestrictUsers(true)} onArchive={() => setArchive(true)} onEdit={() => setEdit(true)} onDelete={handleOpenDeleteModal} event={"Trip"} color={background} /> : null)
        }
        registerButton={
          (user == "staff" || user == "student" || user == "ta" || user == "professor") && (
            !(datePassed || attended) && (
              <>
                {registered || isRegisteredEvent ? (
                  // User is registered - show cancel button
                  <CustomButton
                    size="small"
                    variant="contained"
                    sx={{
                      borderRadius: 999,
                      backgroundColor: `${theme.palette.error.main}`,
                      color: "background.paper",
                      border: `1px solid ${theme.palette.error.dark}`,
                      fontWeight: 600,
                      px: 3,
                      textTransform: "none",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                      },
                      width: 'fit-content'
                    }}
                    onClick={() => setCancelRegisteration(true)}
                  >
                    Cancel Registration
                  </CustomButton>
                ) : waitlistInfo.isOnWaitlist ? (
                  // User is on waitlist
                  waitlistInfo.status === "pending_payment" ? (
                    // User has a reserved slot - show complete payment button
                    <CustomButton
                      size="small"
                      variant="contained"
                      sx={{
                        borderRadius: 999,
                        border: `1px solid ${theme.palette.success.main}`,
                        backgroundColor: `${theme.palette.success.main}`,
                        color: "background.paper",
                        fontWeight: 600,
                        px: 3,
                        textTransform: "none",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                        },
                      }}
                      onClick={() => setRegister(true)}
                    >
                      Complete Payment
                    </CustomButton>
                  ) : (
                    // User is waiting in queue - show leave waitlist button
                    <CustomButton
                      size="small"
                      variant="contained"
                      sx={{
                        borderRadius: 999,
                        border: `1px solid ${theme.palette.warning.main}`,
                        backgroundColor: `${theme.palette.warning.main}`,
                        color: "background.paper",
                        fontWeight: 600,
                        px: 3,
                        textTransform: "none",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                        },
                      }}
                      onClick={() => setLeaveWaitlistOpen(true)}
                    >
                      Leave Waitlist
                    </CustomButton>
                  )
                ) : isFull ? (
                  // Event is full and user not on waitlist - show join waitlist button
                  !(registrationPassed) && (
                    <CustomButton
                      size="small"
                      variant="contained"
                      sx={{
                        borderRadius: 999,
                        border: `1px solid ${theme.palette.info.main}`,
                        backgroundColor: `${theme.palette.info.main}`,
                        color: "background.paper",
                        fontWeight: 600,
                        px: 3,
                        textTransform: "none",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                        },
                      }}
                      onClick={() => setJoinWaitlistOpen(true)}
                    >
                      Join Waitlist
                    </CustomButton>
                  )
                ) : (
                  // User is not registered and event has spots - show register button
                  !(registrationPassed) && (
                    <CustomButton
                      size="small"
                      variant="contained"
                      sx={{
                      borderRadius: 999,
                      border: `1px solid ${background}`,
                      backgroundColor: `${background}`,
                       color: "background.paper",
                      fontWeight: 600,
                      px: 3,
                      textTransform: "none",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                      },
                    }}
                      onClick={() => setRegister(true)}
                    >
                      Register
                    </CustomButton>
                  )
                )}
              </>
            )
          )
        }
        expanded={expanded} attended={attended} archived={archived} location={details["Location"]} cost={details["Cost"]} />

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
              : `${details["Start Date"] || "TBD"} - ${details["End Date"] || "TBD"
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
      <EditTrip registrationPassed={registrationPassed} setRefresh={setRefresh!} tripId={id} tripName={name} location={details["Location"]} price={finalPrice} description={description} startDate={new Date(`${details["Start Date"]}T${details["Start Time"]}`)} endDate={new Date(`${details["End Date"]}T${details["End Time"]}`)} registrationDeadline={new Date(registrationDeadline)} capacity={parseInt(details["Capacity"], 10)} color={theme.palette.tertiary.main} open={edit} onClose={() => { setEdit(false) }} />
      <RestrictUsers setRefresh={setRefresh!} eventId={id} eventName={name} eventType={"trip"} allowedUsers={allowedUsers} open={restrictUsers} onClose={() => setRestrictUsers(false)} />
      <CancelRegistration setRefresh={setRefresh!} eventId={id} open={cancelRegisteration} onClose={() => setCancelRegisteration(false)} isRefundable={isRefundable} />
      <ArchiveEvent setRefresh={setRefresh!} eventId={id} eventName={name} eventType={"trip"} open={archive} onClose={() => setArchive(false)} />
      <RegisterEventModal open={register} onClose={() => { setRegister(false); }} onParentClose={() => setDetailsModalOpen(false)}
        eventType={"Trip"} userInfo={userInfo} eventId={id} color={background} paymentOpen={() => setPaymentDrawerOpen(true)} />


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
          onParentClose={() => setDetailsModalOpen(false)}
          button={(user == "staff" || user == "student" || user == "ta" || user == "professor") && (
            !(datePassed || attended) && (
              <>
                {registered || isRegisteredEvent ? (
                  // User is registered - show cancel button
                  <CustomButton
                    size="small"
                    variant="outlined"
                     sx={{
                        borderRadius: 999,
                        backgroundColor: `${theme.palette.error.main}`,
                        color:  "#fff",
                        border: `1px solid ${theme.palette.error.dark}`,
                        fontWeight: 600,
                        px: 3,
                        textTransform: "none",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                        },
                        width: 'fit-content'
                      }}
                    onClick={() => setCancelRegisteration(true)}
                  >
                    Cancel Registration
                  </CustomButton>
                ) : waitlistInfo.isOnWaitlist ? (
                  // User is on waitlist
                  waitlistInfo.status === "pending_payment" ? (
                    <CustomButton
                      size="small"
                      variant="contained"
                      sx={{
                        borderRadius: 999,
                        backgroundColor: `${theme.palette.success.main}`,
                        color: "#fff",
                        border: `1px solid ${theme.palette.success.dark}`,
                        fontWeight: 600,
                        px: 3,
                        textTransform: "none",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                        },
                      }}
                      onClick={() => setRegister(true)}
                    >
                      Complete Payment
                    </CustomButton>
                  ) : (
                    <CustomButton
                      size="small"
                      variant="contained"
                      sx={{
                        borderRadius: 999,
                        backgroundColor: `${theme.palette.warning.main}`,
                        color: "#fff",
                        border: `1px solid ${theme.palette.warning.dark}`,
                        fontWeight: 600,
                        px: 3,
                        textTransform: "none",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                        },
                      }}
                      onClick={() => setLeaveWaitlistOpen(true)}
                    >
                      Leave Waitlist
                    </CustomButton>
                  )
                ) : isFull ? (
                  !(registrationPassed) && (
                    <CustomButton
                      size="small"
                      variant="contained"
                      sx={{
                        borderRadius: 999,
                        backgroundColor: `${theme.palette.info.main}`,
                        color: "#fff",
                        border: `1px solid ${theme.palette.info.dark}`,
                        fontWeight: 600,
                        px: 3,
                        textTransform: "none",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                        },
                      }}
                      onClick={() => setJoinWaitlistOpen(true)}
                    >
                      Join Waitlist
                    </CustomButton>
                  )
                ) : (
                  !(registrationPassed) && (
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
                  )
                )}
              </>
            )
          )}
          sections={user == "vendor" ? ['general', 'details'] : ['general', 'details',
            'reviews']}
          user={user ? user : ""}
          attended={attended}
          eventId={id}
          userId={userInfo._id}/>
      </CustomModalLayout>

      <PaymentDrawer
        open={paymentDrawerOpen}
        onClose={() => setPaymentDrawerOpen(false)}
        totalAmount={parseInt(details["Cost"])}
        walletBalance={userInfo.walletBalance || 0}
        onPaymentSuccess={handlePaymentSuccess}
        eventId={id}
        email={userInfo.email}
      />

      {/* Waitlist Modals */}
      <JoinWaitlistModal
        eventId={id}
        eventName={name}
        open={joinWaitlistOpen}
        onClose={() => setJoinWaitlistOpen(false)}
        setRefresh={setRefresh!}
        color={background}
      />
      <LeaveWaitlistModal
        eventId={id}
        eventName={name}
        open={leaveWaitlistOpen}
        onClose={() => setLeaveWaitlistOpen(false)}
        setRefresh={setRefresh!}
      />
    </>
  );
};

export default TripView;
