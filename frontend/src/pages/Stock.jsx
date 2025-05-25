import { useEffect, useRef, useState } from "react";
import { useAuth } from "../store/AuthContext";
import { toast } from "react-toastify";
import { Minus, Plus } from "lucide-react";
import FormulariosModal from "../components/FormulariosModal";
import SaidaMaterial from "./SaidaMaterial";
import EntradaMaterial from "./EntradaMaterial";

export default function Stock() {
  const { userData } = useAuth();
  const token = userData?.token;
  const [stock, setStock] = useState([]);
  const [total, setTotal] = useState(0);

  async function fetchStock() {
    if (!token) return;

    try {
      const response = await fetch("http://localhost:8080/api/estoques", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar dados dos materiais!");
      }

      const data = await response.json();

      const totalValue = data.reduce((acc, item) => acc + item.valorTotal, 0);
      setStock(data);
      setTotal(totalValue);
    } catch (error) {
      toast.error(error.message || "Erro ao carregar dados dos materiais!");
    }
  }

  useEffect(() => {
    fetchStock();
  }, [token]);


  const modalRefEntrada = useRef();
  const modalRefSaida = useRef();

  const abrirModalEntrada = () => {
    modalRefEntrada.current?.open();
  };

  const fecharModalEntrada = () => {
    modalRefEntrada.current?.close();
  };

  const abrirModalSaida = () => {
    modalRefSaida.current?.open();
  };

  const fecharModalSaida = () => {
    modalRefSaida.current?.close();
  };

  return (
    <>
      <div className="py-7">
        <FormulariosModal
          ref={modalRefEntrada}
          fecharModal={fecharModalEntrada}
        >
          <EntradaMaterial fecharModal={fecharModalEntrada} />
        </FormulariosModal>
      </div>
      <div className="py-7">
        <FormulariosModal ref={modalRefSaida} fecharModal={fecharModalSaida}>
          <SaidaMaterial fecharModal={fecharModalSaida} />
        </FormulariosModal>
      </div>
      <main className="flex flex-col min-h-screen mx-auto items-center px-8 pt-26">
        <section className="w-full min-w-[300px] px-10">
          <div className="flex flex-col md:flex-row justify-between my-8">
            <h1 className="font-semibold text-2xl">Controle de Estoque</h1>
            <div className="flex gap-2 mt-2">
              <button onClick={abrirModalEntrada} className="flex gap-2 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-700">
                <Plus /> Adicionar Entrada
              </button>
              <button onClick={abrirModalSaida} className="flex gap-2 p-3 bg-red-500 text-white rounded-md hover:bg-red-700">
                <Minus /> Adicionar Saída
              </button>
            </div>
          </div>
          <div className="p-7 bg-white w-full rounded-sm drop-shadow-xl space-y-3">
            <h2 className="font-semibold">Resumo do Estoque</h2>
            <p className="font-bold text-xl">
              Valor Total: R$ {total.toFixed(2)}
            </p>
          </div>

          <div className="bg-white py-2 mt-5 drop-shadow-xl mx-auto rounded-lg ">
            <h1 className="px-4 py-1 text-md font-semibold">Saldo Atual</h1>
            <table className="w-full mt-4 border-separate border-spacing-0 overflow-hidden bg-zinc-100">
              <thead>
                <tr className="text-zinc-400 text-sm">
                  <th className="p-3 text-left font-medium w-50">Material</th>
                  <th className="p-3 text-end font-medium ">Quantidade</th>
                  <th className="hidden sm:table-cell p-3 text-left font-medium">
                    Unidade
                  </th>
                  <th className="p-3 text-end font-medium">Preço Médio</th>
                  <th className="p-3 text-end font-medium">Valor Total</th>
                </tr>
              </thead>
              <tbody>
                {stock.length > 0 ? (
                  stock.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : ""
                      } hover:bg-gray-100 transition-colors text-sm`}
                    >
                      <td className="p-3 text-gray-800">
                        {item.material.nome}
                      </td>
                      <td className="p-3 text-end text-gray-800">
                        {item.quantidade.toFixed(2)}
                      </td>
                      <td className="hidden sm:table-cell p-3 text-gray-800">
                        {item.material.unidade}
                      </td>
                      <td className="p-3 text-end text-gray-800">
                        R$ {item.precoMedio.toFixed(2)}
                      </td>
                      <td className="p-3 text-end text-gray-800">
                        R$ {item.valorTotal.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-3 text-center text-gray-500 bg-white"
                    >
                      Nenhum item no estoque.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <p className="p-2 text-end font-semibold text-sm">
              Valor Total: R$ {total.toFixed(2)}
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
