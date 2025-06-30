import React from 'react'

const ViewButtons = () => {
  return (
    <div>
      <div className="dropdown dropdown-hover">
        <div tabIndex={0} role="button" className="btn m-1">
          View
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
          <li>
            <a>View Tasks</a>
          </li>
          <li>
            <a>View Teams</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ViewButtons