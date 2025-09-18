import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { loginFunction } from "@/http";

interface TokenDto {
  token: string;
  nome: string;
  id: number;
}

interface SignInResult {
  success: boolean;
  data?: TokenDto;
  error?: string;
}

interface AuthContextType {
  isLoading: boolean;
  signIn: (email: string, senha: string) => Promise<SignInResult>;
  signOut: () => void;
  userToken: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isLoading: false,
  signIn: async (email: string, senha: string) => {
    return Promise.resolve({
      success: false,
      data: { token: "", nome: "", id: 0 },
      error: "",
    });
  },
  signOut: () => {},
  userToken: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const signIn = async (
    email: string,
    senha: string
  ): Promise<SignInResult> => {
    const response = await loginFunction(email, senha);
    if (response.success && response.data) {
      const { token, nome, id } = response.data;
      setUserToken(token);
      return { success: true, data: { token, nome, id } };
    } else {
      return { success: false, error: response.error };
    }
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
