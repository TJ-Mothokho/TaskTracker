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
        className={`tab tab-lg ${activeTab === "overview" ? "tab-active" : ""}`}
        onClick={() => onTabChange("overview")}>
        📊 Overview
      </button>
      <button
        className={`tab tab-lg ${activeTab === "todos" ? "tab-active" : ""}`}
        onClick={() => onTabChange("todos")}>
        ✅ Tasks ({activeTodosCount})
      </button>
      <button
        className={`tab tab-lg ${activeTab === "teams" ? "tab-active" : ""}`}
        onClick={() => onTabChange("teams")}>
        👥 Teams ({teamsCount})
      </button>
    </div>
  );
};

export default DashboardTabs;
