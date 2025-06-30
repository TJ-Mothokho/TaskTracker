interface IStat{
    numOfTasksCreated?:number;
    numOfTasksAssigned?:number;
    numOfTeams?:number;
}

const Stats = ({numOfTasksAssigned = 0, numOfTasksCreated = 0, numOfTeams = 0}:IStat) => {
  return (
    <div className='flex justify-center my-3'>
      <div className="stats stats-vertical lg:stats-horizontal shadow">
        <div className="stat">
          <div className="stat-title">Tasks Created By You</div>
          <div className="stat-value">{numOfTasksCreated}</div>
          <div className="stat-desc">{numOfTasksCreated > 5 ? (<p className="text-red-700">Too Many!</p>):(<p>Tasks</p>)}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Teams</div>
          <div className="stat-value">{numOfTeams}</div>
          <div className="stat-desc">{numOfTeams > 5 ? (<p className="text-red-700">Too Many!</p>):(<p>Teams</p>)}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Tasks Assigned To You</div>
          <div className="stat-value">{numOfTasksAssigned}</div>
          <div className="stat-desc">{numOfTasksAssigned > 5 ? (<p className="text-red-700">Too Many!</p>):(<p>Tasks</p>)}</div>
        </div>
      </div>
    </div>
  );
}

export default Stats