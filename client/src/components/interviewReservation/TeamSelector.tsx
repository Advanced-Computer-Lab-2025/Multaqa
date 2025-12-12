import React from "react";
import { UsherTeam } from "./types";

interface TeamSelectorProps {
  teams: UsherTeam[];
  selectedTeamId: string;
  onChange: (teamId: string) => void;
}

const TeamSelector: React.FC<TeamSelectorProps> = ({
  teams,
  selectedTeamId,
  onChange,
}) => {
  return (
    <div className="mb-8">
      <label className="text-gray-700 font-semibold block mb-2">
        Select Your Team
      </label>

      <select
        value={selectedTeamId}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-lg p-3 w-full"
      >
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.team}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TeamSelector;
