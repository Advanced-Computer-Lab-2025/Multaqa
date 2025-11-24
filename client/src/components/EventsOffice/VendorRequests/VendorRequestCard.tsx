"use client";

import React, { useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Stack,
  Typography,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { CheckCircle, Clock, MapPin, Users, XCircle, ChevronDown } from "lucide-react";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import theme from "@/themes/lightTheme";
import {
  VendorParticipationRequest,
  VendorRequestStatus,
} from "./types";

type Props = {
  request: VendorParticipationRequest;
  onRespond?: (status: Extract<VendorRequestStatus, "approved" | "rejected">) => void;
  disabled?: boolean;
  loadingStatus?: VendorRequestStatus | null;
  setRefresh:React.Dispatch<React.SetStateAction<boolean>>;
};

const STATUS_CONFIG: Record<VendorRequestStatus, { label: string; color: "success" | "error" | "warning"; bg: string; fg: string }> = {
  pending: {
    label: "Pending Review",
    color: "warning",
    bg: "#fef3c7",
    fg: "#92400e",
  },
  approved: {
    label: "Approved",
    color: "success",
    bg: "#dcfce7",
    fg: "#166534",
  },
  rejected: {
    label: "Rejected",
    color: "error",
    bg: "#fee2e2",
    fg: "#b91c1c",
  },
};

const EVENT_TYPE_CONFIG: Record<string, { label: string; bg: string; fg: string }> = {
  bazaar: {
    label: "Bazaar",
    bg: "#ede9fe",
    fg: "#5b21b6",
  },
  platform_booth: {
    label: "Platform Booth",
    bg: "#dbeafe",
    fg: "#1d4ed8",
  },
  unknown: {
    label: "Other",
    bg: "#e5e7eb",
    fg: "#374151",
  },
};

function formatDate(value?: string) {
  if (!value) return "TBD";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase?.() ?? "")
    .join("")
    .slice(0, 2);
}

