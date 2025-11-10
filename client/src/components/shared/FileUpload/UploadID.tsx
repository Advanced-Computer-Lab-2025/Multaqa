"use client";
import React, { useRef, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BadgeIcon from "@mui/icons-material/Badge";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import theme from "@/themes/lightTheme";

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface UploadIDProps {
  label?: string;
  accept?: string;
  disabled?: boolean;
  uploadStatus?: UploadStatus;
  onFileSelected?: (file: File | null) => void;
}

const UploadID: React.FC<UploadIDProps> = ({
  label = "ID",
  accept = "image/*,.pdf",
  disabled = false,
  uploadStatus = "idle",
  onFileSelected,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleClick = () => {
    if (!disabled && uploadStatus !== "uploading") inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    onFileSelected?.(selectedFile);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    onFileSelected?.(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Box
        onClick={handleClick}
        sx={{
          width: "90px",
          height: "90px",
          borderRadius: "10px",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.35s ease",
          opacity: disabled ? 0.6 : 1,
          position: "relative",
          border:
            uploadStatus === "success"
              ? "2px solid #24ad51ff"
              : uploadStatus === "error"
              ? `2px solid ${theme.palette.error.main}`
              : uploadStatus === "uploading"
              ? "2px solid transparent"
              : "2px solid transparent",
          boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
          ...(uploadStatus === "uploading" && {
            "&::before": {
              content: '""',
              position: "absolute",
              top: "-4px",
              left: "-4px",
              right: "-4px",
              bottom: "-4px",
              borderRadius: "14px",
              background: `linear-gradient(90deg, transparent 0%, transparent 50%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.main} 100%)`,
              backgroundSize: "200% 100%",
              animation: "borderProgress 2s linear infinite",
              zIndex: 2,
              padding: "3px",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            },
            "@keyframes borderProgress": {
              "0%": {
                backgroundPosition: "200% 0",
              },
              "100%": {
                backgroundPosition: "-200% 0",
              },
            },
          }),
          "&:hover": {
            transform: disabled ? "none" : "scale(1.05)",
            border:
              uploadStatus === "success"
                ? "2px solid #24ad51ff"
                : uploadStatus === "error"
                ? `2px solid ${theme.palette.error.main}`
                : uploadStatus === "uploading"
                ? "2px solid transparent"
                : `2px dashed ${theme.palette.primary.main}`,
          },
        }}
      >
        <input
          type="file"
          ref={inputRef}
          accept={accept}
          disabled={disabled || uploadStatus === "uploading"}
          onChange={handleChange}
          style={{ display: "none" }}
        />

        {(file || uploadStatus === "success") && (
          <IconButton
            size="small"
            onClick={handleRemove}
            sx={{
              position: "absolute",
              top: -8,
              right: -8,
              bgcolor: "#ef4444",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              width: 28,
              height: 28,
              zIndex: 3,
              "&:hover": {
                bgcolor: "#dc2626",
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 16, color: "white" }} />
          </IconButton>
        )}

        {uploadStatus === "success" ? (
          <CheckCircleIcon sx={{ fontSize: 56, color: "#24ad51ff" }} />
        ) : uploadStatus === "error" ? (
          <ErrorIcon sx={{ fontSize: 56, color: theme.palette.error.main }} />
        ) : (
          <BadgeIcon
            sx={{
              fontSize: 40,
              color:
                uploadStatus === "uploading"
                  ? theme.palette.primary.main
                  : file
                  ? "#24ad51ff"
                  : theme.palette.primary.main,
            }}
          />
        )}

        <Typography
          sx={{
            fontSize: "10px",
            fontWeight: "bold",
            color:
              uploadStatus === "uploading"
                ? theme.palette.primary.main
                : uploadStatus === "success"
                ? "#24ad51ff"
                : uploadStatus === "error"
                ? theme.palette.error.main
                : file
                ? "#24ad51ff"
                : theme.palette.primary.main,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {uploadStatus === "uploading"
            ? "Uploading..."
            : uploadStatus === "success"
            ? "Uploaded"
            : uploadStatus === "error"
            ? "Failed"
            : file
            ? "Uploaded"
            : label}
        </Typography>
      </Box>

      {uploadStatus === "success" && file && (
        <Typography
          variant="caption"
          sx={{
            fontSize: "11px",
            color: "#24ad51ff",
            maxWidth: "90px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          {file.name}
        </Typography>
      )}
    </Box>
  );
};

export default UploadID;
