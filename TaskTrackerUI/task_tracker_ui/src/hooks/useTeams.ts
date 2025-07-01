// Custom hook for managing teams data and operations
// Provides data fetching, CRUD operations, and state management for teams

import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { TeamsService } from "../services/teamsService";
import { selectCurrentUser } from "../redux/authSelectors";
import type { Team, CreateTeamRequest, UpdateTeamRequest } from "../types";

interface UseTeamsReturn {
  // Data
  teams: Team[];
  ownedTeams: Team[];
  memberTeams: Team[];

  // Loading states
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;

  // Error states
  error: string | null;

  // Actions
  fetchTeams: () => Promise<void>;
  createTeam: (teamData: CreateTeamRequest) => Promise<Team | null>;
  updateTeam: (teamData: UpdateTeamRequest) => Promise<Team | null>;
  deleteTeam: (teamId: string) => Promise<boolean>;
  addMember: (teamId: string, userId: string) => Promise<boolean>;
  removeMember: (teamId: string, userId: string) => Promise<boolean>;
  addMembersByEmail: (teamId: string, emails: string[]) => Promise<boolean>;
}

export const useTeams = (): UseTeamsReturn => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUser = useSelector(selectCurrentUser);

  // Computed values
  const ownedTeams = teams.filter((team) => team.owner?.id === currentUser.id);
  const memberTeams = teams.filter(
    (team) =>
      team.owner?.id !== currentUser.id &&
      team.members.some((member) => member.id === currentUser.id)
  );

  /**
   * Fetch all teams for the current user (both owned and member of)
   */
  const fetchTeams = useCallback(async () => {
    if (!currentUser.id) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await TeamsService.testConnection();
      const userTeams = await TeamsService.getUserTeams(currentUser.id);
      setTeams(userTeams);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch teams";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentUser.id]);

  /**
   * Create a new team
   */
  const createTeam = useCallback(
    async (teamData: CreateTeamRequest): Promise<Team | null> => {
      setCreating(true);
      setError(null);

      try {
        const newTeam = await TeamsService.createTeam(teamData);
        setTeams((prev) => [...prev, newTeam]);
        return newTeam;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create team");
        return null;
      } finally {
        setCreating(false);
      }
    },
    []
  );

  /**
   * Update an existing team
   */
  const updateTeam = useCallback(
    async (teamData: UpdateTeamRequest): Promise<Team | null> => {
      setUpdating(true);
      setError(null);

      try {
        const updatedTeam = await TeamsService.updateTeam(
          teamData.id,
          teamData
        );
        setTeams((prev) =>
          prev.map((team) => (team.id === updatedTeam.id ? updatedTeam : team))
        );
        return updatedTeam;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update team");
        return null;
      } finally {
        setUpdating(false);
      }
    },
    []
  );

  /**
   * Delete a team
   */
  const deleteTeam = useCallback(async (teamId: string): Promise<boolean> => {
    setDeleting(true);
    setError(null);

    try {
      await TeamsService.deleteTeam(teamId);
      setTeams((prev) => prev.filter((team) => team.id !== teamId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete team");
      return false;
    } finally {
      setDeleting(false);
    }
  }, []);

  /**
   * Add a member to a team
   */
  const addMember = useCallback(
    async (teamId: string, userId: string): Promise<boolean> => {
      setUpdating(true);
      setError(null);

      try {
        await TeamsService.addMemberToTeam(teamId, userId);
        // Refresh the specific team data
        await fetchTeams();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add member");
        return false;
      } finally {
        setUpdating(false);
      }
    },
    [fetchTeams]
  );

  /**
   * Remove a member from a team
   */
  const removeMember = useCallback(
    async (teamId: string, userId: string): Promise<boolean> => {
      setUpdating(true);
      setError(null);

      try {
        await TeamsService.removeMemberFromTeam(teamId, userId);
        // Refresh the specific team data
        await fetchTeams();
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to remove member"
        );
        return false;
      } finally {
        setUpdating(false);
      }
    },
    [fetchTeams]
  );

  /**
   * Add multiple members to a team using their email addresses
   */
  const addMembersByEmail = useCallback(
    async (teamId: string, emails: string[]): Promise<boolean> => {
      setUpdating(true);
      setError(null);

      try {
        await TeamsService.addMembersByEmail(teamId, emails);
        // Refresh the specific team data
        await fetchTeams();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add members");
        return false;
      } finally {
        setUpdating(false);
      }
    },
    [fetchTeams]
  );

  // Fetch teams when component mounts or user changes
  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return {
    // Data
    teams,
    ownedTeams,
    memberTeams,

    // Loading states
    loading,
    creating,
    updating,
    deleting,

    // Error states
    error,

    // Actions
    fetchTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    addMember,
    removeMember,
    addMembersByEmail,
  };
};
