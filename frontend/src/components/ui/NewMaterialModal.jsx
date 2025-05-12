import { useState } from "react";
import Input from "../Input";
import { toast } from "react-toastify";
import { useAuth } from "../../store/AuthContext";

export default function NewMaterial({ fecharModal }) {
  const { userData } = useAuth();
  const token = userData?.token;

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    unidade: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const response = await fetch("http://localhost:8080/api/materiais", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao registrar material.");
      }

      toast.success("Material registrado com sucesso!");
      fecharModal();
    } catch (error) {
      toast.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-blue-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-white">
          Registrar Novo Material
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <Input label="Nome" id="nome" type="text" onChange={handleFormChange} />
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="descricao"
        >
          Descrição
        </label>
        <textarea
          id="descricao"
          name="descricao"
          onChange={handleFormChange}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <Input
          label="Unidade"
          id="unidade"
          type="text"
          onChange={handleFormChange}
        />

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
            {isSubmitting ? "Adicionando..." : "Adicionar"}
          </button>
        </div>
      </form>
    </div>
  );
}
