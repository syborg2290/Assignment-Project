import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, isTokenExpired } from "./contexts/AuthContext";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import UserProfile from "./components/UserProfile";
import PrivateRoute from "./components/PrivateRoute";
import NotFoundPage from "./components/NotFoundPage";
import useAuth from "./hooks/useAuth";

const App = () => {
  return (
    <Router>
      <AuthProviderWithNavigate>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="" element={<UserProfile />} />
          </Route>

          {/* Catch-all route for undefined paths */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProviderWithNavigate>
    </Router>
  );
};

const AuthProviderWithNavigate = ({ children }: any) => {
  const navigate = useNavigate();

  return <AuthProvider navigate={navigate}>{children}</AuthProvider>;
};

export default App;

const HomeRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isTokenExpired(localStorage.getItem("token") || "")) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  return null; // Render nothing while redirecting
};
