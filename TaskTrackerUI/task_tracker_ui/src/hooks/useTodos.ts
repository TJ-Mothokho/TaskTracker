// Custom hook for managing todos/tasks data and operations
// Provides data fetching, CRUD operations, and state management for todos

import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { TodosService } from "../services/todosService";
import { selectCurrentUser } from "../redux/authSelectors";
import type { Todo, CreateTodoRequest, UpdateTodoRequest } from "../types";

interface UseTodosReturn {
  // Data
  todos: Todo[];
  activeTodos: Todo[];
  completedTodos: Todo[];
  todosCreated: Todo[];
  todosAssigned: Todo[];

  // Loading states
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;

  // Error states
  error: string | null;

  // Actions
  fetchTodos: () => Promise<void>;
  createTodo: (todoData: CreateTodoRequest) => Promise<Todo | null>;
  updateTodo: (todoData: UpdateTodoRequest) => Promise<Todo | null>;
  deleteTodo: (todoId: string, hardDelete?: boolean) => Promise<boolean>;
  archiveTodo: (todoId: string) => Promise<boolean>;

  // Statistics
  priorityStats: {
    high: number;
    medium: number;
    low: number;
  };
}

export const useTodos = (): UseTodosReturn => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUser = useSelector(selectCurrentUser);

  // Computed values
  const activeTodos = todos.filter((todo) => todo.status !== "Completed");
  const completedTodos = todos.filter((todo) => todo.status === "Completed");
  const todosCreated = todos.filter(
    (todo) => todo.creator?.id === currentUser.id
  );
  const todosAssigned = todos.filter(
    (todo) => todo.assignee?.id === currentUser.id
  );

  // Priority statistics for bar chart
  const priorityStats = {
    high: activeTodos.filter((todo) => todo.priority === 0).length,
    medium: activeTodos.filter((todo) => todo.priority === 1).length,
    low: activeTodos.filter((todo) => todo.priority === 2).length,
  };

  /**
   * Fetch all todos for the current user (both created and assigned)
   */
  const fetchTodos = useCallback(async () => {
    if (!currentUser.id) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await TodosService.testConnection();

      // Fetch both created and assigned todos
      const [createdTodos, assignedTodos] = await Promise.all([
        TodosService.getTodosCreatedByUser(currentUser.id),
        TodosService.getTodosAssignedToUser(currentUser.id),
      ]);

      // Merge and deduplicate todos
      const allTodos = [...createdTodos];
      assignedTodos.forEach((todo) => {
        if (!allTodos.find((t) => t.id === todo.id)) {
          allTodos.push(todo);
        }
      });

      setTodos(allTodos);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch todos";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentUser.id]);

  /**
   * Create a new todo
   */
  const createTodo = useCallback(
    async (todoData: CreateTodoRequest): Promise<Todo | null> => {
      setCreating(true);
      setError(null);

      try {
        const newTodo = await TodosService.createTodo(todoData);
        setTodos((prev) => [...prev, newTodo]);
        return newTodo;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create todo");
        return null;
      } finally {
        setCreating(false);
      }
    },
    []
  );

  /**
   * Update an existing todo
   */
  const updateTodo = useCallback(
    async (todoData: UpdateTodoRequest): Promise<Todo | null> => {
      setUpdating(true);
      setError(null);

      try {
        const updatedTodo = await TodosService.updateTodo(
          todoData.id,
          todoData
        );
        setTodos((prev) =>
          prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
        );
        return updatedTodo;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update todo");
        return null;
      } finally {
        setUpdating(false);
      }
    },
    []
  );

  /**
   * Delete a todo (soft or hard delete)
   */
  const deleteTodo = useCallback(
    async (todoId: string, hardDelete = false): Promise<boolean> => {
      setDeleting(true);
      setError(null);

      try {
        if (hardDelete) {
          await TodosService.deleteTodo(todoId);
          setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
        } else {
          await TodosService.softDeleteTodo(todoId);
          // For soft delete, we might want to keep the todo but update its status
          // or remove it from the list depending on your business logic
          setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
        }
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete todo");
        return false;
      } finally {
        setDeleting(false);
      }
    },
    []
  );

  /**
   * Archive a todo (mark as completed)
   */
  const archiveTodo = useCallback(async (todoId: string): Promise<boolean> => {
    setUpdating(true);
    setError(null);

    try {
      const archivedTodo = await TodosService.completeTodo(todoId);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === archivedTodo.id ? archivedTodo : todo))
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive todo");
      return false;
    } finally {
      setUpdating(false);
    }
  }, []);

  // Fetch todos when component mounts or user changes
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return {
    // Data
    todos,
    activeTodos,
    completedTodos,
    todosCreated,
    todosAssigned,

    // Loading states
    loading,
    creating,
    updating,
    deleting,

    // Error states
    error,

    // Actions
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    archiveTodo,

    // Statistics
    priorityStats,
  };
};
