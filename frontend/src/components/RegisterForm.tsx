import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { SpinnerDotted } from "spinners-react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import authService from "../services/authService";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!username || !email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "All fields are required!",
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

    setLoading(true);
    try {
      const response = await authService.registerUser({
        username,
        email,
        password,
      });

      if (response.error) {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: response.error,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "You can now log in!",
        });
        navigate("/login"); // Navigate to login after successful registration
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Registration Error",
        text: "An error occurred while registering. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigate("/login"); // Function to navigate to login page
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md space-y-4 w-full max-w-md"
      >
        <h1 className="text-xl font-bold text-center">Register</h1>
        <div>
          <label htmlFor="username" className="block">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="email" className="block">
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
          className="bg-blue-500 text-white w-full p-2 rounded"
          disabled={loading}
        >
          {loading ? (
            <div className="loader flex justify-center">
              <SpinnerDotted color="white" size={25} />
            </div>
          ) : (
            "Register"
          )}
        </button>
        <div className="text-center">
          <span className="text-sm">Already have an account? </span>
          <button
            type="button"
            onClick={navigateToLogin}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Log in here.
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
