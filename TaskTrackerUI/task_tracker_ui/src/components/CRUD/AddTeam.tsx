// Updated AddTeam component using the new TeamsService and hooks
// Integrates with the actual API and provides proper team creation functionality

import { useState, type FormEvent } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/authSelectors";
import { TeamsService } from "../../services/teamsService";
import type { CreateTeamRequest } from "../../types";

const AddTeam = () => {
  const [name, setName] = useState("");
  const currentUser = useSelector(selectCurrentUser);
  const [memberEmails, setMemberEmails] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTeam = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a team name");
      return;
    }

    setIsSubmitting(true);

    try {
      // For now, we'll create the team without member IDs since we don't have user lookup
      // In a real implementation, you'd look up users by email to get their IDs
      const teamData: CreateTeamRequest = {
        name: name.trim(),
        ownerId: currentUser.id,
        // memberIds: undefined // We'll handle member addition separately
      };

      // Create the team
      await TeamsService.createTeam(teamData);

      alert(`Team "${name}" created successfully!`);

      // Reset form
      setName("");
      setMemberEmails("");

      // Close modal
      const modal = document.getElementById("my_modal_1") as HTMLDialogElement;
      if (modal) modal.close();

      // Refresh the page to show the new team
      window.location.reload();
    } catch (error) {
      console.error("Error creating team:", error);
      alert("Error creating team. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn btn-primary"
        onClick={() => {
          const modal = document.getElementById(
            "my_modal_1"
          ) as HTMLDialogElement | null;
          if (modal) modal.showModal();
        }}>
        Add Team
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add a Team!</h3>
          <p className="text-sm text-gray-600 mb-4">
            Owner: {currentUser.firstName} {currentUser.lastName} (
            {currentUser.email})
          </p>
          <div>
            <form onSubmit={handleAddTeam}>
              <fieldset disabled={isSubmitting}>
                <label className="label">Team Name:</label>
                <input
                  className="input input-bordered w-full mb-4"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter team name"
                  required
                />

                <label className="label">
                  Add Members (comma-separated emails):
                </label>
                <input
                  className="input input-bordered w-full mb-4"
                  type="text"
                  value={memberEmails}
                  onChange={(e) => setMemberEmails(e.target.value)}
                  placeholder="user1@example.com, user2@example.com"
                />
                <div className="text-sm text-gray-500 mb-4">
                  Note: Members will need to be added after team creation
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Team"}
                  </button>
                </div>
              </fieldset>
            </form>
          </div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AddTeam;
