"use client";

import React, { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ActionCard from "../shared/cards/ActionCard";
import CustomButton from "../shared/Buttons/CustomButton";
import { BazarViewProps } from "./types";
import theme from "@/themes/lightTheme";
import { Trash2 } from "lucide-react";
import { CustomModal } from "../shared/modals";

const TripView: React.FC<BazarViewProps> = ({
  details,
  name,
  description,
  user,
  registered,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<boolean>(false);

  const handleOpenDeleteModal = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    console.log("Opening modal - Before:", tripToDelete);
    setTripToDelete(true);
    // Log after next render
    setTimeout(() => console.log("Opening modal - After:", tripToDelete), 0);
  };

  const handleCloseDeleteModal = () => {
    console.log("Closing modal");
    setTripToDelete(false);
  };

  const deleteTripHandler = () => {
    console.log("Delete clicked for trip:", name);
    handleCloseDeleteModal();
  };

  const metaNodes = [
    <Typography key="datetime" variant="body2" sx={{ color: "#6b7280" }}>
      Deadline: {details["Registration Deadline"] || "TBD"}
    </Typography>,
    <Typography key="date-range" variant="caption" sx={{ color: "#6b7280" }}>
      {
        details["Start Date"] === details["End Date"]
          ? details["Start Date"] || "TBD"
          : `${details["Start Date"] || "TBD"} - ${
              details["End Date"] || "TBD"
            }`
      }
    </Typography>,
    <Typography
      key="transportation"
      variant="caption"
      sx={{ color: "#6b7280" }}
    >
      {details["Location"] || "TBD"}
    </Typography>,
    <Typography key="cost" variant="caption" sx={{ color: "#6b7280" }}>
      {details["Cost"] || "TBD"}
    </Typography>,
  ];

  const detailsContent = (
    <Box>
      {description && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ color: theme.palette.info.dark, mb: 1 }}
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

      <Box>
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{ color: theme.palette.info.dark, mb: 1 }}
        >
          Trip Details
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

  console.log("TripView render - tripToDelete:", tripToDelete);

  return (
    <>
      <ActionCard
        title={name}
        type="events"
        tags={[
          {
            label: "Trip",
            sx: {
              bgcolor: theme.palette.info.light,
              color: theme.palette.info.contrastText,
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
              color="info"
              sx={{ borderRadius: 999 }}
            >
              Register
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
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              <Trash2 size={16} />
            </IconButton>
          ) : null
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
        borderColor={theme.palette.info.main}
        elevation="soft"
      />

      {/* Modal - Always render when tripToDelete is true */}
      <CustomModal
        open={tripToDelete}
        onClose={handleCloseDeleteModal}
        title="Delete Trip"
        modalType="delete"
        borderColor={theme.palette.error.main}
        buttonOption1={{
          label: "Delete Trip",
          variant: "contained",
          color: "error",
          onClick: deleteTripHandler,
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
            {details["Location"] || "TBD"} • Cost: {details["Cost"] || "TBD"}
          </Typography>

          <Typography
            sx={{
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
              color: theme.palette.error.main,
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            Are you sure you want to delete this trip? This action cannot be
            undone.
          </Typography>
        </Box>
      </CustomModal>
    </>
  );
};

export default TripView;