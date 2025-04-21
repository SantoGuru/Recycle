import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";

export default function Navbar() {
  const { isLogged, logout } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();

  const currentOnLogin = location.pathname === "/login";
  const currentOnSignup = location.pathname === "/signup";

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  return (
    <div className="flex justify-between items-center bg-blue-500 p-1">
      <Link className="my-2" to="/">
        <span className="text-3xl text-white drop-shadow-[3px_3px_6px_rgba(0,0,0,0.6)]">
          Recycle
        </span>
      </Link>
      <ul className="flex gap-3 mr-5">
        {!currentOnLogin && !isLogged && (
          <Link className="align-middle" to="/login">
            <li className="click bg-gray-100 text-blue-500 hover:bg-gray-300 p-2 rounded shadow-md">
              Login
            </li>
          </Link>
        )}
        {!currentOnSignup && !isLogged && (
          <Link className="align-middle" to="signup">
            <li className="click bg-gray-100 text-blue-500 hover:bg-gray-300 p-2 rounded shadow-md">
              Registrar
            </li>
          </Link>
        )}
        {isLogged && (
          <button onClick={handleLogout}>
            <li className="click bg-gray-100 text-blue-500 hover:bg-gray-300 p-2 rounded drop-shadow-md">
              Sair
            </li>
          </button>
        )}
      </ul>
    </div>
  );
}
