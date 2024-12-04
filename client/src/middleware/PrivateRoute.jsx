import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
  const local_data = JSON.parse(localStorage.getItem("_session"));
  if (local_data) {
    const isAuthenticated = local_data.token;
    if (isAuthenticated) {
      return <Outlet />;
    } else {
      return <Navigate to="/login" />;
    }
  } else {
    return <Navigate to="/login" />;
  }
};

export default PrivateRoutes;
