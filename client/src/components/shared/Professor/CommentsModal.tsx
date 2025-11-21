import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Stack,
  alpha,
} from "@mui/material";
import { ChatBubbleOutline } from "@mui/icons-material";
import theme from "@/themes/lightTheme";

interface CommentItem {
  id: number;
  commenter: string;
  text: string;
  timestamp: string;
}

interface CommentsListProps {
  comments: CommentItem[];
}

const CommentsList: React.FC<CommentsListProps> = ({ comments }) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (comments.length === 0) {
    return (
      <Box
        sx={{
          py: 6,
          px: 3,
          textAlign: "center",
        }}
      >
        <ChatBubbleOutline
          sx={{
            fontSize: 48,
            color: theme.palette.grey[300],
            mb: 2,
          }}
        />
        <Typography variant="body2" color="text.secondary">
          No comments yet
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={0} sx={{ maxHeight: "400px", overflowY: "auto" }}>
      {comments.map((comment, index) => (
        <Box
          key={comment.id}
          sx={{
            p: 3,
            borderBottom:
              index < comments.length - 1
                ? `1px solid ${theme.palette.divider}`
                : "none",
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.02),
            },
            transition: "background-color 0.2s",
          }}
        >
          <Stack direction="row" spacing={2}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: theme.palette.primary.main,
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              {getInitials(comment.commenter)}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 0.5 }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: theme.palette.text.primary }}
                >
                  {comment.commenter}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  •
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {formatTimestamp(comment.timestamp)}
                </Typography>
              </Stack>

              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.6,
                  wordBreak: "break-word",
                }}
              >
                {comment.text}
              </Typography>
            </Box>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
};

export default CommentsList;

// Example usage with your CustomModal component:
//
// 1. Import the component:
// import CommentsList from "./CommentsList";
//
// 2. Add state for modal:
// const [commentsModalOpen, setCommentsModalOpen] = useState(false);
//
// 3. Mock data (replace with actual backend data):
// const mockComments = [
//   {
//     id: 1,
//     commenter: "Dr. Sarah Johnson",
//     text: "Please provide more details about the technical requirements.",
//     timestamp: "2025-01-15T10:30:00Z",
//   },
//   {
//     id: 2,
//     commenter: "Events Office Admin",
//     text: "The budget seems reasonable.",
//     timestamp: "2025-01-16T14:22:00Z",
//   },
// ];
//
// 4. Add button to open modal (e.g., in the header next to status badge):
// <IconButton 
//   onClick={() => setCommentsModalOpen(true)}
//   size="small"
//   sx={{ bgcolor: "#f3f4f6" }}
// >
//   <ChatBubbleOutline size={20} />
// </IconButton>
//
// 5. Use with your CustomModal:
// <CustomModal
//   title="Comments & Feedback"
//   open={commentsModalOpen}
//   onClose={() => setCommentsModalOpen(false)}
//   modalType="info"
//   buttonOption1={{
//     label: "Close",
//     variant: "contained",
//     color: "primary",
//     onClick: () => setCommentsModalOpen(false),
//   }}
// >
//   <CommentsList comments={mockComments} />
// </CustomModal>