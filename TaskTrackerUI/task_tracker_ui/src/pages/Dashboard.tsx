// Enhanced Dashboard with real data integration and comprehensive CRUD operations
// Integrates todos, teams, statistics, and archive functionality

import { useState } from "react";
import { useSelector } from "react-redux";
import { ProtectedRoute } from "../components";
import Stats from "../components/Stats";
import {
  DashboardHeader,
  DashboardTabs,
  DashboardModals,
  ErrorAlert,
  OverviewTab,
  TasksTab,
  TeamsTab,
} from "../components/dashboard";
import { useTodos } from "../hooks/useTodos";
import { useTeams } from "../hooks/useTeams";
import { selectCurrentUser } from "../redux/authSelectors";
import type {
  Todo,
  Team,
  CreateTodoRequest,
  UpdateTodoRequest,
  CreateTeamRequest,
  UpdateTeamRequest,
} from "../types";

const Dashboard = () => {
  const currentUser = useSelector(selectCurrentUser);

  // Hooks for data management
  const {
    activeTodos,
    completedTodos,
    todosCreated,
    todosAssigned,
    loading: todosLoading,
    error: todosError,
    createTodo,
    updateTodo,
    deleteTodo,
    archiveTodo,
    priorityStats,
  } = useTodos();

  const {
    teams,
    ownedTeams,
    memberTeams,
    loading: teamsLoading,
    error: teamsError,
    createTeam,
    updateTeam,
    deleteTeam,
    addMember,
    removeMember,
  } = useTeams();

  // UI State
  const [activeTab, setActiveTab] = useState<"overview" | "todos" | "teams">(
    "overview"
  );

  // Todo Modal State
  const [todoModalOpen, setTodoModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [todoModalMode, setTodoModalMode] = useState<
    "create" | "edit" | "view"
  >("create");

  // Team Modal State
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamModalMode, setTeamModalMode] = useState<
    "create" | "edit" | "view"
  >("create");

  // Todo Actions
  const handleCreateTodo = () => {
    setSelectedTodo(null);
    setTodoModalMode("create");
    setTodoModalOpen(true);
  };

  const handleViewTodo = (todo: Todo) => {
    setSelectedTodo(todo);
    setTodoModalMode("view");
    setTodoModalOpen(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setSelectedTodo(todo);
    setTodoModalMode("edit");
    setTodoModalOpen(true);
  };

  const handleSaveTodo = async (
    todoData: CreateTodoRequest | UpdateTodoRequest
  ) => {
    try {
      if (todoModalMode === "create") {
        await createTodo(todoData as CreateTodoRequest);
      } else if (todoModalMode === "edit") {
        await updateTodo(todoData as UpdateTodoRequest);
      }
      setTodoModalOpen(false);
    } catch (error) {
      console.error("Error saving todo:", error);
      alert("Failed to save task. Please try again.");
    }
  };

  const handleDeleteTodo = async (todoId: string, hardDelete = false) => {
    try {
      await deleteTodo(todoId, hardDelete);
    } catch (error) {
      console.error("Error deleting todo:", error);
      alert("Failed to delete task. Please try again.");
    }
  };

  const handleArchiveTodo = async (todoId: string) => {
    try {
      await archiveTodo(todoId);
    } catch (error) {
      console.error("Error archiving todo:", error);
      alert("Failed to archive task. Please try again.");
    }
  };

  // Team Actions
  const handleCreateTeam = () => {
    setSelectedTeam(null);
    setTeamModalMode("create");
    setTeamModalOpen(true);
  };

  const handleViewTeam = (team: Team) => {
    setSelectedTeam(team);
    setTeamModalMode("view");
    setTeamModalOpen(true);
  };

  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team);
    setTeamModalMode("edit");
    setTeamModalOpen(true);
  };

  const handleSaveTeam = async (
    teamData: CreateTeamRequest | UpdateTeamRequest
  ) => {
    try {
      if (teamModalMode === "create") {
        await createTeam(teamData as CreateTeamRequest);
      } else if (teamModalMode === "edit") {
        await updateTeam(teamData as UpdateTeamRequest);
      }
      setTeamModalOpen(false);
    } catch (error) {
      console.error("Error saving team:", error);
      alert("Failed to save team. Please try again.");
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      await deleteTeam(teamId);
    } catch (error) {
      console.error("Error deleting team:", error);
      alert("Failed to delete team. Please try again.");
    }
  };

  const handleAddTeamMember = async (teamId: string, userId: string) => {
    try {
      await addMember(teamId, userId);
    } catch (error) {
      console.error("Error adding team member:", error);
      alert("Failed to add team member. Please try again.");
    }
  };

  const handleRemoveTeamMember = async (teamId: string, userId: string) => {
    try {
      await removeMember(teamId, userId);
    } catch (error) {
      console.error("Error removing team member:", error);
      alert("Failed to remove team member. Please try again.");
    }
  };

  // Get unique users from teams for user selection
  const allUsers = Array.from(
    new Map(
      teams
        .flatMap((team) => [...team.members, team.owner])
        .map((user) => [user.id, user])
    ).values()
  );

  return (
    <div>
      <ProtectedRoute>
        <div className="mx-[5%] py-4">
          {/* Header */}
          <DashboardHeader
            currentUser={currentUser}
            onCreateTodo={handleCreateTodo}
            onCreateTeam={handleCreateTeam}
            todosLoading={todosLoading}
            teamsLoading={teamsLoading}
          />

          {/* Error Messages */}
          <ErrorAlert todosError={todosError} teamsError={teamsError} />

          {/* Stats Cards */}
          <Stats
            numOfTasksCreated={todosCreated.length}
            numOfTasksAssigned={todosAssigned.length}
            numOfTeams={teams.length}
          />

          {/* Tabs */}
          <DashboardTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            activeTodosCount={activeTodos.length}
            teamsCount={teams.length}
          />

          {/* Tab Content */}
          {activeTab === "overview" && (
            <OverviewTab
              activeTodos={activeTodos}
              completedTodos={completedTodos}
              ownedTeamsCount={ownedTeams.length}
              memberTeamsCount={memberTeams.length}
              priorityStats={priorityStats}
              onViewTodo={handleViewTodo}
            />
          )}

          {activeTab === "todos" && (
            <TasksTab
              activeTodos={activeTodos}
              onCreateTodo={handleCreateTodo}
              onViewTodo={handleViewTodo}
              onEditTodo={handleEditTodo}
              onDeleteTodo={handleDeleteTodo}
              onArchiveTodo={handleArchiveTodo}
              loading={todosLoading}
            />
          )}

          {activeTab === "teams" && (
            <TeamsTab
              teams={teams}
              onCreateTeam={handleCreateTeam}
              onViewTeam={handleViewTeam}
              onEditTeam={handleEditTeam}
              onDeleteTeam={handleDeleteTeam}
              loading={teamsLoading}
            />
          )}
        </div>

        {/* Modals */}
        <DashboardModals
          // Todo Modal props
          todoModalOpen={todoModalOpen}
          selectedTodo={selectedTodo}
          todoModalMode={todoModalMode}
          onCloseTodoModal={() => setTodoModalOpen(false)}
          onSaveTodo={handleSaveTodo}
          onDeleteTodo={handleDeleteTodo}
          onArchiveTodo={handleArchiveTodo}
          // Team Modal props
          teamModalOpen={teamModalOpen}
          selectedTeam={selectedTeam}
          teamModalMode={teamModalMode}
          onCloseTeamModal={() => setTeamModalOpen(false)}
          onSaveTeam={handleSaveTeam}
          onDeleteTeam={handleDeleteTeam}
          onAddTeamMember={handleAddTeamMember}
          onRemoveTeamMember={handleRemoveTeamMember}
          // Shared data
          teams={teams}
          allUsers={allUsers}
          todosLoading={todosLoading}
          teamsLoading={teamsLoading}
        />
      </ProtectedRoute>
    </div>
  );
};

export default Dashboard;
