import { useEffect, useRef, useState } from "react";
import FormulariosModal from "../../components/FormulariosModal";
import NewMaterial from "./NewMaterialModal";
import { useAuth } from "../../store/AuthContext";
import { toast } from "react-toastify";
import EditMaterial from "./EditMaterial";
import { Plus } from "lucide-react";
import ConfirmMaterialDelete from "./ConfirmMaterialDelete";

export default function Materials() {
  const { userData } = useAuth();
  const token = userData?.token;

  const [materials, setMaterials] = useState([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const editMaterialModal = useRef();
  const newMaterialModal = useRef();
  const confirmarExclusaoModal = useRef();
  
  async function fetchMaterials() {
    if (!token) return;

    try {
      const response = await fetch("http://localhost:8080/api/materiais", {
        method: "GET",
        headers: {
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

  async function deleteMaterial(materialId) {
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/materiais/${materialId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 400) {
        throw new Error ('Erro ao excluir: Material em uso!')
      }

      if (!response.ok) {
        throw new Error("Erro ao excluir material!");
      }

      toast.success("Material excluído com sucesso!");
      fetchMaterials();
    } catch (error) {
      toast.error(error.message || "Erro ao excluir material!");
    }
  }

  useEffect(() => {
    fetchMaterials();
  }, [token]);

  const fecharModal = () => {
    newMaterialModal.current?.close();
    fetchMaterials();
  };

  const abrirModal = () => {
    newMaterialModal.current?.open();
  };

  const abrirModalEditar = (materialId) => {
    setSelectedMaterialId(materialId);
    editMaterialModal.current?.open();
  };

  const fecharModalEditar = () => {
    editMaterialModal.current?.close();
    setSelectedMaterialId(null);
    fetchMaterials();
  };

  const abrirModalConfirmacao = (materialId) => {
    setSelectedMaterialId(materialId);
    confirmarExclusaoModal.current?.open();
  }

  const fecharModalConfirmacao = () => {
    confirmarExclusaoModal.current?.close();
  }
  
  const confirmarExclusao = () => {
    if (selectedMaterialId) {
      deleteMaterial(selectedMaterialId);
      setSelectedMaterialId(null);
      fecharModalConfirmacao();
    }
  }


  return (
    <>
      <FormulariosModal ref={newMaterialModal} fecharModal={fecharModal}>
        <NewMaterial fecharModal={fecharModal} />
      </FormulariosModal>

      <FormulariosModal ref={editMaterialModal} fecharModal={fecharModalEditar}>
        <EditMaterial
          fecharModal={fecharModalEditar}
          materialId={selectedMaterialId}
        />
      </FormulariosModal>
      
      <FormulariosModal ref={confirmarExclusaoModal} fecharModal={fecharModalConfirmacao}>
        <ConfirmMaterialDelete 
          onConfirm={confirmarExclusao}
          onCancel={fecharModalConfirmacao}
        />
      </FormulariosModal>

      <main className="flex flex-col min-h-screen mx-auto items-center px-8 pt-26">
        <section className="w-full max-w-5xl min-w-[300px] px-10">
          <div className="flex flex-col md:flex-row justify-between items-end">
            <h1 className="font-semibold text-2xl">Materiais</h1>
            <button
              onClick={abrirModal}
              className="flex gap-2 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-700 cursor-pointer"
            >
              <Plus />
              Adicionar Material
            </button>
          </div>
          <div>
            <table className="w-full max-w-5xl min-w-[300px] mt-5 drop-shadow-xl mx-auto border-separate border-spacing-0 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 text-left font-semibold text-gray-700">
                    Nome
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    Descrição
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    Unidade
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {materials.length > 0 ? (
                  materials.map((material, index) => (
                    <tr
                      key={material.id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100 transition-colors`}
                    >
                      <td className="p-3 text-gray-800">{material.nome}</td>
                      <td className="p-3 text-gray-800">
                        {material.descricao}
                      </td>
                      <td className="p-3 text-gray-800">{material.unidade}</td>
                      <td className="flex flex-col sm:flex-row p-3 text-start gap-2">
                        <button
                          className="px-2 py-1 rounded-sm bg-blue-500 text-white hover:bg-blue-700 cursor-pointer"
                          onClick={() => abrirModalEditar(material.id)}
                        >
                          Editar
                        </button>
                        <button
                          className="px-2 py-1 rounded-sm bg-red-500 text-white hover:bg-red-700 cursor-pointer"
                          onClick={() => abrirModalConfirmacao(material.id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-3 text-center text-gray-500 bg-white"
                    >
                      Nenhum material encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}
