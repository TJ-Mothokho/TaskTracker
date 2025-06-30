import { useNavigate } from "react-router-dom";

import { logout } from "../../redux/authSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

const Logout = () => {
  const dispatch = useAppDispatch();
  const { email, token } = useAppSelector((state) => state.auth);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // ⬅️ Clears all stored keys (token, refreshToken, etc.)
    dispatch(logout());
    navigate("/login");
  };

  if (!token) return null;

  return (
    <div className="flex items-center gap-3">
      <p className="hidden md:block">Hello, {email}</p>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded">
        Logout
      </button>
    </div>
  );
};

export default Logout;
