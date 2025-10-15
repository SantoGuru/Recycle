// LoaderDialog.tsx
const LoaderDialog = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl flex flex-col items-center gap-4 shadow-lg">
        <div className="w-12 h-12 border-4 border-primary border-dotted rounded-full animate-spin"></div>
        <p className="text-lg font-medium">Carregando...</p>
      </div>
    </div>
  );
};

export default LoaderDialog;
