import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Chip,
  Avatar,
  Grid,
  IconButton,
  Stack,
  alpha,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  LocationOn,
  People,
  AttachMoney,
  School,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  CalendarMonth,
  Person,
} from "@mui/icons-material";
import { ArrowLeft } from "lucide-react";
import theme from "@/themes/lightTheme";
import { CustomModal } from "../shared/modals";
import { api } from "@/api";
import { WorkshopViewProps } from "../Event/types";
import { toast } from "react-toastify";

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

type CommentWithoutId = Omit<CommentItem, "id">;

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
  const [loading, setLoading] = useState(false);
  const professors = workshop.professors;

  const statusOptions = [
    { label: "Awaiting Review", value: "awaiting_review" },
    { label: "Accept & Publish", value: "accept_publish" },
    { label: "Reject", value: "reject" },
    { label: "N/A", value: "N/A" },
  ];

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

  const getStatusConfig = (statusValue: string) => {
    switch (statusValue) {
      case "accept_publish":
        return {
          color: theme.palette.success.main,
          bgColor: alpha(theme.palette.success.main, 0.1),
          borderColor: alpha(theme.palette.success.main, 0.3),
          icon: <CheckCircle fontSize="small" />,
        };
      case "reject":
        return {
          color: theme.palette.error.main,
          bgColor: alpha(theme.palette.error.main, 0.1),
          borderColor: alpha(theme.palette.error.main, 0.3),
          icon: <Cancel fontSize="small" />,
        };
      case "awaiting_review":
        return {
          color: theme.palette.warning.main,
          bgColor: alpha(theme.palette.warning.main, 0.1),
          borderColor: alpha(theme.palette.warning.main, 0.3),
          icon: <HourglassEmpty fontSize="small" />,
        };
      default:
        return {
          color: theme.palette.grey[600],
          bgColor: alpha(theme.palette.grey[400], 0.1),
          borderColor: alpha(theme.palette.grey[400], 0.3),
          icon: <HourglassEmpty fontSize="small" />,
        };
    }
  };

  const handleStatusChange = (value: string) => {
    if (value !== "N/A") {
      setPendingStatus(value);
      setModalOpen(true);
    } else {
      setStatus("N/A");
      setPendingStatus(null);
      setModalOpen(false);
    }
  };

  const handleCallApi = async (payload: {
    approvalStatus: string;
    comments: CommentWithoutId[];
  }) => {
    const professorId = workshop.details["CreatedId"];
    console.log(payload);

    try {
      await api.patch(
        `/workshops/${professorId}/${workshop.id}/status`,
        payload
      );
      toast.success("Your evaluation has been recieved. Thank you !", {
              position: "bottom-right",
              autoClose: 3000,
              theme: "colored",
            });
    } catch (err: any) {
       toast.error(err?.response?.data?.error, {
              position: "bottom-right",
              autoClose: 3000,
              theme: "colored",
            });
      setStatus("N/A");
      setStatusFinalized(false);
      setComment(""); // Clear comment field if the attempt failed
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmStatus = () => {
    const confirmed = pendingStatus;

    if (confirmed) {
      setStatus(confirmed);
      if (confirmed !== "N/A") {
        setStatusFinalized(true);
      }
      setPendingStatus(null);
    }

    setModalOpen(false);

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

    const commentArray: CommentWithoutId[] =
      comment.trim() && confirmed === "awaiting_review"
        ? [
            {
              commenter: eventsOfficeId,
              text: comment,
              timestamp: new Date().toISOString(),
            },
          ]
        : [];

    const payload = {
      approvalStatus: mapToApiStatus(confirmed),
      comments: commentArray,
    };

    handleCallApi(payload);
    setComment("");
  };

  const handleCancelStatus = () => {
    setStatus("N/A");
    setPendingStatus(null);
    setModalOpen(false);
  };

  const statusConfig = getStatusConfig(status);

  // Info Row Component
  const InfoItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
    highlight?: boolean;
  }> = ({ icon, label, value, highlight }) => (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
        <Box sx={{ color: theme.palette.grey[600], display: "flex" }}>
          {icon}
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.grey[600],
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {label}
        </Typography>
      </Stack>
      <Typography
        variant="body2"
        sx={{
          color: highlight ? theme.palette.error.main : theme.palette.text.primary,
          fontWeight: highlight ? 600 : 500,
          pl: 3.5,
        }}
      >
        {value}
      </Typography>
    </Box>
  );

  return (
    <>
      <Box sx={{ minHeight: "100vh", bgcolor: `${theme.palette.primary.main}25` }}>
        {/* Header */}
        <Box
          sx={{
            bgcolor: "#fff",
            borderBottom: "1px solid #e5e7eb",
            position: "sticky",
            top: 0,
            zIndex: 10,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <Box
            sx={{
              maxWidth: "1200px",
              mx: "auto",
              px: 3,
              py: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton
                onClick={() => setEvaluating(false)}
                size="small"
                sx={{ bgcolor: "#f3f4f6" }}
              >
                <ArrowLeft size={20} />
              </IconButton>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Workshop Evaluation
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Review and approve workshop details
                </Typography>
              </Box>
            </Stack>

            <Chip
              icon={statusConfig.icon}
              label={getStatusLabel(status)}
              sx={{
                bgcolor: statusConfig.bgColor,
                color: statusConfig.color,
                fontWeight: 600,
                border: `1px solid ${statusConfig.borderColor}`,
              }}
            />
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ maxWidth: "1200px", mx: "auto", p: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 2,
              border: "1px solid #e5e7eb",
              mb: 3,
            }}
          >
            {/* Title */}
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, mb: 3, color: "#111827" }}
            >
              {workshop.name}
            </Typography>

            {/* Two Column Layout */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
              {/* Left Column */}
              <Grid size={{xs:12, md:6}}>
                <InfoItem
                  icon={<CalendarMonth fontSize="small" />}
                  label="Start"
                  value={`${workshop.details["Start Date"]} • ${workshop.details["Start Time"]}`}
                />
                <InfoItem
                  icon={<CalendarMonth fontSize="small" />}
                  label="End"
                  value={`${workshop.details["End Date"]} • ${workshop.details["End Time"]}`}
                />
                <InfoItem
                  icon={<CalendarMonth fontSize="small" />}
                  label="Registration Deadline"
                  value={workshop.details["Registration Deadline"]}
                  highlight
                />
                <InfoItem
                  icon={<LocationOn fontSize="small" />}
                  label="Location"
                  value={workshop.details["Location"]}
                />
                <InfoItem
                  icon={<People fontSize="small" />}
                  label="Capacity"
                  value={workshop.details["Capacity"]}
                />
              </Grid>

              {/* Right Column */}
                <Grid size={{xs:12, md:6}}>
                <InfoItem
                  icon={<AttachMoney fontSize="small" />}
                  label="Budget"
                  value={workshop.details["Required Budget"]}
                />
                <InfoItem
                  icon={<AttachMoney fontSize="small" />}
                  label="Funding Source"
                  value={workshop.details["Funding Source"]}
                />
                <InfoItem
                  icon={<School fontSize="small" />}
                  label="Faculty"
                  value={workshop.details["Faculty Responsible"]}
                />
                <Box sx={{ mb: 2 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Person
                      fontSize="small"
                      sx={{ color: theme.palette.grey[600] }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.grey[600],
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      Professors
                    </Typography>
                  </Stack>
                  <Stack spacing={0.5} sx={{ pl: 3.5 }}>
                    {professors.map((prof: string, idx: number) => (
                      <Typography
                        key={idx}
                        variant="body2"
                        sx={{ color: theme.palette.text.primary }}
                      >
                        • {prof}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              </Grid>
            </Grid>

            {/* Description Section */}
            <Box sx={{ mb: 3, pb: 3, borderBottom: "1px solid #f3f4f6" }}>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.grey[600],
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  display: "block",
                  mb: 1,
                }}
              >
                Description
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.7,
                }}
              >
                {workshop.description}
              </Typography>
            </Box>

            {/* Agenda Section */}
            <Box sx={{ mb: 3, pb: 3, borderBottom: "1px solid #f3f4f6" }}>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.grey[600],
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  display: "block",
                  mb: 1,
                }}
              >
                Agenda
              </Typography>
              <Typography
                component="pre"
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                  fontFamily: "inherit",
                  m: 0,
                }}
              >
                {workshop.agenda}
              </Typography>
            </Box>

            {/* Resources Section */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.grey[600],
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  display: "block",
                  mb: 1,
                }}
              >
                Required Resources
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.7,
                }}
              >
                {workshop.details["Extra Required Resources"]}
              </Typography>
            </Box>
          </Paper>

          {/* Evaluation Section */}
          {!statusFinalized && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid #e5e7eb",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2.5, color: "#111827" }}
              >
                Evaluation
              </Typography>

              <Grid container spacing={2}>
                    <Grid size={{xs:12, md:8}}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, mb: 0.5 }}
                  >
                    Comments
                  </Typography>
                  <TextField
                    multiline
                    rows={3}
                    fullWidth
                    placeholder={
                      status === "N/A" || status === "awaiting_review"
                        ? "Add comments (saved for 'Awaiting Review' only)..."
                        : "Comments only available for 'Awaiting Review'"
                    }
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={status !== "awaiting_review" && status !== "N/A"}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{xs:12, md:4}}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, mb: 0.5 }}
                  >
                    Status
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      sx={{ borderRadius: 1.5 }}
                    >
                      {statusOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* Status Finalized */}
          {statusFinalized && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid #e5e7eb",
                textAlign: "center",
                bgcolor: statusConfig.bgColor,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Evaluation Completed
              </Typography>
              <Chip
                icon={statusConfig.icon}
                label={getStatusLabel(status)}
                sx={{
                  bgcolor: alpha(statusConfig.color, 0.2),
                  color: statusConfig.color,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  py: 2.5,
                }}
              />
            </Paper>
          )}
        </Box>
      </Box>

      {/* Confirmation Modal */}
      <CustomModal
        title="Confirm Status Change"
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
        <Box sx={{ mt: 2 }}>
          <Typography>
            Set status to{" "}
            <strong>{getStatusLabel(pendingStatus || "N/A")}</strong>?
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 2, color: theme.palette.error.main, fontWeight: 500 }}
          >
            ⚠️ This action cannot be undone.
          </Typography>
        </Box>
      </CustomModal>
    </>
  );
};

export default WorkshopDetails;