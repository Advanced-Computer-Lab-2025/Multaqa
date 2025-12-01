import React from "react";
import { IconButton, Stack, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Trash2 , Ban, Archive} from "lucide-react";

interface EditDeleteIconsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onRestrict?: () => void;
  onArchive?: () => void;
  archived?:boolean;
  color?: string; // optional custom color (default gray)
  event:string;
  renderEdit?:boolean;
}

const EditDeleteIcons: React.FC<EditDeleteIconsProps> = ({
  onEdit,
  onDelete,
  onRestrict,
  onArchive,
  archived,
  color = "#6b7280",
  renderEdit=true,
  event
}) => {
  const editText = event?`Edit ${event}`:"Edit";
  const deleteText = event?`Delete ${event}`:"Delete";
  const restrictText = event?`Restrict ${event}`:"Restrict";
  const archiveText = event?`Archive ${event}`:"Archive";
  return (
    <Stack direction="row" spacing={1}>
      {/* Safe/Moderate Actions First */}
      {renderEdit &&
      <Tooltip title={editText}>
        <IconButton
          size="medium"
          onClick={onEdit}
          sx={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              "&:hover": {
                backgroundColor: `${color}15`,
                borderColor: color,
                color: color,
              },
            }}
        >
          <EditIcon fontSize="small"/>
        </IconButton>
      </Tooltip>
      }
      {!archived && (
        <Tooltip title={archiveText}>
          <IconButton
            size="medium"
            onClick={onArchive}
            sx={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "#ff980015",
                  borderColor: "warning.main",
                  color: "warning.main",
                },
              }}
          >
            <Archive size={18} />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title={restrictText}>
        <IconButton
          size="medium"
          onClick={onRestrict}
          sx={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "rgba(255, 0, 0, 0.1)",
                borderColor: "error.main",
                color: "error.main",
              },
            }}
        >
          <Ban size={18} />
        </IconButton>
      </Tooltip>
      
      {/* Dangerous Action Last - Separated */}
      <Tooltip title={deleteText}>
        <IconButton
          size="medium"
          onClick={onDelete}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            ml: 0.5, // Extra spacing to separate dangerous action
            "&:hover": {
              backgroundColor: "rgba(255, 0, 0, 0.1)",
              borderColor: "error.main",
              color: "error.main",
            },
          }}
        >
          <Trash2 size={18} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default EditDeleteIcons;
