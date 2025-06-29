import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { loginUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useAppDispatch();
  const { loading, error, token } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));

    if (token) {
      navigate("/");
    }
  };

  useEffect(() => {
    setEmail("");
    setPassword("");
  }, [])

  return (
    <div className="">
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse mx-[10%]">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Login now!</h1>
            <p className="py-6">
              Welcome to Team Tracker App created by Tshiamo Mothokho! To get
              started, login to view your dashboard.
            </p>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <fieldset className="fieldset">
                <label className="label">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  type="email"
                  className="input"
                />
                <label className="label">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  type="password"
                  className="input"
                />
                <div>
                  <a className="link link-hover">Forgot password?</a>
                </div>
                <div>{error && <p style={{ color: "red" }}>{error}</p>}</div>
                <button
                  className="btn btn-neutral mt-4"
                  disabled={loading}
                  onClick={handleLogin}>
                  {loading ? "Logging in..." : "Login"}
                </button>

                <div>
                  Not a member yet?{" "}
                  <a className="link" href="#">
                    Click here to register.
                  </a>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
