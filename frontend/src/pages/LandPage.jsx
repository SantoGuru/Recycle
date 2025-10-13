import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { ClipboardMinus, ScrollText } from "lucide-react";

export default function LandPage() {
  const navigate = useNavigate();
  const { isLogged, loading } = useAuth();

  useEffect(() => {
    if (!loading && isLogged) {
      navigate("/dashboard");
    }
  }, [loading, isLogged]);

  return (
    <main className="flex flex-col min-h-screen mx-auto justify-center items-center px-4 py-4">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-20 mt-5 max-w-6xl">
        <div className="flex flex-col items-start justify-center gap-3">
          <h1 className="text-3xl font-semibold">Controle o Seu Estoque</h1>
          <p className="text-lg text-zinc-800 max-w-xl leading-relaxed">
            Gerencie entradas, saídas e níveis de materiais com praticidade e
            agilidade.
            <span className="font-semibold text-primary"> Otimize</span> o
            controle,
            <span className="font-semibold text-primary"> evite</span>{" "}
            desperdícios e tome decisões com mais
            <span className="font-semibold text-primary"> segurança</span>.
          </p>

          <div className="flex justify-end gap-4 mt-2">
            <Link
              to="/Login"
              className="flex items-center justify-center p-3 bg-primary text-on-primary rounded-lg hover:bg-primary-hover transition-colors"
            >
              <h3 className="text-lg font-semibold">Fazer Login</h3>
            </Link>
            <Link
              to="/Signup"
              className="flex items-center justify-center p-3 bg-light-container text-on-light-container hover:text-on-light-container-hover rounded-lg hover:bg-light-container-hover transition-colors"
            >
              <h3 className="text-lg font-semibold">Criar Conta</h3>
            </Link>
          </div>
        </div>

        <div>
          <div className="flex flex-col justify-center items-center gap-10">
            <div className="w-full flex flex-col text-center justify-between bg-white rounded drop-shadow-md p-5">
              <div className="flex flex-col items-center gap-1">
                <ScrollText />
                <h2 className="text-lg font-semibold text-gray-900">
                  Controle de Estoque
                </h2>
              </div>
              <p className="mt-2 text-gray-600">
                Registre entradas e saídas de materiais recicláveis.
              </p>
            </div>
            <div className="w-full flex flex-col text-center justify-between bg-white rounded drop-shadow-md p-5">
              <div className="flex flex-col items-center gap-1">
                <ClipboardMinus />
                <h2 className="text-lg font-semibold text-gray-900">
                  Relatórios Detalhados
                </h2>
              </div>
              <p className="mt-2 text-gray-600">
                Acompanhe o desempenho do seu estoque.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
