import { toast } from "react-toastify";
import { BadgeCheck, CircleAlert } from "lucide-react";


/**
 * 
 * @param {*} bodyData - nome, email, senha
 * @returns 
 */
export async function createAccountFunction(bodyData) {
  try {
    const response = await fetch("http://localhost:8080/api/auth/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    if (response.ok) {
      toast.success("Conta criada!", {
        icon: <BadgeCheck className="stroke-blue-500" />,
        className:
          "border-1 border-blue-600 bg-white text-blue-600 font-bold rounded-sm",
      });
    }

    return response;
  } catch (error) {
    toast.error(`Erro de rede: ${error.message}`, {
      className: "border-1 border-red-600 bg-white text-red-600 font-bold rounded-sm",
    });
    throw error;
  }
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
  
        if (response.ok) {
          toast.success("Login efetuado com sucesso!", {
            icon: <BadgeCheck className="stroke-blue-500" />,
            className:
              "border-1 border-blue-600 bg-white text-blue-600 font-bold rounded-sm",
          });
        }
        
        return response;
      } catch (error) {
        toast.error(`Erro de rede: ${error.message}`, {
          icon: <CircleAlert className="stroke-red-500" />,
          className:
            "border-1 border-red-600 bg-white text-red-600 font-bold rounded-sm",
        });
        throw error;
      }
}
