import React, { useState } from 'react';
import { Box, IconButton, Typography, Grid } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import CustomModalLayout from '../shared/modals/CustomModalLayout';
import { Team } from './TeamsDescription';
import { Users } from 'lucide-react'; // Default icon
import CustomTextField from '../shared/input-fields/CustomTextField';
import CustomButton from '../shared/Buttons/CustomButton';

interface AddTeamsModalProps {
  open: boolean;
  onClose: () => void;
  onAddTeams: (teams: Team[]) => void;
}

const AddTeamsModal: React.FC<AddTeamsModalProps> = ({ open, onClose, onAddTeams }) => {
  const [newTeams, setNewTeams] = useState<Partial<Team>[]>([{ name: '', description: '', color: '' }]);

  const handleChange = (index: number, field: keyof Team, value: string) => {
    const updatedTeams = [...newTeams];
    updatedTeams[index] = { ...updatedTeams[index], [field]: value };
    setNewTeams(updatedTeams);
  };

  const handleAddTeamField = () => {
    setNewTeams([...newTeams, { name: '', description: '', color: '' }]);
  };

  const handleRemoveTeamField = (index: number) => {
    const updatedTeams = newTeams.filter((_, i) => i !== index);
    setNewTeams(updatedTeams);
  };

  const handleSubmit = () => {
    // Validate and format teams
    const teamsToAdd: Team[] = newTeams
      .filter(t => t.name && t.description) // Basic validation
      .map(t => ({
        name: t.name!,
        description: t.description!,
        color: t.color || '#E0E0E0', // Default color if not provided
        logo: <Users size={40} />, // Default logo for now as we don't have an icon picker yet
      }));

    if (teamsToAdd.length > 0) {
      onAddTeams(teamsToAdd);
      setNewTeams([{ name: '', description: '', color: '' }]); // Reset form
      onClose();
    }
  };

  return (
    <CustomModalLayout
      open={open}
      onClose={onClose}
      title="Add Graduation Teams"
      width="md:w-[600px]"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
        {newTeams.map((team, index) => (
          <Box key={index} sx={{ p: 3, border: '1px solid #eee', borderRadius: 4, position: 'relative', backgroundColor: '#fafafa' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Team {index + 1}</Typography>
              {newTeams.length > 1 && (
                <IconButton size="small" onClick={() => handleRemoveTeamField(index)} color="error">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  name={`team-name-${index}`}
                  label="Team Name"
                  fieldType="text"
                  value={team.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  neumorphicBox
                  placeholder="e.g. Graduates"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  name={`team-color-${index}`}
                  label="Color"
                  fieldType="text"
                  value={team.color}
                  onChange={(e) => handleChange(index, 'color', e.target.value)}
                  neumorphicBox
                  placeholder="#000000"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <CustomTextField
                  name={`team-desc-${index}`}
                  label="Description"
                  fieldType="text"
                  value={team.description}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                  multiline
                  rows={3}
                  neumorphicBox
                  placeholder="Enter team description..."
                />
              </Grid>
            </Grid>
          </Box>
        ))}

        <CustomButton
          variant="text"
          onClick={handleAddTeamField}
          sx={{ alignSelf: 'flex-start' }}
        >
          + Add Team
        </CustomButton>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <CustomButton
            variant="contained"
            onClick={handleSubmit}
            disabled={!newTeams.some(t => t.name && t.description)}
          >
            Save Teams
          </CustomButton>
        </Box>
      </Box>
    </CustomModalLayout>
  );
};

export default AddTeamsModal;
