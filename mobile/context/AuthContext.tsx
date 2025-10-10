import * as SecureStore from "expo-secure-store";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { loginFunction } from "@/http";

interface UserSession {
  token: string;
  tipo: string;
  nome: string;
  id: number;
  role: string;
  empresaId: number;
  empresaNome: string;
}

interface SignInResult {
  success: boolean;
  data?: UserSession;
  error?: string;
}
interface AuthContextType {
  isLoading: boolean;
  signIn: (email: string, senha: string) => Promise<SignInResult>;
  signOut: () => void;
  session: UserSession | null;
}

const AuthContext = createContext<AuthContextType>({
  isLoading: false,
  signIn: async () => Promise.resolve({ success: false, error: "Contexto não provido" }),
  signOut: () => { },
  session: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userSessionString: string | null;
      try {
        userSessionString = await SecureStore.getItemAsync("userSession");
        if (userSessionString) {
          setSession(JSON.parse(userSessionString));
        }
      } catch (e) {
        console.warn("Erro ao restaurar a sessão: ", e);
      }
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  const signIn = async (
    email: string,
    senha: string
  ): Promise<SignInResult> => {
    const response = await loginFunction(email, senha);
    if (response.success && response.data) {
      const userSessionData = response.data;
      setSession(userSessionData);
      await SecureStore.setItemAsync(
        "userSession",
        JSON.stringify(userSessionData)
      );
      return { success: true, data: userSessionData };
    } else {
      return { success: false, error: response.error };
    }
  };

  const signOut = async () => {
    setSession(null);
    await SecureStore.deleteItemAsync("userSession");
  };


  return (
    <AuthContext.Provider value={{ isLoading, signIn, signOut, session }}>
      {children}
    </AuthContext.Provider>
  );
};