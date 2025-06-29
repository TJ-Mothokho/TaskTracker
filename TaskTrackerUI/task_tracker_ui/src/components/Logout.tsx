import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { logout } from "../redux/authSlice";

const Logout = () => {
  const dispatch = useAppDispatch();
  const { firstName, token } = useAppSelector((state) => state.auth);

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear(); // ⬅️ Clears all stored keys (token, refreshToken, etc.)
    dispatch(logout());
    navigate("/login");
  };

  if (!token) return null;

  return (
    <div>
      <p>Hello, {firstName} 👋</p>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded">
        Logout
      </button>
    </div>
  );
};

export default Logout;
