"use client";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ActionCard from "../shared/cards/ActionCard";
import { BazarViewProps } from "./types";
import theme from "@/themes/lightTheme";
import CustomButton from "../shared/Buttons/CustomButton";
import { CustomModal } from "../shared/modals";

const BazarView: React.FC<BazarViewProps> = ({
  details,
  name,
  description,
  user,
  registered,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<boolean>(false);

  const handleOpenDeleteModal = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEventToDelete(true);
  };

  const handleCloseDeleteModal = () => {
    setEventToDelete(false);
  };

  const deleteEventHandler = () => {
    // Your delete logic here
    console.log("Delete clicked for bazaar:", name);
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
            >
              Apply
            </CustomButton>
          )
        }
        rightIcon={
          user === "events-office" ? (
            <IconButton
              size="small"
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
          ) : null
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
          label: "Delete Bazaar",
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
              color: "#666",
              mb: 3,
              fontSize: "0.9rem",
            }}
          >
            {details["Location"] || "TBD"} •{" "}
            {details["Vendor Count"]
              ? `${details["Vendor Count"]} vendors`
              : ""}
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
    </>
  );
};

export default BazarView;
