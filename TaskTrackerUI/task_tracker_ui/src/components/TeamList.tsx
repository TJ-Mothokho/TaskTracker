// Component for displaying a list of teams with actions
// Provides a comprehensive view of teams with member management

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/authSelectors";
import type { Team } from "../types";
import { BinIcon, EditIcon, ViewIcon } from "./icons/Icons";

interface TeamListProps {
  teams: Team[];
  onView: (team: Team) => void;
  onEdit: (team: Team) => void;
  onDelete: (teamId: string) => void;
  loading?: boolean;
}

const TeamList: React.FC<TeamListProps> = ({
  teams,
  onView,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const currentUser = useSelector(selectCurrentUser);
  const [filterType, setFilterType] = useState<string>("all");

  // Filter teams
  const filteredTeams = teams.filter((team) => {
    switch (filterType) {
      case "owned":
        return team.owner?.id === currentUser.id;
      case "member":
        return (
          team.owner?.id !== currentUser.id &&
          team.members.some((member) => member.id === currentUser.id)
        );
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="p-4 bg-base-100 rounded-lg border">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="label label-text">Filter Teams:</label>
            <select
              className="select select-bordered select-sm w-full max-w-xs"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Teams</option>
              <option value="owned">Teams I Own</option>
              <option value="member">Teams I'm Member Of</option>
            </select>
          </div>
        </div>
      </div>

      {/* Team List */}
      <div className="space-y-3">
        {filteredTeams.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <p className="text-lg">No teams found</p>
            <p className="text-sm">
              {filterType === "owned"
                ? "Create your first team to get started"
                : filterType === "member"
                ? "You are not a member of any teams yet"
                : "No teams available"}
            </p>
          </div>
        ) : (
          filteredTeams.map((team) => {
            const isOwner = team.owner?.id === currentUser.id;
            const isMember = team.members.some(
              (member) => member.id === currentUser.id
            );

            return (
              <div
                key={team.id}
                className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="card-title text-lg">{team.name}</h3>
                        {isOwner && (
                          <div className="badge badge-primary">Owner</div>
                        )}
                        {!isOwner && isMember && (
                          <div className="badge badge-secondary">Member</div>
                        )}
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          Owner: {team.owner?.firstName || "Unknown"}{" "}
                          {team.owner?.lastName || ""} (
                          {team.owner?.email || "No email"})
                        </p>
                        <p>Members: {team.members.length}</p>
                        {team.members.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {team.members.slice(0, 3).map((member) => (
                              <div
                                key={member.id}
                                className="badge badge-outline badge-sm">
                                {member.firstName} {member.lastName}
                              </div>
                            ))}
                            {team.members.length > 3 && (
                              <div className="badge badge-outline badge-sm">
                                +{team.members.length - 3} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onView(team)}
                        className="btn btn-ghost btn-sm"
                        title="View Team Details">
                        <ViewIcon/> View
                      </button>

                      {isOwner && (
                        <>
                          <button
                            onClick={() => onEdit(team)}
                            className="btn btn-ghost btn-sm"
                            title="Edit Team">
                            <EditIcon/> Edit
                          </button>

                          <div className="dropdown dropdown-end">
                            <button
                              tabIndex={0}
                              className="btn btn-ghost btn-sm"
                              title="More Actions">
                              ⋮
                            </button>
                            <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10">
                              <li>
                                <button
                                  onClick={() => onDelete(team.id)}
                                  className="text-error">
                                  <BinIcon/> Delete Team
                                </button>
                              </li>
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TeamList;
