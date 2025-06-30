// Quick stats card component showing task and team statistics
interface QuickStatsProps {
  activeTodosCount: number;
  completedTodosCount: number;
  ownedTeamsCount: number;
  memberTeamsCount: number;
  priorityStats: {
    high: number;
    medium: number;
    low: number;
  };
}

const QuickStats: React.FC<QuickStatsProps> = ({
  activeTodosCount,
  completedTodosCount,
  ownedTeamsCount,
  memberTeamsCount,
  priorityStats,
}) => {
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">Quick Stats</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Active Tasks:</span>
            <span className="font-semibold">{activeTodosCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Completed Tasks:</span>
            <span className="font-semibold text-success">
              {completedTodosCount}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Teams Owned:</span>
            <span className="font-semibold">{ownedTeamsCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Teams Member:</span>
            <span className="font-semibold">{memberTeamsCount}</span>
          </div>
          <div className="divider"></div>
          <div className="flex justify-between">
            <span>High Priority:</span>
            <span className="font-semibold text-error">
              {priorityStats.high}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Medium Priority:</span>
            <span className="font-semibold text-warning">
              {priorityStats.medium}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Low Priority:</span>
            <span className="font-semibold text-success">
              {priorityStats.low}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
