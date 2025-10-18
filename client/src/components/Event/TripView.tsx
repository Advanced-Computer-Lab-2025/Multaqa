"use client";

import React, { useState } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import ActionCard from "../shared/cards/ActionCard";
import CustomButton from "../shared/Buttons/CustomButton";
import { BazarViewProps } from "./types";
import theme from "@/themes/lightTheme";
import { Trash2 } from "lucide-react";
import { CustomModal } from "../shared/modals";
import Utilities from "../shared/Utilities";
import RegisterEventModal from "./Modals/RegisterModal";
import EditTrip from "../tempPages/EditTrip/EditTrip";

const TripView: React.FC<BazarViewProps> = ({
  id,
  details,
  name,
  description,
  user,
  registered,
  onDelete,
  setRefresh,
  userInfo,
  isReady
}) => {
  const [expanded, setExpanded] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<boolean>(false);
  const [register, setRegister] = useState(false);
  const [edit, setEdit] = useState(false);

  const finalPrice = parseInt(details["Cost"], 10); // base 10
  const handleOpenDeleteModal = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setTripToDelete(true);
  };

  const handleCloseDeleteModal = () => {
    setTripToDelete(false);
  };

  const deleteTripHandler = () => {
    // Call the onDelete callback to remove from parent state
    onDelete?.();
    handleCloseDeleteModal();
  };

  const metaNodes = [
    <Typography key="datetime" variant="body2" sx={{ color: "#6b7280" }}>
      Deadline: {details["Registration Deadline"] || "TBD"}
    </Typography>,
    <Typography key="date-range" variant="caption" sx={{ color: "#6b7280" }}>
      {details["Start Date"] === details["End Date"]
        ? details["Start Date"] || "TBD"
        : `${details["Start Date"] || "TBD"} - ${details["End Date"] || "TBD"}`}
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
              onClick={()=> {setRegister(true)}}
            >
              Register
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
          ) : (user==="events-office" || user==="events-only"?<Utilities onEdit={()=> setEdit(true)} onDelete={handleOpenDeleteModal}/>:null) // add edit and delete handlers
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
          label: "Delete",
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
      <EditTrip setRefresh={setRefresh} tripId={id} tripName={name} location={details["Location"]} price={finalPrice} description={description} startDate={new Date(details['Start Date'])} endDate={new Date (details['End Date'])} registrationDeadline={new Date(details['Registration Deadline'])} capacity={0} open={edit} onClose={()=> {setEdit(false)}}/>
      <RegisterEventModal isReady={isReady} open={register} onClose={() => { setRegister(false); } }
      eventType={"Trip"} userInfo={userInfo} eventId={id}/>
    </>
  );
};

export default TripView;
