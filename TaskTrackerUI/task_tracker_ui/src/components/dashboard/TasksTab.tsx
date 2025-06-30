// Tasks tab content with task list and actions
import TodoList from "../TodoList";
import type { Todo } from "../../types";

interface TasksTabProps {
  activeTodos: Todo[];
  onCreateTodo: () => void;
  onViewTodo: (todo: Todo) => void;
  onEditTodo: (todo: Todo) => void;
  onDeleteTodo: (todoId: string, hardDelete?: boolean) => void;
  onArchiveTodo: (todoId: string) => void;
  loading: boolean;
}

const TasksTab: React.FC<TasksTabProps> = ({
  activeTodos,
  onCreateTodo,
  onViewTodo,
  onEditTodo,
  onDeleteTodo,
  onArchiveTodo,
  loading,
}) => {
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title">My Tasks</h2>
          <button
            onClick={onCreateTodo}
            className="btn btn-primary btn-sm"
            disabled={loading}>
            + Add Task
          </button>
        </div>
        <TodoList
          todos={activeTodos}
          onView={onViewTodo}
          onEdit={onEditTodo}
          onDelete={onDeleteTodo}
          onArchive={onArchiveTodo}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default TasksTab;
