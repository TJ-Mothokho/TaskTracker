// Modal component for viewing, creating, and editing todos
// Provides a comprehensive interface for todo CRUD operations

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/authSelectors";
import { Priority } from "../../types";
import type {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  Team,
  User,
} from "../../types";

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo?: Todo;
  mode: "create" | "edit" | "view";
  onSave: (data: CreateTodoRequest | UpdateTodoRequest) => Promise<void>;
  onDelete?: (todoId: string, hardDelete?: boolean) => Promise<void>;
  onArchive?: (todoId: string) => Promise<void>;
  teams?: Team[];
  users?: User[];
  loading?: boolean;
}

const TodoModal: React.FC<TodoModalProps> = ({
  isOpen,
  onClose,
  todo,
  mode,
  onSave,
  onDelete,
  onArchive,
  teams = [],
  users = [],
  loading = false,
}) => {
  const currentUser = useSelector(selectCurrentUser);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: Priority.Medium as Priority,
    dueDate: "",
    assigneeId: "",
    teamId: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when todo changes
  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
        description: todo.description || "",
        priority: todo.priority,
        dueDate: todo.dueDate
          ? new Date(todo.dueDate).toISOString().split("T")[0]
          : "",
        assigneeId: todo.assignee?.id || "",
        teamId: todo.team?.id || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: Priority.Medium as Priority,
        dueDate: "",
        assigneeId: "",
        teamId: "",
      });
    }
    setErrors({});
  }, [todo]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else if (new Date(formData.dueDate) < new Date()) {
      newErrors.dueDate = "Due date cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (mode === "create") {
        const createData: CreateTodoRequest = {
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          priority: formData.priority,
          dueDate: formData.dueDate,
          createdBy: currentUser.id,
          assignTo: formData.assigneeId || undefined,
          teamId: formData.teamId || undefined,
        };
        await onSave(createData);
      } else if (mode === "edit" && todo) {
        const updateData: UpdateTodoRequest = {
          id: todo.id,
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          priority: formData.priority,
          dueDate: formData.dueDate,
          assignTo: formData.assigneeId || undefined,
          teamId: formData.teamId || undefined,
        };
        await onSave(updateData);
      }

      onClose();
    } catch (error) {
      console.error("Error saving todo:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (hardDelete = false) => {
    if (!todo || !onDelete) return;

    const confirmMessage = hardDelete
      ? "Are you sure you want to permanently delete this task? This action cannot be undone."
      : "Are you sure you want to cancel this task?";

    if (window.confirm(confirmMessage)) {
      try {
        await onDelete(todo.id, hardDelete);
        onClose();
      } catch (error) {
        console.error("Error deleting todo:", error);
      }
    }
  };

  const handleArchive = async () => {
    if (!todo || !onArchive) return;

    if (window.confirm("Mark this task as completed?")) {
      try {
        await onArchive(todo.id);
        onClose();
      } catch (error) {
        console.error("Error archiving todo:", error);
      }
    }
  };

  const getPriorityLabel = (priority: Priority): string => {
    switch (priority) {
      case Priority.High:
        return "High";
      case Priority.Medium:
        return "Medium";
      case Priority.Low:
        return "Low";
      default:
        return "Medium";
    }
  };

  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case Priority.High:
        return "text-red-600";
      case Priority.Medium:
        return "text-yellow-600";
      case Priority.Low:
        return "text-green-600";
      default:
        return "text-yellow-600";
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Completed":
        return "text-green-600";
      case "Cancelled":
        return "text-red-600";
      case "On Hold":
        return "text-yellow-600";
      default:
        return "text-blue-600";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">
            {mode === "create" && "Create New Task"}
            {mode === "edit" && "Edit Task"}
            {mode === "view" && "Task Details"}
          </h3>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
            disabled={isSubmitting}>
            ✕
          </button>
        </div>

        {mode === "view" && todo ? (
          // View mode
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-xl">{todo.title}</h4>
              {todo.description && (
                <p className="text-gray-600 mt-2">{todo.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Priority:</span>
                <span
                  className={`ml-2 font-semibold ${getPriorityColor(
                    todo.priority
                  )}`}>
                  {getPriorityLabel(todo.priority)}
                </span>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <span
                  className={`ml-2 font-semibold ${getStatusColor(
                    todo.status
                  )}`}>
                  {todo.status}
                </span>
              </div>
              <div>
                <span className="font-medium">Due Date:</span>
                <span className="ml-2">
                  {new Date(todo.dueDate).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="font-medium">Creator:</span>
                <span className="ml-2">
                  {todo.creator?.firstName || "Unknown"}{" "}
                  {todo.creator?.lastName || ""}
                </span>
              </div>
              {todo.assignee && (
                <div>
                  <span className="font-medium">Assignee:</span>
                  <span className="ml-2">
                    {todo.assignee.firstName} {todo.assignee.lastName}
                  </span>
                </div>
              )}
              {todo.team && (
                <div>
                  <span className="font-medium">Team:</span>
                  <span className="ml-2">{todo.team.name}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              {todo.status !== "Completed" && (
                <>
                  <button
                    onClick={handleArchive}
                    className="btn btn-success btn-sm"
                    disabled={loading}>
                    Mark Complete
                  </button>
                  <button
                    onClick={() => handleDelete(false)}
                    className="btn btn-warning btn-sm"
                    disabled={loading}>
                    Cancel Task
                  </button>
                </>
              )}
              <button
                onClick={() => handleDelete(true)}
                className="btn btn-error btn-sm"
                disabled={loading}>
                Delete Permanently
              </button>
            </div>
          </div>
        ) : (
          // Create/Edit mode
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Title *</span>
              </label>
              <input
                type="text"
                className={`input input-bordered w-full ${
                  errors.title ? "input-error" : ""
                }`}
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter task title"
                disabled={isSubmitting}
              />
              {errors.title && (
                <span className="text-error text-sm">{errors.title}</span>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full h-24"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter task description (optional)"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text">Priority *</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={formData.priority}
                  onChange={(e) =>
                    handleInputChange("priority", parseInt(e.target.value))
                  }
                  disabled={isSubmitting}>
                  <option value={Priority.High}>High</option>
                  <option value={Priority.Medium}>Medium</option>
                  <option value={Priority.Low}>Low</option>
                </select>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Due Date *</span>
                </label>
                <input
                  type="date"
                  className={`input input-bordered w-full ${
                    errors.dueDate ? "input-error" : ""
                  }`}
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.dueDate && (
                  <span className="text-error text-sm">{errors.dueDate}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text">Assign to User</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={formData.assigneeId}
                  onChange={(e) =>
                    handleInputChange("assigneeId", e.target.value)
                  }
                  disabled={isSubmitting}>
                  <option value="">Select user (optional)</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Assign to Team</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={formData.teamId}
                  onChange={(e) => handleInputChange("teamId", e.target.value)}
                  disabled={isSubmitting}>
                  <option value="">Select team (optional)</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-action">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost"
                disabled={isSubmitting}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : mode === "create"
                  ? "Create Task"
                  : "Update Task"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TodoModal;
