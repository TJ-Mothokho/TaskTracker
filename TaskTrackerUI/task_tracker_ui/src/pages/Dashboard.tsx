
// import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../components';
import Stats from '../components/Stats';

const Dashboard = () => {
    //const navigate = useNavigate();

  return (
    <div>
      <ProtectedRoute>
        <Stats/>
      </ProtectedRoute>
    </div>
  );
}

export default Dashboard