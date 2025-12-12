// Styled components for Comments feature
import { styled } from "@mui/material/styles";
import { Box, IconButton } from "@mui/material";

// Main card container with border and shadow
export const CardContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
  padding: "20px",
  transition: "box-shadow 0.2s ease, transform 0.2s ease",
  "&:hover": {
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
    transform: "translateY(-2px)",
  },
}));

// Container for sentiment icons
export const SentimentContainer = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  alignItems: "center",
});

// Individual sentiment icon wrapper
export const SentimentBadge = styled(Box)<{
  severity: "low" | "medium" | "high";
}>(({ severity }) => ({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "12px",
  fontWeight: 500,
  color:
    severity === "high"
      ? "#dc2626"
      : severity === "medium"
      ? "#d97706"
      : "#16a34a",
}));

// Action button styling for delete and block
export const ActionButton = styled(IconButton)<{
  actionType?: "delete" | "block" | "safe";
}>(({ theme, actionType }) => ({
  padding: "8px",
  borderRadius: "8px",
  transition: "all 0.2s ease",
  color:
    actionType === "delete" || actionType === "block"
      ? theme.palette.error.main
      : theme.palette.success.main,
  backgroundColor: "transparent",
  "&:hover": {
    backgroundColor:
      actionType === "delete" || actionType === "block"
        ? "rgba(239, 68, 68, 0.1)"
        : "rgba(34, 197, 94, 0.1)",
    transform: "scale(1.1)",
  },
  "&:disabled": {
    color: theme.palette.action.disabled,
  },
}));

// Header section with actions
export const CardHeader = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "12px",
});

// Footer section with event name and sentiment
export const CardFooter = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  marginTop: "16px",
  flexWrap: "wrap",
  gap: "12px",
});

// Skeleton styles
export const SkeletonCard = styled(Box)(({ theme }) => ({
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  border: `1px solid ${theme.palette.divider}`,
  padding: "20px",
}));

// Overall toxicity score badge
export const ToxicityScoreBadge = styled(Box)<{ score: number }>(
  ({ score }) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: 600,
    backgroundColor:
      score >= 0.7
        ? "rgba(239, 68, 68, 0.15)"
        : score >= 0.4
        ? "rgba(245, 158, 11, 0.15)"
        : "rgba(34, 197, 94, 0.15)",
    color: score >= 0.7 ? "#dc2626" : score >= 0.4 ? "#d97706" : "#16a34a",
  })
);
