import { useState, type FormEvent } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/authSelectors";

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
      // Convert comma-separated emails to array and get dummy user IDs
      const emailArray = memberEmails
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email.length > 0);

      // Generate dummy user IDs for the emails (you'll replace this with actual API call)
      const dummyMemberIds = emailArray.map(
        (_, index) => `dummy-user-id-${index + 1}`
      );

      const teamData = {
        name: name.trim(),
        owner: currentUser.id, // Get owner ID from Redux
        members: dummyMemberIds, // Array of user IDs
      };

      console.log("Team data to be sent to API:", teamData);

      // TODO: Replace with actual API call
      // await createTeamAPI(teamData);

      alert("Team would be created with this data (check console)");

      // Reset form
      setName("");
      setMemberEmails("");

      // Close modal
      const modal = document.getElementById("my_modal_1") as HTMLDialogElement;
      if (modal) modal.close();
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
            Owner: {currentUser.fullName} ({currentUser.email})
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
