// Component for displaying a list of todos with actions
// Provides a comprehensive view of todos with filtering and action buttons

import React, { useState } from "react";
import { Priority } from "../types";
import type { Todo } from "../types";

interface TodoListProps {
  todos: Todo[];
  onView: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todoId: string, hardDelete?: boolean) => void;
  onArchive: (todoId: string) => void;
  loading?: boolean;
  showArchived?: boolean;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onView,
  onEdit,
  onDelete,
  onArchive,
  loading = false,
  showArchived = false,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("dueDate");

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
        return "badge-error";
      case Priority.Medium:
        return "badge-warning";
      case Priority.Low:
        return "badge-success";
      default:
        return "badge-warning";
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Completed":
        return "badge-success";
      case "Cancelled":
        return "badge-error";
      case "On Hold":
        return "badge-warning";
      default:
        return "badge-primary";
    }
  };

  const isOverdue = (dueDate: string, status: string): boolean => {
    return status === "Active" && new Date(dueDate) < new Date();
  };

  // Filter todos
  const filteredTodos = todos.filter((todo) => {
    if (filterStatus !== "all" && todo.status !== filterStatus) return false;
    if (filterPriority !== "all" && todo.priority.toString() !== filterPriority)
      return false;
    return true;
  });

  // Sort todos
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    switch (sortBy) {
      case "dueDate":
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case "priority":
        return a.priority - b.priority;
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
      {/* Filters and Sort */}
      <div className="flex flex-wrap gap-4 p-4 bg-base-100 rounded-lg border">
        <div className="flex-1 min-w-48">
          <label className="label label-text">Filter by Status:</label>
          <select
            className="select select-bordered select-sm w-full"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex-1 min-w-48">
          <label className="label label-text">Filter by Priority:</label>
          <select
            className="select select-bordered select-sm w-full"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}>
            <option value="all">All Priorities</option>
            <option value="0">High</option>
            <option value="1">Medium</option>
            <option value="2">Low</option>
          </select>
        </div>

        <div className="flex-1 min-w-48">
          <label className="label label-text">Sort by:</label>
          <select
            className="select select-bordered select-sm w-full"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        {sortedTodos.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <p className="text-lg">No tasks found</p>
            <p className="text-sm">
              {showArchived
                ? "No completed tasks yet"
                : "Create your first task to get started"}
            </p>
          </div>
        ) : (
          sortedTodos.map((todo) => (
            <div
              key={todo.id}
              className={`card bg-base-100 shadow-sm border ${
                isOverdue(todo.dueDate, todo.status)
                  ? "border-error"
                  : "border-base-300"
              }`}>
              <div className="card-body p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="card-title text-lg">{todo.title}</h3>
                      <div
                        className={`badge ${getPriorityColor(todo.priority)}`}>
                        {getPriorityLabel(todo.priority)}
                      </div>
                      <div className={`badge ${getStatusColor(todo.status)}`}>
                        {todo.status}
                      </div>
                      {isOverdue(todo.dueDate, todo.status) && (
                        <div className="badge badge-error">Overdue</div>
                      )}
                    </div>

                    {todo.description && (
                      <p className="text-gray-600 mb-2">{todo.description}</p>
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

                    {todo.status !== "Completed" && (
                      <>
                        <button
                          onClick={() => onEdit(todo)}
                          className="btn btn-ghost btn-sm"
                          title="Edit Task">
                          ✏️
                        </button>

                        <button
                          onClick={() => onArchive(todo.id)}
                          className="btn btn-success btn-sm"
                          title="Mark Complete">
                          ✅
                        </button>
                      </>
                    )}

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
                            onClick={() => onDelete(todo.id, false)}
                            className="text-warning">
                            Cancel Task
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

export default TodoList;
