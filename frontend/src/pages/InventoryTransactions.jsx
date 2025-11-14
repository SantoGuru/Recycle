import { useEffect, useState } from "react";
import { useAuth } from "../store/AuthContext";
import { toast } from "react-toastify";
import TransactionsTable from "../components/TransactionsTable";

export default function InventoryTransactions() {
  const { userData } = useAuth();
  const token = userData?.token;

  const [movimentos, setMovimentos] = useState([]);

  async function fetchMovimentos() {
    if (!token) return;

    try {
      const entradasReq = fetch("http://localhost:8080/api/entradas", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const saídasReq = fetch("http://localhost:8080/api/saidas", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const [entradasRes, saídasRes] = await Promise.all([
        entradasReq,
        saídasReq,
      ]);

      if (!entradasRes.ok || !saídasRes.ok) {
        throw new Error("Erro ao carregar movimentos");
      }

      const entradas = entradasRes.status !== 204 ? await entradasRes.json() : [];
      const saídas = saídasRes.status !== 204 ? await saídasRes.json() : [];

      const entradasFormatadas = entradas.map((e) => ({
        id: e.id,
        tipo: "ENTRADA",
        materialNome: e.materialNome,
        quantidade: e.quantidade,
        data: e.data,
        usuarioNome: e.usuarioNome,
      }));

      const saídasFormatadas = saídas.map((s) => ({
        id: s.id,
        tipo: "SAÍDA",
        materialNome: s.materialNome,
        quantidade: s.quantidade,
        data: s.data,
        usuarioNome: s.usuarioNome,
      }));

      const unidos = [...entradasFormatadas, ...saídasFormatadas].sort(
        (a, b) => new Date(b.data) - new Date(a.data)
      );

      setMovimentos(unidos);
    } catch (err) {
      toast.error(err.message || "Erro ao carregar histórico");
    }
  }

  useEffect(() => {
    fetchMovimentos();
  }, [token]);

  return (
    <main className="flex flex-col min-h-screen mx-auto items-center px-8 pt-20">
      <section className="w-full min-w-[300px] px-10">
        <h1 className="font-semibold text-2xl my-6">Histórico de Movimentações</h1>

        <div className="bg-white p-7 rounded-md drop-shadow-xl">
          <TransactionsTable movimentos={movimentos} />
        </div>
      </section>
    </main>
  );
}
