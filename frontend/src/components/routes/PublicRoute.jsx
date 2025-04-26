import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { useRef, useEffect } from "react";
import LoaderDialog from "../ui/LoaderDialog";


function PublicRoute() {
  const { isLogged, loading } = useAuth();
  const loaderRef = useRef();

    useEffect(() => {
        if (loading) {
            loaderRef.current.open();
        } else {
            loaderRef.current.close();
        }
    }, [loading]);

  if (isLogged) {
    return <Navigate to="/dashboard" replace />;
  }

    return (
        <>
        <LoaderDialog ref={loaderRef} />
        <Outlet />
        </>
    ) ;
}

export default PublicRoute;
