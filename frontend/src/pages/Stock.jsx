export default function Stock() {
  return (
    <main className="flex flex-col min-h-screen mx-auto mt-20 items-center px-8 py-4 ">
      <section className="w-full max-w-5xl min-w-[300px] px-10">
        <div className="flex flex-col md:flex-row justify-between">
          <h1 className="font-semibold text-2xl">Controle de Estoque</h1>
          <div className="flex gap-2">
            <button className="p-3 bg-blue-500 text-white rounded-md hover:bg-blue-700">
              Adicionar Entrada
            </button>
            <button className="p-3 bg-red-500 text-white rounded-md hover:bg-red-700">
              Adicionar Saída
            </button>
          </div>
        </div>
        <div className="mt-4 bg-white w-full h-45 rounded-sm drop-shadow-xl">
            <h2 className="font-semibold p-5">Resumo do Estoque</h2>
            <p >Valor Total: R$ 0.00</p>    
        </div>
      </section>
    </main>
  );
}
