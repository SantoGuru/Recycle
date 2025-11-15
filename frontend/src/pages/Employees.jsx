import { useEffect, useState } from "react";
import { useAuth } from "../store/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CreateFuncionarioDialog from "../components/CreateFuncionarioDialog";

export default function Employees() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const token = userData?.token;
  const role = userData?.role;

  if (role !== "GERENTE") {
    navigate('/dashboard')
  }

  const [openDialog, setOpenDialog] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);

  async function fetchEmployees() {
    if (!token) return;

    try {
      const response = await fetch(
        "http://localhost:8080/api/usuarios/funcionarios",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao carregar dados dos funcionários!");
      }

      const data = await response.json();

      setEmployees(data);
      setTotalEmployees(data.length);
    } catch (error) {
      toast.error(error.message || "Erro ao carregar dados dos funcionários!");
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, [token]);

  return (
    <main className="flex flex-col min-h-screen mx-auto items-center px-8 pt-26">
      <section className="w-full min-w-[300px] px-10">
        <div className="flex flex-col md:flex-row justify-between my-8">
          <h1 className="font-semibold text-2xl">Funcionários</h1>
        </div>
        <div className="flex justify-end w-full mb-4">
          <button
            className="transition cursor-pointer bg-primary text-white p-4 rounded-lg hover:bg-primary-hover"
            onClick={() => setOpenDialog(true)}
          >
            Cadastrar Funcionário
          </button>
        </div>
        <div className="p-7 bg-white w-full rounded-sm drop-shadow-xl space-y-3">
          <h2 className="font-semibold">Resumo</h2>
          <p className="font-bold text-xl">
            Total de Funcionários: {totalEmployees}
          </p>
        </div>

        <div className="bg-white py-2 mt-5 drop-shadow-xl mx-auto rounded-lg">
          <h1 className="px-4 py-1 text-md font-semibold">Lista Geral</h1>

          <table className="w-full mt-4 border-separate border-spacing-0 overflow-hidden bg-zinc-100">
            <thead>
              <tr className="text-zinc-400 text-sm">
                <th className="p-3 text-left font-medium">Nome</th>
                <th className="p-3 text-end font-medium">Entradas</th>
                <th className="p-3 text-end font-medium">Saídas</th>
              </tr>
            </thead>

            <tbody>
              {employees.length > 0 ? (
                employees.map((item, index) => (
                  <tr
                    key={item.funcionario.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : ""
                    } hover:bg-gray-100 transition-colors text-sm`}
                  >
                    <td className="p-3 text-gray-800">
                      {item.funcionario.nome}
                    </td>

                    <td className="p-3 text-end text-gray-800">
                      {item.totalEntradas}
                    </td>

                    <td className="p-3 text-end text-gray-800">
                      {item.totalSaidas}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="p-3 text-center text-gray-500 bg-white"
                  >
                    Nenhum funcionário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <p className="p-2 text-end font-semibold text-sm">
            Total: {totalEmployees}
          </p>
        </div>
      </section>
      <CreateFuncionarioDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onClose={() => setOpenDialog(false)}
        onSuccess={() => {
          fetchEmployees();
          setOpenDialog(false);
        }}
      />
    </main>
  );
}
