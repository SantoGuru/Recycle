import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EntradaMaterial({ fecharModal }) {
  const navigate = useNavigate();

  const [materiais, setMateriais] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);

  const [materialSelecionado, setMaterialSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [preco, setPreco] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Movimentações:", movimentacoes);
  };

  const handleAddMovimentacao = () => {
    if (!materialSelecionado || !quantidade || !preco) return;

    const material = materiais.find(
      (m) => m.id === parseInt(materialSelecionado)
    );

    const novaMovimentacao = {
      materialId: materialSelecionado,
      quantidade: parseFloat(quantidade),
      preco: parseFloat(preco),
    };

    setMovimentacoes([...movimentacoes, novaMovimentacao]);

    setMaterialSelecionado("");
    setQuantidade("");
    setPreco("");
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
                  const material = materiais.find(
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="form-label">Material</label>

            <select
              className="input-field bg-gray-300 mt-3 rounded"
              required
              onChange={(e) => setMaterialSelecionado(e.target.value)}
            >
              <option value={0}>Selecione um material</option>
              {materiais.map((material) => (
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
                className="input-field bg-gray-300 rounded text-right w-full mt-3"
                placeholder="0"
                onChange={(e) => setQuantidade(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div>
              <label className="form-label">Preço Unitário (R$)</label>

              <input
                type="number"
                className="input-field bg-gray-300 gray-300 rounded text-right w-full mt-3"
                placeholder="0.0"
                onChange={(e) => setPreco(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end my-4">
          <button
            type="button"
            onClick={handleAddMovimentacao}
            className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium"
          >
            + Adicionar mais uma movimentação
          </button>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 cursor-pointer rounded px-4 py-2 text-white"
            onClick={fecharModal}
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
