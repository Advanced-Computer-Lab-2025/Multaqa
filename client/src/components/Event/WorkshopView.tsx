"use client";
import React, { useState } from "react";
import { Box, Typography, Avatar, IconButton, Tooltip, Divider, Grid } from "@mui/material";
import ActionCard from "../shared/cards/ActionCard";
import CustomButton from "../shared/Buttons/CustomButton";
import { WorkshopViewProps } from "./types";
import theme from "@/themes/lightTheme";
import { Trash2, MapPin, Users, Calendar, Clock, AlertCircle } from "lucide-react";
import { CustomModal } from "../shared/modals";
import Utilities from "../shared/Utilities";
import RegisterEventModal from "./Modals/RegisterModal";
import EventCard from "../shared/cards/EventCard";
import { CustomModalLayout } from "../shared/modals";
import EventDetails from "./Modals/EventDetails";

interface DetailChipProps {
  label: string;
  value: string | number;
  color?: string; // Color is now optional if determined by 'urgent'
  icon: React.ReactNode; // For the custom icon components (AlertCircle, etc.)
  urgent?: boolean;
  chipSize?: 'small' | 'default'; // New prop to control size
}
// ------------------------------------

interface SectionTitleProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

interface ProfessorGridItemProps {
    professor: string;
    getAvatarColor: (name: string) => string;
    getInitials: (name: string) => string;
}

interface InfoRowProps {
  label: string;
  value: string | number;
  highlight?: boolean;
}

// ------------------------------------------

const ProfessorGridItem: React.FC<ProfessorGridItemProps> = ({ 
    professor, 
    getAvatarColor, 
    getInitials 
}) => (
    <Grid size={{ xs: 12, md: 4, sm:6 }} >
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 2,
                borderRadius: 3,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s ease',
                "&:hover": {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    borderColor: 'primary.main',
                }
            }}
        >
            <Avatar
              sx={{
                width: 48,
                height: 48,
                backgroundColor: getAvatarColor(professor),
                fontSize: "16px",
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              {getInitials(professor)}
            </Avatar>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ color: "text.primary", flex: 1 }}
            >
              {professor}
            </Typography>
        </Box>
    </Grid>
);

// --------------------------------------------------------------------------------

