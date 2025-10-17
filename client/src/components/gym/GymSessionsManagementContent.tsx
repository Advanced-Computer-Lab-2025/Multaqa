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
import CustomButton from "../shared/Buttons/CustomButton";
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

  const getSessionTypeColor = (type: GymSessionType) => {
    const colors = {
      YOGA: theme.palette.primary.main,
      PILATES: theme.palette.secondary.main,
      AEROBICS: theme.palette.tertiary.main,
      ZUMBA: "#ff9800",
      CROSS_CIRCUIT: "#4caf50",
      KICK_BOXING: "#f44336",
    };
    return colors[type];
  };

  const getAvailabilityStatus = (spotsTaken: number, spotsTotal: number) => {
    const percentage = (spotsTaken / spotsTotal) * 100;
    if (percentage >= 100)
      return { label: "Full", color: theme.palette.error.main };
    if (percentage >= 80)
      return { label: "Almost Full", color: theme.palette.warning.main };
    return { label: "Available", color: theme.palette.success.main };
  };

  const handleSessionTypeSelect = (sessionType: GymSessionType) => {
    setSelectedSessionType(sessionType);
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
    setSelectedSessionType(undefined);
  };

  const handleSubmitSession = (sessionData: any) => {
    // Generate a new ID for the session
    const newSession: GymSession = {
      ...sessionData,
      id: (sessions.length + 1).toString(),
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
        <Box sx={{ position: "relative" }}>
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
              <TableCell>Session</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Instructor</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Availability</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.map((session) => {
              const availability = getAvailabilityStatus(
                session.spotsTaken || 0,
                session.spotsTotal || 0
              );

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
                  <TableCell>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          fontFamily: "var(--font-jost), system-ui, sans-serif",
                        }}
                      >
                        {session.title}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
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
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      {session.instructor}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      {session.location}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {formatDate(session.start)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        {formatTime(session.start)} - {formatTime(session.end)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {session.spotsTaken}/{session.spotsTotal}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: availability.color,
                          fontWeight: 600,
                        }}
                      >
                        {availability.label}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={availability.label}
                      size="small"
                      sx={{
                        backgroundColor: `${availability.color}20`,
                        color: availability.color,
                        fontWeight: 600,
                      }}
                    />
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
