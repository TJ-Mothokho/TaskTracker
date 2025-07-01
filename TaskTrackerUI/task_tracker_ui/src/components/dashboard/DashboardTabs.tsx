import { ChartIcon, TaskIcon, TeamIcon } from "../icons/Icons";

// Dashboard tabs navigation component
interface DashboardTabsProps {
  activeTab: "overview" | "todos" | "teams";
  onTabChange: (tab: "overview" | "todos" | "teams") => void;
  activeTodosCount: number;
  teamsCount: number;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab,
  onTabChange,
  activeTodosCount,
  teamsCount,
}) => {
  return (
    <div className="tabs tabs-bordered mb-6">
      <button
        className={`tab mx-1 text-black tab-lg bg-indigo-200 rounded-2xl ${
          activeTab === "overview" ? "tab-active bg-indigo-300" : ""
        }`}
        onClick={() => onTabChange("overview")}>
        <ChartIcon /> Overview
      </button>
      <button
        className={`tab mx-1 text-black tab-l bg-indigo-200 rounded-2xl ${
          activeTab === "todos" ? "tab-active bg-indigo-300" : ""
        }`}
        onClick={() => onTabChange("todos")}>
        <TaskIcon /> Tasks ({activeTodosCount})
      </button>
      <button
        className={`tab mx-1 text-black tab-lg bg-indigo-200 rounded-2xl ${
          activeTab === "teams" ? "tab-active bg-indigo-300" : ""
        }`}
        onClick={() => onTabChange("teams")}>
        <TeamIcon />
        Teams ({teamsCount})
      </button>
    </div>
  );
};

export default DashboardTabs;
