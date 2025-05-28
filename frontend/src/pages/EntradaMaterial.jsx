import { useEffect, useState } from "react";
import { useAuth } from "../store/AuthContext";
import { toast } from "react-toastify";

export default function EntradaMaterial({ fecharModal, atualizarEstoque }) {
  const { userData } = useAuth();
  const token = userData?.token;

  const [materials, setMaterials] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);

  const [materialSelecionado, setMaterialSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [preco, setPreco] = useState("");

  useEffect(() => {
    fetchMaterials();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !materialSelecionado ||
      materialSelecionado == 0 ||
      !quantidade ||
      !preco
    )
      return;

    const novaMovimentacao = {
      materialId: Number(materialSelecionado),
      quantidade: parseFloat(quantidade),
      preco: parseFloat(preco),
    };

    const todasMovimentacoes = [...movimentacoes, novaMovimentacao];

    try {
      const response = await fetch("http://localhost:8080/api/entradas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(todasMovimentacoes),
      });

      if (!response.ok) {
        toast.error("Erro ao enviar dados das movimentações!");
        throw new Error("Erro ao enviar dados das movimentações!");
      }

      toast.success("Material registrado com sucesso!");

      setMovimentacoes([]);
      setMaterialSelecionado("");
      setQuantidade("");
      setPreco("");
      atualizarEstoque();
      fecharModal();
    } catch (error) {
      toast.error(error.message || "Erro ao enviar dados das movimentações!");
    }
  };

  async function fetchMaterials() {
    if (!token) return;

    try {
      const response = await fetch("http://localhost:8080/api/materiais", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar dados dos materiais!");
      }

      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      toast.error(error.message || "Erro ao carregar dados dos materiais!");
    }
  }

  const inputsEmpty =
    !materialSelecionado || materialSelecionado == 0 || !quantidade || !preco || quantidade <= 0 || preco <= 0;
  const handleAddMovimentacao = () => {
    if (inputsEmpty) return;

    // const material = materials.find(m => m.id === parseInt(materialSelecionado));

    const novaMovimentacao = {
      materialId: Number(materialSelecionado),
      quantidade: parseFloat(quantidade),
      preco: parseFloat(preco),
    };

    setMovimentacoes([...movimentacoes, novaMovimentacao]);

    setMaterialSelecionado("");
    setQuantidade("");
    setPreco("");
  };

  const removerMovimentacao = (index) => {
    const novasMovimentacoes = movimentacoes.filter((_, i) => i !== index);
    setMovimentacoes(novasMovimentacoes);
  };

  const handleCancel = () => {
    setMovimentacoes([]);
    setMaterialSelecionado("");
    setQuantidade("");
    setPreco("");
    fecharModal();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-blue-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-white">
          Registrar Entrada de Material
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        {movimentacoes.length > 0 && (
          <div className="overflow-x-auto border border-gray-300 rounded-md p-4 bg-white">
            <h2 className="text-lg font-semibold mb-2">
              Movimentações adicionadas:
            </h2>
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-3 py-2">Material</th>
                  <th className="px-3 py-2 text-right">Quantidade</th>
                  <th className="px-3 py-2 text-right">Preço (R$)</th>
                </tr>
              </thead>
              <tbody>
                {movimentacoes.map((mov, index) => {
                  const material = materials.find(
                    (m) => m.id === parseInt(mov.materialId)
                  );
                  return (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-2">
                        {material?.nome || "Desconhecido"}{" "}
                        {material?.unidade || "-"}
                      </td>
                      <td className="px-3 py-2 text-right">{mov.quantidade}</td>
                      <td className="px-3 py-2 text-right">
                        {" "}
                        {mov.preco.toFixed(2).replace(".", ",")}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700 font-bold cursor-pointer"
                          onClick={() => removerMovimentacao(index)}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="form-label">Material</label>

            <select
              className="input-field bg-gray-100 mt-3 rounded drop-shadow-md"
              required
              value={materialSelecionado}
              onChange={(e) => setMaterialSelecionado(e.target.value)}
            >
              <option value="">Selecione um material</option>
              {materials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.nome} ({material.unidade})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <div>
              <label className="form-label">Quantidade</label>
              <input
                type="number"
                className="input-field bg-gray-100 rounded text-right w-full mt-3 drop-shadow-md"
                placeholder="0"
                min={0}
                value={quantidade}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || Number(value) >= 0) setQuantidade(value);
                }}
                required
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div>
              <label className="form-label">Preço Unitário (R$)</label>

              <input
                type="number"
                step="any"
                min={0}
                className="input-field bg-gray-100 gray-100 rounded text-right w-full mt-3 drop-shadow-md"
                placeholder="0.0"
                value={preco}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || Number(value) >= 0) setPreco(value);
                }}
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end my-4">
          <button
            type="button"
            disabled={inputsEmpty}
            onClick={handleAddMovimentacao}
            className={
              (inputsEmpty
                ? "text-blue-300"
                : "text-blue-600 hover:text-blue-800 cursor-pointer") +
              " font-medium"
            }
          >
            + Adicionar mais uma movimentação
          </button>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 cursor-pointer rounded px-4 py-2 text-white"
            onClick={handleCancel}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer rounded px-4 py-2 text-white"
          >
            Registrar
          </button>
        </div>
      </form>
    </div>
  );
}
