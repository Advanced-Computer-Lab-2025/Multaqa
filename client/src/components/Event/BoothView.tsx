"use client";
import React, { useState } from "react";
import { Box, Typography, Avatar, IconButton, Tooltip } from "@mui/material";
import ActionCard from "../shared/cards/ActionCard";
import { BoothViewProps } from "./types";
import theme from "@/themes/lightTheme";
import CustomButton from "../shared/Buttons/CustomButton";
import { Trash2 } from "lucide-react";
import { CustomModal } from "../shared/modals";

const BoothView: React.FC<BoothViewProps> = ({
  company,
  people,
  details,
  user,
  registered,
  onDelete,
  id
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
  // Helper function to extract initials from name
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
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

  const metaNodes = [
    <Typography key="duration" variant="body2" sx={{ color: "#6b7280" }}>
      {details["Duration"] || "TBD"}
    </Typography>,
    <Typography key="location" variant="caption" sx={{ color: "#6b7280" }}>
      {details["Location"] || "TBD"}
    </Typography>,
 (user === "events-office" || user==="admin") && (
  <Typography key="booth-size" variant="caption" sx={{ color: "#6b7280" }}>
    Size: {details["Booth Size"] || "TBD"}
  </Typography>
 )
  ];

  const detailsContent = (
    <Box>
      {/* Description */}
      {details["Description"] && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ color: theme.palette.primary.dark, mb: 1 }}
          >
            Description
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: "14px", lineHeight: 1.5 }}
          >
            {details["Description"]}
          </Typography>
        </Box>
      )}

      {/* People Section */}
      {(user === "events-office" || user === "admin") && people && people.length > 0 && (
  <Box sx={{ mb: 2 }}>
    <Typography
      variant="body2"
      fontWeight={600}
      sx={{ color: theme.palette.primary.dark, mb: 1 }}
    >
      Representatives
    </Typography>

  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
  {people.map((person, index) => (
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
          backgroundColor: getAvatarColor(person.name),
          fontSize: "12px",
          fontWeight: 600,
        }}
      >
        {getInitials(person.name)}
      </Avatar>

      <Box sx={{ flex: 1 }}>
        <Typography
          variant="caption"
          sx={{
            fontSize: "12px",
            color: "text.primary",
            fontWeight: 500,
          }}
        >
          {person.name}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            fontSize: "11px",
            color: "text.secondary",
            display: "block",
          }}
        >
          {person.email}
        </Typography>
      </Box>
    </Box>
  ))}
</Box>

  </Box>
)}

            {/* Other Details */}
      {(user === "events-office" || user === "admin") && (
        <Box>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ color: theme.palette.primary.dark, mb: 1 }}
          >
            Booth Details
          </Typography>

          {Object.entries(details)
            .filter(([key]) => {
              const baseExcluded = ["Description"];
              return !baseExcluded.includes(key);
            })
            .map(([key, value]) => (
              <Box
                key={key}
                sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
              >
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  {key}:
                </Typography>
                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                  {value || "TBD"}
                </Typography>
              </Box>
            ))}
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <ActionCard
        title={company}
        tags={[
          {
            label: "Booth",
            sx: { bgcolor: "#b2cee2", color: "#1E1E1E", fontWeight: 600 },
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
              color="primary"
              sx={{ borderRadius: 999 }}
            >
              Apply
            </CustomButton>
          )
        }
        registered={registered || !(user == "vendor")}
        rightIcon={
         (user === "events-office" ||   user === "admin")? (
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
          ) : null
        }
        expanded={expanded}
        onExpandChange={setExpanded}
        details={detailsContent}
        borderColor={theme.palette.primary.main}
        elevation="soft"
      />

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
    </>
  );
};

export default BoothView;
