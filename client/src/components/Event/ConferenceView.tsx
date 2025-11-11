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
import Edit from "../shared/CreateConference/Edit";
import EventCard from "../shared/cards/EventCard";
import EventDetails from "./Modals/EventDetails";

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
  attended
}) => {
  const [expanded, setExpanded] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<boolean>(false);
  const [edit, setEdit] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

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
     <EventCard title={name} startDate={details["Start Date"]} endDate={details["End Date"]} startTime={details["Start Time"]} endTime={details["End Time"]} totalSpots={details["Capacity"]}  link={details["Link"]} color={background} leftIcon={<IconComponent />} eventType={"Conference"} spotsLeft={details["Spots Left"]}  onOpenDetails={() => setDetailsModalOpen(true)} utilities={ user === "admin" ? (
            <Tooltip title="Delete Conference">
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
          ) : ( user==="events-office"|| user==="events-only"?
           <Utilities onEdit={() => { setEdit(true); } } onDelete={handleOpenDeleteModal} event={"Conference"}  color={background}/> : null)} 
        expanded={expanded} location={details["Location"]} />


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
      <Edit 
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
                      color={background}
                      sections={user=="vendor"?['general', 'details']:['general','details',
                        'reviews']}
                      user={user?user:""}
                      attended ={attended}
                    />
                  </CustomModalLayout>
    </>
  );
};

export default ConferenceView;
