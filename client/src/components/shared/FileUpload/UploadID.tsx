"use client";
import React, { useRef, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BadgeIcon from "@mui/icons-material/Badge";
import theme from "@/themes/lightTheme";

interface UploadIDProps {
  label?: string;
  accept?: string;
  disabled?: boolean;
  onFileSelected?: (file: File | null) => void;
}

const UploadID: React.FC<UploadIDProps> = ({
  label = "ID",
  accept = "image/*,.pdf",
  disabled = false,
  onFileSelected,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
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
          width: "100px",
          height: "100px",
          borderRadius: "30px",
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
          border: file ? "2px solid transparent" : "2px solid transparent",
          boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
          "&:hover": {
            transform: disabled ? "none" : "scale(1.05)",
            border: file
              ? "2px solid #24ad51ff"
              : `2px dashed ${theme.palette.primary.main}`,
          },
        }}
      >
        <input
          type="file"
          ref={inputRef}
          accept={accept}
          disabled={disabled}
          onChange={handleChange}
          style={{ display: "none" }}
        />

        {file && (
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
              "&:hover": {
                bgcolor: "#dc2626",
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 16, color: "white" }} />
          </IconButton>
        )}

        <BadgeIcon
          sx={{
            fontSize: 56,
            color: file ? "#24ad51ff" : theme.palette.primary.main,
          }}
        />

        <Typography
          sx={{
            fontSize: "11px",
            fontWeight: "bold",
            color: file ? "#24ad51ff" : theme.palette.primary.main,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {file ? "Uploaded" : label}
        </Typography>
      </Box>

      {file && (
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
