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
  IconButton,
  Grid,
  Paper,
  alpha,
  AccordionDetails
} from "@mui/material";
import {
  CheckCircle,
  Clock,
  MapPin,
  XCircle,
  FileText,
  Download,
  IdCard,
  Image as ImageIcon,
  ChevronDown,
  Building,
  CalendarDays,
  Eye,
  Users,
} from "lucide-react";

import CustomButton from "@/components/shared/Buttons/CustomButton";
import { CustomModalLayout } from "@/components/shared/modals";
import theme from "@/themes/lightTheme";
import StyledAccordion from "@/components/shared/Accordion/StyledAccordion";
import StyledAccordionSummary from "@/components/shared/Accordion/StyledAccordionSummary";
import { VendorParticipationRequest, VendorRequestStatus } from "./types";

type ExtendedVendorRequest = VendorParticipationRequest & {
  taxCardUrl?: string;
  attendees?: Array<{
    name?: string;
    email?: string;
    nationalIdUrl?: string;
  }>;
};

type Props = {
  request: ExtendedVendorRequest;
  onRespond?: (
    status: Extract<VendorRequestStatus, "approved" | "rejected">
  ) => void;
  disabled?: boolean;
  loadingStatus?: VendorRequestStatus | null;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

const STATUS_CONFIG: Record<
  VendorRequestStatus,
  { label: string; color: "success" | "error" | "warning"; bg: string; fg: string }
> = {
  pending: { label: "Pending Review", color: "warning", bg: "#fffbeb", fg: "#b45309" },
  approved: { label: "Approved", color: "success", bg: "#f0fdf4", fg: "#15803d" },
  rejected: { label: "Rejected", color: "error", bg: "#fef2f2", fg: "#b91c1c" },
};

const EVENT_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  bazaar: { label: "Bazaar", color: "#e91e63" },
  platform_booth: { label: "Platform Booth", color: "#2196f3" },
  unknown: { label: "Event", color: "#374151" },
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

function isImageUrl(url: string) {
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) || url.includes("format=png") || url.includes("format=jpg");
}

const downloadFile = async (url: string, desiredName: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    let extension = blob.type.split('/')[1];
    if (!extension || extension === 'plain') {
      extension = url.split('.').pop()?.split('?')[0] || 'file';
    }

    const fileName = `${desiredName}.${extension}`;

    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    window.open(url, "_blank");
  }
};

