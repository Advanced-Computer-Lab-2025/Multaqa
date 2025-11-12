import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Chip,
  Avatar,
  Divider,
  Card,
  CardContent,
  Grid,
  IconButton,
} from "@mui/material";
import CustomSelectField from "../shared/input-fields/CustomSelectField";
import { LocationOn, People, AttachMoney, MenuBook } from "@mui/icons-material";
import { ArrowLeft, Calendar } from "lucide-react";
import theme from "@/themes/lightTheme";
import CustomButton from "../shared/Buttons/CustomButton";
import CustomIcon from "../shared/Icons/CustomIcon";
import NeumorphicBox from "../shared/containers/NeumorphicBox";
import { CustomModal } from "../shared/modals";
import { api } from "@/api";
import { WorkshopViewProps } from "../Event/types";

interface WorkshopDetailsProps {
  workshop: WorkshopViewProps;
  setEvaluating: React.Dispatch<React.SetStateAction<boolean>>;
  eventsOfficeId: string;
}
interface CommentItem {
  id: number;
  commenter: string;
  text: string;
  timestamp: string;
}
// Define the type without 'id'
type CommentWithoutId = Omit<CommentItem, 'id'>;

function removeId(comments: CommentItem[]): CommentWithoutId[] {
  return comments.map(({ id, ...rest }) => rest);
}

