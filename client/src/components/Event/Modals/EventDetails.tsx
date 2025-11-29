"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CustomButton from "../../shared/Buttons/CustomButton";
import Rating from "../../shared/mui-core/Rating";
import { EventDetailsProps, mockReviews, EventSection, Review } from "./types";
import EventTypeDetails from "./EventTypeDetails";
import { Trash2 } from "lucide-react";
import { CustomModal } from "../../shared/modals";
import theme from "@/themes/lightTheme";
import { toast } from "react-toastify";
import { api } from "../../../api";
import { frameData } from "./utils/frameData";
import { ReviewSkeletonList } from "./utils/ReviewSkeletonList";
import { AttendeesList } from "./utils/Attendees";
import EmptyState from "@/components/shared/states/EmptyState";

// Styled components
const TabsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(0, 2),
  backgroundColor: theme.palette.background.paper,
  justifyContent: "center",
}));

const TabButton = styled("button")<{ active?: boolean; color?: string }>(
  ({ theme, active, color }) => ({
    all: "unset",
    cursor: "pointer",
    padding: theme.spacing(1.5, 3),
    borderRadius: "4px 4px 0 0",
    color: active ? color : theme.palette.text.primary,
    backgroundColor: active ? `${color}08` : "transparent",
    borderBottom: `2px solid ${active ? color : "transparent"}`,
    transition: "all 0.4s ease",
    fontFamily: theme.typography.fontFamily,
    fontSize: "0.875rem",
    fontWeight: active ? 600 : 600,
    "&:hover": {
      backgroundColor: `${color}15`,
      borderBottom: `2px solid ${color}`,
    },
  })
);

const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  flex: 1,
  position: "relative",
  maxHeight: "100%",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40px",
    background:
      "linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.9))",
    pointerEvents: "none",
    opacity: 0,
    transition: "opacity 0.2s ease",
  },
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.divider,
    borderRadius: "3px",
  },
  "&.can-scroll::after": {
    opacity: 1,
  },
}));

