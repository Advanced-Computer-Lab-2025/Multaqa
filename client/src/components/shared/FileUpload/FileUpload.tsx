"use client";
import React, { useRef, useState } from "react";
import {
  Typography,
  Box,
  IconButton,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { UploadFieldProps } from "./types";
import { formatFileSize } from "./utils";
import { StyledWrapper } from "./style";
import theme from "@/themes/lightTheme";

const FileUpload: React.FC<UploadFieldProps> = ({
  label,
  accept,
  className = "",
  disabled = false,
  width = 300,
  showPreviewAs = "file",
  variant = "folder",
  uploadStatus = "idle",
  onFileSelected,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const handleClick = () => {
    if (!disabled && uploadStatus !== "uploading") inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files ? Array.from(e.target.files) : [];
    setFiles(fileList);
    if (onFileSelected && fileList.length > 0) {
      onFileSelected(fileList[0]);
    }
  };

  const handlePreviewRemove = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);

    // If no files left, notify parent to reset status to 'idle'
    if (newFiles.length === 0) {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      // Notify parent that all files were deleted
      onFileSelected?.(null);
    }
  };
  const renderVariant = () => {
    switch (variant) {
      case "folder":
        return (
          <div className="folder">
            <div className="front-side">
              <div className="tip" />
              <div className="cover" />
            </div>
            <div className="back-side cover" />
          </div>
        );
      case "tax-card":
        return (
          <div className="tax-card">
            <Typography
              sx={{
                position: "absolute",
                top: "50px",
                left: "12px",
                fontSize: "clamp(8px, 1.5vw, 10px)",
                fontWeight: "bold",
                color: "rgba(255, 255, 255, 0.9)",
                letterSpacing: "0.5px",
              }}
            >
              TAX ID
            </Typography>
          </div>
        );
      case "logo":
        return (
          <div className="logo">
            <div className="logo-icon">L</div>
            <div className="logo-text">LOGO</div>
          </div>
        );
      default:
        return (
          <div className="folder">
            <div className="front-side">
              <div className="tip" />
              <div className="cover" />
            </div>
            <div className="back-side cover" />
          </div>
        );
    }
  };

  return (
    <Box
      className={className}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        width: "100%",
      }}
    >
      {/* Upload UI with variants */}
      <StyledWrapper
        onClick={handleClick}
        containerWidth={width}
        uploadStatus={uploadStatus}
        sx={{ opacity: disabled ? 0.6 : 1 }}
      >
        <div
          className={`container ${
            uploadStatus === "uploading"
              ? "uploading"
              : uploadStatus === "success"
              ? "success"
              : uploadStatus === "error"
              ? "error"
              : ""
          }`}
        >
          {renderVariant()}

          <div className="custom-file-upload">
            <input
              type="file"
              ref={inputRef}
              accept={accept}
              disabled={disabled || uploadStatus === "uploading"}
              onChange={handleChange}
              style={{ display: "none" }}
            />
            <Box display="flex" alignItems="center" gap={1}>
              {uploadStatus === "uploading" && "Uploading..."}
              {uploadStatus === "success" && (
                <>
                  <CheckCircleIcon
                    sx={{
                      fontSize: "clamp(14px, 2vw, 18px)",
                      color: "#24ad51ff",
                    }}
                  />
                  Uploaded
                </>
              )}
              {uploadStatus === "error" && (
                <>
                  <ErrorIcon
                    sx={{
                      fontSize: "clamp(14px, 2vw, 18px)",
                      color: theme.palette.error.main,
                    }}
                  />
                  Failed
                </>
              )}
              {uploadStatus === "idle" && label}
            </Box>
          </div>
        </div>
      </StyledWrapper>

      {/* Preview section - only show when upload is successful */}
      {files.length > 0 && uploadStatus === "success" && (
        <Box
          mt={1}
          width={typeof width === "number" ? `${width}px` : width}
          maxWidth="100%"
          display="flex"
          flexDirection="column"
          gap={1}
        >
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
                  border: "2px solid #24ad51ff",
                  bgcolor: "rgba(36, 173, 81, 0.05)",
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
                      sx={{
                        fontSize: "clamp(24px, 3vw, 32px)",
                        color: "#24ad51ff",
                      }}
                    />
                  )}
                  <CardContent sx={{ p: "0 !important", flex: 1 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CheckCircleIcon
                        sx={{
                          fontSize: "clamp(14px, 2vw, 18px)",
                          color: "#24ad51ff",
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: "0.8rem", sm: "0.9rem" },
                          wordBreak: "break-all",
                        }}
                      >
                        {file.name}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      color="#24ad51ff"
                      sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" } }}
                    >
                      {formatFileSize(file.size)} • Uploaded
                    </Typography>
                  </CardContent>
                </Box>

                <IconButton
                  size="small"
                  onClick={(e) => handlePreviewRemove(index, e)}
                  sx={{
                    bgcolor: theme.palette.error.main,
                    "&:hover": {
                      bgcolor: theme.palette.error.dark,
                    },
                  }}
                >
                  <CloseIcon fontSize="small" sx={{ color: "white" }} />
                </IconButton>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
