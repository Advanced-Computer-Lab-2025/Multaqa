import React from "react";
import { IconButton, Stack, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Trash2 } from "lucide-react";

interface EditDeleteIconsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  color?: string; // optional custom color (default gray)
}

const EditDeleteIcons: React.FC<EditDeleteIconsProps> = ({
  onEdit,
  onDelete,
  color = "#6b7280",
}) => {
  return (
    <Stack direction="row" spacing={1}>
      <Tooltip title="Edit">
        <IconButton
          onClick={onEdit}
          sx={{
            color,
            "&:hover": { color: "primary.main" },
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete">
      <IconButton
              size="medium"
              onClick={onDelete}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                "&:hover": {
                  backgroundColor: "rgba(255, 0, 0, 0.1)",
                  color: "error.main",
                },
              }}
            >
              <Trash2 size={16} />
            </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default EditDeleteIcons;
