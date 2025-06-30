// Archive page header with statistics
interface ArchiveHeaderProps {
  archivedTodos: Array<{ status: string }>;
}

const ArchiveHeader: React.FC<ArchiveHeaderProps> = ({ archivedTodos }) => {
  const completedCount = archivedTodos.filter(
    (t) => t.status === "Completed"
  ).length;
  const cancelledCount = archivedTodos.filter(
    (t) => t.status === "Cancelled"
  ).length;

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">Task Archive</h1>
        <p className="text-gray-600 mt-1">
          View and manage your completed and cancelled tasks
        </p>
      </div>
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Archived Tasks</div>
          <div className="stat-value text-2xl">{archivedTodos.length}</div>
          <div className="stat-desc">
            {completedCount} completed, {cancelledCount} cancelled
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchiveHeader;
