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
  userInfo
}) => {
  const [expanded, setExpanded] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [restrictUsers, setRestrictUsers] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const updatedDetails = {...details, vendors};

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
      ) : (user === "events-office" || user === "events-only" ? <Utilities onRestrict={() => setRestrictUsers(true)} onEdit={() => { setEdit(true); } } onDelete={handleOpenDeleteModal} event={"Bazaar"}  color={background}/> : null)}
      registerButton={!registered &&
        user == "vendor" && (
          <CustomButton
            size="small"
            variant="contained"
            // color="secondary"
            sx={{
              borderRadius: 999, backgroundColor: `${background}20`,
              color: background, borderColor: background
            }}
            onClick={handleOpenModal}
          >
            Apply
            <BazarFormModalWrapper
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              bazarId={id} />
          </CustomButton>
        )} expanded={expanded} location={details["Location"]}  
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
        startDate={new Date(details['Start Date'])} 
        endDate={new Date (details['End Date'])} 
        registrationDeadline={new Date(details['Registration Deadline'])} open={edit} 
        onClose={()=> {setEdit(false)}}
      />
      <RestrictUsers setRefresh={setRefresh} eventId={id} eventName={name} eventType={"Bazaar"} open={restrictUsers} onClose={() => setRestrictUsers(false)} />  
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
          button={
          !registered &&
          user == "vendor" && (
            <CustomButton
              size="small"
              variant="contained"
             // color="secondary"
              sx={{ borderRadius: 999 , backgroundColor: `${background}20`,
              color:background, borderColor:background}}
              onClick={handleOpenModal}
            >
              Apply
              <BazarFormModalWrapper
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                bazarId={id}
              />
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
    </>
  );
};

export default BazarView;