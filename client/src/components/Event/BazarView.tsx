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

const BazarView: React.FC<BazarViewProps> = ({
  id,
  details,
  name,
  description,
  user,
  registered,
  onDelete,
  icon: IconComponent,
  background,
  setRefresh,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

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

  const metaNodes = [
    <Typography key="datetime" variant="body2" sx={{ color: "#6b7280" }}>
      Deadline: {details["Registration Deadline"] || "TBD"}
    </Typography>,
    <Typography key="datetime" variant="caption" sx={{ color: "#6b7280" }}>
      {details["Start Date"] || "TBD"} - {details["End Date"] || "TBD"}
    </Typography>,
    <Typography key="location" variant="caption" sx={{ color: "#6b7280" }}>
      {details["Location"] || "TBD"}
    </Typography>,
    <Typography key="vendors" variant="caption" sx={{ color: "#6b7280" }}>
      {details["Vendor Count"] ? `${details["Vendor Count"]} vendors` : ""}
    </Typography>,
  ];

  const detailsContent = (
    <Box> 
      {/* sx={{backgroundColor: `${background}10`}} */}
      {/* Description */}
      {description && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ color: background, mb: 1 }}
          >
            Description
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: "14px", lineHeight: 1.5 }}
          >
            {description}
          </Typography>
        </Box>
      )}

      {/* Event Details */}
      <Box>
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{ color: background, mb: 1 }}
        >
          Event Details
        </Typography>
        {Object.entries(details).map(([key, value]) => (
          <Box
            key={key}
            sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
          >
            <Typography variant="caption" sx={{ fontWeight: 500 }}>
              {key}:
            </Typography>
            <Typography variant="caption" sx={{ color: "#6b7280" }}>
              {value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );

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
              "&:hover": {
                backgroundColor: "rgba(255, 0, 0, 0.1)",
                color: "error.main",
              },
            }}
          >
            <Trash2 size={16} />
          </IconButton>
        </Tooltip>
      ) : (user === "events-office" || user === "events-only" ? <Utilities onEdit={() => { setEdit(true); } } onDelete={handleOpenDeleteModal} event={"Bazaar"}  color={background}/> : null)}
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
        )} expanded={expanded} location={details["Location"]}         />
      {/* <ActionCard
        title={name}
        background={background}
        leftIcon={<IconComponent sx={{ backgroundColor: `${background}20`,   color: background,
                        mb: 1,
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        padding:"4px",
                        transition: "background-color 0.2s ease",
                        "&:hover": {
                          backgroundColor: `${background}30`,
                        },}} />}
        tags={[
          {
            label: "Bazaar",
            sx: {
              bgcolor: `${background}20`,
              color:background,
              fontWeight: 600,
            },
            size: "small",
          },
        ]}
        metaNodes={metaNodes}
        rightSlot={
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
        rightIcon={
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
          ) : (user==="events-office" || user==="events-only"?<Utilities onEdit={()=>{setEdit(true)}} onDelete={handleOpenDeleteModal}/>:null) // add edit and delete handlers
        }
        registered={registered || !(user == "vendor")}
        expanded={expanded}
        onExpandChange={setExpanded}
        details={detailsContent}
        borderColor={background}
        elevation="soft"
      /> */}

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
          details={details}
          color={background}
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
        />
      </CustomModalLayout>
    </>
  );
};

export default BazarView;