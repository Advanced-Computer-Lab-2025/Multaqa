"use client";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Box, Typography, IconButton, Tooltip, Avatar } from "@mui/material";
import ActionCard from "../shared/cards/ActionCard";
import { BazarViewProps } from "./types";
import theme from "@/themes/lightTheme";
import CustomButton from "../shared/Buttons/CustomButton";
import { CustomModal } from "../shared/modals";
import BazarFormModalWrapper from "./helpers/BazarFormModalWrapper";
import Utilities from "../shared/Utilities";
import EditBazaar from "../tempPages/EditBazaar/EditBazaar";
import { getAvatarColor, getInitials } from "./helpers";

const BazarView: React.FC<BazarViewProps> = ({
  id,
  details,
  name,
  vendors,
  description,
  user,
  registered,
  onDelete,
  setRefresh,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [edit, setEdit] = useState(false)

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
      {/* Description */}
      {description && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ color: theme.palette.secondary.dark, mb: 1 }}
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

       {/* Vendors */}
       {vendors && vendors.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ color: theme.palette.tertiary.dark, mb: 1 }}
          >
          Vendors Participating
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {vendors.map((vendor, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1,
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: getAvatarColor(vendor),
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {getInitials(vendor)}
                </Avatar>
                <Typography
                  variant="caption"
                  sx={{ fontSize: "12px", color: "text.primary" }}
                >
                  {vendor}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Event Details */}
      <Box>
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{ color: theme.palette.secondary.dark, mb: 1 }}
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
      <ActionCard
        title={name}
        tags={[
          {
            label: "Bazaar",
            sx: {
              bgcolor: theme.palette.secondary.light,
              color: theme.palette.secondary.contrastText,
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
              color="secondary"
              sx={{ borderRadius: 999 }}
              onClick={handleOpenModal}
            >
              Apply
              <BazarFormModalWrapper
                isOpen={isModalOpen}
                onClose={handleCloseModal}
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
        borderColor={theme.palette.secondary.main}
        elevation="soft"
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
      <EditBazaar setRefresh={setRefresh} bazaarId={id} bazaarName={name} location={details["Location"]}  description={description} startDate={new Date(details['Start Date'])} endDate={new Date (details['End Date'])} registrationDeadline={new Date(details['Registration Deadline'])} open={edit} onClose={()=> {setEdit(false)}}/>
    </>
  );
};

export default BazarView;
