import React, { useState } from "react";
import { Box, Typography, IconButton, Chip, Tooltip } from "@mui/material";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  MapPin,
  Check,
  Copy,
  Wallet,
  ExternalLink,
} from "lucide-react";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { api } from "@/api";
import theme from "@/themes/lightTheme";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

interface EventCardProps {
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location?: string;
  duration?: string;
  spotsLeft?: string;
  link?: string;
  cost?: string;
  totalSpots?: string;
  color?: string;
  eventType: string;
  leftIcon?: React.ReactNode;
  utilities?: React.ReactNode;
  registerButton?: React.ReactNode;
  eventId?: string;
  isFavorite?: boolean;
  evaluateButton?: React.ReactNode;
  commentButton?: React.ReactNode;
  onExpandChange?: (expanded: boolean) => void;
  onOpenDetails?: () => void;
  expanded?: boolean;
  details?: Record<string, any>;
  attended?: boolean;
  professorStatus?: string;
  createdBy?: string;
  professors?: string[]; // Array of professor names for workshops
  archived?: boolean;
  payButton?: React.ReactNode;
  vendorStatus?: string;
  isUpcoming?: boolean;
  registrationDeadline?:string
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  startDate,
  endDate,
  startTime,
  endTime,
  location,
  link,
  cost,
  duration,
  spotsLeft,
  totalSpots,
  color = "#6366F1", // Default indigo color
  leftIcon,
  utilities,
  registerButton,
  onExpandChange,
  onOpenDetails,
  eventType,
  expanded = false,
  details,
  attended = false,
  eventId,
  isFavorite = false,
  commentButton,
  evaluateButton,
  professorStatus,
  createdBy,
  professors = [],
  archived = false,
  payButton,
  vendorStatus,
  isUpcoming = false,
  registrationDeadline,
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const spots = (spotsLeft && parseInt(spotsLeft)) || 0;
  const total = (totalSpots && parseInt(totalSpots)) || 0;
  const [copySuccess, setCopySuccess] = useState(false);
  const { user } = useAuth();
  const isEventsOffice =
    user?.role === "administration" &&
    (user as any).roleType === "eventsOffice";
  const [fav, setFav] = useState<boolean>(isFavorite);
  const [animateFav, setAnimateFav] = useState<boolean>(false);