export default function VendorRequestCard({
  request,
  onRespond,
  disabled = false,
  loadingStatus = null,
  setRefresh,
}: Props) {
  const [viewDoc, setViewDoc] = useState<{ url: string; title: string } | null>(null);

  const statusConfig = STATUS_CONFIG[request.status] ?? STATUS_CONFIG.pending;
  const eventConfig = EVENT_TYPE_CONFIG[request.eventType] ?? EVENT_TYPE_CONFIG.unknown;
  const isPending = request.status === "pending";
  const attendees = request.attendees ?? [];

  const handleViewDocument = (url: string, title: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setViewDoc({ url, title });
  };

  const handleCloseModal = () => {
    setViewDoc(null);
  };

  const handleDownloadClick = (url: string, docTitle: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const cleanVendorName = request.vendorName.replace(/[^a-z0-9]/gi, '_');
    const cleanDocTitle = docTitle.replace(/[^a-z0-9]/gi, '_');
    const fileName = `${cleanVendorName}_${cleanDocTitle}`;
    downloadFile(url, fileName);
  };

  // Helper to construct Google Docs Viewer URL
  const getEmbedUrl = (url: string) => {
    return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
  };

  return (
    <>
      <StyledAccordion
        disableGutters
        sx={{
          border: "1px solid #e5e7eb",
          borderRadius: "12px !important",
          background: "#ffffff",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
          overflow: "hidden",
          "&:before": { display: "none" },
        }}
      >
        <StyledAccordionSummary
          component="div"
          expandIcon={null}
          sx={{
            px: { xs: 2, sm: 3 },
            py: 2.5,
            "& .MuiAccordionSummary-content": {
              margin: "12px 0",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              cursor: "pointer",
              width: "100%",
            },
            "&.Mui-expanded .custom-expand-icon": {
              transform: "translateX(-50%) rotate(180deg)",
            },
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
            width="100%"
            spacing={2}
            sx={{ position: "relative" }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src={request.vendorLogo}
                alt={request.vendorName}
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: theme.palette.primary.light,
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  border: "1px solid #e2e8f0",
                }}
              >
                {initials(request.vendorName)}
              </Avatar>

              <Stack spacing={0.5}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#111827", lineHeight: 1.2 }}
                >
                  {request.vendorName}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography
                    variant="body2"
                    sx={{ color: "#6b7280", fontWeight: 500 }}
                  >
                    {request.eventName}
                  </Typography>
                  <Chip
                    size="small"
                    label={eventConfig.label}
                    sx={{
                      height: 20,
                      fontSize: "0.65rem",
                      backgroundColor: `${eventConfig.color}08`,
                      color: eventConfig.color,
                      fontWeight: 600,
                      border: `1px solid ${eventConfig.color}`,
                      "&:hover": {
                        backgroundColor: `${eventConfig.color}15`,
                      },
                    }}
                  />
                </Stack>
              </Stack>
            </Stack>

            <Box
              className="custom-expand-icon"
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "center",
                color: "#9ca3af",
                transition: "transform 0.3s ease",
                position: "absolute",
                left: "50%",
                bottom: "-34px",
                transform: "translateX(-50%)",
                zIndex: 1,
                p: 0.5,
              }}
            >
              <ChevronDown size={24} />
            </Box>

            <Stack
              direction={{ xs: "row", md: "row" }}
              justifyContent={{ xs: "space-between", md: "flex-end" }}
              width={{ xs: "100%", md: "auto" }}
              spacing={2}
              alignItems="center"
            >
              <Box
                className="custom-expand-icon-mobile"
                sx={{
                  display: { xs: "flex", md: "none" },
                  color: "#6b7280",
                  transition: "transform 0.3s ease",
                }}
              >
                <ChevronDown size={24} />
              </Box>

              {isPending && onRespond ? (
                <Stack direction="row" spacing={1}>
                  <CustomButton
                    variant="outlined"
                    color="error"
                    size="small"
                    disabled={disabled || loadingStatus === "approved"}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRespond("rejected");
                      setRefresh((prev) => !prev);
                    }}
                    startIcon={<XCircle size={16} />}
                  >
                    Reject
                  </CustomButton>
                  <CustomButton
                    variant="contained"
                    color="success"
                    size="small"
                    disabled={disabled || loadingStatus === "rejected"}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRespond("approved");
                      setRefresh((prev) => !prev);
                    }}
                    startIcon={<CheckCircle size={16} />}
                  >
                    Approve
                  </CustomButton>
                </Stack>
              ) : (
                <Chip
                  label={statusConfig.label}
                  sx={{
                    bgcolor: statusConfig.bg,
                    color: statusConfig.fg,
                    fontWeight: 600,
                    borderRadius: "6px",
                  }}
                />
              )}
            </Stack>
          </Stack>
        </StyledAccordionSummary>

        <Divider />

        <AccordionDetails sx={{ p: { xs: 2, sm: 3 }, bgcolor: "#f9fafb" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  color="#374151"
                >
                  Event Details
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    border: "1px solid #e5e7eb",
                    borderRadius: 2,
                    bgcolor: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  <Stack direction="row" spacing={1.5}>
                    <CalendarDays size={18} className="text-gray-400" />
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Start Date
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {formatDate(request.startDate)}
                      </Typography>
                    </Box>
                  </Stack>
                  {request.endDate && (
                    <Stack direction="row" spacing={1.5}>
                      <Clock size={18} className="text-gray-400" />
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          End Date
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {formatDate(request.endDate)}
                        </Typography>
                      </Box>
                    </Stack>
                  )}
                  <Divider sx={{ borderStyle: "dashed" }} />
                  <Stack direction="row" spacing={1.5}>
                    <MapPin size={18} className="text-gray-400" />
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Location
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {request.location || "N/A"}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1.5}>
                    <Building size={18} className="text-gray-400" />
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Booth Info
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {request.boothSize || "Standard"}{" "}
                        {request.boothLocation && ` • ${request.boothLocation}`}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
                {request.notes && (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "#fff",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#6b7280",
                        fontWeight: 700,
                        mb: 0.5,
                        display: "block",
                      }}
                    >
                      VENDOR NOTES
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#4b5563", fontStyle: "italic" }}
                    >
                      "{request.notes}"
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  color="#374151"
                >
                  Company Documents
                </Typography>
                <Stack spacing={1.5}>
                  {request.taxCardUrl ? (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        border: "1px solid #e5e7eb",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        bgcolor: "#fff",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        overflow="hidden"
                      >
                        <Box
                          sx={{
                            p: 1,
                            bgcolor: "#eff6ff",
                            borderRadius: 1,
                            color: "#3b82f6",
                          }}
                        >
                          <FileText size={20} />
                        </Box>
                        <Box minWidth={0}>
                          <Typography variant="body2" fontWeight={600} noWrap>
                            Tax Card
                          </Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row">
                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleViewDocument(
                                request.taxCardUrl!,
                                "Tax Card"
                              )
                            }
                          >
                            <Eye size={18} className="text-gray-500" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton
                            size="small"
                            onClick={(e) =>
                              handleDownloadClick(
                                request.taxCardUrl!,
                                "Tax Card",
                                e
                              )
                            }
                          >
                            <Download size={18} className="text-gray-500" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Paper>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontStyle="italic"
                    >
                      No Tax Card uploaded
                    </Typography>
                  )}

                  {request.vendorLogo ? (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        border: "1px solid #e5e7eb",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        bgcolor: "#fff",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        overflow="hidden"
                      >
                        <Box
                          sx={{
                            p: 1,
                            bgcolor: "#f0fdf4",
                            borderRadius: 1,
                            color: "#22c55e",
                          }}
                        >
                          <ImageIcon size={20} />
                        </Box>
                        <Box minWidth={0}>
                          <Typography variant="body2" fontWeight={600} noWrap>
                            Vendor Logo
                          </Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row">
                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleViewDocument(
                                request.vendorLogo!,
                                "Vendor Logo"
                              )
                            }
                          >
                            <Eye size={18} className="text-gray-500" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton
                            size="small"
                            onClick={(e) =>
                              handleDownloadClick(
                                request.vendorLogo!,
                                "Logo",
                                e
                              )
                            }
                          >
                            <Download size={18} className="text-gray-500" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Paper>
                  ) : null}
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    color="#374151"
                  >
                    Attendees
                  </Typography>
                  <Chip
                    label={attendees.length}
                    size="small"
                    sx={{ height: 20, fontSize: "0.7rem", fontWeight: 600 }}
                  />
                </Stack>
                {attendees.length > 0 ? (
                  <Stack spacing={1.5}>
                    {attendees.map((attendee, index) => (
                      <Paper
                        key={index}
                        elevation={0}
                        sx={{
                          p: 1.5,
                          border: "1px solid #e5e7eb",
                          borderRadius: 2,
                          bgcolor: "#fff",
                          transition: "all 0.2s",
                          "&:hover": {
                            borderColor: theme.palette.primary.main,
                          },
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Stack
                            direction="row"
                            spacing={1.5}
                            overflow="hidden"
                          >
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                fontSize: "0.75rem",
                                bgcolor: "#f3f4f6",
                                color: "#4b5563",
                                fontWeight: 700,
                              }}
                            >
                              {initials(attendee.name ?? "A")}
                            </Avatar>
                            <Box minWidth={0}>
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                noWrap
                              >
                                {attendee.name || "Unknown"}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                noWrap
                                display="block"
                              >
                                {attendee.email || "No email"}
                              </Typography>
                            </Box>
                          </Stack>
                          {attendee.nationalIdUrl && (
                            <Stack direction="row" spacing={0.5}>
                              <Tooltip title="View ID">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleViewDocument(
                                      attendee.nationalIdUrl!,
                                      `${attendee.name} ID`
                                    )
                                  }
                                  sx={{
                                    color: "#6b7280",
                                    "&:hover": {
                                      color: theme.palette.primary.main,
                                      bgcolor: alpha(
                                        theme.palette.primary.main,
                                        0.1
                                      ),
                                    },
                                  }}
                                >
                                  <IdCard size={16} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download ID">
                                <IconButton
                                  size="small"
                                  onClick={(e) =>
                                    handleDownloadClick(
                                      attendee.nationalIdUrl!,
                                      `${attendee.name}_ID`,
                                      e
                                    )
                                  }
                                  sx={{
                                    color: "#6b7280",
                                    "&:hover": {
                                      color: theme.palette.primary.main,
                                      bgcolor: alpha(
                                        theme.palette.primary.main,
                                        0.1
                                      ),
                                    },
                                  }}
                                >
                                  <Download size={16} />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          )}
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                ) : (
                  <Box
                    sx={{
                      p: 3,
                      textAlign: "center",
                      border: "1px dashed #d1d5db",
                      borderRadius: 2,
                    }}
                  >
                    <Users size={24} className="text-gray-300 mx-auto mb-1" />
                    <Typography variant="caption" color="text.secondary">
                      No attendees listed
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Grid>
          </Grid>
        </AccordionDetails>
      </StyledAccordion>

      <CustomModalLayout
        open={!!viewDoc}
        onClose={handleCloseModal}
        width="w-[90vw] md:w-[800px] lg:w-[1000px]"
      >
        {viewDoc && (
          <Stack spacing={2} sx={{ p: 2 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" fontWeight={700}>
                {viewDoc.title}
              </Typography>
            </Stack>

            <Box
              sx={{
                width: "100%",
                height: isImageUrl(viewDoc.url) ? "auto" : "60vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "#fffff",
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
              }}
            >
              {isImageUrl(viewDoc.url) ? (
                <img
                  src={viewDoc.url}
                  alt={viewDoc.title}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "60vh",
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                    display: "block",
                    border: "3px solid #e5e7eb",
                    borderRadius: "10%",
                  }}
                />
              ) : (
                <iframe
                  src={getEmbedUrl(viewDoc.url)}
                  title={viewDoc.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                  }}
                />
              )}
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <CustomButton
                variant="contained"
                onClick={(e) =>
                  handleDownloadClick(viewDoc.url, viewDoc.title, e)
                }
                startIcon={<Download size={18} />}
                sx={{ width: "auto" }}
              >
                Download {isImageUrl(viewDoc.url) ? "Image" : "Document"}
              </CustomButton>
            </Box>
          </Stack>
        )}
      </CustomModalLayout>
    </>
  );
}