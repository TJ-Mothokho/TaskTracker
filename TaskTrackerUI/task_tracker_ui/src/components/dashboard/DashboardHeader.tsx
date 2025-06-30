// Dashboard header component with welcome message and quick actions
import { Link } from "react-router-dom";
import type { User } from "../../types";

interface DashboardHeaderProps {
  currentUser: User;
  onCreateTodo: () => void;
  onCreateTeam: () => void;
  todosLoading: boolean;
  teamsLoading: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentUser,
  onCreateTodo,
  onCreateTeam,
  todosLoading,
  teamsLoading,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {currentUser.firstName}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your tasks and teams
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <button
          onClick={onCreateTodo}
          className="btn btn-primary"
          disabled={todosLoading}>
          + New Task
        </button>
        <button
          onClick={onCreateTeam}
          className="btn btn-secondary"
          disabled={teamsLoading}>
          + New Team
        </button>
        <Link to="/archive" className="btn btn-outline">
          📁 Archive
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;
