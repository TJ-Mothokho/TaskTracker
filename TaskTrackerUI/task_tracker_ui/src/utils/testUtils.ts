// Test utilities for debugging team membership
// Can be used from browser console to test functionality

import { TeamsService } from '../services/teamsService';

// Test function to add a member to a team
export const testAddMember = async (teamId: string, userId: string) => {
  try {
    console.log(`Testing add member: teamId=${teamId}, userId=${userId}`);
    await TeamsService.addMemberToTeam(teamId, userId);
    console.log('Member added successfully');
    
    // Fetch team to verify
    const team = await TeamsService.getTeamById(teamId);
    console.log('Updated team:', team);
    
    return team;
  } catch (error) {
    console.error('Error adding member:', error);
    throw error;
  }
};

// Test function to get user teams
export const testGetUserTeams = async (userId: string) => {
  try {
    console.log(`Testing get user teams: userId=${userId}`);
    const teams = await TeamsService.getUserTeams(userId);
    console.log('User teams:', teams);
    return teams;
  } catch (error) {
    console.error('Error getting user teams:', error);
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
