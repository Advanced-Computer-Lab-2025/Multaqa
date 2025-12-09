"use client";

import React from "react";
import { Box, Typography, Rating, Tooltip, Skeleton } from "@mui/material";
import {
    Trash2,
    Ban,
    AlertTriangle,
    Flame,
    MessageSquareWarning,
    Skull,
} from "lucide-react";
import {
    CardContainer,
    CardHeader,
    CardFooter,
    SentimentContainer,
    SentimentBadge,
    ActionButton,
    ToxicityScoreBadge,
} from "./styles";
import { CommentCardProps } from "./types";

// Map toxicity category to icon and label
const categoryConfig = {
    insult: { icon: MessageSquareWarning, label: "Insult" },
    threat: { icon: Skull, label: "Threat" },
    profanity: { icon: Flame, label: "Profanity" },
    hateSpeech: { icon: AlertTriangle, label: "Hate Speech" },
};

// Get severity based on score
const getSeverity = (score: number): "low" | "medium" | "high" => {
    if (score >= 0.7) return "high";
    if (score >= 0.4) return "medium";
    return "low";
};

// Format date to readable string
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export default function CommentCard({
    comment,
    onDelete,
    onBlockUser,
    isDeleting = false,
    isBlocking = false,
}: CommentCardProps) {
    const { reviewer, eventName, rating, createdAt, flaggedForToxicity } = comment;
    const fullName = `${reviewer.firstName} ${reviewer.lastName}`;

    return (
        <CardContainer>
            {/* Header with user info and actions */}
            <CardHeader>
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.5 }}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 600,
                                color: "text.primary",
                                fontFamily: "var(--font-jost), system-ui, sans-serif",
                            }}
                        >
                            {fullName}
                        </Typography>
                        <ToxicityScoreBadge score={flaggedForToxicity.score}>
                            {Math.round(flaggedForToxicity.score * 100)}% Toxic
                        </ToxicityScoreBadge>
                    </Box>
                    <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", display: "block" }}
                    >
                        {formatDate(createdAt)}
                    </Typography>
                </Box>

                {/* Action buttons */}
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="Delete Comment" arrow>
                        <span>
                            <ActionButton
                                actionType="delete"
                                onClick={() => onDelete(comment.eventId, reviewer._id)}
                                disabled={isDeleting}
                                size="small"
                            >
                                <Trash2 size={18} />
                            </ActionButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Block User" arrow>
                        <span>
                            <ActionButton
                                actionType="block"
                                onClick={() => onBlockUser(reviewer._id)}
                                disabled={isBlocking}
                                size="small"
                            >
                                <Ban size={18} />
                            </ActionButton>
                        </span>
                    </Tooltip>
                </Box>
            </CardHeader>

            {/* Comment text */}
            <Box sx={{ mb: 2 }}>
                <Typography
                    variant="body2"
                    sx={{
                        color: "text.primary",
                        lineHeight: 1.6,
                        backgroundColor: "rgba(239, 68, 68, 0.05)",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: "1px solid rgba(239, 68, 68, 0.1)",
                        fontFamily: "var(--font-poppins), system-ui, sans-serif",
                    }}
                >
                    &ldquo;{comment.comment}&rdquo;
                </Typography>
            </Box>

            {/* Rating */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
                    Rating:
                </Typography>
                <Rating value={rating} readOnly size="small" precision={0.5} />
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    ({rating}/5)
                </Typography>
            </Box>

            {/* Footer with event name and sentiment badges */}
            <CardFooter>
                {/* Sentiment badges */}
                <SentimentContainer>
                    {Object.entries(flaggedForToxicity.categories).map(([key, score]) => {
                        const config = categoryConfig[key as keyof typeof categoryConfig];
                        if (!config) return null;
                        const IconComponent = config.icon;
                        const severity = getSeverity(score);
                        return (
                            <SentimentBadge key={key} severity={severity}>
                                <IconComponent size={14} />
                                <span>{config.label}</span>
                                <span style={{ fontWeight: 600 }}>{Math.round(score * 100)}%</span>
                            </SentimentBadge>
                        );
                    })}
                </SentimentContainer>

                {/* Event name */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        backgroundColor: "rgba(99, 102, 241, 0.08)",
                        padding: "6px 12px",
                        borderRadius: "8px",
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            color: "#6366f1",
                            fontWeight: 500,
                        }}
                    >
                        Event: {eventName}
                    </Typography>
                </Box>
            </CardFooter>
        </CardContainer>
    );
}

// Skeleton loader for CommentCard
export function CommentCardSkeleton() {
    return (
        <CardContainer>
            <CardHeader>
                <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width={150} height={24} />
                    <Skeleton variant="text" width={100} height={16} />
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="circular" width={32} height={32} />
                </Box>
            </CardHeader>
            <Skeleton variant="rounded" height={60} sx={{ mb: 2 }} />
            <Skeleton variant="text" width={120} height={20} sx={{ mb: 2 }} />
            <CardFooter>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Skeleton variant="rounded" width={80} height={28} />
                    <Skeleton variant="rounded" width={80} height={28} />
                    <Skeleton variant="rounded" width={80} height={28} />
                    <Skeleton variant="rounded" width={80} height={28} />
                </Box>
                <Skeleton variant="rounded" width={150} height={28} />
            </CardFooter>
        </CardContainer>
    );
}
