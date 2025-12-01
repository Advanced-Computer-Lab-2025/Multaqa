"use client";
import React, { useState } from "react";
import { Box, Typography, Avatar, IconButton, Tooltip, Stack } from "@mui/material";
import ActionCard from "../shared/cards/ActionCard";
import { BoothViewProps } from "./types";
import theme from "@/themes/lightTheme";
import CustomButton from "../shared/Buttons/CustomButton";
import { Trash2 , Ban, Archive} from "lucide-react";
import { CustomModal, CustomModalLayout } from "../shared/modals";
import EventCard from "../shared/cards/EventCard";
import EventDetails from "./Modals/EventDetails";
import RestrictUsers from "./Modals/RestrictUsers";
import ArchiveEvent from "./Modals/ArchiveEvent";

const BoothView: React.FC<BoothViewProps> = ({
  company,
  people,
  details,
  description,
  user,
  icon: IconComponent, 
  background,
  registered,
  onDelete,
  setRefresh,
  attended ,
  archived,
  allowedUsers,
  id,
  userInfo, 
  payButton,
  vendorStatus, 
  isRequested = false,
  datePassed
}) => {
  const [expanded, setExpanded] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<boolean>(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [restrictUsers, setRestrictUsers] = useState(false);
  const [archive, setArchive] = useState(false);
  const isFavorited = Boolean(userInfo?.favorites?.some((f:any) => {
    const fid = f?._id?.$oid || f?._id || f;
    return String(fid) === String(id);
  }));
  const updatedDetails={...details,people}

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
    <EventCard eventId={id}       payButton={payButton}
        vendorStatus={vendorStatus} isUpcoming={!datePassed} isFavorite={isFavorited} title={company} attended={attended} startDate={details["Start Date"]} endDate={details["End Date"]} startTime={details["Start Time"]} endTime={details["End Time"]} duration={details["Setup Duration"]} location={details["Location"]} color={background} leftIcon={<IconComponent />} eventType={"Booth"} onOpenDetails={() => setDetailsModalOpen(true)}  utilities={
         (user === "events-office" ||   user === "admin")? (
         <Stack direction="row" spacing={1}>
          {(user === "events-office" && !archived)?
          <>
           <Tooltip title ={"Archive Booth"}>
            <IconButton
              size="medium"
              onClick={() => setArchive(true)}
              sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "#ff980015",
                    borderColor: "warning.main",
                    color: "warning.main",
                  },
                }}
            >
              <Archive size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title ={"Restrict Booth"}>
                    <IconButton
                      size="medium"
                      onClick={() => setRestrictUsers(true)}
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
                      <Ban size={18} />
                    </IconButton>
                  </Tooltip>
            </>      
          :<></>}  
         <Tooltip title="Delete Booth">
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
            </Stack>    
          ) : null
        }
          registerButton={
          !registered &&
          user == "vendor" && !isRequested? (
            <CustomButton
              size="small"
              variant="contained"
              // color="primary"
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
            >
              Apply
            </CustomButton>
          )
        :null} expanded={expanded} archived={archived}/>
      {/* Delete Confirmation Modal */}
      <CustomModal
        open={eventToDelete}
        onClose={handleCloseDeleteModal}
        title="Delete Booth"
        description={`Are you sure you want to delete the booth for "${company}"? This action cannot be undone.`}
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
            {company}
          </Typography>

          <Typography
            sx={{
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
              color: "#666",
              mb: 1,
              fontSize: "0.95rem",
            }}
          >
            {details["Duration"] || "TBD"}
          </Typography>

          <Typography
            sx={{
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
              color: "#666",
              mb: 3,
              fontSize: "0.9rem",
            }}
          >
            {details["Location"] || "TBD"} • Size:{" "}
            {details["Booth Size"] || "TBD"}
          </Typography>

          <Typography
            sx={{
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
              color: theme.palette.error.main,
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            Are you sure you want to delete this booth? This action cannot be
            undone.
          </Typography>
        </Box>
      </CustomModal>
        <CustomModalLayout
                    open={detailsModalOpen}
                    onClose={() => setDetailsModalOpen(false)}
                    width="w-[95vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw]"
                    borderColor={background}
                  >
                    <EventDetails
                    title={company}
                    eventType="Booth"
                    details={updatedDetails}
                    color={background}
                    description={description}
                    userId={userInfo._id}
                    button={
                      !registered &&
                      user == "vendor" && (
                        <CustomButton
                          size="small"
                          variant="contained"
                          // color="primary"
                          sx={{ borderRadius: 999 , backgroundColor: `${background}20`,
                          color:background, borderColor:background}}
                        >
                          Apply
                        </CustomButton>
                      )
                    }
                      sections={user=="vendor"?['general', 'details']:['general','details',
                      'reviews']}
                    user={user?user:""}
                    attended ={attended}
                    eventId={id}
                    />
                  </CustomModalLayout>
                  <RestrictUsers setRefresh={setRefresh} eventId={id} eventName={company} eventType={"platform_booth"} allowedUsers={allowedUsers} open={restrictUsers} onClose={() => setRestrictUsers(false)} />
                  <ArchiveEvent setRefresh={setRefresh} eventId={id} eventName={company} eventType="platform_booth" open={archive} onClose={() => setArchive(false)}/>
    </>
  );
};

export default BoothView;
