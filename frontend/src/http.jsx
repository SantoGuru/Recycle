import { toast } from "react-toastify";
import { BadgeCheck, CircleAlert } from "lucide-react";


/**
 * 
 * @param {*} bodyData - nome, email, senha
 * @returns 
 */
export async function createAccountFunction(bodyData) {
  const response = await fetch("http://localhost:8080/api/auth/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    return response;
}

/**
 * 
 * @param {*} bodyData -  email, senha
 * @returns - Promise[id, nome, tipo, token]
 */
export async function loginFunction(bodyData){
    try {
        const response = await fetch("http://localhost:8080/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
        });
  
    if (response.status === 400 || response.status === 401) {
      toast.error("Email ou senha incorretos!", {
        icon: <CircleAlert className="stroke-red-500" />,
        className:
          "border-1 border-red-600 bg-white text-red-600 font-bold rounded-sm",
      });
      return response;
    }

    if (!response.ok) {
      toast.error("Erro no servidor. Tente novamente mais tarde.", {
        icon: <CircleAlert className="stroke-red-500" />,
        className:
          "border-1 border-red-600 bg-white text-red-600 font-bold rounded-sm",
      });
      return response;
    }

    toast.success("Login efetuado com sucesso!", {
      icon: <BadgeCheck className="stroke-blue-500" />,
      className:
        "border-1 border-blue-600 bg-white text-blue-600 font-bold rounded-sm",
    });
    return response;

  } catch (error) {
    toast.error("Não foi possível conectar ao servidor. Verifique o backend.", {
      icon: <CircleAlert className="stroke-red-500" />,
      className:
        "border-1 border-red-600 bg-white text-red-600 font-bold rounded-sm",
    });
    throw error;
  }
}
