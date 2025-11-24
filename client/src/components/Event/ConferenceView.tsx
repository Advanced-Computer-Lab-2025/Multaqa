"use client";
import React, { useState } from "react";
import ActionCard from "../shared/cards/ActionCard";
import { ConferenceViewProps } from "./types";
import EditIcon from "@mui/icons-material/Edit";
import theme from "@/themes/lightTheme";
import { Trash2 } from "lucide-react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { Copy, Check } from "lucide-react";
import { CustomModal, CustomModalLayout } from "../shared/modals";
import Utilities from "../shared/Utilities";
import EditConference from "../../components/tempPages/EditConference/EditConference";
import EventCard from "../shared/cards/EventCard";
import EventDetails from "./Modals/EventDetails";
import RestrictUsers from "./Modals/RestrictUsers";
import ArchiveEvent from "./Modals/ArchiveEvent";

const ConferenceView: React.FC<ConferenceViewProps> = ({
  id,
  details,
  name,
  description,
  agenda,
  icon:IconComponent, 
  background,
  user,
  onDelete,
  setRefresh,
  attended,
  archived,
  userInfo
}) => {
  const [expanded, setExpanded] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<boolean>(false);
  const [edit, setEdit] = useState(false)
  const [restrictUsers, setRestrictUsers] = useState(false);
  const [archive, setArchive] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const isFavorited = Boolean(userInfo?.favorites?.some((f:any) => {
    const fid = f?._id?.$oid || f?._id || f;
    return String(fid) === String(id);
  }));

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
    <EventCard eventId={id} isFavorite={isFavorited} title={name} attended={attended} startDate={details["Start Date"]} endDate={details["End Date"]} startTime={details["Start Time"]} endTime={details["End Time"]} totalSpots={details["Capacity"]}  link={details["Link"]} color={background} leftIcon={<IconComponent />} eventType={"Conference"} spotsLeft={details["Spots Left"]}  onOpenDetails={() => setDetailsModalOpen(true)} utilities={ user === "admin" ? (
            <Tooltip title="Delete Conference">
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
          ) : ( user==="events-office"|| user==="events-only"?
           <Utilities archived={archived} onRestrict={() => setRestrictUsers(true)} onArchive={() => setArchive(true)} onEdit={() => { setEdit(true); } } onDelete={handleOpenDeleteModal} event={"Conference"}  color={background}/> : null)} 
        expanded={expanded} archived={archived} location={details["Location"]} />


      {/* Delete Confirmation Modal */}
      <CustomModal
        open={eventToDelete}
        onClose={handleCloseDeleteModal}
        title="Delete Conference"
        description={`Are you sure you want to delete the conference "${name}"? This action cannot be undone.`}
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
            Are you sure you want to delete this conference? This action cannot
            be undone.
          </Typography>
        </Box>
      </CustomModal>
      <EditConference
        conferenceId={id}
        open={edit} 
        onClose={() => setEdit(false)} 
        setRefresh={setRefresh} 
        eventName= {name}
        description={description}
        eventStartDate = {details["Start Date"]} 
        eventEndDate =  {details["End Date"]}
        requiredBudget = {details["Required Budget"]}
        fundingSource = {details["Funding Source"]}
        websiteLink = {details["Link"]}
        agenda={agenda}
        extraRequiredResources={details["Extra Required Resources"]}
        eventStartTime={details["Start Time"]}
        eventEndTime={details["End Time"]}
      />
      <RestrictUsers setRefresh={setRefresh} eventId={id} eventName={name} eventType={"conference"} open={restrictUsers} onClose={() => setRestrictUsers(false)} />
        <ArchiveEvent setRefresh={setRefresh} eventName={name} eventId={id} eventType={"conference"} open={archive} onClose={() => setArchive(false)}/>
       <CustomModalLayout
                    open={detailsModalOpen}
                    onClose={() => setDetailsModalOpen(false)}
                    width="w-[95vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw]"
                    borderColor={background}
                  >
                    <EventDetails
                      title={name}
                      description={description}
                      eventType="Conference"
                      details={details}
                      agenda={agenda}
                      color={background}
                      sections={user=="vendor"?['general', 'agenda','details']:['general','details','agenda',
                        'reviews']}
                      user={user?user:""}
                      attended ={attended}
                      eventId={id}
                      userId={userInfo._id}
                    />
                  </CustomModalLayout>
    </>
  );
};

export default ConferenceView;
