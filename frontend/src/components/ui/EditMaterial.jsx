import { useEffect, useState } from "react";
import Input from "../Input";
import { toast } from "react-toastify";
import { useAuth } from "../../store/AuthContext";

export default function EditMaterial({ fecharModal, materialId }) {
  const { userData } = useAuth();
  const token = userData?.token;

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    unidade: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (materialId) {
      async function fetchMaterial() {
        try {
          const response = await fetch(
            `http://localhost:8080/api/materiais/${materialId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Erro ao buscar dados do material.");
          }

          const data = await response.json();
          setFormData({
            nome: data.nome || "",
            descricao: data.descricao || "",
            unidade: data.unidade || "",
          });
        } catch (error) {
          toast.error(error.message || "Erro ao buscar dados do material.");
        }
      }

      fetchMaterial();
    }
  }, [materialId, token]);

  function handleFormChange(e) {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.nome || !formData.descricao || !formData.unidade) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/materiais/${materialId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao editar material.");
      }

      toast.success("Material editado com sucesso!");
      fecharModal();
    } catch (error) {
      toast.error(error.message || "Erro ao editar material.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-blue-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-white">Editar Material</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <Input
          label="Nome"
          id="nome"
          type="text"
          maxLength="25"
          value={formData.nome}
          onChange={handleFormChange}
        />
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="descricao"
        >
          Descrição
        </label>
        <textarea
          id="descricao"
          name="descricao"
          value={formData.descricao}
          maxLength={100}
          onChange={handleFormChange}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="unidade"
        >
          Unidade
        </label>
        <select
          id="unidade"
          name="unidade"
          value={formData.unidade}
          onChange={handleFormChange}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="kg">kg</option>
          <option value="g">g</option>
          <option value="un">un</option>
          <option value="l">l</option>
          <option value="ml">ml</option>
        </select>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 cursor-pointer rounded px-4 py-2 text-white"
            onClick={fecharModal}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer rounded px-4 py-2 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
