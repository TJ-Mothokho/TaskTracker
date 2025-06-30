// Recent tasks component showing the latest active tasks
import type { Todo } from "../../types";

interface RecentTasksProps {
  activeTodos: Todo[];
  onViewTodo: (todo: Todo) => void;
}

const RecentTasks: React.FC<RecentTasksProps> = ({
  activeTodos,
  onViewTodo,
}) => {
  const getPriorityColor = (priority: number): string => {
    switch (priority) {
      case 0:
        return "badge-error";
      case 1:
        return "badge-warning";
      case 2:
        return "badge-success";
      default:
        return "badge-warning";
    }
  };

  const getPriorityLabel = (priority: number): string => {
    switch (priority) {
      case 0:
        return "High";
      case 1:
        return "Medium";
      case 2:
        return "Low";
      default:
        return "Medium";
    }
  };

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">Recent Tasks</h2>
        <div className="space-y-2">
          {activeTodos.slice(0, 5).map((todo) => (
            <div
              key={todo.id}
              className="flex justify-between items-center p-2 hover:bg-base-200 rounded cursor-pointer"
              onClick={() => onViewTodo(todo)}>
              <span className="truncate">{todo.title}</span>
              <span
                className={`badge badge-sm ${getPriorityColor(todo.priority)}`}>
                {getPriorityLabel(todo.priority)}
              </span>
            </div>
          ))}
          {activeTodos.length === 0 && (
            <p className="text-gray-500 text-center py-4">No active tasks</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentTasks;
