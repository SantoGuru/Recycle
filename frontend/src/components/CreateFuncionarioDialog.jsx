import { useState } from "react";
import { useAuth } from "../store/AuthContext";

export default function CreateFuncionarioDialog({ open, onClose, onSuccess }) {
  if (!open) return null;

  const { userData } = useAuth();
  const token = userData?.token;

  function validarSenha(senha) {
    if (senha.length < 6) {
      return "A senha deve ter pelo menos 6 caracteres.";
    }
    if (!/[0-9]/.test(senha)) {
      return "A senha deve conter ao menos um número.";
    }
    if (!/[A-Z]/.test(senha)) {

    }
    if (!/[a-z]/.test(senha)) {
      return "A senha deve conter ao menos uma letra minúscula.";
    }
    return null;
  }

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

  const handleSubmit = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      setMensagem("Preencha todos os campos.");
      setTipoMensagem("error");
      return;
    }

    const erroSenha = validarSenha(senha);
    if (erroSenha) {
      setMensagem(erroSenha);
      setTipoMensagem("error");
      return;
    }

    if (senha !== confirmarSenha) {
      setMensagem("As senhas não coincidem.");
      setTipoMensagem("error");
      return;
    }

    setLoading(true);
    setMensagem("");
    setTipoMensagem("");

    try {
      const response = await fetch(
        `http://localhost:8080/api/usuarios/funcionarios`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nome, email, senha }),
        }
      );

      if (response.ok) {
        setMensagem("Funcionário cadastrado com sucesso!");
        setTipoMensagem("success");

        if (onSuccess) onSuccess();

        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setMensagem("Erro ao cadastrar funcionário.");
        setTipoMensagem("error");
      }
    } catch (err) {
      setMensagem("Não foi possível conectar ao servidor.");
      setTipoMensagem("error");
    }

    setLoading(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Cadastrar Funcionário</h2>

        <input
          className="modal-input"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          className="modal-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="modal-input"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <input
          type="password"
          className="modal-input"
          placeholder="Confirmar Senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
        />

        {mensagem && (
          <p
            className={
              tipoMensagem === "success"
                ? "modal-message success"
                : "modal-message error"
            }
          >
            {mensagem}
          </p>
        )}

        <div className="modal-actions">
          <button
            className="bg-tertiary hover:bg-tertiary-hover p-2 rounded-lg text-white transition"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="bg-primary hover:bg-primary-hover p-2 rounded-lg text-white transition"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Cadastrar"}
          </button>
        </div>
      </div>
    </div>
  );
}