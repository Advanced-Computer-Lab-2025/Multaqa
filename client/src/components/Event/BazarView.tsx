"use client";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import ActionCard from "../shared/cards/ActionCard";
import { BazarViewProps } from "./types";
import theme from "@/themes/lightTheme";
import CustomButton from "../shared/Buttons/CustomButton";
import { CustomModal, CustomModalLayout } from "../shared/modals";
import BazarFormModalWrapper from "./helpers/BazarFormModalWrapper";
import Utilities from "../shared/Utilities";
import EditBazaar from "../tempPages/EditBazaar/EditBazaar";
import EventCard from "../shared/cards/EventCard";
import EventDetails from "./Modals/EventDetails";
import RestrictUsers from "./Modals/RestrictUsers";
import CancelApplicationVendor from "./Modals/CancelApplicationVendor";
import ArchiveEvent from "./Modals/ArchiveEvent";
import VendorPaymentDrawer from "./helpers/VendorPaymentDrawer";

const BazarView: React.FC<BazarViewProps> = ({
  id,
  details,
  name,
  description,
  user,
  vendors,
  registered,
  onDelete,
  icon: IconComponent,
  background,
  setRefresh,
  attended,
  archived,
  allowedUsers,
  registrationDeadline,
  userInfo
}) => {
  const [expanded, setExpanded] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [cancelApplication, setCancelApplication] = useState(false);
  const [restrictUsers, setRestrictUsers] = useState(false);
  const [archive, setArchive] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false);
  const isFavorited = Boolean(userInfo?.favorites?.some((f:any) => {
    const fid = f?._id?.$oid || f?._id || f;
    return String(fid) === String(id);
  }));
  const updatedDetails = {...details, vendors};

  // find request for this event — the requestedEvents items contain an `event` object
  const requestForThisEvent = (userInfo?.requestedEvents || []).find((r: any) => {
    const ev = r?.event;
    const evId = ev?._id ?? ev?.id ?? ev;
    return String(evId) === String(id);
  });
  const isRequested = Boolean(requestForThisEvent);
  const requestStatus = requestForThisEvent?.status; // 'pending' | 'approved' etc.
  const hasPaid = requestForThisEvent?.hasPaid;
  const participationFee = requestForThisEvent?.participationFee;

  console.log(requestForThisEvent);
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleOpenDeleteModal = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEventToDelete(true);
  };

  const handleCloseDeleteModal = () => {
    setEventToDelete(false);
  };

  const deleteEventHandler = () => {
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
        eventType={"Bazaar"} 
        onOpenDetails={() => setDetailsModalOpen(true)}
        utilities={user === "admin" ? (
        <Tooltip title="Delete Bazaar">
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
      ) : (user === "events-office" || user === "events-only" ? <Utilities archived={archived} onRestrict={() => setRestrictUsers(true)} onArchive={() => setArchive(true)} onEdit={() => { setEdit(true); } } onDelete={handleOpenDeleteModal} event={"Bazaar"}  color={background}/> : null)}
     registerButton={ user == "vendor" &&
          (
            // if not requested -> show Apply
            !isRequested ? (
              <CustomButton
                size="small"
                variant="contained"
                 sx={{
                      borderRadius: 999,
                      border: `1px solid ${background}`,
                      backgroundColor: `${background}`,
                      color: background,
                      fontWeight: 600,
                      px: 3,
                      textTransform: "none",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                      },
                    }}
                onClick={handleOpenModal}
              >
                Apply
                <BazarFormModalWrapper
                  isOpen={isModalOpen}
                  onClose={handleCloseModal}
                  bazarId={id} 
                />
              </CustomButton>
            ) : (
              // if requested and status is approved but not paid -> show Pay button
              requestStatus === "approved" && !hasPaid ? (
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
                  onClick={() => setPaymentDrawerOpen(true)}
                >
                  Pay
                </CustomButton>
              ) : 
              // if requested and NOT approved -> show Cancel Application
              requestStatus !== "approved" && !hasPaid ? (
                <CustomButton
                  size="small"
                  variant="outlined"
                  sx={{
                      borderRadius: 999,
                      border: `1px solid ${theme.palette.error.dark}`,
                      backgroundColor: `${theme.palette.error.main}`,
                      color: theme.palette.primary.contrastText,
                      fontWeight: 600,
                      px: 3,
                      width: 'fit-content',
                      textTransform: "none",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                      },
                    }}
                  onClick={() => setCancelApplication(true)}
                >
                  Cancel Application
                </CustomButton>
              ) : null // if paid or other status, render nothing
            )
          )
        } expanded={expanded} archived={archived} location={details["Location"]}  
        />
      {/* Delete Confirmation Modal */}
      <CustomModal
        open={eventToDelete}
        onClose={handleCloseDeleteModal}
        title="Delete Bazaar"
        description={`Are you sure you want to delete the bazaar "${name}"? This action cannot be undone.`}
        modalType="delete"
        borderColor={theme.palette.error.main}
        buttonOption1={{
          label: "Delete",
          variant: "contained",
          color: "error",
          onClick: deleteEventHandler,
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
            {details["Start Date"] || "TBD"} - {details["End Date"] || "TBD"}
          </Typography>

          <Typography
            sx={{
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
              color: theme.palette.error.main,
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            Are you sure you want to delete this bazaar? This action cannot be
            undone.
          </Typography>
        </Box>
      </CustomModal>
      <EditBazaar  
        setRefresh={setRefresh} bazaarId={id} bazaarName={name} 
        location={details["Location"]}  description={description} 
        startDate={new Date(`${details["Start Date"]}T${details["Start Time"]}`)} 
        endDate={new Date (`${details["End Date"]}T${details["End Time"]}`)} 
        registrationDeadline={new Date(registrationDeadline)} open={edit} 
        onClose={()=> {setEdit(false)}} color={theme.palette.tertiary.main}
      />
      <RestrictUsers setRefresh={setRefresh} eventId={id} eventName={name} eventType={"bazaar"} allowedUsers={allowedUsers} open={restrictUsers} onClose={() => setRestrictUsers(false)} />
      <ArchiveEvent setRefresh={setRefresh} eventName={name} eventId={id} eventType={"bazaar"}open={archive} onClose={() => setArchive(false)}/>    
      <CustomModalLayout
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        width="w-[95vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw]"
        borderColor={background}
      >
        <EventDetails
          title={name}
          description={description}
          eventType="Bazaar"
          details={updatedDetails}
          color={background}
          userId={userInfo._id}
          button={ user == "vendor" &&
          (
            // if not requested -> show Apply
            !isRequested ? (
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
                onClick={handleOpenModal}
              >
                Apply
                <BazarFormModalWrapper
                  isOpen={isModalOpen}
                  onClose={handleCloseModal}
                  bazarId={id} 
                />
              </CustomButton>
            ) : (
              // if requested and status is approved but not paid -> show Pay button
              requestStatus === "approved" && !hasPaid ? (
                <CustomButton
                  size="small"
                  variant="contained"
                  sx={{
                      borderRadius: 999,
                      border: `1px solid ${theme.palette.success.dark}`,
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
                  onClick={() => {}}
                >
                  Pay
                </CustomButton>
              ) :
              // if requested and NOT approved -> show Cancel Application
              requestStatus !== "approved" && !hasPaid ? (
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
                  onClick={() => setCancelApplication(true)}
                >
                  Cancel Application
                </CustomButton>
              ) : null // if paid or other status, render nothing
            )
          )
        }
        sections={user=="vendor"?['general', 'details']:['general','details',
          'reviews']}
        user={user?user:""}
        attended ={attended}
        eventId={id}
        />
      </CustomModalLayout>
      <CancelApplicationVendor eventId={id} open={cancelApplication} onClose={() => setCancelApplication(false)} setRefresh={setRefresh}/>
      <VendorPaymentDrawer
        open={paymentDrawerOpen}
        onClose={() => setPaymentDrawerOpen(false)}
        eventId={id}
        totalAmount={participationFee}
        email={userInfo.email}
      />
    </>
  );
};

export default BazarView;