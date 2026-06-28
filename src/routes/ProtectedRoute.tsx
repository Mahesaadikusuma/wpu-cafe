import { Navigate, useLocation } from "react-router-dom";
import { getLocalStorage } from "../utils/storage";
import type { IAuthData } from "../types/auth";



interface PropTypes {
  children: React.ReactNode;
}

const ProtectedRoute = (props: PropTypes) => {
  const { children } = props;
  const auth = getLocalStorage<IAuthData | null>("auth", null);

  const currentRoute = useLocation().pathname;
  const isAuthenticated = auth !== null && !!auth.token;

  if (!isAuthenticated && currentRoute !== "/login") {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && currentRoute === "/login") {
    return <Navigate to="/orders" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;