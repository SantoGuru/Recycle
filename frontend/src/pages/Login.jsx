import { Form, Link } from "react-router-dom";
import Input from "../components/Input";

export default function Login() {
  return (
    <section className="flex flex-col justify-center items-center h-screen bg-slate-100">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Bem-vindo de volta!
      </h1>
      <p className="text-gray-600">Acesse sua conta com suas credenciais</p>

      <div className="bg-white rounded-lg shadow-xl p-8 md:w-2xl mt-4">
        {/* Formulario, mover para outro componente futuramente */}
        <Form method="POST" className="space-y-6">
          {/* Input: label e input juntos para facilitar replicação*/}
          <Input
            required
            label="E-mail"
            name="email"
            id="email"
            placeholder="Digite seu e-mail..."
            type="email"
          />

          <Input
            required
            label="Senha"
            name="password"
            id="password"
            type="password"
            placeholder="Digite sua nova senha..."
          />
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Entrar
          </button>
        </Form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Não tem uma conta?
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              to="/"
              className="w-full flex justify-center py-2 px-4 border-1 border-blue-600 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-sm transition-colors duration-300"
            >
              Criar Conta
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
