import AddTeam from "./AddTeam";


const AddButtons = () => {
  return (
    <div>
      <div className="dropdown dropdown-hover">
        <div tabIndex={0} role="button" className="btn m-1">
          Add
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
          <li>
            <a>New Task</a>
          </li>
          <li>
            <AddTeam/>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AddButtons