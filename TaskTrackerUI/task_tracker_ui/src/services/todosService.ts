// API service functions for todos management
// These functions interface with the TaskTracker backend API

import { apiClient } from "../utils/auth";
import type { Todo, CreateTodoRequest, UpdateTodoRequest } from "../types";

const API_BASE = "/todos";

/**
 * Service class for managing todo-related API calls
 * Provides CRUD operations and specialized queries for todos
 */
export class TodosService {
  /**
   * Test endpoint to verify the service is working
   */
  static async testConnection(): Promise<string> {
    try {
      console.log(`Testing connection to: ${API_BASE}/test`);
      const response = await apiClient.get<string>(`${API_BASE}/test`);
      console.log("Test response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Test connection failed:", error);
      throw error;
    }
  }

  /**
   * Create a new todo/task
   * @param todoData - The todo creation data
   * @returns Promise with the created todo
   */
  static async createTodo(todoData: CreateTodoRequest): Promise<Todo> {
    const response = await apiClient.post<Todo>(API_BASE, todoData);
    return response.data;
  }

  /**
   * Get a specific todo by ID
   * @param todoId - The unique identifier of the todo
   * @returns Promise with the todo details
   */
  static async getTodoById(todoId: string): Promise<Todo> {
    const response = await apiClient.get<Todo>(`${API_BASE}/${todoId}`);
    return response.data;
  }

  /**
   * Get all todos created by a specific user
   * @param userId - The user's unique identifier
   * @returns Promise with array of todos created by the user
   */
  static async getTodosCreatedByUser(userId: string): Promise<Todo[]> {
    try {
      console.log(`Making request to: ${API_BASE}/created-by/${userId}`);
      const response = await apiClient.get<Todo[]>(
        `${API_BASE}/created-by/${userId}`
      );
      console.log("Todos created by user response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching todos created by user:", error);
      throw error;
    }
  }

  /**
   * Get all todos assigned to a specific user
   * @param userId - The user's unique identifier
   * @returns Promise with array of todos assigned to the user
   */
  static async getTodosAssignedToUser(userId: string): Promise<Todo[]> {
    const response = await apiClient.get<Todo[]>(
      `${API_BASE}/assigned-to/${userId}`
    );
    return response.data;
  }

  /**
   * Get all todos belonging to a specific team
   * @param teamId - The team's unique identifier
   * @param userId - The requesting user's ID (for access control)
   * @returns Promise with array of team todos
   */
  static async getTodosByTeam(teamId: string, userId: string): Promise<Todo[]> {
    const response = await apiClient.get<Todo[]>(
      `${API_BASE}/team/${teamId}/user/${userId}`
    );
    return response.data;
  }

  /**
   * Update an existing todo
   * @param todoId - The todo's unique identifier
   * @param updateData - The updated todo data
   * @returns Promise with the updated todo
   */
  static async updateTodo(
    todoId: string,
    updateData: UpdateTodoRequest
  ): Promise<Todo> {
    const response = await apiClient.put<Todo>(
      `${API_BASE}/${todoId}`,
      updateData
    );
    return response.data;
  }

  /**
   * Delete a todo (hard delete)
   * @param todoId - The todo's unique identifier
   * @returns Promise with success status
   */
  static async deleteTodo(todoId: string): Promise<void> {
    await apiClient.delete(`${API_BASE}/${todoId}`);
  }

  /**
   * Soft delete a todo by changing status to "Cancelled"
   * @param todoId - The todo's unique identifier
   * @returns Promise with the updated todo
   */
  static async softDeleteTodo(todoId: string): Promise<Todo> {
    const updateData: UpdateTodoRequest = {
      id: todoId,
      status: "Cancelled",
    };
    return this.updateTodo(todoId, updateData);
  }

  /**
   * Mark a todo as completed
   * @param todoId - The todo's unique identifier
   * @returns Promise with the updated todo
   */
  static async completeTodo(todoId: string): Promise<Todo> {
    const updateData: UpdateTodoRequest = {
      id: todoId,
      status: "Completed",
    };
    return this.updateTodo(todoId, updateData);
  }

  /**
   * Assign a todo to a user
   * @param todoId - The todo's unique identifier
   * @param userId - The user to assign the todo to
   * @param requestingUserId - The user making the assignment request
   * @returns Promise with success status
   */
  static async assignTodoToUser(
    todoId: string,
    userId: string,
    requestingUserId: string
  ): Promise<void> {
    await apiClient.post(
      `${API_BASE}/${todoId}/assign/${userId}/by/${requestingUserId}`
    );
  }

  /**
   * Unassign a todo from its current assignee
   * @param todoId - The todo's unique identifier
   * @param requestingUserId - The user making the unassignment request
   * @returns Promise with success status
   */
  static async unassignTodo(
    todoId: string,
    requestingUserId: string
  ): Promise<void> {
    await apiClient.delete(
      `${API_BASE}/${todoId}/unassign/by/${requestingUserId}`
    );
  }

  /**
   * Get all completed todos for archive view
   * @param userId - The user's unique identifier
   * @returns Promise with array of completed todos
   */
  static async getCompletedTodos(userId: string): Promise<Todo[]> {
    // Get all created and assigned todos, then filter for completed ones
    const [createdTodos, assignedTodos] = await Promise.all([
      this.getTodosCreatedByUser(userId),
      this.getTodosAssignedToUser(userId),
    ]);

    // Combine and deduplicate todos, then filter for completed status
    const allTodos = [...createdTodos];
    assignedTodos.forEach((todo) => {
      if (!allTodos.some((t) => t.id === todo.id)) {
        allTodos.push(todo);
      }
    });

    return allTodos.filter((todo) => todo.status === "Completed");
  }

  /**
   * Get dashboard statistics for todos
   * @param userId - The user's unique identifier
   * @returns Promise with dashboard statistics
   */
  static async getDashboardStats(userId: string): Promise<{
    tasksCreated: number;
    tasksAssigned: number;
    completedTasks: number;
    pendingTasks: number;
    highPriorityTasks: number;
    mediumPriorityTasks: number;
    lowPriorityTasks: number;
  }> {
    const [createdTodos, assignedTodos] = await Promise.all([
      this.getTodosCreatedByUser(userId),
      this.getTodosAssignedToUser(userId),
    ]);

    // Combine all todos the user is involved with
    const allUserTodos = [...createdTodos];
    assignedTodos.forEach((todo) => {
      if (!allUserTodos.some((t) => t.id === todo.id)) {
        allUserTodos.push(todo);
      }
    });

    const completedTasks = allUserTodos.filter(
      (t) => t.status === "Completed"
    ).length;
    const pendingTasks = allUserTodos.filter(
      (t) => t.status === "Active"
    ).length;
    const highPriorityTasks = allUserTodos.filter(
      (t) => t.priority === 0 && t.status === "Active"
    ).length;
    const mediumPriorityTasks = allUserTodos.filter(
      (t) => t.priority === 1 && t.status === "Active"
    ).length;
    const lowPriorityTasks = allUserTodos.filter(
      (t) => t.priority === 2 && t.status === "Active"
    ).length;

    return {
      tasksCreated: createdTodos.length,
      tasksAssigned: assignedTodos.length,
      completedTasks,
      pendingTasks,
      highPriorityTasks,
      mediumPriorityTasks,
      lowPriorityTasks,
    };
  }
}