const WorkshopView: React.FC<WorkshopViewProps> = ({
  id,
  details,
  name,
  description,
  professors,
  icon: IconComponent,
  background,
  agenda,
  user,
  registered,
  onDelete,
  isReady,
  userInfo
}) => {
  const [expanded, setExpanded] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<boolean>(false);
  const [register, setRegister] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const handleOpenDeleteModal = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEventToDelete(true);
  };

  const handleCloseDeleteModal = () => {
    setEventToDelete(false);
  };

  const deleteEventHandler = () => {
    onDelete?.();
    handleCloseDeleteModal();
  };

  const getInitials = (name: string) => {
    let cleanName = name.trim();
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

  const getAvatarColor = (name: string) => {
    const colors = [
      "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2",
    ];
    const hash = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const formatDateRange = () => {
    const rawStartDate = details["Start Date"];
    const rawEndDate = details["End Date"];
    
    const startDate = rawStartDate ? rawStartDate.split('T')[0] : '';
    const endDate = rawEndDate ? rawEndDate.split('T')[0] : '';
    
    const startTime = details["Start Time"];
    const endTime = details["End Time"];

    if (startDate && endDate) {
      const dateRange = startDate === endDate ? startDate : `${startDate} - ${endDate}`;
      const timeRange = startTime && endTime ? `${startTime} - ${endTime}` : "";
      return timeRange ? `${dateRange}, ${timeRange}` : dateRange;
    }
    return "";
  };

  const metaNodes = [
    <Typography key="date" variant="body2" sx={{ color: "text.primary", fontWeight: 500, display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Calendar size={16} />
      {formatDateRange()}
    </Typography>,
    <Typography key="location" variant="caption" sx={{ color: "text.primary", display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <MapPin size={14} />
      {details["Location"] || "TBD"}
    </Typography>,
    <Typography key="capacity" variant="caption" sx={{ color: "text.primary", display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Users size={14} />
      {details["Capacity"] || "TBD"} attendees
    </Typography>,
  ];

  const SectionTitle: React.FC<SectionTitleProps> = ({ children, icon }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, mt: 4 }}>
      {icon && <Box sx={{ color: background }}>{icon}</Box>}
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ color: 'text.primary', letterSpacing: '-0.02em' }}
      >
        {children}
      </Typography>
      <Box sx={{ flex: 1, height: '2px', background: `linear-gradient(to right, ${background}40, transparent)`, ml: 2 }} />
    </Box>
  );

  // 🚀 NEW DetailChip Component 🚀
const DetailChip: React.FC<DetailChipProps> = ({ 
  label, 
  value, 
  icon, 
  urgent, 
  color, 
  chipSize = 'default' 
}) => {
  
  // Determine primary color and background based on props
  const primaryColor = urgent ? theme.palette.error.main : color || background;
  
  // Adjusted Padding based on chipSize
  const paddingValue = chipSize === 'small' ? 1.2 : 2; 

  return (
    <Box
      sx={{
        p: paddingValue, // Reduced padding for smaller boxes
        borderRadius: 2,
        border: `1px solid ${primaryColor}50`,
        backgroundColor: `${primaryColor}10`,
        textAlign: 'left', // Aligned left for a cleaner look
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        minWidth: 100,
        flexGrow: 1,
        height: '100%', // Ensure all chips in a row are the same height
      }}
    >
      {/* Icon */}
      <Box sx={{ color: primaryColor, display: 'flex', alignItems: 'center' }}>
        {icon}
      </Box>

      {/* Label and Value */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography 
          variant="caption" 
          sx={{ color: primaryColor, fontWeight: 700, display: 'block', lineHeight: 1.2 }}
        >
          {label}
        </Typography>
        <Typography 
          variant={chipSize === 'small' ? "body2" : "body1"} // Use body2 for smaller font
          fontWeight={600} 
          sx={{ mt: 0.2, color: 'text.primary', lineHeight: 1.2 }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

const detailsContent = (
    <Box sx={{ px: 0.5 }}> 
      {/* Description section remains the same */}
      {description && (
        <Box sx={{ mb: 4 }}>
          <SectionTitle>About This Workshop</SectionTitle>
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: "15px", 
              lineHeight: 1.8, 
              color: 'text.primary',
              pl: 2
            }}
          >
            {description}
          </Typography>
        </Box>
      )}

      {/* Quick Stats - Highlighted Metrics */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          {/* Note: I'm leaving the 'size' prop as you requested, but remember 
             the correct MUI syntax is 'item xs={6} sm={3}'.
             We assume your custom components/setup handles 'size'. */}
          
          {details["Registration Deadline"] && (
            <Grid size={{ xs: 6, sm:3 }}>
              <DetailChip 
                label="Deadline" 
                value={details["Registration Deadline"].split('T')[0]}
                icon={<AlertCircle size={16} />} // Reduced icon size
                urgent={true}
                chipSize="small" // <-- PASS A PROP TO CONTROL INTERNAL SIZE
              />
            </Grid>
          )}
          {/* ... Apply similar changes to the other Grid items ... */}
          {details["Spots Left"] && (
            <Grid size={{ xs: 6, sm:3 }}>
              <DetailChip 
                label="Available Spots" 
                value={details["Spots Left"]}
                icon={<Users size={16} />} // Reduced icon size
                chipSize="small" 
              />
            </Grid>
          )}
          
          {details["Capacity"] && (
         <Grid size={{ xs: 6, sm:3 }}>
              <DetailChip 
                label="Total Capacity" 
                value={details["Capacity"]}
                icon={<Users size={16} />} // Reduced icon size
                chipSize="small"
              />
            </Grid>
          )}
          
          {details["Location"] && (
             <Grid size={{ xs: 6, sm:3 }}>
              <DetailChip 
                label="Venue" 
                value={details["Location"]}
                icon={<MapPin size={16} />} // Reduced icon size
                chipSize="small"
              />
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Agenda */}
      {agenda && (
        <Box sx={{ mb: 4 }}>
          <SectionTitle icon={<Clock size={22} />}>Schedule & Agenda</SectionTitle>
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="body1"
              sx={{ 
                fontSize: "15px", 
                lineHeight: 1.8, 
                whiteSpace: "pre-line", 
                color: 'text.primary'
              }}
            >
              {agenda}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Professors */}
      {professors.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <SectionTitle>Meet Your Instructors</SectionTitle>
          <Grid container spacing={2}>
            {professors.map((professor, index) => (
              <ProfessorGridItem
                key={index}
                professor={professor}
                getAvatarColor={getAvatarColor}
                getInitials={getInitials}
              />
            ))}
          </Grid>
        </Box>
      )}

      {/* Additional Details */}
      <Box>
        <SectionTitle>Additional Information</SectionTitle>
        <Box
          sx={{
            borderRadius: 3,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
            p:2
          }}
        >
          {Object.entries(details)
            .filter(([key]) => {
              const excludedKeys = [
              //   "Start Date", "End Date", "Start Time", "End Time", "Created By",
              //   "Registration Deadline", "Capacity", "Location", "Spots Left",
              ];
              
              if (user !== "events-office" && user !== "admin") {
                excludedKeys.push("Required Budget", "Source of Funding", "Extra Required Resources", 'Funding Source', "Status");
              }
              
              return !excludedKeys.includes(key);
            })
            .map(([key, value], index, array) => (
              <Box
                  key={key}
                  sx={{ display: "flex", justifyContent: "space-between", mb: 1.5, p: 0.5, borderBottom: '1px solid #eee' }}
              >
                  <Typography variant="body2" sx={{ fontWeight: 600, color:background, width: '50%' }}>
                      {key}:
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, width: '50%', textAlign: 'right' }}>
                      {value?value:'N/A'}
                  </Typography>
            </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
    <EventCard title={name} startDate={details["Start Date"]} endDate={details["End Date"]} startTime={details["Start Time"]} endTime={details["End Time"]} totalSpots={details["Capacity"]} color={background} leftIcon={<IconComponent />} eventType={"Workshop"} spotsLeft={details["Spots Left"]}  onOpenDetails={() => setDetailsModalOpen(true)} utilities={(user === "events-office" || user === "admin") ? (
        <Tooltip title="Delete Workshop">
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
      ) : null}
      registerButton={!registered &&
        (user == "staff" || user == "student" || user == "ta" || user == "professor") && (
          <CustomButton
            size="small"
            variant="contained"
            sx={{
              borderRadius: 999, backgroundColor: `${background}20`,
              color: background, borderColor: background,
              fontWeight: 600,
              px: 3,
              textTransform: 'none',
              boxShadow: `0 4px 14px ${background}40`,
              transition: 'all 0.3s ease',
              "&:hover": {
                backgroundColor: `${background}30`,
                transform: 'translateY(-2px)',
                boxShadow: `0 6px 20px ${background}50`,
              }
            }}
            onClick={() => { setRegister(true); } }
          >
            Register
          </CustomButton>
        )} expanded={expanded} location={details["Location"]} />
      {/* <ActionCard
        title={name}
        background={background}
        leftIcon={
            <Box
                sx={{ backgroundColor: `${background}20`,   color: background,
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
                        },
                }}
            >
                <IconComponent sx={{ fontSize: 26 }} />
            </Box>
        }
        tags={[
          {
            label: "Workshop",
            sx: { 
              bgcolor: `${background}15`, 
              color: background, 
              fontWeight: 600,
              border:`1px solid ${background}`,
            },
            size: "small",
          },
        ]}
        metaNodes={metaNodes}
        rightSlot={
          !registered &&
          (user == "staff" || user == "student" || user == "ta" || user == "professor") && (
            <CustomButton
              size="small"
              variant="contained"
              sx={{ 
               borderRadius: 999 , backgroundColor: `${background}20`,
                color:background, borderColor:background,
                fontWeight: 600,
                px: 3,
                textTransform: 'none',
                boxShadow: `0 4px 14px ${background}40`,
                transition: 'all 0.3s ease',
                "&:hover": {
                 backgroundColor: `${background}30`,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 6px 20px ${background}50`,
                }
              }}
              onClick={() => { setRegister(true) }}
            >
              Register
            </CustomButton>
          )
        }
        rightIcon={
         (user === "events-office"|| user === "admin" ) ? (
          <Tooltip title="Delete Workshop">
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
        borderColor={background}
        elevation="soft"
      /> */}

      {/* Delete Confirmation Modal */}
      <CustomModal
        open={eventToDelete}
        onClose={handleCloseDeleteModal}
        title="Confirm Deletion"
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
              : `${details["Start Date"] || "TBD"} - ${details["End Date"] || "TBD"}`}
          </Typography>

          <Typography
            sx={{
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
              color: theme.palette.error.main,
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            This action cannot be undone.
          </Typography>
        </Box>
      </CustomModal>
      <RegisterEventModal 
        isReady={isReady} 
        open={register} 
        onClose={() => { setRegister(false); } }
        eventType={"Workshop"} 
        userInfo={userInfo} 
        eventId={id}
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
                eventType="Workshop"
                details={details}
                color={background}
                onRegister={!registered && user === "vendor" ? () => setRegister(true) : undefined}
              />
            </CustomModalLayout>
    </>
  );
};

export default WorkshopView;