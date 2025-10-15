import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import LoaderDialog from "../ui/LoaderDialog";

function PublicRoute() {
  const { isLogged, loading } = useAuth();

  if (isLogged) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <LoaderDialog ref={loading} />
      <Outlet />
    </>
  );
}

export default PublicRoute;
