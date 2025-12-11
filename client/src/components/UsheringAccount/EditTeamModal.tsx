import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import CustomModalLayout from '../shared/modals/CustomModalLayout';
import { Team } from './TeamsDescription';
import CustomTextField from '../shared/input-fields/CustomTextField';
import CustomButton from '../shared/Buttons/CustomButton';

interface EditTeamModalProps {
  open: boolean;
  onClose: () => void;
  team: Team | null;
  onSave: (updatedTeam: Team) => void;
}

const EditTeamModal: React.FC<EditTeamModalProps> = ({ open, onClose, team, onSave }) => {
  const [editedTeam, setEditedTeam] = useState<Team | null>(null);

  useEffect(() => {
    if (team) {
      setEditedTeam({ ...team });
    }
  }, [team]);

  const handleChange = (field: keyof Team, value: string) => {
    if (editedTeam) {
      setEditedTeam({ ...editedTeam, [field]: value });
    }
  };

  const handleSubmit = () => {
    if (editedTeam) {
      onSave(editedTeam);
      onClose();
    }
  };

  if (!editedTeam) return null;

  return (
    <CustomModalLayout
      open={open}
      onClose={onClose}
      title={`Edit ${team?.name}'s Team Information`}
      width="md:w-[500px]"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              name="edit-team-name"
              label="Team Name"
              fieldType="text"
              value={editedTeam.name}
              onChange={(e) => handleChange('name', e.target.value)}
              neumorphicBox
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              name="edit-team-color"
              label="Color (Hex or Name)"
              fieldType="text"
              value={editedTeam.color}
              onChange={(e) => handleChange('color', e.target.value)}
              neumorphicBox
              placeholder="#000000"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              name="edit-team-desc"
              label="Description"
              fieldType="text"
              value={editedTeam.description}
              onChange={(e) => handleChange('description', e.target.value)}
              multiline
              rows={4}
              autoCapitalizeName={false}
              neumorphicBox
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <CustomButton
            variant="contained"
            onClick={handleSubmit}
            disabled={!editedTeam.name || !editedTeam.description}
          >
            Save
          </CustomButton>
        </Box>
      </Box>
    </CustomModalLayout>
  );
};

export default EditTeamModal;