const EventDetails: React.FC<EventDetailsProps> = ({
  color,
  title,
  eventType,
  description,
  details,
  agenda,
  reviews = mockReviews,
  button: RegisterButton,
  onSubmitReview,
  sections = ["general", "details", "reviews"],
  user,
  attended = false,
  eventId,
  userId,
  attendees,
  createdBy,
  onParentClose
}) => {
  const [activeTab, setActiveTab] = useState<EventSection>(sections[0]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [commentToDelete, setCommentToDelete] = useState<{
    id: string;
    reviewerId: string;
    name: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [Reviews, setReviews] = useState<Review[]>();

  const handleDeleteComment = async (id: string, reviewerId: string) => {
    setReviews((prevReviews) =>
      prevReviews?.filter((review) => review.id !== id)
    );
    setCommentToDelete(null);
    try {
      await api.delete(`/events/${eventId}/reviews/${reviewerId}`);
      toast.success("Comment deleted successfully.", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
      });
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast.error("Failed to delete comment. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setCommentToDelete(null);
    }
  };

  // Make sure to pass 'userId' when you call this function
  async function handleCallAPI() {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/events/${eventId}/reviews`);
      const allReviews: Review[] = frameData(res.data.data);

      const { userReview, otherReviews } = allReviews.reduce(
        (acc, review) => {
          if (review.userId === userId) {
            acc.userReview = {
              ...review,
              firstName: "You",
              lastName: "",
            };
          } else {
            acc.otherReviews.push(review);
          }
          return acc;
        },
        { userReview: null as Review | null, otherReviews: [] as Review[] }
      );

      const finalSortedReviews = userReview
        ? [userReview, ...otherReviews]
        : otherReviews;

      setReviews(finalSortedReviews);
    } catch (err) {
      console.error(err);
      setError("Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleCallAPI();
    // setReviews(reviews);
  }, [refresh]);

  const checkScroll = React.useCallback(() => {
    if (contentRef.current) {
      const { scrollHeight, clientHeight } = contentRef.current;
      contentRef.current.classList.toggle(
        "can-scroll",
        scrollHeight > clientHeight
      );
    }
  }, []);

  const handleSubmitReview = async () => {
    setIsSubmitting(true);

    try {
      const response = await api.post(`/events/${eventId}/reviews`, {
        rating: newRating || undefined,
        comment: newComment.trim() || undefined,
      });

      // Show success toast
      toast.success(
        "Review submitted successfully! Thank you for your feedback.",
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );

      // Reset form
      setNewRating(0);
      setNewComment("");

      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to submit review. Please try again.";

      toast.error(message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setIsSubmitting(false);
      setRefresh((prev) => !prev);
    }
  };

  const renderGeneral = () => (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h5"
        sx={{ mb: 2, color: "text.primary", fontWeight: 600 }}
      >
        {title}
      </Typography>
      <Chip
        label={eventType}
        size="medium"
        sx={{
          mb: 4,
          backgroundColor: `${color}08`,
          color: color,
          fontWeight: 600,
          fontSize: "0.9rem",
          height: "30px",
          minWidth: "70px",
          border: `1px solid ${color}`,
          "&:hover": {
            backgroundColor: `${color}15`,
          },
        }}
      />
      <Box
        sx={{
          position: "relative",
          p: 3,
          mt: 2,
          "&::before, &::after": {
            position: "absolute",
            fontSize: "6rem",
            fontFamily: "Georgia, serif",
            opacity: 0.15,
            color: color,
            lineHeight: 1,
            height: "auto",
          },
          "&::before": {
            content: "open-quote",
            top: -30,
            left: -15,
          },
          "&::after": {
            content: "close-quote",
            bottom: -70,
            right: -15,
          },
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: "text.primary",
            fontSize: "1.1rem",
            lineHeight: 1.6,
            position: "relative",
            zIndex: 1,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
  const renderAgenda = () => (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h5"
        sx={{ mb: 6, color: "text.primary", fontWeight: 600 }}
      >
        Full Agenda
      </Typography>
      <Box
        sx={{
          position: "relative",
          p: 3,
          mt: 2,
          "&::before, &::after": {
            position: "absolute",
            fontSize: "6rem",
            fontFamily: "Georgia, serif",
            opacity: 0.15,
            color: color,
            lineHeight: 1,
            height: "auto",
          },
          "&::before": {
            content: "open-quote",
            top: -30,
            left: -15,
          },
          "&::after": {
            content: "close-quote",
            bottom: -70,
            right: -15,
          },
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: "text.primary",
            fontSize: "1.1rem",
            lineHeight: 1.6,
            position: "relative",
            zIndex: 1,
          }}
        >
          {agenda}
        </Typography>
      </Box>
    </Box>
  );

  const renderAttendees = () => (
   <AttendeesList 
     attendees={attendees||[]}
   />
  );


  const renderReviews = () => {
    const showAddReview =
      (user === "student" ||
        user === "professor" ||
        user === "staff" ||
        user === "ta") &&
      attended;

    return (
      <Box
        sx={{
          display: "flex",
          gap: 4,
          flexDirection: { xs: "column", md: "row" },
          height: "100%",
        }}
      >
        {showAddReview && (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              alignItems: "stretch",
              py: 2,
            }}
          >
            {/* Title */}
            <Typography
              variant="h5"
              sx={{
                color: "text.primary",
                display: "block",
                fontWeight: 600,
                mb: 6,
                textAlign: "center",
              }}
            >
              Add Your Review
            </Typography>

            {/* Form Content Wrapper */}
            <Box
              sx={{
                flexGrow: 1,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              {/* Form Elements */}
              <Rating
                value={newRating}
                onChange={(event, value) => setNewRating(value || 0)}
                size="large"
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setNewComment(e.target.value)
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: color,
                    },
                    "&:hover fieldset": {
                      borderColor: `${color}90`,
                    },
                  },
                }}
              />
              <CustomButton
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                sx={{
                  backgroundColor: color,
                  border: `2px solid ${color}`,
                  color: "#fff",
                  minWidth: "150px",
                  "&:hover": {
                    backgroundColor: `${color}CC`,
                  },
                  "&.Mui-disabled": {
                    backgroundColor: `${color}40`,
                    borderColor: `${color}40`,
                  },
                }}
              >
                {isSubmitting ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={16} sx={{ color: "#fff" }} />
                    <span>Submitting...</span>
                  </Box>
                ) : (
                  "Submit Review"
                )}
              </CustomButton>
            </Box>
          </Box>
        )}

        {/* Modern Divider - Only shows when both sections are visible */}
        {showAddReview && (
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              position: "relative",
              width: "2px",
              alignSelf: "stretch",
              my: 2,
            }}
          >
            {/* Gradient background */}
            <Box
              sx={{
                width: "100%",
                background: `linear-gradient(to bottom, 
              transparent 0%, 
              ${color}40 10%, 
              ${color}80 50%, 
              ${color}40 90%, 
              transparent 100%)`,
                borderRadius: "2px",
              }}
            />

            {/* Decorative dots */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: "flex",
                flexDirection: "column",
                gap: 1,
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: color,
                  boxShadow: `0 0 8px ${color}80`,
                }}
              />
              <Box
                sx={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: color,
                  opacity: 0.6,
                  ml: "1px",
                }}
              />
              <Box
                sx={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: color,
                  boxShadow: `0 0 8px ${color}80`,
                }}
              />
            </Box>
          </Box>
        )}

        {/* Mobile Divider */}
        {showAddReview && (
          <Box
            sx={{
              display: { xs: "block", md: "none" },
              height: "2px",
              position: "relative",
              my: 3,
            }}
          >
            <Box
              sx={{
                height: "100%",
                background: `linear-gradient(to right, 
              transparent 0%, 
              ${color}40 10%, 
              ${color}80 50%, 
              ${color}40 90%, 
              transparent 100%)`,
                borderRadius: "2px",
              }}
            />
          </Box>
        )}

        {/* Reviews List */}
        <Box
          sx={{
            flex: 1,
            height: "450px",
            maxHeight: "450px",
            overflowY: "auto",
          }}
        >
          {loading ? (
            <ReviewSkeletonList />
          ) : Reviews && Reviews.length > 0 ? (
            Reviews?.map((review) => (
              <Box
                key={review.id}
                sx={{
                  mb: 3,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "background.paper",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  border: "1px solid rgba(0,0,0,0.07)",
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", mb: 1, gap: 2 }}
                >
                  <Avatar sx={{ bgcolor: color }}>
                    {review.firstName[0]}
                    {review.lastName[0]}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2">
                      {review.firstName} {review.lastName}
                    </Typography>
                    {review.rating > 0 && (
                      <Rating value={review.rating} readOnly size="small" />
                    )}
                    <Typography
                      variant="caption"
                      sx={{ color: "text.primary", display: "block" }}
                    >
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  {user === "admin" && (
                    <Tooltip title="Delete Comment">
                      <IconButton
                        size="small"
                        onClick={() =>
                          setCommentToDelete({
                            id: review.id,
                            reviewerId: review.userId,
                            name: `${review.firstName} ${review.lastName}`,
                          })
                        }
                        sx={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 2,
                          "&:hover": {
                            backgroundColor: "rgba(255, 0, 0, 0.1)",
                            borderColor: "error.main",
                            color: "error.main",
                          },
                        }}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                <Typography
                  variant="body2"
                  sx={{ ml: 7, color: "text.primary" }}
                >
                  {review.comment ? review.comment : ""}
                </Typography>
              </Box>
            ))
          ) : (
            <EmptyState  title = "No Reviews Yet!"  description = {attended? "Be the first to share your thoughts!"
          : "Check back later to see what people think."}/>
          )}
        </Box>
      </Box>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return renderGeneral();
      case "details":
        return (
          <EventTypeDetails type={eventType} details={details} color={color} eventId={eventId} userRole={user}/>
        );
      case "reviews":
        return renderReviews();
      case "agenda":
        return renderAgenda();
      case "attendees":
        return renderAttendees();
      default:
        return null;
    }
  };

  const tabLabels: Record<EventSection, string> = {
    general: "General Info",
    details: "Event Details",
    reviews: "Reviews & Comments",
    agenda: "Full Agenda",
    attendees: "Attendees"
  };

  React.useEffect(() => {
    checkScroll();
    // Add resize observer to check when content size changes
    const observer = new ResizeObserver(checkScroll);
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }
    return () => observer.disconnect();
  }, [activeTab, checkScroll]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "500px",
        maxHeight: "500px",
      }}
    >
      {/* Tabs */}
      <TabsContainer>
        {sections.map((section) => (
          <TabButton
            key={section}
            active={activeTab === section}
            color={color}
            onClick={() => setActiveTab(section)}
          >
            {tabLabels[section]}
          </TabButton>
        ))}
      </TabsContainer>

      {/* Content */}
      <ContentContainer ref={contentRef}>{renderContent()}</ContentContainer>
      {RegisterButton &&
        (activeTab === "general" ||
          activeTab === "details" ||
          activeTab === "agenda") && (
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              borderTop: 1,
              borderColor: "divider",
              p: 2,
              backgroundColor: "background.paper",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {RegisterButton}
          </Box>
        )}

      {/* Delete Comment Modal */}
      <CustomModal
        open={!!commentToDelete}
        onClose={() => setCommentToDelete(null)}
        title="Delete Comment"
        modalType="delete"
        borderColor={theme.palette.error.main}
        buttonOption1={{
          label: "Delete",
          variant: "contained",
          color: "error",
          onClick: () => {
            console.log(commentToDelete);
            if (commentToDelete?.id && commentToDelete?.reviewerId)
              handleDeleteComment(
                commentToDelete.id,
                commentToDelete.reviewerId
              );
          },
        }}
        buttonOption2={{
          label: "Cancel",
          variant: "outlined",
          color: "error",
          onClick: () => setCommentToDelete(null),
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
            {commentToDelete?.name}
            {"'s Comment"}
          </Typography>

          <Typography
            sx={{
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
              color: theme.palette.error.main,
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </Typography>
        </Box>
      </CustomModal>
    </Box>
  );
};

export default EventDetails;
