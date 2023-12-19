import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import authService from "../services/authService";
import { SpinnerRoundOutlined } from "spinners-react";
import Swal from "sweetalert2";

const UserProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          setLoading(true);
          const profileData = await authService.getUserProfile(user._id);

          setProfile(profileData.profile);
          // setError("");
        } catch (err) {
          // setError("Failed to load profile. Please try again.");
          Swal.fire({
            icon: "warning",
            title: "Oops...",
            text: "Failed to load profile. Please try again!",
          });
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        // setError("User not authenticated");
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "User not authenticated!",
        });
      }
    };

    fetchProfile();
  }, [user, logout]);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure you want to log out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out!",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 text-blue-600 hover:text-blue-800 font-semibold border border-blue-600 rounded px-3 py-1 hover:border-blue-800"
      >
        Logout
      </button>
      {loading ? (
        <div className="loader flex justify-center">
          <SpinnerRoundOutlined color="blue" size={35} />
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl text-center">
          <div className="text-center mt-6 mb-4">
            <h3 className="text-2xl font-bold text-blue-600 mb-2">
              Welcome again, {profile.username}!
            </h3>
            <p className="text-base text-gray-600">
              We're glad to see you back. Check out your profile details below.
            </p>
          </div>
          <div className="mb-4">
            <img
              src="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?size=338&ext=jpg&ga=GA1.1.1546980028.1702857600&semt=sph"
              alt="Avatar"
              className="w-35 h-35 rounded-full mx-auto"
            />
          </div>
          <div className="mt-4 mb-6 text-center">
            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              Your Email Address:
            </h4>
            <span className="text-md text-blue-500 font-medium">
              {profile.email}
            </span>
            <p className="text-sm text-gray-600 mt-3">
              This is the primary email address associated with your account.
              You'll receive all notifications and updates at this address.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
