// Error alert component for displaying API errors
interface ErrorAlertProps {
  todosError?: string | null;
  teamsError?: string | null;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ todosError, teamsError }) => {
  if (!todosError && !teamsError) {
    return null;
  }

  return (
    <div className="alert alert-error mb-4">
      <span>
        {todosError && `Tasks: ${todosError}`}
        {todosError && teamsError && " | "}
        {teamsError && `Teams: ${teamsError}`}
      </span>
    </div>
  );
};

export default ErrorAlert;
