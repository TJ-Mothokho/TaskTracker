// Test utilities for debugging team membership
// Can be used from browser console to test functionality

import { TeamsService } from "../services/teamsService";

// Test function to add a member to a team
export const testAddMember = async (teamId: string, userId: string) => {
  try {
    await TeamsService.addMemberToTeam(teamId, userId);

    // Fetch team to verify
    const team = await TeamsService.getTeamById(teamId);

    return team;
  } catch (error) {
    console.error("Error adding member:", error);
    throw error;
  }
};

// Test function to get user teams
export const testGetUserTeams = async (userId: string) => {
  try {
    const teams = await TeamsService.getUserTeams(userId);
    return teams;
  } catch (error) {
    console.error("Error getting user teams:", error);
    throw error;
  }
};

// Make test functions available globally for console testing
declare global {
  interface Window {
    testAddMember: typeof testAddMember;
    testGetUserTeams: typeof testGetUserTeams;
  }
}

window.testAddMember = testAddMember;
window.testGetUserTeams = testGetUserTeams;
