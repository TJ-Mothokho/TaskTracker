
import { useNavigate } from 'react-router-dom';
import Logout from '../components/Auth/Logout';
import { ProtectedRoute } from '../components';

const Dashboard = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    }
  return (
    <div>
      <ProtectedRoute>
        Dashboard: {token}
        <button className="btn btn-active mx-5" onClick={handleLogin}>
          login
        </button>
        <Logout />
      </ProtectedRoute>
    </div>
  );
}

export default Dashboard