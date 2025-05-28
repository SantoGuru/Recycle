export default function ConfirmMaterialDelete({ onConfirm, onCancel }) {
  return (
    <div className="p-3 flex flex-col items-center">
      <p className="mb-4 text-lg text-gray-700">
        Tem certeza que deseja excluir este material?
      </p>
      <div className="flex gap-4">
        <button
          className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
          onClick={onConfirm}
        >
          Confirmar
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}