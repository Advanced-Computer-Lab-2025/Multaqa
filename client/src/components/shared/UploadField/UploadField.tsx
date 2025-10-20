"use client";
import React, { useRef, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import {
  Typography,
  Box,
  IconButton,
  useTheme,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { UploadFieldProps } from "./types";
import { formatFileSize } from "./utils";

const UploadField: React.FC<UploadFieldProps> = ({
  label,
  accept,
  className = "",
  disabled = false,
  icon,
  showPreviewAs = "file",
}) => {
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const handleClick = () => {
    if (files.length !== 0) disabled = true;
    if (!disabled) inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files ? Array.from(e.target.files) : [];
    setFiles(fileList);
  };

  return (
    <Box
      className={className}
      sx={{
        border: `2px dashed ${
          disabled ? theme.palette.text.disabled : theme.palette.primary.main
        }`,
        "&:hover": {
          borderColor: disabled
            ? theme.palette.text.disabled
            : theme.palette.primary.dark,
          backgroundColor: disabled
            ? theme.palette.action.disabledBackground
            : "#ffffff",
        },
        backgroundColor: disabled
          ? theme.palette.action.disabledBackground
          : "transparent",
        color: theme.palette.text.primary,
        borderRadius: "12px",
        maxWidth: "100%",
        width: "100%",
        padding: 3,
        transition: "0.3s ease all",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onClick={handleClick}
    >
      <input
        type="file"
        ref={inputRef}
        accept={accept}
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
      />

      {icon ? (
        <Box sx={{ mb: 1 }}>{icon}</Box>
      ) : (
        <CloudUploadIcon
          sx={{
            fontSize: { xs: 30, sm: 40 },
            color: theme.palette.primary.main,
            mb: 1,
          }}
        />
      )}

      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          color: theme.palette.text.primary,
          fontSize: { xs: "0.9rem", sm: "1rem" },
        }}
      >
        {label}
      </Typography>

      {files.length > 0 && (
        <Box mt={2} width="100%" display="flex" flexDirection="column" gap={1}>
          {files.map((file, index) => {
            const isImage = file.type.startsWith("image/");
            const fileURL = URL.createObjectURL(file);

            return (
              <Card
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1,
                  borderRadius: "10px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Box display="flex" alignItems="center" gap={2} width="100%">
                  {showPreviewAs === "image" && isImage ? (
                    <CardMedia
                      component="img"
                      src={fileURL}
                      alt={file.name}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <InsertDriveFileIcon
                      sx={{ color: theme.palette.primary.main }}
                    />
                  )}
                  <CardContent sx={{ p: "0 !important" }}>
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                    >
                      {file.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" } }}
                    >
                      {formatFileSize(file.size)}
                    </Typography>
                  </CardContent>
                </Box>

                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFiles(files.filter((_, i) => i !== index));
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
};
export default UploadField;