const WorkshopDetails: React.FC<WorkshopDetailsProps> = ({
  workshop,
  setEvaluating,
  eventsOfficeId,
}) => {
  const [status, setStatus] = useState("N/A");
  const [comment, setComment] = useState("");
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusFinalized, setStatusFinalized] = useState(false);
  // start comments empty to avoid undefined errors
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const professors = workshop.professors;

  // Status options for CustomSelectField
  const statusOptions = [
    { label: "Awaiting Review", value: "awaiting_review" },
    { label: "Accept & Publish", value: "accept_publish" },
    { label: "Reject", value: "reject" },
    { label: "N/A", value: "N/A" },
  ];

  const handleAddComment = () => {
    if (comment.trim() && (status === "awaiting_review" || status === "N/A")) {
      const newComment: CommentItem = {
        id: comments.length > 0 ? comments[comments.length - 1].id + 1 : 1,
        commenter: eventsOfficeId,
        text: comment,
        timestamp: new Date().toISOString(),
      };
      setComments((prev) => [...prev, newComment]);
      setComment("");
    }
  };

  const handleDeleteComment = (commentId: number) => {
    setComments((prev) => prev.filter((c: CommentItem) => c.id !== commentId));
  };

  // Map status value to readable label
  const getStatusLabel = (statusValue: string) => {
    switch (statusValue) {
      case "accept_publish":
        return "Accepted & Published";
      case "reject":
        return "Rejected";
      case "awaiting_review":
        return "Awaiting Review";
      default:
        return "N/A";
    }
  };

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case "accept_publish":
        return "success";
      case "reject":
        return "error";
      case "awaiting_review":
        return "warning";
      default:
        return "default";
    }
  };

  // When selecting a new status → open modal for confirmation
  const handleStatusChange = (value: string) => {
    console.log(value);
    if (value !== "N/A") {
      setPendingStatus(value);
      setModalOpen(true);
      console.log("true");
    } else {
      setStatus("N/A");
      setPendingStatus(null);
      setModalOpen(false);
      console.log("false");
    }
  };

  const handleCallApi = async (payload: {
    approvalStatus: string;
    comments: CommentWithoutId[];
  }) => {
    const professorId = workshop.details["Created By"];
    console.log(professorId);
    console.log(workshop.id);
    console.log(payload.comments);
    try {
      console.log("Payload being sent:", payload);
      const res = await api.patch(
        `/workshops/${professorId}/${workshop.id}/status`,
        payload
      );
    } catch (err: any) {
      window.alert(err?.response?.data?.error || "API call failed");
    } finally {
      setLoading(false);
    }
  };
  // Confirm change
  const handleConfirmStatus = () => {
    // Capture the pendingStatus value locally before we clear it
    const confirmed = pendingStatus;

    if (confirmed) {
      setStatus(confirmed);
      if (confirmed !== "N/A") {
        setStatusFinalized(true); // hide UI for finalized status
      }
      console.log(confirmed);
      // if (confirmed !== "awaiting_review") {
      //   setComments([]);
      // }
      // clear pending after we've captured and used it
      setPendingStatus(null);
    }

    setModalOpen(false);

    // map the just-confirmed value to the API expected status
    const mapToApiStatus = (val: string | null | undefined) => {
      switch (val) {
        case "awaiting_review":
          return "awaiting_review";
        case "accept_publish":
          return "approved";
        case "reject":
          return "rejected";
        default:
          return "pending";
      }
    };

    const payload = {
      approvalStatus: mapToApiStatus(confirmed),
      comments: confirmed === "awaiting_review" ? removeId(comments) : [],
    };

    handleCallApi(payload);
  };

  // Cancel → revert to previous (do nothing)
  const handleCancelStatus = () => {
    setPendingStatus(null);
    setModalOpen(false);
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: 0, p: 0, flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0px 25px",
            paddingTop: 2,
            paddingRight: "40px",
          }}
        >
          <IconButton
            onClick={() => {
              setEvaluating(false);
            }}
            sx={{
              color: theme.palette.tertiary.main,
              "&:hover": {
                backgroundColor: theme.palette.secondary.main,
                transform: "scale(1.05) rotate(-5deg)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              alignSelf: "start",
              justifyContent: "start",
            }}
          >
            <ArrowLeft size={20} />
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0,
              color: theme.palette.tertiary.main,
              fontFamily: "var(--font-jost), system-ui, sans-serif",
            }}
          >
            Your Evaluation Hub
          </Typography>

          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 0.5, display: "block" }}
            >
              Current Status
            </Typography>
            <Chip
              label={getStatusLabel(status || "N/A")}
              color={getStatusColor(status || "N/A")}
              sx={{ fontWeight: 600 }}
            />
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 3, p: 4, maxHeight: "65vh" }}>
          {/* Left Side - Workshop Details */}
          <Paper
            elevation={1}
            sx={{
              flex: 1,
              p: 4,
              borderRadius: 3,
              bgcolor: "#ffffff",
              border: `1px solid ${theme.palette.tertiary.main}`,
              overflowY: "auto",
            }}
          >
            {/* Header Section */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: "#111827",
                  fontFamily: "var(--font-jost), system-ui, sans-serif",
                }}
              >
                {workshop.name}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Chip
                  icon={<LocationOn />}
                  label={workshop.details["Location"]}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  icon={<People />}
                  label={`Capacity: ${workshop.details["Capacity"]}`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Box>

            {/* Date & Time Section */}
            <Card sx={{ mb: 3, bgcolor: "#eef2ff", boxShadow: "none" }}>
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <Calendar color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Schedule
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid sx={{ xs: "6" }}>
                    <Typography variant="caption" color="text.secondary">
                      Start Date & Time
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {workshop.details["Start Date"]} at{" "}
                      {workshop.details["Start Time"]}
                    </Typography>
                  </Grid>
                  <Grid sx={{ xs: "6" }}>
                    <Typography variant="caption" color="text.secondary">
                      End Date & Time
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {workshop.details["End Date"]} at{" "}
                      {workshop.details["End Time"]}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Typography variant="caption" color="text.secondary">
                  Registration Deadline
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, color: "error.main" }}
                >
                  {workshop.details["Registration Deadline"]}
                </Typography>
              </CardContent>
            </Card>

            {/* Description Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Description
              </Typography>
              <Typography
                variant="body1"
                sx={{ lineHeight: 1.8, color: "#374151" }}
              >
                {workshop.description}
              </Typography>
            </Box>

            {/* Agenda Section */}
            <Card sx={{ mb: 4, bgcolor: "#f9fafb", boxShadow: "none" }}>
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <MenuBook color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Full Agenda
                  </Typography>
                </Box>
                <Typography
                  component="pre"
                  sx={{
                    whiteSpace: "pre-wrap",
                    fontFamily: "inherit",
                    lineHeight: 1.8,
                    color: "#374151",
                    m: 0,
                  }}
                >
                  {workshop.agenda}
                </Typography>
              </CardContent>
            </Card>

            {/* Faculty & Professors Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Academic Information
              </Typography>
              <Grid container spacing={3}>
                <Grid sx={{ xs: "6" }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 1, display: "block" }}
                  >
                    Faculty Responsible
                  </Typography>
                  <Chip
                    label={workshop.details["Faculty Responsible"]}
                    color="secondary"
                    sx={{ fontWeight: 600, fontSize: "0.95rem" }}
                  />
                </Grid>
                <Grid sx={{ xs: "6" }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 1, display: "block" }}
                  >
                    Professors Participating
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
                    {professors.map((prof: string, idx: number) => (
                      <Box
                        key={idx}
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "primary.main",
                            fontSize: "0.9rem",
                          }}
                        >
                          {prof.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {prof}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Budget & Funding Section */}
            <Card sx={{ mb: 4, bgcolor: "#ecfdf5", boxShadow: "none" }}>
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <AttachMoney color="success" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Budget & Funding
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid sx={{ xs: "6" }}>
                    <Typography variant="caption" color="text.secondary">
                      Required Budget
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {workshop.details["Required Budget"]}
                    </Typography>
                  </Grid>
                  <Grid sx={{ xs: "6" }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mb: 1, display: "block" }}
                    >
                      Funding Source
                    </Typography>
                    <Chip
                      label={workshop.details["Funding Source"]}
                      color={
                        workshop.details["Funding Source"] === "External"
                          ? "info"
                          : "success"
                      }
                      sx={{ fontWeight: 600 }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Extra Resources Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Extra Required Resources
              </Typography>
              <Card
                sx={{
                  bgcolor: "#fffbeb",
                  border: "1px solid #fcd34d",
                  boxShadow: "none",
                }}
              >
                <CardContent>
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.8, color: "#374151" }}
                  >
                    {workshop.details["Extra Required Resources"]}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Paper>

          {/* Right Side - Comments & Status */}
          <Paper
            elevation={1}
            sx={{
              width: 400,
              p: 3,
              borderRadius: 3,
              bgcolor: "#ffffff",
              border: `1px solid ${theme.palette.secondary.dark}`,
              display: "flex",
              flexDirection: "column",
              maxHeight: statusFinalized ? "20%" : "40%", // adjust depending on your header height
              overflow: "auto", // hides any content that shouldn't overflow here
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Reviews & Comments
            </Typography>

            {/* Comments Section */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                mb: 2,
                minHeight: "30%",
                pr: 1,
              }}
            >
              {comments.map((c: CommentItem) => (
                <Box key={c.id} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {c.timestamp}
                      </Typography>
                    </Box>
                    {(status === "awaiting_review" ||
                      (status === "N/A" && !statusFinalized)) && (
                      <CustomIcon
                        icon="delete"
                        size="small"
                        onClick={() => handleDeleteComment(c.id)}
                        sx={{
                          cursor: "pointer",
                          width: "24px",
                          height: "24px",
                        }}
                      />
                    )}
                  </Box>
                  <NeumorphicBox
                    containerType="inwards"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      width: "100%",
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "text.primary" }}>
                      {c.text}
                    </Typography>
                  </NeumorphicBox>
                </Box>
              ))}
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Add Comment */}
            {!statusFinalized && (
              <>
                {/* Add Comment */}
                <Box
                  sx={{
                    mb: 4,
                    display: "flex",
                    flexDirection: "row",
                    gap: "6px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    multiline
                    rows={1}
                    placeholder={
                      status === "N/A" || status === "awaiting_review"
                        ? "Add a comment..."
                        : "Comments disabled when not awaiting review"
                    }
                    value={comment}
                    onChange={(
                      e: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >
                    ) => setComment(e.target.value)}
                    disabled={status !== "awaiting_review" && status !== "N/A"}
                    sx={{
                      mb: 1,
                      width: "100%",
                      mr: 3,
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: `${theme.palette.tertiary.main}`,
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                  <CustomButton
                    label="Add"
                    variant="contained"
                    color="tertiary"
                    size="small"
                    onClick={handleAddComment}
                    disabled={status !== "awaiting_review" && status !== "N/A"}
                  />
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 500, mb: 2, fontSize: "12px" }}
                >
                  Add <strong>all </strong>your comments before setting this
                  workshops's status. Comments are only added in the case of an{" "}
                  <strong>Awaiting Review</strong> Status.
                </Typography>

                {/* Status Dropdown */}
                <Box sx={{ mb: 2 }}>
                  <CustomSelectField
                    label="Status"
                    fieldType="single"
                    options={statusOptions}
                    value={status}
                    onChange={(value) => handleStatusChange(value as string)}
                    placeholder="Select status..."
                    size="small"
                    fullWidth={true}
                    neumorphicBox={true}
                    name={""}
                  />
                </Box>
              </>
            )}

            {/* Current Status Display */}
            {statusFinalized && (
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 1, display: "block" }}
                >
                  Current Status
                </Typography>
                <Chip
                  label={getStatusLabel(status || "N/A")}
                  color={getStatusColor(status || "N/A")}
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
      {/* Confirmation Modal */}
      <CustomModal
        title="Confirm Evaluation Status"
        modalType="warning"
        open={modalOpen}
        onClose={handleCancelStatus}
        buttonOption1={{
          label: "Confirm",
          variant: "contained",
          color: "warning",
          onClick: handleConfirmStatus,
        }}
        buttonOption2={{
          label: "Cancel",
          variant: "outlined",
          color: "warning",
          onClick: handleCancelStatus,
        }}
      >
        <Typography
          sx={{
            mt: 2,
            fontFamily: "var(--font-poppins), system-ui, sans-serif",
            textAlign: "center",
          }}
        >
          Are you sure you want to set this workshop's status to{" "}
          <strong>{getStatusLabel(pendingStatus || "N/A")}</strong>?
          <br />
          <br />
          This action is <strong>irreversible</strong>.
        </Typography>
      </CustomModal>
    </>
  );
};

export default WorkshopDetails;
