import { useEffect, useRef, useState } from "react";
import FormulariosModal from "../components/FormulariosModal";
import NewMaterial from "../components/ui/NewMaterialModal";
import { useAuth } from "../store/AuthContext";
import { toast } from "react-toastify";
import EditMaterial from "../components/ui/EditMaterial";

export default function Materials() {
  const { userData } = useAuth();
  const token = userData?.token;
  
  const [materials, setMaterials] = useState([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const editMaterialModal = useRef();

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

  useEffect(() => {
    fetchMaterials();
  }, [token]);
  const newMaterialModal = useRef();

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

  }

  const fecharModalEditar = () => {
    editMaterialModal.current?.close();
    setSelectedMaterialId(null);
    fetchMaterials();
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

      <main className="flex flex-col min-h-screen mx-auto mt-20 items-center px-8 py-4 ">
        <section className="w-full max-w-5xl min-w-[300px] px-10">
          <div className="flex flex-col md:flex-row justify-between">
            <h1 className="font-semibold text-2xl">Materiais</h1>
            <button
              onClick={abrirModal}
              className="p-3 bg-blue-500 text-white rounded-md hover:bg-blue-700"
            >
              Adicionar Material
            </button>
          </div>
          <table className="w-full max-w-5xl min-w-[300px] mt-5 drop-shadow-md mx-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">Nome</th>
                <th className="p-3 text-left">Descrição</th>
                <th className="p-3 text-left">Unidade</th>
                <th className="p-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {materials.length > 0 ? (
                materials.map((material) => (
                  <tr key={material.id} className="bg-white ">
                    <td className="p-3">{material.nome}</td>
                    <td className="p-3">{material.descricao}</td>
                    <td className="p-3">{material.unidade}</td>
                    <td className="flex flex-col sm:flex-row p-3 text-start gap-2">
                      <button className=" px-2 py-1 rounded-sm bg-blue-500 text-white hover:bg-blue-700" onClick={() => abrirModalEditar(material.id)}>
                        Editar
                      </button>
                      <button className="px-2 py-1 rounded-sm bg-red-500 text-white hover:bg-red-700">
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-3 text-center">
                    Nenhum material encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
}
