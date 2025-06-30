// Archive page for viewing completed and cancelled tasks
// Provides a comprehensive view of archived todos with restore functionality

import React, { useState } from "react";
import { ProtectedRoute } from "../components";
import { ArchiveHeader, ArchiveActions } from "../components/archive";
import TodoModal from "../components/modals/TodoModal";
import { useTodos } from "../hooks/useTodos";
import type { Todo, UpdateTodoRequest, CreateTodoRequest } from "../types";

const Archive: React.FC = () => {
  const { todos, loading, error, updateTodo, deleteTodo } = useTodos();

  // Modal state
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter for archived (completed and cancelled) todos
  const archivedTodos = todos.filter(
    (todo) => todo.status === "Completed" || todo.status === "Cancelled"
  );

  const handleViewTodo = (todo: Todo) => {
    setSelectedTodo(todo);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setSelectedTodo(todo);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDeleteTodo = async (todoId: string, hardDelete = false) => {
    try {
      await deleteTodo(todoId, hardDelete);
    } catch (error) {
      console.error("Error deleting todo:", error);
      alert("Failed to delete task. Please try again.");
    }
  };

  const handleRestoreTodo = async (todoId: string) => {
    if (window.confirm("Restore this task to active status?")) {
      try {
        await updateTodo({
          id: todoId,
          status: "Active",
        });
      } catch (error) {
        console.error("Error restoring todo:", error);
        alert("Failed to restore task. Please try again.");
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTodo(null);
  };

  const handleSaveTodo = async (
    todoData: UpdateTodoRequest | CreateTodoRequest
  ) => {
    try {
      if (modalMode === "edit" && selectedTodo) {
        await updateTodo({
          ...todoData,
          id: selectedTodo.id,
        });
      }
    } catch (error) {
      console.error("Error saving todo:", error);
      alert("Failed to save task. Please try again.");
    }
  };

  const handleBulkDelete = async (todos: Todo[]) => {
    try {
      await Promise.all(todos.map((task) => handleDeleteTodo(task.id, true)));
    } catch (error) {
      console.error("Error bulk deleting todos:", error);
      alert("Failed to delete some tasks. Please try again.");
    }
  };

  if (error) {
    return (
      <div className="mx-[10%] mt-8">
        <ProtectedRoute>
          <div className="alert alert-error">
            <span>Error loading archived tasks: {error}</span>
          </div>
        </ProtectedRoute>
      </div>
    );
  }

  return (
    <div className="mx-[10%] mt-4">
      <ProtectedRoute>
        <div className="space-y-6">
          {/* Header */}
          <ArchiveHeader archivedTodos={archivedTodos} />

          {/* Archive Actions */}
          <ArchiveActions
            archivedTodos={archivedTodos}
            onBulkDelete={handleBulkDelete}
          />

          {/* Archive List with Custom Actions */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body p-4">
              <h2 className="card-title text-lg mb-4">Archived Tasks</h2>

              <CustomArchivedTodoList
                todos={archivedTodos}
                onView={handleViewTodo}
                onEdit={handleEditTodo}
                onDelete={handleDeleteTodo}
                onRestore={handleRestoreTodo}
                loading={loading}
              />
            </div>
          </div>
        </div>

        {/* Todo Modal */}
        <TodoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          todo={selectedTodo || undefined}
          mode={modalMode}
          onSave={handleSaveTodo}
          onDelete={handleDeleteTodo}
          loading={loading}
        />
      </ProtectedRoute>
    </div>
  );
};

// Custom component for archived todos with restore functionality
interface CustomArchivedTodoListProps {
  todos: Todo[];
  onView: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todoId: string, hardDelete?: boolean) => void;
  onRestore: (todoId: string) => void;
  loading?: boolean;
}

const CustomArchivedTodoList: React.FC<CustomArchivedTodoListProps> = ({
  todos,
  onView,
  onEdit,
  onDelete,
  onRestore,
  loading = false,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("dueDate");

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

  // Filter todos
  const filteredTodos = todos.filter((todo) => {
    if (filterStatus !== "all" && todo.status !== filterStatus) return false;
    return true;
  });

  // Sort todos
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    switch (sortBy) {
      case "dueDate":
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(); // Most recent first
      case "title":
        return a.title.localeCompare(b.title);
      case "status":
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-base-200 rounded-lg">
        <div className="flex-1 min-w-48">
          <label className="label label-text">Filter by Status:</label>
          <select
            className="select select-bordered select-sm w-full"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Archived</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex-1 min-w-48">
          <label className="label label-text">Sort by:</label>
          <select
            className="select select-bordered select-sm w-full"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}>
            <option value="dueDate">Date (Newest First)</option>
            <option value="title">Title</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        {sortedTodos.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <p className="text-lg">No archived tasks found</p>
            <p className="text-sm">
              {filterStatus !== "all"
                ? `No ${filterStatus.toLowerCase()} tasks in your archive`
                : "Your completed and cancelled tasks will appear here"}
            </p>
          </div>
        ) : (
          sortedTodos.map((todo) => (
            <div
              key={todo.id}
              className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="card-title text-lg opacity-75">
                        {todo.title}
                      </h3>
                      <div
                        className={`badge ${getPriorityColor(todo.priority)}`}>
                        {getPriorityLabel(todo.priority)}
                      </div>
                      <div
                        className={`badge ${
                          todo.status === "Completed"
                            ? "badge-success"
                            : "badge-error"
                        }`}>
                        {todo.status}
                      </div>
                    </div>

                    {todo.description && (
                      <p className="text-gray-600 mb-2 opacity-75">
                        {todo.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>
                        Due: {new Date(todo.dueDate).toLocaleDateString()}
                      </span>
                      {todo.assignee && (
                        <span>
                          Assigned to: {todo.assignee.firstName}{" "}
                          {todo.assignee.lastName}
                        </span>
                      )}
                      {todo.team && <span>Team: {todo.team.name}</span>}
                      <span>
                        Created by: {todo.creator?.firstName || "Unknown"}{" "}
                        {todo.creator?.lastName || ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onView(todo)}
                      className="btn btn-ghost btn-sm"
                      title="View Details">
                      👁️
                    </button>

                    <button
                      onClick={() => onRestore(todo.id)}
                      className="btn btn-success btn-sm"
                      title="Restore to Active">
                      ↩️
                    </button>

                    <div className="dropdown dropdown-end">
                      <button
                        tabIndex={0}
                        className="btn btn-ghost btn-sm"
                        title="More Actions">
                        ⋮
                      </button>
                      <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10">
                        <li>
                          <button
                            onClick={() => onEdit(todo)}
                            className="text-primary">
                            Edit Task
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => onDelete(todo.id, true)}
                            className="text-error">
                            Delete Permanently
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Archive;
