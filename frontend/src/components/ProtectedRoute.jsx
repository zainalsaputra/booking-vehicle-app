import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/auth/sign-in" replace />;
  }
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp < currentTime) {
      localStorage.removeItem("accessToken");
      return <Navigate to="/auth/sign-in" replace />;
    }
  } catch (error) {
    console.error("Gagal mendecode token:", error);
    localStorage.removeItem("accessToken");
    return <Navigate to="/auth/sign-in" replace />;
  }
  return children;
};

export default ProtectedRoute;
