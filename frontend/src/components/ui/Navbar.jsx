import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";

export default function Navbar() {
  const { userData, isLogged, logout } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();

  const currentOnLogin = location.pathname === "/login";
  const currentOnSignup = location.pathname === "/signup";

  const role = userData?.role;
  const isGerente = role === "GERENTE";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-[100%] flex justify-between items-center bg-primary drop-shadow-xl py-1 px-5">
      {isLogged ? (
        <>
          <ul className="flex items-center gap-7 mr-5">
            <Link className="my-2" to={isLogged ? "/dashboard" : "/"}>
              <span className="text-3xl text-white drop-shadow-[3px_3px_6px_rgba(0,0,0,0.6)]">
                Recycle
              </span>
            </Link>

            {isGerente && (
              <Link to="/materials">
                <li className="text-lg text-white drop-shadow-[3px_3px_6px_rgba(0,0,0,0.3)]">
                  Materiais
                </li>
              </Link>
            )}
            <Link to="/stock">
              <li className="text-lg text-white drop-shadow-[3px_3px_6px_rgba(0,0,0,0.3)]">
                Estoque
              </li>
            </Link>
            {isGerente && (
              <Link to="/employees">
                <li className="text-lg text-white drop-shadow-[3px_3px_6px_rgba(0,0,0,0.3)]">
                  Funcionários
                </li>
              </Link>
            )}
          </ul>
          <button
            onClick={handleLogout}
            className="cursor-pointer mr-5 bg-gray-100 hover:bg-gray-300 px-3 py-1 rounded drop-shadow-md"
          >
            Sair
          </button>
        </>
      ) : (
        <>
          <Link to="/">
            <span className="cursor-pointer text-3xl text-on-primary drop-shadow-[3px_3px_6px_rgba(0,0,0,0.6)]">
              Recycle
            </span>
          </Link>
          <ul className="flex items-center gap-3 mr-5">
            {!currentOnLogin && (
              <Link className="align-middle" to="/login">
                <li className="click text-on-primary hover:text-on-primary-hover">
                  Login
                </li>
              </Link>
            )}
            {!currentOnSignup && (
              <Link className="align-middle" to="signup">
                <li className="click bg-surface text-on-surface hover:bg-surface-hover px-2 py-1 rounded shadow-md">
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
