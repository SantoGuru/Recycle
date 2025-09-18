import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isLoading: boolean;
  signIn: (token: string) => void;
  signOut: () => void;
  userToken: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isLoading: false,
  signIn: () => {},
  signOut: () => {},
  userToken: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const signIn = (token: string) => {
    setUserToken(token);
  };

  const signOut = () => {
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ isLoading, signIn, signOut, userToken }}>
      {children}
    </AuthContext.Provider>
  );
};
