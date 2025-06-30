// Enhanced Dashboard with real data integration and comprehensive CRUD operations
// Integrates todos, teams, statistics, and archive functionality

import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ProtectedRoute } from "../components";
import BarChart from "../components/BarChart";
import Stats from "../components/Stats";
import TodoList from "../components/TodoList";
import TeamList from "../components/TeamList";
import TodoModal from "../components/modals/TodoModal";
import TeamModal from "../components/modals/TeamModal";
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {currentUser.firstName}!
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your tasks and teams
              </p>
              {/* Debug info */}
              <div className="text-xs text-gray-500 mt-1">
                User ID: {currentUser.id} (Length: {currentUser.id.length})
                {/* Check if it's a valid GUID format */}- Valid GUID:{" "}
                {/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
                  currentUser.id
                )
                  ? "Yes"
                  : "No"}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleCreateTodo}
                className="btn btn-primary"
                disabled={todosLoading}>
                + New Task
              </button>
              <button
                onClick={handleCreateTeam}
                className="btn btn-secondary"
                disabled={teamsLoading}>
                + New Team
              </button>
              <Link to="/archive" className="btn btn-outline">
                📁 Archive
              </Link>
            </div>
          </div>

          {/* Error Messages */}
          {(todosError || teamsError) && (
            <div className="alert alert-error mb-4">
              <span>
                {todosError && `Tasks: ${todosError}`}
                {todosError && teamsError && " | "}
                {teamsError && `Teams: ${teamsError}`}
              </span>
            </div>
          )}

          {/* Stats Cards */}
          <Stats
            numOfTasksCreated={todosCreated.length}
            numOfTasksAssigned={todosAssigned.length}
            numOfTeams={teams.length}
          />

          {/* Tabs */}
          <div className="tabs tabs-bordered mb-6">
            <button
              className={`tab tab-lg ${
                activeTab === "overview" ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab("overview")}>
              📊 Overview
            </button>
            <button
              className={`tab tab-lg ${
                activeTab === "todos" ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab("todos")}>
              ✅ Tasks ({activeTodos.length})
            </button>
            <button
              className={`tab tab-lg ${
                activeTab === "teams" ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab("teams")}>
              👥 Teams ({teams.length})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Priority Chart */}
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h2 className="card-title">Tasks by Priority</h2>
                  <div className="h-64 flex justify-center items-center">
                    <BarChart
                      high={priorityStats.high}
                      medium={priorityStats.medium}
                      low={priorityStats.low}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                {/* Recent Activity */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title">Quick Stats</h2>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Active Tasks:</span>
                        <span className="font-semibold">
                          {activeTodos.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Completed Tasks:</span>
                        <span className="font-semibold text-success">
                          {completedTodos.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Teams Owned:</span>
                        <span className="font-semibold">
                          {ownedTeams.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Teams Member:</span>
                        <span className="font-semibold">
                          {memberTeams.length}
                        </span>
                      </div>
                      <div className="divider"></div>
                      <div className="flex justify-between">
                        <span>High Priority:</span>
                        <span className="font-semibold text-error">
                          {priorityStats.high}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Medium Priority:</span>
                        <span className="font-semibold text-warning">
                          {priorityStats.medium}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Low Priority:</span>
                        <span className="font-semibold text-success">
                          {priorityStats.low}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Tasks */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title">Recent Tasks</h2>
                    <div className="space-y-2">
                      {activeTodos.slice(0, 5).map((todo) => (
                        <div
                          key={todo.id}
                          className="flex justify-between items-center p-2 hover:bg-base-200 rounded cursor-pointer"
                          onClick={() => handleViewTodo(todo)}>
                          <span className="truncate">{todo.title}</span>
                          <span
                            className={`badge badge-sm ${
                              todo.priority === 0
                                ? "badge-error"
                                : todo.priority === 1
                                ? "badge-warning"
                                : "badge-success"
                            }`}>
                            {todo.priority === 0
                              ? "High"
                              : todo.priority === 1
                              ? "Medium"
                              : "Low"}
                          </span>
                        </div>
                      ))}
                      {activeTodos.length === 0 && (
                        <p className="text-gray-500 text-center py-4">
                          No active tasks
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "todos" && (
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="card-title">My Tasks</h2>
                  <button
                    onClick={handleCreateTodo}
                    className="btn btn-primary btn-sm"
                    disabled={todosLoading}>
                    + Add Task
                  </button>
                </div>
                <TodoList
                  todos={activeTodos}
                  onView={handleViewTodo}
                  onEdit={handleEditTodo}
                  onDelete={handleDeleteTodo}
                  onArchive={handleArchiveTodo}
                  loading={todosLoading}
                />
              </div>
            </div>
          )}

          {activeTab === "teams" && (
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="card-title">My Teams</h2>
                  <button
                    onClick={handleCreateTeam}
                    className="btn btn-secondary btn-sm"
                    disabled={teamsLoading}>
                    + Add Team
                  </button>
                </div>
                <TeamList
                  teams={teams}
                  onView={handleViewTeam}
                  onEdit={handleEditTeam}
                  onDelete={handleDeleteTeam}
                  loading={teamsLoading}
                />
              </div>
            </div>
          )}
        </div>

        {/* Todo Modal */}
        <TodoModal
          isOpen={todoModalOpen}
          onClose={() => setTodoModalOpen(false)}
          todo={selectedTodo || undefined}
          mode={todoModalMode}
          onSave={handleSaveTodo}
          onDelete={handleDeleteTodo}
          onArchive={handleArchiveTodo}
          teams={teams}
          users={allUsers}
          loading={todosLoading}
        />

        {/* Team Modal */}
        <TeamModal
          isOpen={teamModalOpen}
          onClose={() => setTeamModalOpen(false)}
          team={selectedTeam || undefined}
          mode={teamModalMode}
          onSave={handleSaveTeam}
          onDelete={handleDeleteTeam}
          onAddMember={handleAddTeamMember}
          onRemoveMember={handleRemoveTeamMember}
          availableUsers={allUsers}
          loading={teamsLoading}
        />
      </ProtectedRoute>
    </div>
  );
};

export default Dashboard;
