import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import { useRef, useEffect } from "react";
import LoaderDialog from "../ui/LoaderDialog";

function PrivateRoute() {
  const { isLogged, loading } = useAuth();

  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <LoaderDialog ref={loading} />
      <Outlet />
    </>
  );
}

export default PrivateRoute;
