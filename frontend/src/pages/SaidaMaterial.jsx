import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../store/AuthContext";
import { toast } from "react-toastify";



export default function SaidaMaterial({ fecharModal, atualizarEstoque }) {
  const navigate = useNavigate();

  const { userData } = useAuth();
  const token = userData?.token;

  const [materials, setMaterials] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);

  const [materialSelecionado, setMaterialSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState("");



  useEffect(() => {
    fetchMaterials();
  }, [token]);

  async function fetchMaterials() {
    if (!token) return;

    try {
      const response = await fetch("http://localhost:8080/api/materiais", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Movimentações:", movimentacoes);

    if (!materialSelecionado || !quantidade) return;

    const material = materials.find(m => m.id === parseInt(materialSelecionado));

    if (!materialSelecionado || materialSelecionado == 0 || !quantidade) return;

    const novaMovimentacao = {
      materialId: Number(materialSelecionado),
      quantidade: parseFloat(quantidade),
    };

    const todasMovimentacoes = [...movimentacoes, novaMovimentacao];

    console.log("Movimentações:", todasMovimentacoes);

    try {
      const response = await fetch("http://localhost:8080/api/saidas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(todasMovimentacoes)
      });

      if (!response.ok) {
        toast.error("Erro ao enviar dados das movimentações!");
        throw new Error("Erro ao enviar dados das movimentações!");
      }

      toast.success("Material retirado com sucesso!");

      setMovimentacoes([]);
      setMaterialSelecionado("");
      setQuantidade("");
      atualizarEstoque();

    } catch (error) {
      toast.error(error.message || "Erro ao enviar dados das movimentações!");
    }
  };


  const handleAddMovimentacao = () => {
    if (!materialSelecionado || !quantidade) return;

    const material = materials.find(m => m.id === parseInt(materialSelecionado));

    const novaMovimentacao = {
      materialId: materialSelecionado,
      quantidade: parseFloat(quantidade),
    };

    setMovimentacoes([...movimentacoes, novaMovimentacao]);

    setMaterialSelecionado("");
    setQuantidade("");
  };

  const handleCancel = () => {
    setMovimentacoes([]);
    setMaterialSelecionado("");
    setQuantidade("");
    fecharModal(); // fecha o modal após limpar
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-blue-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-white">Registrar Saída de Material</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">

        {movimentacoes.length > 0 && (
          <div className="overflow-x-auto border border-gray-300 rounded-md p-4 bg-white">
            <h2 className="text-lg font-semibold mb-2">Movimentações adicionadas:</h2>
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-3 py-2">Material</th>
                  <th className="px-3 py-2 text-right">Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {movimentacoes.map((mov, index) => {
                  const material = materials.find(m => m.id === parseInt(mov.materialId));
                  return (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-2">{material?.nome || 'Desconhecido'} {material?.unidade || '-'}</td>
                      <td className="px-3 py-2 text-right">{mov.quantidade}</td>
                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        )}


        <div className="grid grid-cols-2 gap-4">

          <div className='flex flex-col'>

            <label className="form-label">
              Material
            </label>

            <select className="input-field bg-gray-300 mt-3 rounded"
              required
              value={materialSelecionado}
              onChange={(e) => setMaterialSelecionado(e.target.value)}>
              <option value={0}>Selecione um material</option>
              {materials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.nome} ({material.unidade})
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col'>

            <div>
              <label className="form-label">
                Quantidade
              </label>
              <input
                type="number"
                className="input-field bg-gray-300 rounded text-right w-full mt-3"
                placeholder="0"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
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
          <button type="button" className="bg-red-500 hover:bg-red-600 cursor-pointer rounded px-4 py-2 text-white" onClick={handleCancel}>
            Cancelar
          </button>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 cursor-pointer rounded px-4 py-2 text-white">
            Registrar
          </button>
        </div>

      </form>
    </div>
  );
};
