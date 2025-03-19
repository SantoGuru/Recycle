import { useState } from "react";
import { Form, Link } from "react-router-dom";
import { CircleAlert } from "lucide-react";
import { toast } from "react-toastify";

import Input from "../components/Input";
import { createAccountFunction } from "../http";

export default function Signup() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [erroSenha, setErroSenha] = useState(false);
  const [erroConfirmarSenha, setErroConfirmarSenha] = useState(false);

  const [mensagemErro, setMensagemErro] = useState("");

  const HandleSubmit = async (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      setMensagemErro("As senhas não são iguais!");
      setErroConfirmarSenha(true);
      return;
    }

    if (senha.length < 6) {
      setMensagemErro("A senha deve ter no mínimo 6 caracteres!");
      setErroSenha(true);
      return;
    }

    setErroSenha(false);
    setErroConfirmarSenha(false);
    setMensagemErro("");

    try {
      const response = await createAccountFunction({ nome, email, senha});

      if(!response.ok){
        setMensagemErro("Email já cadastrado!");
      }
    } catch (error) {
      setMensagemErro("Erro ao conectar com o servidor!");
      toast.error(`Erro: ${error.message}`, {
        icon: <CircleAlert className="stroke-red-500" />,
      });
    }
  };

  return (
    <section className="flex flex-col justify-center items-center h-screen bg-slate-100">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Criar Nova Conta
      </h1>
      <p className="text-gray-600">Preencha os dados abaixo para começar</p>

      <div className="bg-white rounded-lg shadow-xl p-8 md:w-2xl mt-4">
        {mensagemErro && (
          <div className="w-50 flex items-center justify-center justify-self-center px-4 text-red-700 border border-red-700 text-center rounded-md mb-4">
            <p className="line-clamp-2">{mensagemErro}</p>
          </div>
        )}
        
        <Form method="POST" onSubmit={HandleSubmit} className="space-y-6">
          {/* Input: label e input juntos para facilitar replicação*/}
          <Input
            required
            label="Nome"
            name="name"
            id="name"
            type="text"
            placeholder="Digite seu nome..."
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Input
            required
            label="E-mail"
            name="email"
            id="email"
            placeholder="Digite seu e-mail..."
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            required
            label="Senha"
            name="password"
            id="password"
            type="password"
            placeholder="Digite sua nova senha..."
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            erro={erroSenha}
          />

          <Input
            required
            label="Confirmar Senha"
            name="confirmPassword"
            id="confirmPassword"
            type="password"
            placeholder="Confirme sua nova senha..."
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            erro={erroConfirmarSenha}
          />
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Criar conta
          </button>
        </Form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Já possui uma conta?
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              to="/login"
              className="w-full flex justify-center py-2 px-4 border-1 border-blue-600 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-sm transition-colors duration-300"
            >
              Fazer Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
