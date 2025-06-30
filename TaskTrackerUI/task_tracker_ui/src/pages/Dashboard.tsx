
// import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../components';
import BarChart from '../components/BarChart';
import AddButtons from '../components/CRUD/AddButtons';
import ViewButtons from '../components/CRUD/ViewButtons';
import Stats from '../components/Stats';

const Dashboard = () => {
    //const navigate = useNavigate();

  return (
    <div>
      <ProtectedRoute>
        <div className="mx-[10%]">
          <div className="flex justify-end">
            <div className="flex gap-3">
              <AddButtons />
              <ViewButtons />
            </div>
          </div>

          <Stats />
          <div className="w-[80%] h-90 flex justify-center">
            <BarChart />
          </div>
        </div>
      </ProtectedRoute>
    </div>
  );
}

export default Dashboard