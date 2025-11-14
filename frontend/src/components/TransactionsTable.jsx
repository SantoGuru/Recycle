export default function TransactionsTable({ movimentos }) {
  return (
    <table className="w-full mt-4 border-separate border-spacing-0 bg-zinc-100">
      <thead>
        <tr className="text-zinc-400 text-sm">
          <th className="p-3 text-left">Usuário</th>
          <th className="p-3 text-left">Material</th>
          <th className="p-3 text-end">Quantidade</th>
          <th className="p-3 text-left">Tipo</th>
          <th className="p-3 text-left">Data</th>
        </tr>
      </thead>

      <tbody>
        {movimentos.length > 0 ? (
          movimentos.map((mov, index) => (
            <tr
              key={`${mov.tipo}-${mov.id}`}
              className={`${index % 2 === 0 ? "bg-white" : ""} 
                hover:bg-gray-100 transition-colors text-sm`}
            >
              <td className="p-3">{mov.usuarioNome}</td>

              <td className="p-3">{mov.materialNome}</td>

              <td className="p-3 text-end">{mov.quantidade}</td>

              <td
                className={`p-3 font-semibold ${
                  mov.tipo === "ENTRADA" ? "text-green-600" : "text-red-600"
                }`}
              >
                {mov.tipo}
              </td>

              <td className="p-3">
                {new Date(mov.data).toLocaleString()}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="p-3 text-center text-gray-500 bg-white">
              Nenhuma movimentação encontrada.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
