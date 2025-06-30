// Overview tab content with charts and quick stats
import BarChart from "../BarChart";
import QuickStats from "./QuickStats";
import RecentTasks from "./RecentTasks";
import type { Todo } from "../../types";

interface OverviewTabProps {
  activeTodos: Todo[];
  completedTodos: Todo[];
  ownedTeamsCount: number;
  memberTeamsCount: number;
  priorityStats: {
    high: number;
    medium: number;
    low: number;
  };
  onViewTodo: (todo: Todo) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  activeTodos,
  completedTodos,
  ownedTeamsCount,
  memberTeamsCount,
  priorityStats,
  onViewTodo,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Priority Chart */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Tasks by Priority</h2>
          <div className="h-64 flex justify-center items-center">
            <BarChart
              high={priorityStats.high}
              medium={priorityStats.medium}
              low={priorityStats.low}
            />
          </div>
        </div>
      </div>

      {/* Quick Stats and Recent Tasks */}
      <div className="space-y-4">
        <QuickStats
          activeTodosCount={activeTodos.length}
          completedTodosCount={completedTodos.length}
          ownedTeamsCount={ownedTeamsCount}
          memberTeamsCount={memberTeamsCount}
          priorityStats={priorityStats}
        />

        <RecentTasks activeTodos={activeTodos} onViewTodo={onViewTodo} />
      </div>
    </div>
  );
};

export default OverviewTab;
