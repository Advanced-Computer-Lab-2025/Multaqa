"use client";
import React, { useState } from "react";
import { Box, Typography, Avatar, IconButton, Tooltip } from "@mui/material";
import ActionCard from "../shared/cards/ActionCard";
import CustomButton from "../shared/Buttons/CustomButton";
import { WorkshopViewProps } from "./types";
import theme from "@/themes/lightTheme";
import { Trash2 } from "lucide-react";
import { CustomModal } from "../shared/modals";
import Utilities from "../shared/Utilities";

const WorkshopView: React.FC<WorkshopViewProps> = ({
  details,
  name,
  description,
  agenda,
  user,
  registered,
  onDelete,
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
    // Call the onDelete callback to remove from parent state
    onDelete?.();
    handleCloseDeleteModal();
  };
  // Helper function to extract initials from professor name
  const getInitials = (name: string) => {
    let cleanName = name.trim();

    // Remove title (Dr., Eng., Prof., etc.) if present
    if (cleanName.includes(".")) {
      const dotIndex = cleanName.indexOf(".");
      cleanName = cleanName.substring(dotIndex + 1).trim();
    }

    const parts = cleanName.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return cleanName[0].toUpperCase();
  };

  // Helper function to get a color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFA07A",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E2",
    ];
    const hash = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // Parse professors string into array
  const professorString = details["Professors Participating"] || "";
  const professors = professorString
    .split(",")
    .map((prof) => prof.trim())
    .filter((prof) => prof.length > 0);

  // Format key details for display
  const formatDateRange = () => {
    const startDate = details["Start Date"];
    const endDate = details["End Date"];
    const startTime = details["Start Time"];
    const endTime = details["End Time"];

    if (startDate && endDate) {
      const dateRange =
        startDate === endDate ? startDate : `${startDate} - ${endDate}`;
      const timeRange = startTime && endTime ? `${startTime} - ${endTime}` : "";
      return timeRange ? `${dateRange}, ${timeRange}` : dateRange;
    }
    return "";
  };

  const metaNodes = [
    <Typography key="date" variant="body2" sx={{ color: "#6b7280" }}>
      {formatDateRange()}
    </Typography>,
    <Typography key="location" variant="caption" sx={{ color: "#6b7280" }}>
      {details["Location"] || "TBD"}
    </Typography>,
    <Typography key="capacity" variant="caption" sx={{ color: "#6b7280" }}>
      Capacity: {details["Capacity"] || "TBD"}
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
            sx={{ color: theme.palette.tertiary.dark, mb: 1 }}
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

      {/* Agenda */}
      {agenda && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ color: theme.palette.tertiary.dark, mb: 1 }}
          >
            Full Agenda
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: "14px", lineHeight: 1.5, whiteSpace: "pre-line" }}
          >
            {agenda}
          </Typography>
        </Box>
      )}

      {/* Professors */}
      {professors.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ color: theme.palette.tertiary.dark, mb: 1 }}
          >
            Professors Participating
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {professors.map((professor, index) => (
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
                    backgroundColor: getAvatarColor(professor),
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {getInitials(professor)}
                </Avatar>
                <Typography
                  variant="caption"
                  sx={{ fontSize: "12px", color: "text.primary" }}
                >
                  {professor}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Other Details */}
      <Box>
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{ color: theme.palette.tertiary.dark, mb: 1 }}
        >
          Additional Details
        </Typography>
        {Object.entries(details)
          .filter(
            ([key]) =>{ 
                        // Base fields to always exclude
            const baseExcluded = [
              "Start Date",
              "End Date",
              "Start Time",
              "End Time",
              "Professors Participating",
            ];

          // Additional fields to exclude for non-admin/non-events users
          const extraExcluded = [
            "Required Budget",
            "Source of Funding",
            "Extra Required Resources",
            'Funding Source'
          ];

          // Combine exclusion lists depending on the user
          const excludedKeys =
            user !== "events-office" && user !== "admin"
              ? [...baseExcluded, ...extraExcluded]
              : baseExcluded;

          return !excludedKeys.includes(key);
        }
          )
          .map(([key, value]) => (
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
            label: "Workshop",
            sx: {
              bgcolor: theme.palette.tertiary.main,
              color: theme.palette.tertiary.contrastText,
              fontWeight: 600,
            },
            size: "small",
          },
        ]}
        metaNodes={metaNodes}
        rightSlot={
          !registered &&
          (user == "staff" ||
            user == "student" ||
            user == "ta" ||
            user == "professor") && (
            <CustomButton
              size="small"
              variant="contained"
              color="tertiary"
              sx={{ borderRadius: 999 }}
            >
              Register
            </CustomButton>
          )
        }
        rightIcon={
         (user === "events-office"|| user === "admin" )? (
          <Tooltip title="Delete">
          <IconButton
                  size="medium"
                  onClick={onDelete}
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
          ) : (registered && user==="professor"? <Utilities/>: null)
        }
        registered={
          registered ||
          !(
            user == "staff" ||
            user == "student" ||
            user == "ta" ||
            user == "professor"
          )
        }
        expanded={expanded}
        onExpandChange={setExpanded}
        details={detailsContent}
        borderColor={theme.palette.tertiary.main}
        elevation="soft"
      />

      {/* Delete Confirmation Modal */}
      <CustomModal
        open={eventToDelete}
        onClose={handleCloseDeleteModal}
        title="Delete Workshop"
        description={`Are you sure you want to delete the workshop "${name}"? This action cannot be undone.`}
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
              color: "#666",
              mb: 3,
              fontSize: "0.9rem",
            }}
          >
            {details["Location"] || "TBD"} • Capacity:{" "}
            {details["Capacity"] || "TBD"}
          </Typography>

          <Typography
            sx={{
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
              color: theme.palette.error.main,
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            Are you sure you want to delete this workshop? This action cannot be
            undone.
          </Typography>
        </Box>
      </CustomModal>
    </>
  );
};

export default WorkshopView;
