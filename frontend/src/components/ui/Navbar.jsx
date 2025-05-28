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
    navigate("/");
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-[100%] flex justify-between items-center bg-blue-500 drop-shadow-xl py-1 px-5">
      {isLogged ? (
        <>
          <ul className="flex items-center gap-7 mr-5">
            <Link className="my-2" to={isLogged ? "/dashboard" : "/"}>
              <span className="text-3xl text-white drop-shadow-[3px_3px_6px_rgba(0,0,0,0.6)]">
                Recycle
              </span>
            </Link>

            <Link to="/materials">
              <li className="text-lg text-white drop-shadow-[3px_3px_6px_rgba(0,0,0,0.3)]">
                Materiais
              </li>
            </Link>
            <Link to="/stock">
              <li className="text-lg text-white drop-shadow-[3px_3px_6px_rgba(0,0,0,0.3)]">
                Estoque
              </li>
            </Link>
          </ul>
          <button
            onClick={handleLogout}
            className="mr-5 bg-gray-100 text-blue-500 hover:bg-gray-300 px-3 py-1 rounded drop-shadow-md"
          >
            Sair
          </button>
        </>
      ) : (
        <>
          <Link to="/">
            <span className="text-3xl text-white drop-shadow-[3px_3px_6px_rgba(0,0,0,0.6)]">
              Recycle
            </span>
          </Link>
          <ul className="flex items-center gap-3 mr-5">
            {!currentOnLogin && (
              <Link className="align-middle" to="/login">
                <li className="click text-zinc-50 hover:text-zinc-300">
                  Login
                </li>
              </Link>
            )}
            {!currentOnSignup && (
              <Link className="align-middle" to="signup">
                <li className="click bg-gray-100 text-blue-500 hover:bg-gray-300 px-2 py-1 rounded shadow-md">
                  Registrar
                </li>
              </Link>
            )}
          </ul>
        </>
      )}
    </div>
  );
}
