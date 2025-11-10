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
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files ? Array.from(e.target.files) : [];
    setFiles(fileList);
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
                fontSize: "10px",
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
        sx={{ opacity: disabled ? 0.6 : 1 }}
      >
        <div className="container">
          {renderVariant()}
          <div className="custom-file-upload">
            <input
              type="file"
              ref={inputRef}
              accept={accept}
              disabled={disabled}
              onChange={handleChange}
              style={{ display: "none" }}
            />
            {label}
          </div>
        </div>
      </StyledWrapper>

      {/* Preview section */}
      {files.length > 0 && (
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
                      sx={{
                        fontSize: { xs: "0.8rem", sm: "0.9rem" },
                        wordBreak: "break-all",
                      }}
                    >
                      {file.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color={theme.palette.primary.main}
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
                  <CloseIcon
                    fontSize="small"
                    sx={{ color: theme.palette.error.main }}
                  />
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
