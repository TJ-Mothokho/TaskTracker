import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { registerUser, clearError } from "../redux/authSlice";
import {
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from "../redux/authSelectors";
import PublicRoute from "../components/Auth/PublicRoute";
import { showError, showSuccess } from "../utils/toast";

const Register = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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
    const errors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!firstName.trim()) {
      errors.firstName = "First name is required";
      isValid = false;
    } else if (firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters";
      isValid = false;
    }

    if (!lastName.trim()) {
      errors.lastName = "Last name is required";
      isValid = false;
    } else if (lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
      isValid = false;
    }

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

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }

    console.log(`Attempting registration with email: ${email}`);

    try {
      const result = await dispatch(
        registerUser({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email,
          password,
          confirmPassword,
        })
      );

      console.log("Register dispatch result:", result);

      if (registerUser.fulfilled.match(result)) {
        console.log("Registration successful, user data:", result.payload);
        showSuccess("Registration successful! Welcome to TaskTracker!");
        // Navigation will be handled by the useEffect above
      } else {
        console.log("Registration failed:", result.payload);
        showError((result.payload as string) || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      showError("An unexpected error occurred");
    }
  };

  const handleInputChange = (
    field: "firstName" | "lastName" | "email" | "password" | "confirmPassword",
    value: string
  ) => {
    // Update the respective state
    switch (field) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
    }

    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Clear redux error when user starts typing
    if (error) {
      dispatch(clearError());
    }
  };

  useEffect(() => {
    // Clear form when component mounts
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFormErrors({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  }, []);

  return (
    <div>
      <PublicRoute>
        <div className="">
          <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse mx-[10%]">
              <div className="text-center lg:text-left">
                <h1 className="text-5xl font-bold">Join us today!</h1>
                <p className="py-6">
                  Welcome to Team Tracker App created by Tshiamo Mothokho!
                  Create your account to start managing your tasks and teams
                  efficiently.
                </p>
              </div>
              <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                <div className="card-body">
                  <form onSubmit={handleRegister}>
                    <fieldset className="fieldset">
                      <label className="label">First Name</label>
                      <input
                        value={firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        placeholder="First Name"
                        type="text"
                        className={`input ${
                          formErrors.firstName ? "input-error" : ""
                        }`}
                        disabled={loading}
                      />
                      {formErrors.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.firstName}
                        </p>
                      )}

                      <label className="label mt-4">Last Name</label>
                      <input
                        value={lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        placeholder="Last Name"
                        type="text"
                        className={`input ${
                          formErrors.lastName ? "input-error" : ""
                        }`}
                        disabled={loading}
                      />
                      {formErrors.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.lastName}
                        </p>
                      )}

                      <label className="label mt-4">Email</label>
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

                      <label className="label mt-4">Confirm Password</label>
                      <input
                        value={confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        placeholder="Confirm Password"
                        type="password"
                        className={`input ${
                          formErrors.confirmPassword ? "input-error" : ""
                        }`}
                        disabled={loading}
                      />
                      {formErrors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.confirmPassword}
                        </p>
                      )}

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
                            Creating Account...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </button>
                    </fieldset>
                  </form>
                  <div className="divider">OR</div>
                  <div className="text-center mt-4">
                    Already have an account?
                  </div>
                  <button
                    onClick={() => navigate("/login")}
                    className="btn btn-outline w-full">
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PublicRoute>
    </div>
  );
};

export default Register;
