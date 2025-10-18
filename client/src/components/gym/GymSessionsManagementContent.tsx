"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import ContentWrapper from "../shared/containers/ContentWrapper";
import CreateGymSession from "./CreateGymSession";
import SessionTypeDropdown from "./SessionTypeDropdown";
import { GymSession, GymSessionType, SESSION_LABEL } from "./types";

// Mock data for demonstration
const initialSessions: GymSession[] = [
  {
    id: "1",
    title: "Morning Flow",
    type: "YOGA",
    instructor: "Sara Ahmed",
    location: "Studio A",
    start: "2025-01-20T09:00:00.000Z",
    end: "2025-01-20T10:00:00.000Z",
    spotsTotal: 20,
    spotsTaken: 15,
  },
  {
    id: "2",
    title: "Evening Zumba",
    type: "ZUMBA",
    instructor: "Omar Hassan",
    location: "Main Hall",
    start: "2025-01-20T18:00:00.000Z",
    end: "2025-01-20T19:00:00.000Z",
    spotsTotal: 25,
    spotsTaken: 20,
  },
  {
    id: "3",
    title: "Core Strength",
    type: "PILATES",
    instructor: "Nora Youssef",
    location: "Studio B",
    start: "2025-01-21T08:00:00.000Z",
    end: "2025-01-21T09:00:00.000Z",
    spotsTotal: 15,
    spotsTaken: 12,
  },
  {
    id: "4",
    title: "High Energy",
    type: "AEROBICS",
    instructor: "Hossam Ali",
    location: "Main Hall",
    start: "2025-01-21T17:00:00.000Z",
    end: "2025-01-21T18:00:00.000Z",
    spotsTotal: 30,
    spotsTaken: 8,
  },
  {
    id: "5",
    title: "Circuit Blast",
    type: "CROSS_CIRCUIT",
    instructor: "Maya Fahmy",
    location: "Studio A",
    start: "2025-01-22T10:00:00.000Z",
    end: "2025-01-22T11:00:00.000Z",
    spotsTotal: 18,
    spotsTaken: 18,
  },
  {
    id: "6",
    title: "Kick-boxing Basics",
    type: "KICK_BOXING",
    instructor: "Karim Salah",
    location: "Studio B",
    start: "2025-01-22T19:00:00.000Z",
    end: "2025-01-22T20:00:00.000Z",
    spotsTotal: 12,
    spotsTaken: 5,
  },
];

