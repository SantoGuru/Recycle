/**
 * @typedef {Object} UserSession
 * @property {string} token
 * @property {string} tipo
 * @property {string} nome
 * @property {number} id
 * @property {string} role
 * @property {number} empresaId
 * @property {string} empresaNome
 */

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

const AuthContext = createContext({
  userData: {},
  login: () => {},
  logout: () => {},
  loading: true,
  isLogged: false,
});

function authReducer(state, action) {
  if (action.type === "LOGIN") {
    localStorage.setItem("user", JSON.stringify(action.userData));
    return {
      ...state,
      userData: action.userData,
      isLogged: true,
    };
  }
  if (action.type === "LOGOUT") {
    localStorage.removeItem("user");

    return {
      ...state,
      userData: {},
      isLogged: false,
    };
  }
}

export function AuthContextProvider({ children }) {
  const [user, dispatchUserAction] = useReducer(authReducer, {
    userData: {},
    isLogged: false,
  });
  const [loading, setLoading] = useState(true);

  function login(userData) {
    dispatchUserAction({
      type: "LOGIN",
      userData,
    });
  }

  function logout() {
    dispatchUserAction({
      type: "LOGOUT",
    });
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatchUserAction({
        type: "LOGIN",
        userData: JSON.parse(storedUser),
      });
    }
    setLoading(false);
  }, []);

  const userCtx = {
    userData: user.userData,
    login,
    logout,
    loading,
    isLogged: user.isLogged,
  };

  return (
    <AuthContext.Provider value={userCtx}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
