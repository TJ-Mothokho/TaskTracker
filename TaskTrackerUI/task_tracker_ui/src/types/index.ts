// Type definitions for the TaskTracker application
// These interfaces mirror the backend DTOs for consistency

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Team {
  id: string;
  name: string;
  owner: User;
  members: User[];
}

export interface CreateTeamRequest {
  name: string;
  ownerId: string;
  memberIds?: string[];
}

export interface UpdateTeamRequest {
  id: string;
  name?: string;
  ownerId?: string;
  memberIds?: string[];
}

// Priority enum matching backend
export const Priority = {
  High: 0,
  Medium: 1,
  Low: 2,
} as const;

export type Priority = (typeof Priority)[keyof typeof Priority];

export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate: string;
  status: string; // "Active", "Completed", "On Hold", "Cancelled"
  creator: User;
  assignee?: User;
  team?: Team;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority: Priority;
  createdBy: string;
  assignTo?: string;
  teamId?: string;
  dueDate: string;
}

export interface UpdateTodoRequest {
  id: string;
  title?: string;
  description?: string;
  priority?: Priority;
  assignTo?: string;
  teamId?: string;
  dueDate?: string;
  status?: string;
}

// Dashboard statistics interface
export interface DashboardStats {
  tasksCreated: number;
  tasksAssigned: number;
  teamsCount: number;
  completedTasks: number;
  pendingTasks: number;
  highPriorityTasks: number;
  mediumPriorityTasks: number;
  lowPriorityTasks: number;
}

// API response interfaces
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// Filter and sort options for todos
export interface TodoFilters {
  status?: string[];
  priority?: Priority[];
  assignedToMe?: boolean;
  createdByMe?: boolean;
  teamId?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
}

export interface SortOptions {
  field: "title" | "dueDate" | "priority" | "status" | "createdAt";
  direction: "asc" | "desc";
}

// Modal types for component state management
export type ModalType =
  | "add-todo"
  | "edit-todo"
  | "view-todo"
  | "add-team"
  | "edit-team"
  | "view-team"
  | "view-todos"
  | "view-teams"
  | "archive"
  | null;

// Form validation interfaces
export interface FormErrors {
  [key: string]: string;
}