export default function GymSessionsManagementContent() {
  const theme = useTheme();
  const [sessions, setSessions] = useState<GymSession[]>(initialSessions);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedSessionType, setSelectedSessionType] = useState<
    GymSessionType | undefined
  >();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const calculateDuration = (start: string, end: string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));

    if (durationMinutes < 60) {
      return `${durationMinutes} min`;
    } else {
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    }
  };

  const getSessionTypeColor = (type: GymSessionType) => {
    const colors = {
      YOGA: "#4caf50", // Green - matches SessionTypeDropdown
      PILATES: "#2196f3", // Blue - matches SessionTypeDropdown
      AEROBICS: "#ff9800", // Orange - matches SessionTypeDropdown
      ZUMBA: "#e91e63", // Pink - matches SessionTypeDropdown
      CROSS_CIRCUIT: "#9c27b0", // Purple - matches SessionTypeDropdown
      KICK_BOXING: "#f44336", // Red - matches SessionTypeDropdown
    };
    return colors[type];
  };

  const handleSessionTypeSelect = (sessionType: GymSessionType) => {
    console.log("handleSessionTypeSelect called with:", sessionType);
    // Set the session type first, then open the modal
    setSelectedSessionType(sessionType);
    // Use a callback to ensure state is updated before opening modal
    setTimeout(() => {
      console.log("Opening modal");
      setCreateModalOpen(true);
    }, 0);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
    // Reset selected type after a slight delay to allow modal to close first
    setTimeout(() => {
      setSelectedSessionType(undefined);
    }, 300);
  };

  const handleSubmitSession = (sessionData: Partial<GymSession>) => {
    // Generate a new ID for the session
    const newSession: GymSession = {
      id: (sessions.length + 1).toString(),
      title: sessionData.title || "",
      type: sessionData.type || "YOGA",
      instructor: sessionData.instructor || "",
      location: sessionData.location || "",
      start: sessionData.start || "",
      end: sessionData.end || "",
      spotsTotal: sessionData.spotsTotal || 0,
      spotsTaken: sessionData.spotsTaken || 0,
    };

    // Add to sessions list
    setSessions((prev) => [...prev, newSession]);

    // TODO: Make API call to save session
    console.log("Session created:", newSession);
  };

  const handleEditSession = (session: GymSession) => {
    // TODO: Implement edit session modal/form
    console.log("Edit session:", session);
  };

  const handleDeleteSession = (session: GymSession) => {
    // TODO: Implement delete confirmation modal
    console.log("Delete session:", session);
  };

  const handleViewSession = (session: GymSession) => {
    // TODO: Implement view session details modal
    console.log("View session:", session);
  };

  return (
    <ContentWrapper
      title="Sessions Management"
      description="Manage all gym sessions, create new ones, and monitor attendance"
    >
      {/* Header with Create Button */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: "var(--font-jost), system-ui, sans-serif",
            fontWeight: 600,
            color: theme.palette.tertiary.dark,
          }}
        >
          All Sessions ({sessions.length})
        </Typography>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <SessionTypeDropdown onSessionTypeSelect={handleSessionTypeSelect} />
        </Box>
      </Box>

      {/* Sessions Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          border: `1px solid ${theme.palette.primary.light}`,
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: theme.palette.primary.light,
                "& .MuiTableCell-head": {
                  fontFamily: "var(--font-jost), system-ui, sans-serif",
                  fontWeight: 700,
                  color: theme.palette.tertiary.dark,
                  fontSize: "14px",
                },
              }}
            >
              <TableCell align="left">Date</TableCell>
              <TableCell align="center">Time</TableCell>
              <TableCell align="center">Duration</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Max Participants</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.map((session) => {
              return (
                <TableRow
                  key={session.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(98, 153, 208, 0.05)",
                    },
                    "& .MuiTableCell-body": {
                      fontFamily: "var(--font-poppins), system-ui, sans-serif",
                      fontSize: "14px",
                    },
                  }}
                >
                  <TableCell align="left">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {formatDate(session.start)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {formatTime(session.start)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {calculateDuration(session.start, session.end)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={SESSION_LABEL[session.type]}
                      size="small"
                      sx={{
                        backgroundColor: `${getSessionTypeColor(
                          session.type
                        )}20`,
                        color: getSessionTypeColor(session.type),
                        fontWeight: 600,
                        fontFamily:
                          "var(--font-poppins), system-ui, sans-serif",
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {session.spotsTotal}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        justifyContent: "center",
                      }}
                    >
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewSession(session)}
                          sx={{
                            color: theme.palette.primary.main,
                            "&:hover": {
                              backgroundColor: `${theme.palette.primary.main}20`,
                            },
                          }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Session">
                        <IconButton
                          size="small"
                          onClick={() => handleEditSession(session)}
                          sx={{
                            color: theme.palette.tertiary.main,
                            "&:hover": {
                              backgroundColor: `${theme.palette.tertiary.main}20`,
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Session">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteSession(session)}
                          sx={{
                            color: theme.palette.error.main,
                            "&:hover": {
                              backgroundColor: `${theme.palette.error.main}20`,
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {sessions.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            color: theme.palette.text.secondary,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: "var(--font-jost), system-ui, sans-serif",
              fontWeight: 600,
              mb: 1,
            }}
          >
            No Sessions Found
          </Typography>
          <Typography variant="body2">
            Create your first gym session to get started.
          </Typography>
        </Box>
      )}

      {/* Create Session Modal */}
      <CreateGymSession
        open={createModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleSubmitSession}
        preselectedType={selectedSessionType}
      />
    </ContentWrapper>
  );
}
