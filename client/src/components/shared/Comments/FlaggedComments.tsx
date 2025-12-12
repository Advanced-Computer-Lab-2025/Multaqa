"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { MessageSquareWarning, RefreshCw } from "lucide-react";
import CommentCard, { CommentCardSkeleton } from "./CommentCard";
import { FlaggedComment } from "./types";
import {
  fetchFlaggedComments,
  deleteComment,
  blockUser,
  flagAsSafe,
} from "./utils";
import { CustomModal } from "../modals";
import CustomButton from "../Buttons/CustomButton";

export default function FlaggedComments() {
  const [comments, setComments] = useState<FlaggedComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<{
    type: "delete" | "block" | "safe" | null;
    id: string | null;
  }>({ type: null, id: null });

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "delete" | "block" | "safe";
    eventId?: string;
    userId: string;
    userName?: string;
  } | null>(null);

  // Fetch comments on mount
  const loadComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchFlaggedComments();
      setComments(data);
    } catch {
      setError("Failed to load flagged comments. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Handle delete confirmation
  const handleDeleteClick = (eventId: string, userId: string) => {
    const comment = comments.find(
      (c) => c.eventId === eventId && c.reviewer._id === userId
    );
    setConfirmModal({
      isOpen: true,
      type: "delete",
      eventId,
      userId,
      userName: comment
        ? `${comment.reviewer.firstName} ${comment.reviewer.lastName}`
        : undefined,
    });
  };

  // Handle block confirmation
  const handleBlockClick = (userId: string) => {
    const comment = comments.find((c) => c.reviewer._id === userId);
    setConfirmModal({
      isOpen: true,
      type: "block",
      userId,
      userName: comment
        ? `${comment.reviewer.firstName} ${comment.reviewer.lastName}`
        : undefined,
    });
  };

  // Handle flag safe confirmation
  const handleFlagSafeClick = (eventId: string, userId: string) => {
    const comment = comments.find(
      (c) => c.eventId === eventId && c.reviewer._id === userId
    );
    setConfirmModal({
      isOpen: true,
      type: "safe",
      eventId,
      userId,
      userName: comment
        ? `${comment.reviewer.firstName} ${comment.reviewer.lastName}`
        : undefined,
    });
  };

  // Close modal
  const handleCloseModal = () => {
    setConfirmModal(null);
  };

  // Confirm delete action
  const handleConfirmDelete = async () => {
    if (!confirmModal || !confirmModal.eventId) return;

    setActionLoading({ type: "delete", id: confirmModal.userId });
    handleCloseModal();

    const success = await deleteComment(
      confirmModal.eventId,
      confirmModal.userId
    );
    if (success) {
      setComments((prev) =>
        prev.filter(
          (c) =>
            !(
              c.eventId === confirmModal.eventId &&
              c.reviewer._id === confirmModal.userId
            )
        )
      );
    }
    setActionLoading({ type: null, id: null });
  };

  // Confirm block action
  const handleConfirmBlock = async () => {
    if (!confirmModal) return;

    setActionLoading({ type: "block", id: confirmModal.userId });
    handleCloseModal();

    const success = await blockUser(confirmModal.userId);
    if (success) {
      // Remove all comments from this user
      setComments((prev) =>
        prev.filter((c) => c.reviewer._id !== confirmModal.userId)
      );
    }
    setActionLoading({ type: null, id: null });
  };

  // Confirm flag safe action
  const handleConfirmFlagSafe = async () => {
    if (!confirmModal || !confirmModal.eventId) return;

    setActionLoading({ type: "safe", id: confirmModal.userId });
    handleCloseModal();

    const success = await flagAsSafe(confirmModal.eventId, confirmModal.userId);
    if (success) {
      setComments((prev) =>
        prev.filter(
          (c) =>
            !(
              c.eventId === confirmModal.eventId &&
              c.reviewer._id === confirmModal.userId
            )
        )
      );
    }
    setActionLoading({ type: null, id: null });
  };

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            fontFamily: "var(--font-jost), system-ui, sans-serif",
          }}
        >
          <MessageSquareWarning size={24} />
          Flagged Comments
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[1, 2, 3].map((i) => (
            <CommentCardSkeleton key={i} />
          ))}
        </Box>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <CustomButton
          variant="outlined"
          color="primary"
          onClick={loadComments}
          startIcon={<RefreshCw size={18} />}
        >
          Try Again
        </CustomButton>
      </Box>
    );
  }

  // Empty state
  if (comments.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            fontFamily: "var(--font-jost), system-ui, sans-serif",
          }}
        >
          <MessageSquareWarning size={24} />
          Flagged Comments
        </Typography>
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 4,
            backgroundColor: "#f9fafb",
            borderRadius: "16px",
            border: "1px dashed #e5e7eb",
          }}
        >
          <MessageSquareWarning
            size={48}
            strokeWidth={1.5}
            style={{ color: "#9ca3af", marginBottom: 16 }}
          />
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              fontWeight: 500,
              mb: 1,
              fontFamily: "var(--font-jost), system-ui, sans-serif",
            }}
          >
            No Flagged Comments
          </Typography>
          <Typography variant="body2" sx={{ color: "text.disabled" }}>
            All comments are currently safe. Check back later.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            fontFamily: "var(--font-jost), system-ui, sans-serif",
          }}
        >
          <MessageSquareWarning size={24} />
          Flagged Comments
          <Box
            component="span"
            sx={{
              backgroundColor: "error.main",
              color: "white",
              fontSize: "12px",
              fontWeight: 600,
              padding: "2px 10px",
              borderRadius: "12px",
              ml: 1,
            }}
          >
            {comments.length}
          </Box>
        </Typography>
      </Box>

      {/* Comments list */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {comments.map((comment) => (
          <CommentCard
            key={comment.reviewId}
            comment={comment}
            onDelete={handleDeleteClick}
            onBlockUser={handleBlockClick}
            onFlagSafe={handleFlagSafeClick}
            isDeleting={
              actionLoading.type === "delete" &&
              actionLoading.id === comment.reviewer._id
            }
            isBlocking={
              actionLoading.type === "block" &&
              actionLoading.id === comment.reviewer._id
            }
            isFlaggingSafe={
              actionLoading.type === "safe" &&
              actionLoading.id === comment.reviewer._id
            }
          />
        ))}
      </Box>

      <CustomModal
        open={!!(confirmModal?.isOpen && confirmModal?.type === "delete")}
        onClose={handleCloseModal}
        title="Delete Comment"
        description={`Are you sure you want to delete this comment${
          confirmModal?.userName ? ` by ${confirmModal.userName}` : ""
        }? This action cannot be undone.`}
        modalType="delete"
        buttonOption1={{
          label: "Delete",
          variant: "contained",
          color: "error",
          onClick: handleConfirmDelete,
        }}
        buttonOption2={{
          label: "Cancel",
          variant: "outlined",
          onClick: handleCloseModal,
        }}
      />

      <CustomModal
        open={!!(confirmModal?.isOpen && confirmModal?.type === "block")}
        onClose={handleCloseModal}
        title="Block User"
        description={`Are you sure you want to block ${
          confirmModal?.userName || "this user"
        }? They will no longer be able to post comments.`}
        modalType="warning"
        buttonOption1={{
          label: "Block User",
          variant: "contained",
          color: "warning",
          onClick: handleConfirmBlock,
        }}
        buttonOption2={{
          label: "Cancel",
          variant: "outlined",
          onClick: handleCloseModal,
        }}
      />

      <CustomModal
        open={!!(confirmModal?.isOpen && confirmModal?.type === "safe")}
        onClose={handleCloseModal}
        title="Flag as Safe"
        description={`Are you sure you want to flag this comment${
          confirmModal?.userName ? ` by ${confirmModal.userName}` : ""
        } as safe? This will remove the toxicity flag.`}
        modalType="confirm"
        buttonOption1={{
          label: "Confirm",
          variant: "contained",
          onClick: handleConfirmFlagSafe,
        }}
        buttonOption2={{
          label: "Cancel",
          variant: "outlined",
          onClick: handleCloseModal,
        }}
      />
    </Box>
  );
}
