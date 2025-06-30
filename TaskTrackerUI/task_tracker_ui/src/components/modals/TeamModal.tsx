// Modal component for viewing, creating, and editing teams
// Provides a comprehensive interface for team CRUD operations and member management

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/authSelectors";
import type {
  Team,
  CreateTeamRequest,
  UpdateTeamRequest,
  User,
} from "../../types";
import { BinIcon } from "../icons/Icons";

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team?: Team;
  mode: "create" | "edit" | "view";
  onSave: (data: CreateTeamRequest | UpdateTeamRequest) => Promise<void>;
  onDelete?: (teamId: string) => Promise<void>;
  onAddMember?: (teamId: string, userId: string) => Promise<void>;
  onRemoveMember?: (teamId: string, userId: string) => Promise<void>;
  availableUsers?: User[];
  loading?: boolean;
}

const TeamModal: React.FC<TeamModalProps> = ({
  isOpen,
  onClose,
  team,
  mode,
  onSave,
  onDelete,
  onAddMember,
  onRemoveMember,
  availableUsers = [],
  loading = false,
}) => {
  const currentUser = useSelector(selectCurrentUser);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    memberEmails: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newMemberEmail, setNewMemberEmail] = useState("");

  // Initialize form data when team changes
  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
        memberEmails: team.members.map((member) => member.email).join(", "),
      });
    } else {
      setFormData({
        name: "",
        memberEmails: "",
      });
    }
    setErrors({});
    setNewMemberEmail("");
  }, [team]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Team name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (mode === "create") {
        // Convert comma-separated emails to user IDs (simplified for now)
        const emailArray = formData.memberEmails
          .split(",")
          .map((email) => email.trim())
          .filter((email) => email.length > 0);

        // Find user IDs based on emails
        const memberIds = availableUsers
          .filter((user) => emailArray.includes(user.email))
          .map((user) => user.id);

        const createData: CreateTeamRequest = {
          name: formData.name.trim(),
          ownerId: currentUser.id,
          memberIds: memberIds.length > 0 ? memberIds : undefined,
        };
        await onSave(createData);
      } else if (mode === "edit" && team) {
        const updateData: UpdateTeamRequest = {
          id: team.id,
          name: formData.name.trim(),
        };
        await onSave(updateData);
      }

      onClose();
    } catch (error) {
      console.error("Error saving team:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!team || !onDelete) return;

    if (
      window.confirm(
        "Are you sure you want to delete this team? This action cannot be undone."
      )
    ) {
      try {
        await onDelete(team.id);
        onClose();
      } catch (error) {
        console.error("Error deleting team:", error);
      }
    }
  };

  const handleAddMember = async () => {
    if (!team || !onAddMember || !newMemberEmail.trim()) return;

    // Find user by email
    const user = availableUsers.find((u) => u.email === newMemberEmail.trim());
    if (!user) {
      alert("User not found with that email address");
      return;
    }

    // Check if user is already a member
    if (team.members.some((member) => member.id === user.id)) {
      alert("User is already a member of this team");
      return;
    }

    try {
      await onAddMember(team.id, user.id);
      setNewMemberEmail("");
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!team || !onRemoveMember) return;

    const member = team.members.find((m) => m.id === userId);
    if (!member) return;

    if (
      window.confirm(
        `Remove ${member.firstName} ${member.lastName} from this team?`
      )
    ) {
      try {
        await onRemoveMember(team.id, userId);
      } catch (error) {
        console.error("Error removing member:", error);
      }
    }
  };

  const isTeamOwner = team?.owner.id === currentUser.id;

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">
            {mode === "create" && "Create New Team"}
            {mode === "edit" && "Edit Team"}
            {mode === "view" && "Team Details"}
          </h3>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
            disabled={isSubmitting}>
            ✕
          </button>
        </div>

        {mode === "view" && team ? (
          // View mode
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-xl">{team.name}</h4>
              <p className="text-gray-600 mt-1">
                Owner: {team.owner?.firstName || "Unknown"}{" "}
                {team.owner?.lastName || ""} ({team.owner?.email || "No email"})
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-medium text-lg">
                  Team Members ({team.members.length})
                </h5>
                {isTeamOwner && (
                  <div className="flex gap-2">
                    <input
                      type="email"
                      className="input input-bordered input-sm"
                      placeholder="Enter member email"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      onClick={handleAddMember}
                      className="btn btn-primary btn-sm"
                      disabled={loading || !newMemberEmail.trim()}>
                      Add Member
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {team.members.length === 0 ? (
                  <p className="text-gray-500 italic">No members yet</p>
                ) : (
                  team.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                      <div>
                        <span className="font-medium">
                          {member.firstName} {member.lastName}
                        </span>
                        <span className="text-gray-600 ml-2">
                          ({member.email})
                        </span>
                      </div>
                      {isTeamOwner && member.id !== currentUser.id && (
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="btn btn-error btn-xs"
                          disabled={loading}>
                          Remove
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {isTeamOwner && (
              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={handleDelete}
                  className="btn btn-error btn-sm"
                  disabled={loading}>
                  <BinIcon/> Delete Team
                </button>
              </div>
            )}
          </div>
        ) : (
          // Create/Edit mode
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Team Name *</span>
              </label>
              <input
                type="text"
                className={`input input-bordered w-full ${
                  errors.name ? "input-error" : ""
                }`}
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter team name"
                disabled={isSubmitting}
              />
              {errors.name && (
                <span className="text-error text-sm">{errors.name}</span>
              )}
            </div>

            {mode === "create" && (
              <div>
                <label className="label">
                  <span className="label-text">Team Members</span>
                  <span className="label-text-alt">Comma-separated emails</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-24"
                  value={formData.memberEmails}
                  onChange={(e) =>
                    handleInputChange("memberEmails", e.target.value)
                  }
                  placeholder="user1@example.com, user2@example.com"
                  disabled={isSubmitting}
                />
                <div className="text-sm text-gray-600 mt-1">
                  Owner: {currentUser.firstName} {currentUser.lastName} (
                  {currentUser.email})
                </div>
              </div>
            )}

            <div className="modal-action">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost"
                disabled={isSubmitting}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : mode === "create"
                  ? "Create Team"
                  : "Update Team"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TeamModal;
