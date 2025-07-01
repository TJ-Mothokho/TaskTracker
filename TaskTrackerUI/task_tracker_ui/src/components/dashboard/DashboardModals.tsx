// Dashboard modals component managing both todo and team modals
import TodoModal from "../modals/TodoModal";
import TeamModal from "../modals/TeamModal";
import type {
  Todo,
  Team,
  User,
  CreateTodoRequest,
  UpdateTodoRequest,
  CreateTeamRequest,
  UpdateTeamRequest,
} from "../../types";

interface DashboardModalsProps {
  // Todo Modal
  todoModalOpen: boolean;
  selectedTodo: Todo | null;
  todoModalMode: "create" | "edit" | "view";
  onCloseTodoModal: () => void;
  onSaveTodo: (
    todoData: CreateTodoRequest | UpdateTodoRequest
  ) => Promise<void>;
  onDeleteTodo: (todoId: string, hardDelete?: boolean) => Promise<void>;
  onArchiveTodo: (todoId: string) => Promise<void>;

  // Team Modal
  teamModalOpen: boolean;
  selectedTeam: Team | null;
  teamModalMode: "create" | "edit" | "view";
  onCloseTeamModal: () => void;
  onSaveTeam: (
    teamData: CreateTeamRequest | UpdateTeamRequest
  ) => Promise<void>;
  onDeleteTeam: (teamId: string) => Promise<void>;
  onAddTeamMember: (teamId: string, userId: string) => Promise<void>;
  onRemoveTeamMember: (teamId: string, userId: string) => Promise<void>;
  onAddMembersByEmail: (teamId: string, emails: string[]) => Promise<void>;

  // Shared data
  teams: Team[];
  allUsers: User[];
  todosLoading: boolean;
  teamsLoading: boolean;
}

const DashboardModals: React.FC<DashboardModalsProps> = ({
  // Todo Modal props
  todoModalOpen,
  selectedTodo,
  todoModalMode,
  onCloseTodoModal,
  onSaveTodo,
  onDeleteTodo,
  onArchiveTodo,

  // Team Modal props
  teamModalOpen,
  selectedTeam,
  teamModalMode,
  onCloseTeamModal,
  onSaveTeam,
  onDeleteTeam,
  onAddTeamMember,
  onRemoveTeamMember,
  onAddMembersByEmail,

  // Shared data
  teams,
  allUsers,
  todosLoading,
  teamsLoading,
}) => {
  return (
    <>
      {/* Todo Modal */}
      <TodoModal
        isOpen={todoModalOpen}
        onClose={onCloseTodoModal}
        todo={selectedTodo || undefined}
        mode={todoModalMode}
        onSave={onSaveTodo}
        onDelete={onDeleteTodo}
        onArchive={onArchiveTodo}
        teams={teams}
        users={allUsers}
        loading={todosLoading}
      />

      {/* Team Modal */}
      <TeamModal
        isOpen={teamModalOpen}
        onClose={onCloseTeamModal}
        team={selectedTeam || undefined}
        mode={teamModalMode}
        onSave={onSaveTeam}
        onDelete={onDeleteTeam}
        onAddMember={onAddTeamMember}
        onRemoveMember={onRemoveTeamMember}
        onAddMembersByEmail={onAddMembersByEmail}
        availableUsers={allUsers}
        loading={teamsLoading}
      />
    </>
  );
};

export default DashboardModals;
