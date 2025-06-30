// Archive actions component with bulk operations
import type { Todo } from "../../types";

interface ArchiveActionsProps {
  archivedTodos: Todo[];
  onBulkDelete: (todos: Todo[]) => void;
}

const ArchiveActions: React.FC<ArchiveActionsProps> = ({
  archivedTodos,
  onBulkDelete,
}) => {
  const handleCleanupCancelled = () => {
    const cancelledTasks = archivedTodos.filter(
      (t) => t.status === "Cancelled"
    );
    if (cancelledTasks.length === 0) {
      alert("No cancelled tasks to clean up");
      return;
    }
    if (
      window.confirm(
        `Permanently delete ${cancelledTasks.length} cancelled tasks? This cannot be undone.`
      )
    ) {
      onBulkDelete(cancelledTasks);
    }
  };

  return (
    <div className="card bg-base-100 shadow-sm border">
      <div className="card-body p-4">
        <h2 className="card-title text-lg mb-3">Archive Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => window.location.reload()}>
            🔄 Refresh Archive
          </button>
          <div
            className="tooltip"
            data-tip="Permanently delete all cancelled tasks">
            <button
              className="btn btn-error btn-outline btn-sm"
              onClick={handleCleanupCancelled}>
              🗑️ Clean Up Cancelled
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchiveActions;
