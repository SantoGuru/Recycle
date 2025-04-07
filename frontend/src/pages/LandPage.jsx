import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

export default function LandPage() {
  const navigate = useNavigate();
  const { isLogged, loading } = useAuth();

  useEffect(() => {
    if (!loading && isLogged) {
      navigate("/dashboard");
    }
  }, [loading, isLogged]);

  return (
    <div className="mx-auto container px-8 py-4 m-5">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold py-2 text-gray-900">LANDPAGE</h1>
        <p className="text-gray-600 text-lg">Gerencie o seu estoque</p>
      </div>

      <div className="grid grid-cols-2 gap-6 text-center">
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900">
            Controle de Estoque
          </h2>
          <p className="mt-2 text-gray-600">
            Registre entradas e saídas de materiais recicláveis.
          </p>
        </div>
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900">
            Relatórios Detalhados
          </h2>
          <p className="mt-2 text-gray-600">
            Acompanhe o desempenho do seu estoque.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6">
        <Link
          to="/Login"
          className="flex items-center justify-center p-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <h3 className="text-lg font-semibold">Fazer Login</h3>
        </Link>
        <Link
          to="/Signup"
          className="flex items-center justify-center p-6 bg-blue-100 text-blue-900 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <h3 className="text-lg font-semibold">Criar Conta</h3>
        </Link>
      </div>
    </div>
  );
}
