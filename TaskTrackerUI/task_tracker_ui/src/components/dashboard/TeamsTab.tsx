// Teams tab content with team list and actions
import TeamList from "../TeamList";
import type { Team } from "../../types";

interface TeamsTabProps {
  teams: Team[];
  onCreateTeam: () => void;
  onViewTeam: (team: Team) => void;
  onEditTeam: (team: Team) => void;
  onDeleteTeam: (teamId: string) => void;
  loading: boolean;
}

const TeamsTab: React.FC<TeamsTabProps> = ({
  teams,
  onCreateTeam,
  onViewTeam,
  onEditTeam,
  onDeleteTeam,
  loading,
}) => {
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title">My Teams</h2>
          <button
            onClick={onCreateTeam}
            className="btn btn-secondary btn-sm"
            disabled={loading}>
            + Add Team
          </button>
        </div>
        <TeamList
          teams={teams}
          onView={onViewTeam}
          onEdit={onEditTeam}
          onDelete={onDeleteTeam}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default TeamsTab;
