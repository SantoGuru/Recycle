import { API_URL } from "./config";

export const loginFunction = async (
  email: string,
  senha: string
): Promise<{ success: boolean; data?: any; error?: string }> => {

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.message || 'Email ou senha inválidos' };
    }
  } catch (err) {
    return { success: false, error: 'Não foi possível conectar ao servidor' };
  }
};