export default function VendorRequestCard({
  request,
  onRespond,
  disabled = false,
  loadingStatus = null,
  setRefresh
}: Props) {
  const statusConfig = STATUS_CONFIG[request.status] ?? STATUS_CONFIG.pending;
  const eventConfig =
    EVENT_TYPE_CONFIG[request.eventType] ?? EVENT_TYPE_CONFIG.unknown;
  const isPending = request.status === "pending";
  const attendees = request.attendees ?? [];
  const [expanded, setExpanded] = useState(false);
  
  const hasMultipleAttendees = attendees.length > 1;
  const visibleAttendees = expanded ? attendees : attendees.slice(0, 1);

  return (
    <Box
      sx={{
        borderRadius: 3,
        border: "1px solid #e5e7eb",
        background: "#ffffff",
        boxShadow:
          "0 12px 32px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
        p: { xs: 2, sm: 3 },
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
      }}
    >
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
        <Avatar
          src={request.vendorLogo}
          alt={request.vendorName}
          sx={{
            width: 56,
            height: 56,
            bgcolor: theme.palette.primary.light,
            fontWeight: 700,
            fontSize: "1.1rem",
          }}
        >
          {initials(request.vendorName)}
        </Avatar>

        <Stack spacing={1} flex={1} minWidth={0}>
          <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={1} alignItems={{ md: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827" }} noWrap>
              {request.vendorName}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip
                size="small"
                label={eventConfig.label}
                sx={{
                  bgcolor: eventConfig.bg,
                  color: eventConfig.fg,
                  fontWeight: 600,
                }}
              />
              <Chip
                size="small"
                label={statusConfig.label}
                sx={{
                  bgcolor: statusConfig.bg,
                  color: statusConfig.fg,
                  fontWeight: 600,
                }}
              />
              {request.boothSize ? (
                <Chip
                  size="small"
                  label={`Booth: ${request.boothSize}`}
                  sx={{
                    bgcolor: "#f0f9ff",
                    color: "#0c4a6e",
                    fontWeight: 600,
                  }}
                />
              ) : null}
            </Stack>
          </Box>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2} color="#425466" fontSize="0.95rem">
            <Stack direction="row" spacing={1} alignItems="center">
              <Clock size={16} />
              <Typography variant="body2">{formatDate(request.startDate)}</Typography>
              {request.endDate ? (
                <Typography variant="body2">– {formatDate(request.endDate)}</Typography>
              ) : null}
            </Stack>
            {request.location ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <MapPin size={16} />
                <Typography variant="body2">{request.location}</Typography>
              </Stack>
            ) : null}
            {request.boothLocation ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Booth Location:
                </Typography>
                <Typography variant="body2">{request.boothLocation}</Typography>
              </Stack>
            ) : null}
          </Stack>
        </Stack>

        <Stack spacing={1.5} alignItems={{ xs: "stretch", sm: "flex-end" }} justifyContent="space-between">
          <Box textAlign={{ xs: "left", sm: "right" }}>
            <Typography variant="caption" sx={{ color: "#6b7280" }}>
              Event
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {request.eventName}
            </Typography>
          </Box>

          {isPending && onRespond ? (
            <Stack direction="row" spacing={1}>
              <CustomButton
                variant="outlined"
                color="error"
                size="small"
                disabled={disabled || loadingStatus === "approved"}
                onClick={() => {onRespond("rejected"); setRefresh((prev)=>!prev)} }
                startIcon={<XCircle size={16} />}
              >
                Reject
              </CustomButton>
              <CustomButton
                variant="contained"
                color="success"
                size="small"
                disabled={disabled || loadingStatus === "rejected"}
                onClick={() => {onRespond("approved"); setRefresh((prev)=>!prev)} }
                startIcon={<CheckCircle size={16} />}
              >
                Approve
              </CustomButton>
            </Stack>
          ) : (
            <Chip
              size="small"
              label={statusConfig.label}
              sx={{
                bgcolor: statusConfig.bg,
                color: statusConfig.fg,
                fontWeight: 600,
              }}
            />
          )}
        </Stack>
      </Stack>

      <Divider />

      <Stack spacing={1.5}>
        {attendees.length > 0 ? (
          hasMultipleAttendees ? (
            <Accordion
              expanded={expanded}
              onChange={(_, isExpanded) => setExpanded(isExpanded)}
              sx={{
                boxShadow: "none",
                border: "none",
                "&:before": { display: "none" },
                "&.Mui-expanded": { margin: 0 },
              }}
              disableGutters
            >
              <AccordionSummary
                expandIcon={
                  <ChevronDown
                    size={20}
                    style={{
                      transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                }
                sx={{
                  padding: 0,
                  minHeight: "unset",
                  "&.Mui-expanded": { minHeight: "unset" },
                  "& .MuiAccordionSummary-content": {
                    margin: 0,
                    "&.Mui-expanded": { margin: 0 },
                  },
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Users size={16} color="#1f2937" />
                  <Typography variant="subtitle2" sx={{ color: "#111827" }}>
                    Attendees ({attendees.length})
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: 0, paddingTop: 1.5 }}>
                <Stack spacing={0.75}>
                  {visibleAttendees.map((attendee, index) => (
                    <Stack
                      key={`${attendee.email ?? attendee.name ?? index}`}
                      direction="row"
                      spacing={1}
                      justifyContent="space-between"
                      alignItems="baseline"
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, color: "#1f2937" }}
                      >
                        {attendee.name ?? "Unnamed attendee"}
                      </Typography>
                      {attendee.email ? (
                        <Tooltip title={attendee.email} placement="top">
                          <Typography
                            variant="caption"
                            sx={{ color: "#6b7280" }}
                            noWrap
                          >
                            {attendee.email}
                          </Typography>
                        </Tooltip>
                      ) : null}
                    </Stack>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          ) : (
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
                <Users size={16} color="#1f2937" />
                <Typography variant="subtitle2" sx={{ color: "#111827" }}>
                  Attendees
                </Typography>
              </Stack>
              <Stack spacing={0.75}>
                {attendees.map((attendee, index) => (
                  <Stack
                    key={`${attendee.email ?? attendee.name ?? index}`}
                    direction="row"
                    spacing={1}
                    justifyContent="space-between"
                    alignItems="baseline"
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, color: "#1f2937" }}
                    >
                      {attendee.name ?? "Unnamed attendee"}
                    </Typography>
                    {attendee.email ? (
                      <Tooltip title={attendee.email} placement="top">
                        <Typography
                          variant="caption"
                          sx={{ color: "#6b7280" }}
                          noWrap
                        >
                          {attendee.email}
                        </Typography>
                      </Tooltip>
                    ) : null}
                  </Stack>
                ))}
              </Stack>
            </Box>
          )
        ) : (
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <Users size={16} color="#6b7280" />
              <Typography variant="subtitle2" sx={{ color: "#111827" }}>
                Attendees
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              No attendees provided.
            </Typography>
          </Box>
        )}

        {request.notes ? (
          <Box
            sx={{
              mt: 1,
              p: 1.5,
              borderRadius: 2,
              border: "1px dashed #cbd5f5",
              bgcolor: "#f8fafc",
            }}
          >
            <Typography variant="caption" sx={{ color: "#1e293b", fontWeight: 600 }}>
              Notes
            </Typography>
            <Typography variant="body2" sx={{ color: "#475569" }}>
              {request.notes}
            </Typography>
          </Box>
        ) : null}
      </Stack>
    </Box>
  );
}
