import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { loginUser, clearError } from "../redux/authSlice";
import {
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from "../redux/authSelectors";
import { useNavigate } from "react-router-dom";
import PublicRoute from "../components/Auth/PublicRoute";
import { showError, showSuccess } from "../utils/toast";

const Login = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({ email: "", password: "" });

  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validateForm = () => {
    const errors = { email: "", password: "" };
    let isValid = true;

    if (!email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(loginUser({ email, password }));

      if (loginUser.fulfilled.match(result)) {
        showSuccess("Login successful! Redirecting...");
        // Navigation will be handled by the useEffect above
      } else {
        showError((result.payload as string) || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      showError("An unexpected error occurred");
    }
  };

  const handleInputChange = (field: "email" | "password", value: string) => {
    if (field === "email") {
      setEmail(value);
      if (formErrors.email) {
        setFormErrors((prev) => ({ ...prev, email: "" }));
      }
    } else {
      setPassword(value);
      if (formErrors.password) {
        setFormErrors((prev) => ({ ...prev, password: "" }));
      }
    }

    // Clear redux error when user starts typing
    if (error) {
      dispatch(clearError());
    }
  };

  useEffect(() => {
    // Clear form when component mounts
    setEmail("");
    setPassword("");
    setFormErrors({ email: "", password: "" });
  }, []);

  return (
    <PublicRoute>
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
                <form onSubmit={handleLogin}>
                  <fieldset className="fieldset">
                    <label className="label">Email</label>
                    <input
                      value={email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Email"
                      type="email"
                      className={`input ${
                        formErrors.email ? "input-error" : ""
                      }`}
                      disabled={loading}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.email}
                      </p>
                    )}

                    <label className="label mt-4">Password</label>
                    <input
                      value={password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      placeholder="Password"
                      type="password"
                      className={`input ${
                        formErrors.password ? "input-error" : ""
                      }`}
                      disabled={loading}
                    />
                    {formErrors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.password}
                      </p>
                    )}

                    <div className="flex justify-between items-center mt-2">
                      <a className="link link-hover">Forgot password?</a>
                    </div>

                    {error && (
                      <div className="alert alert-error mt-4">
                        <p>{error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn btn-neutral mt-4 w-full"
                      disabled={loading}>
                      {loading ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </button>
                  </fieldset>
                </form>
                <div className="divider">OR</div>
                <div className="text-center mt-4">Not a member yet?</div>
                <button
                  onClick={() => navigate("/register")}
                  className="btn btn-outline w-full">
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
};

export default Login;
