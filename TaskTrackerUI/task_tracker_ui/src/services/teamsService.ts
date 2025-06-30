// API service functions for teams management
// These functions interface with the TaskTracker backend API for team operations

import { apiClient } from "../utils/auth";
import type { Team, CreateTeamRequest, UpdateTeamRequest } from "../types";

const API_BASE = "/teams";

/**
 * Service class for managing team-related API calls
 * Provides CRUD operations and member management for teams
 */
export class TeamsService {
  /**
   * Test endpoint to verify the service is working
   */
  static async testConnection(): Promise<string> {
    try {
      const response = await apiClient.get<string>(`${API_BASE}/test`);
      return response.data;
    } catch (error) {
      console.error("Test connection failed:", error);
      throw error;
    }
  }

  /**
   * Create a new team
   * @param teamData - The team creation data
   * @returns Promise with the created team
   */
  static async createTeam(teamData: CreateTeamRequest): Promise<Team> {
    const response = await apiClient.post<Team>(API_BASE, teamData);
    return response.data;
  }

  /**
   * Get a specific team by ID
   * @param teamId - The unique identifier of the team
   * @returns Promise with the team details
   */
  static async getTeamById(teamId: string): Promise<Team> {
    const response = await apiClient.get<Team>(`${API_BASE}/${teamId}`);
    return response.data;
  }

  /**
   * Get all teams associated with a user (owned or member)
   * @param userId - The user's unique identifier
   * @returns Promise with array of teams the user is associated with
   */
  static async getUserTeams(userId: string): Promise<Team[]> {
    try {
      const response = await apiClient.get<Team[]>(
        `${API_BASE}/user/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user teams:", error);
      throw error;
    }
  }

  /**
   * Update an existing team
   * @param teamId - The team's unique identifier
   * @param updateData - The updated team data
   * @returns Promise with the updated team
   */
  static async updateTeam(
    teamId: string,
    updateData: UpdateTeamRequest
  ): Promise<Team> {
    const response = await apiClient.put<Team>(
      `${API_BASE}/${teamId}`,
      updateData
    );
    return response.data;
  }

  /**
   * Delete a team
   * @param teamId - The team's unique identifier
   * @returns Promise with success status
   */
  static async deleteTeam(teamId: string): Promise<void> {
    await apiClient.delete(`${API_BASE}/${teamId}`);
  }

  /**
   * Add a member to a team
   * @param teamId - The team's unique identifier
   * @param userId - The user to add as a member
   * @returns Promise with success status
   */
  static async addMemberToTeam(teamId: string, userId: string): Promise<void> {
    await apiClient.post(`${API_BASE}/${teamId}/members/${userId}`);
  }

  /**
   * Remove a member from a team
   * @param teamId - The team's unique identifier
   * @param userId - The user to remove from the team
   * @returns Promise with success status
   */
  static async removeMemberFromTeam(
    teamId: string,
    userId: string
  ): Promise<void> {
    await apiClient.delete(`${API_BASE}/${teamId}/members/${userId}`);
  }

  /**
   * Get dashboard statistics for teams
   * @param userId - The user's unique identifier
   * @returns Promise with team count
   */
  static async getTeamStats(userId: string): Promise<{ teamsCount: number }> {
    const teams = await this.getUserTeams(userId);
    return {
      teamsCount: teams.length,
    };
  }
}
