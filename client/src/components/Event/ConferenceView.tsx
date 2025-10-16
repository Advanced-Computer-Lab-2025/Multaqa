"use client";
import React, { useState } from "react";
import ActionCard from "../shared/cards/ActionCard";
import { ConferenceViewProps } from "./types";
import theme from "@/themes/lightTheme";
import { Trash2 } from "lucide-react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { Copy, Check } from "lucide-react";
import { CustomModal } from "../shared/modals";
import Utilities from "../shared/Utilities";

const ConferenceView: React.FC<ConferenceViewProps> = ({
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

  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyLink = () => {
    const link = details["Link"] || "";
    if (link) {
      navigator.clipboard.writeText(link).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
    }
  };

  const metaNodes = [
    <Typography key="date" variant="body2" sx={{ color: "#6b7280" }}>
      {formatDateRange()}
    </Typography>,
    <Typography key="budget" variant="caption" sx={{ color: "#6b7280" }}>
      Budget: {details["Required Budget"] || "TBD"}
    </Typography>,
    ...(details["Link"]
      ? [
          <Box
            key="link"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              cursor: "pointer",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.primary.main,
                textDecoration: "underline",
                "&:hover": {
                  color: theme.palette.primary.dark,
                },
              }}
              onClick={() => window.open(details["Link"], "_blank")}
            >
              {details["Link"]}
            </Typography>
            <IconButton
              size="small"
              onClick={handleCopyLink}
              sx={{
                padding: 0.25,
                "&:hover": {
                  backgroundColor: theme.palette.primary.light + "20",
                },
              }}
            >
              {copySuccess ? (
                <Check size={14} color="green" />
              ) : (
                <Copy size={14} color="#6b7280" />
              )}
            </IconButton>
          </Box>,
        ]
      : []),
  ];

  const detailsContent = (
    <Box>
      {/* Description */}
      {description && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ color: theme.palette.warning.dark, mb: 1 }}
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
            sx={{ color: theme.palette.warning.dark, mb: 1 }}
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

      {/* Other Details */}
      
     {user==="events-office"||user==="admin"? <Box>
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{ color: theme.palette.warning.dark, mb: 1 }}
        >
          Additional Details
        </Typography>
        {Object.entries(details)
          .filter(
            ([key]) =>{
              const baseExcluded = [
                "Start Date",
                "End Date",
                "Start Time",
                "End Time",
                "Professors Participating",
              ];
            return !baseExcluded.includes(key);
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
      </Box>: <></>}
    </Box>
  );

  return (
    <>
      <ActionCard
        title={name}
        tags={[
          {
            label: "Conference",
            sx: {
              bgcolor: theme.palette.warning.light,
              color: theme.palette.warning.contrastText,
              fontWeight: 600,
            },
            size: "small",
          },
        ]}
        rightIcon={
          user === "admin" ? (
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
          ) : (user==="events-office"?<Utilities onDelete={handleOpenDeleteModal}/>:null) // add edit and delete handlers
        }
        metaNodes={metaNodes}
        registered={true}
        expanded={expanded}
        onExpandChange={setExpanded}
        details={detailsContent}
        borderColor={theme.palette.warning.main}
        elevation="soft"
      />

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
              color: "#666",
              mb: 3,
              fontSize: "0.9rem",
            }}
          >
            Budget: {details["Required Budget"] || "TBD"}
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
    </>
  );
};

export default ConferenceView;