  // Calculate deadline color based on urgency
  const getDeadlineColor = (deadlineString: string) => {
    if (!deadlineString) return "#6B7280"; // Default gray
    
    const deadline = new Date(deadlineString);
    const now = new Date();
    const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft <= 3) return "#EF4444"; // Red - 3 days or less
    if (daysLeft <= 7) return "#F97316"; // Orange - 1 week or less
    return color; // Purple - more than a week
  };

  const formatDeadlineText = (deadlineString: string) => {
    if (!deadlineString) return "";
    
    const deadline = new Date(deadlineString);
    const now = new Date();
    const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    console.log(title)
    console.log(daysLeft)
    if (daysLeft <= 0 || deadline<now) return "Registration closed";
    if (daysLeft === 1) return "Registration closes tomorrow";
    return `Registration closes in ${daysLeft} days`;
  };
  const normalizedTitle = title?.toLowerCase?.() ?? "";
  const normalizedCreatedBy = createdBy?.toLowerCase?.() ?? "";
  const normalizedLocation = location?.toLowerCase?.() ?? "";
  const normalizedEventType = eventType?.toLowerCase?.() ?? "";
  const isFuture = new Date(startDate) > new Date();
  const attendance = total-spots;
  console.log("typeof event:", eventType);

  const handleOpenModal = () => {
    if (onOpenDetails) {
      onOpenDetails();
    }
  };

  const statusChip = (status: string) => {
    if (status === "pending")
      return (
        <Chip
          size="small"
          label="Pending"
          color="warning"
          variant="outlined"
          sx={{
            fontWeight: 600,
            fontSize: "0.7rem",
            height: 24,
          }}
        />
      );
       if (status === "pending_payment")
      return (
        <Chip
          size="small"
          label="Pending Payment"
          color="info"
          variant="outlined"
          sx={{
            fontWeight: 600,
            fontSize: "0.7rem",
            height: 24,
          }}
        />
      );
    if (status === "awaiting_review")
      return (
        <Chip
          size="small"
          label="Awaiting Review"
          color="info"
          variant="outlined"
          sx={{
            fontWeight: 600,
            fontSize: "0.7rem",
            height: 24,
          }}
        />
      );
    if (status === "rejected")
      return (
        <Chip
          size="small"
          label="Rejected"
          color="error"
          variant="outlined"
          sx={{
            fontWeight: 600,
            fontSize: "0.7rem",
            height: 24,
          }}
        />
      );
    return (
      <Chip
        size="small"
        label="Accepted"
        color="success"
        variant="outlined"
        sx={{
          fontWeight: 600,
          fontSize: "0.7rem",
          height: 24,
        }}
      />
    );
  };

  const handleCopyLink = () => {
    if (link) {
      navigator.clipboard.writeText(link).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
    }
  };
  const handleExpand = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onExpandChange?.(newExpanded);
  };

  const handleToggleFavorite = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!eventId) return;
    const prev = fav;
    setFav(!prev);
    // trigger jump animation only when adding to favorites
    if (!prev) {
      setAnimateFav(true);
      window.setTimeout(() => setAnimateFav(false), 400);
    }
    try {
      if (!prev) {
        await api.post(`/users/favorites/${eventId}`);
      } else {
        await api.delete(`/users/favorites/${eventId}`);
      }
      // Dispatch custom event to notify favorites list to refresh
      window.dispatchEvent(
        new CustomEvent("favoritesUpdated", {
          detail: { eventId, added: !prev },
        })
      );
    } catch (err: any) {
      // revert on error
      setFav(prev);
      setAnimateFav(false);
      console.error("Failed to toggle favorite:", err);
      toast.error(err?.response?.data?.error || "Failed to update favorites", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: 3,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: `${color}30`,
        overflow: "hidden",
        transition: "all 0.3s ease",
        position: "relative",
        minHeight: 280,
        maxHeight: 280,
        "&:hover": {
          borderColor: color,
          transform: "translateY(-2px)",
          boxShadow: `0 8px 24px ${color}15`,
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: `linear-gradient(90deg, ${color}, ${color}90)`,
        },
      }}
      data-title-normalized={normalizedTitle}
      data-createdby-normalized={normalizedCreatedBy}
      data-location-normalized={normalizedLocation}
      data-eventtype-normalized={normalizedEventType}
    >
      {/* Header Section */}
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
          borderBottom: isExpanded ? `1px solid ${color}20` : "none",
          height: "100%",
        }}
      >
        {/* Left Icon */}
        {leftIcon && (
          <Box
            sx={{
              backgroundColor: `${color}10`,
              color: color,
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
              flexShrink: 0,
              transition: "all 0.2s ease",
              border: "1px solid",
              borderColor: `${color}30`,
              "&:hover": {
                backgroundColor: `${color}15`,
                borderColor: color,
              },
            }}
          >
            {leftIcon}
          </Box>
        )}

        {/* Content Section */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Top Row - Event Type and Spots/Utilities */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 0.75,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Chip
                label={eventType}
                size="small"
                sx={{
                  backgroundColor: `${color}08`,
                  color: color,
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  height: 24,
                  border: `1px solid ${color}`,
                  "&:hover": {
                    backgroundColor: `${color}15`,
                  },
                }}
              />
              {isUpcoming && (
                <Chip
                  label="Upcoming"
                  size="small"
                  sx={{
                    backgroundColor: "#ffff", // Green-50
                    color: "#047857", // Green-700
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    height: 24,
                    border: "1px solid #10b981", // Emerald-500
                    "&:hover": {
                      backgroundColor: "#d1fae5", // Green-100
                    },
                  }}
                />
              )}
              {attended && (
                <Chip
                  label="Attended"
                  size="small"
                  sx={{
                    backgroundColor: "#10b98108",
                    color: "#10b981",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    height: 24,
                    border: "1px solid #10b981",
                    "&:hover": {
                      backgroundColor: "#10b98115",
                    },
                  }}
                />
              )}
              {professorStatus && statusChip(professorStatus)}
               {vendorStatus && statusChip(vendorStatus)}
              {archived && (
                <Chip
                  label="Archived"
                  size="small"
                  sx={{
                    backgroundColor: theme.palette.warning.contrastText,
                    color: theme.palette.warning.main,
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    height: 24,
                    border: "1px solid " + theme.palette.warning.main,
                    "&:hover": {
                      backgroundColor: theme.palette.warning.light + "15",
                    },
                  }}
                />
              )}
            </Box>

            {/* Utilities and Action Buttons Group */}
            <Box
              sx={{ display: "flex", gap: 1, alignItems: "center", ml: "auto" }}
            >
              {/* Safe/Frequently Used Actions First */}
              {!isEventsOffice && (
                <Tooltip
                  title={fav ? "Remove from favorites" : "Add to favorites"}
                >
                  <Box
                    onClick={handleToggleFavorite}
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      width: 36,
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      border: "1px solid",
                      borderColor: fav ? "#F59E0B" : "divider",
                      borderRadius: 2,
                      color: fav ? "#F59E0B" : "inherit",
                      "&:hover": {
                        backgroundColor: fav
                          ? "rgba(245,158,11,0.12)"
                          : `${color}15`,
                        borderColor: fav ? "#F59E0B" : color,
                        color: fav ? "#F59E0B" : color,
                      },
                      transform: animateFav ? "translateY(-6px)" : "none",
                      "@keyframes jump": {
                        "0%": { transform: "translateY(0)" },
                        "30%": { transform: "translateY(-8px)" },
                        "60%": { transform: "translateY(0)" },
                        "100%": { transform: "translateY(0)" },
                      },
                      animation: animateFav ? "jump 360ms ease" : "none",
                    }}
                  >
                    {fav ? (
                      <BookmarkIcon sx={{ fontSize: 20, color: "#F59E0B" }} />
                    ) : (
                      <BookmarkBorderIcon sx={{ fontSize: 20 }} />
                    )}
                  </Box>
                </Tooltip>
              )}
              <Tooltip title={"More Info"}>
                <Box
                  onClick={handleOpenModal}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: `${color}15`,
                      borderColor: color,
                      color: color,
                    },
                  }}
                >
                  <ExternalLink size={18} />
                </Box>
              </Tooltip>

              {/* Moderate Actions (Edit, Archive, Restrict) and Dangerous (Delete) */}
              {utilities && utilities}
              {details && (
                <IconButton
                  size="small"
                  onClick={handleExpand}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    "&:hover": {
                      backgroundColor: `${color}10`,
                      borderColor: color,
                    },
                  }}
                >
                  {isExpanded ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </IconButton>
              )}
            </Box>
          </Box>

          {/* Title Row */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5, justifyContent: "space-between" }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                fontSize: "1.1rem",
                lineHeight: 1.3,
              }}
            >
              {title}
            </Typography>
            
            {/* Registration Deadline Chip */}
            {registrationDeadline && (
              <Chip
                icon={<Calendar size={14} />}
                label={formatDeadlineText(registrationDeadline)}
                size="small"
                sx={{
                  backgroundColor: getDeadlineColor(registrationDeadline),
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  height: "24px",
                  mt:2,
                  p:2,
                  "& .MuiChip-icon": {
                    color: "white",
                    fontSize: "14px",
                    marginLeft: "4px",
                  },
                }}
              />
            )}
          </Box>

          {/* Date, Time, and Location Info */}
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 0.8, flex: 1 }}
          >
            {startDate && endDate && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Calendar size={16} color={color} />
                <Typography
                  variant="body2"
                  sx={{
                    color: color,
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  {startDate === endDate
                    ? startDate
                    : `${startDate} - ${endDate}`}
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {startTime && endTime && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Clock size={16} color={color} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: color,
                      fontSize: "0.875rem",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    {`${startTime} - ${endTime}`}
                  </Typography>
                </Box>
              )}

              {/* Show Register/Evaluate/Comment button in the same spot */}
              {!utilities && (
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  {registerButton}
                </Box>
              )}
               {evaluateButton && professorStatus === "pending" && (
                    <>{evaluateButton}</>
                  )}

               {commentButton && professorStatus === "awaiting_review" && (
                    <>{commentButton}</>
                  )}
                  {payButton  && (eventType!=="Booth") && (
                    <>{payButton}</>
                  )}
            </Box>

            {/* Location Row */}
            {location && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <MapPin size={16} color={color} />
                <Typography
                  variant="body2"
                  sx={{
                    color: color,
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  {location}
                </Typography>
              </Box>
            )}

            {/* Duration and Pay Button Row */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >

              {duration && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Clock size={16} color={color} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: color,
                      fontSize: "0.875rem",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    {duration} {duration=="1"?"week":"weeks"}
                  </Typography>
                </Box>
              )}
              {payButton && eventType === "Booth" && (
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  {payButton}
                </Box>
              )}
            </Box>

            {link && (
              <Box
                key="link"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  cursor: "pointer",
                }}
              >
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
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.primary",
                    textDecoration: "underline",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: color,
                    },
                  }}
                  onClick={() => window.open(link, "_blank")}
                >
                  {link}
                </Typography>
              </Box>
            )}
            {cost && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Wallet size={16} color={color} />
                <Typography
                  variant="body2"
                  sx={{
                    color: color,
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  {cost}
                </Typography>
              </Box>
            )}
          </Box>
          {createdBy && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                mt: "auto",
                pt: 1.5,
                pr: spotsLeft && totalSpots ? "120px" : 0,
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "6px",
                  backgroundColor: `${color}08`,
                  border: `1px solid ${color}20`,
                }}
              >
                {/* Avatar icons for hosts */}
                {professors.length > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mr: 0.5,
                    }}
                  >
                    {/* Show up to 3 professor avatars */}
                    {[createdBy, ...professors.slice(0, 3)].map((name, idx) => {
                      const initials = name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2);
                      return (
                        <Box
                          key={idx}
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            backgroundColor: color,
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.5rem",
                            fontWeight: 600,
                            border: "1.5px solid white",
                            marginLeft: idx > 0 ? "-6px" : 0,
                            zIndex: professors.length - idx,
                          }}
                        >
                          {initials}
                        </Box>
                      );
                    })}
                    {/* Show +X if more than 3 total hosts */}
                    {professors.length > 3 && (
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          backgroundColor: `${color}30`,
                          color: color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.5rem",
                          fontWeight: 700,
                          border: "1.5px solid white",
                          marginLeft: "-6px",
                          zIndex: 0,
                        }}
                      >
                        +{professors.length - 3}
                      </Box>
                    )}
                  </Box>
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: color,
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {eventType === "Conference" ? "Featuring" : "Hosted by"}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: color,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  {createdBy.toUpperCase()}
                  {professors.length > 0 && (
                    <>
                      {" & "}
                      {professors.length === 1
                        ? "1 OTHER"
                        : `${professors.length} OTHERS`}
                    </>
                  )}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Spots Left Ribbon - Bottom Left */}
      {spotsLeft && totalSpots&& (

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            py: 0.75,
            px: 1.75,
            backgroundColor: spots > 0 ? `${color}15` : "error.lighter",
            borderTopLeftRadius: "8px",
            borderBottomRightRadius: "8px", // Matches card border radius (3 * 8px)
            border: "none",
          }}
        >
          <Typography
          sx={{
            fontWeight: 600,
            color: isFuture ? (spots > 3 ? color : "error.main") : color,
            fontSize: "0.85rem",
            lineHeight: 1.2,
          }}
        >
          {isFuture ? (
            `${spots} ${spots === 1 ? " spot" : " spots"} left`
          ) : (
            `${attendance}${ attendance === 1 ? " attendee" : " attendees"}`
          )}
        </Typography>
        </Box>
      )}
     
    </Box>
  );
};

export default EventCard;