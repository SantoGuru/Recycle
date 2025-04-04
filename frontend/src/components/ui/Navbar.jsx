import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const currentOnLogin = location.pathname === "/login";
  const currentOnSignup = location.pathname === "/signup";

  return (
    <div className="flex justify-between bg-blue-600 p-3">
      <Link className="my-2" to="/">
        <span className="text-3xl p-3 bg-blue-300 rounded text-white">
          Recycle
        </span>
      </Link>
      <ul className="flex gap-3 mr-5">
        {!currentOnLogin && (
          <Link className="align-middle" to="/login">
            <li className="click bg-gray-100 text-blue-500 hover:bg-gray-300 p-3 rounded outline-blue-500 outline-1">
              Login
            </li>
          </Link>
        )}
        {!currentOnSignup && (
          <Link className="align-middle" to="signup">
            <li className="click bg-gray-100 text-blue-500 hover:bg-gray-300 p-3 rounded outline-blue-500 outline-1">
              Registrar
            </li>
          </Link>
        )}
      </ul>
    </div>
  );
}
