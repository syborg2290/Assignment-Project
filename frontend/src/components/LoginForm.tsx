import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Swal from "sweetalert2";
import { SpinnerDotted } from "spinners-react";
import authService from "../services/authService";
import useAuth from "../hooks/useAuth";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Email and password are required!",
      });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please enter a valid email address!",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await authService.loginUser({ email, password });
      if (response.error) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: response.error,
        });
      } else {
        if (response.token) {
          login(response.user, response.token);
          navigate("/profile");
        } else {
          Swal.fire("Login Failed", "Please try again.", "error");
        }
      }
    } catch (err) {
      Swal.fire(
        "Error",
        "Failed to log in. Please check your credentials.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigate("/register");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="form-container">
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md space-y-4 w-full max-w-md"
        >
          <h1 className="text-xl font-bold text-center">Login</h1>
          <div>
            <label htmlFor="email" className="block text-left">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-left">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 rounded w-full pr-10"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pt-5 pr-3">
              {showPassword ? (
                <AiOutlineEyeInvisible
                  onClick={togglePasswordVisibility}
                  className="cursor-pointer"
                />
              ) : (
                <AiOutlineEye
                  onClick={togglePasswordVisibility}
                  className="cursor-pointer"
                />
              )}
            </span>
          </div>

          <button
            type="submit"
            className={`bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-600 ${
              loading ? "opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="loader flex justify-center">
                <SpinnerDotted color="white" size={25} />
              </div>
            ) : (
              "Login"
            )}
          </button>
          <div className="flex justify-center items-center mt-4">
            <span className="text-sm mr-2">Don't have an account?</span>
            <button
              type="button"
              onClick={navigateToRegister}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Register here.
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
