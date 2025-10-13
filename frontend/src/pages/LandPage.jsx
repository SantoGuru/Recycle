import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { ClipboardMinus, ScrollText, Smartphone } from "lucide-react";
import mockup from "../assets/mockup-iphone-recycle.png";

export default function LandPage() {
  const navigate = useNavigate();
  const { isLogged, loading } = useAuth();

  useEffect(() => {
    if (!loading && isLogged) {
      navigate("/dashboard");
    }
  }, [loading, isLogged]);

  return (
    <div className="w-full mt-10">
      <main className="flex min-h-screen mx-auto justify-center items-center px-4 py-8">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl">
          <div className="flex flex-col items-start justify-center gap-5">
            <h1 className="text-5xl font-bold text-zinc-900">
              Controle o Seu Estoque
            </h1>
            <p className="text-lg text-zinc-700 max-w-xl leading-relaxed">
              Gerencie entradas, saídas e níveis de materiais com praticidade e
              agilidade.
              <span className="font-semibold text-primary"> Otimize</span> o
              controle,
              <span className="font-semibold text-primary"> evite</span>{" "}
              desperdícios e tome decisões com mais
              <span className="font-semibold text-primary"> segurança</span>.
            </p>

            <div className="flex items-center gap-4 mt-4">
              <Link
                to="/Signup"
                className="flex items-center justify-center px-6 py-3 bg-primary text-on-primary rounded-lg hover:bg-primary-hover transition-colors shadow-lg"
              >
                <span className="text-lg font-semibold">Criar Conta Grátis</span>
              </Link>
              <Link
                to="/Login"
                className="flex items-center justify-center px-6 py-3 bg-transparent text-primary border-2 border-primary rounded-lg hover:bg-primary/10 transition-colors"
              >
                <span className="text-lg font-semibold">Fazer Login</span>
              </Link>
            </div>
          </div>
          <img src={mockup} alt="mockup" className="w-full max-w-xl mx-auto" />
        </section>
      </main>

      <section className="w-full bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Tudo que você precisa em um só lugar</h2>
            <p className="text-lg text-zinc-600 mb-12 max-w-3xl mx-auto">Nossa plataforma oferece as ferramentas essenciais para uma gestão de estoque eficiente e sem complicações.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="flex flex-col text-center items-center bg-white rounded-lg drop-shadow-md p-8">
                    <div className="bg-primary/10 p-3 rounded-full mb-4">
                        <ScrollText className="text-primary" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Controle de Estoque
                    </h3>
                    <p className="text-gray-600">
                        Registre entradas e saídas de materiais de forma intuitiva e rápida.
                    </p>
                </div>
                <div className="flex flex-col text-center items-center bg-white rounded-lg drop-shadow-md p-8">
                    <div className="bg-primary/10 p-3 rounded-full mb-4">
                        <ClipboardMinus className="text-primary" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Relatórios Detalhados
                    </h3>
                    <p className="text-gray-600">
                        Acompanhe o desempenho do seu estoque com dados claros e tome decisões informadas.
                    </p>
                </div>
                <div className="flex flex-col text-center items-center bg-white rounded-lg drop-shadow-md p-8">
                    <div className="bg-primary/10 p-3 rounded-full mb-4">
                        <Smartphone className="text-primary" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Acesso Múltiplaforma
                    </h3>
                    <p className="text-gray-600">
                        Gerencie seu estoque de qualquer lugar com nosso aplicativo para celular.
                    </p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}