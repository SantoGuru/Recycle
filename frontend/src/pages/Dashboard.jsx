import React, { useRef } from "react";
import { Link } from 'react-router-dom';
import FormulariosModal from "../components/FormulariosModal";
import EntradaMaterial from "./EntradaMaterial";
import SaidaMaterial from "./SaidaMaterial";

export default function Dashboard() {

  // Modal
  const modalRefEntrada = useRef();
  const modalRefSaida = useRef();

  // Funções para abrir e fechar o modal
  const abrirModalEntrada = () => {
    modalRefEntrada.current?.open();
  };

  const fecharModalEntrada = () => {
    modalRefEntrada.current?.close();
  };

  const abrirModalSaida = () => {
    modalRefSaida.current?.open();
  };

  const fecharModalSaida = () => {
    modalRefSaida.current?.close();
  };

  return (
    <div className="mx-auto container px-8 py-4 m-5">
      <div className="mb-8">
        <h1 className="text-3xl font-bold py-2 text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo ao sistema de controle de estoque</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center max-w-screen">
        <div className="bg-white rounded drop-shadow-md w-2/3 md:w-full p-4">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-gray-900">Total de Materiais</h2>
            <p className="mt-2 text-md font-bold text-gray-700">{"materiais.length"}</p>
            <Link to="/" className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-700">
              Ver todos →</Link>
          </div>
        </div>

        <div className="bg-white rounded drop-shadow-md  w-2/3 md:w-full p-4">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-gray-900">Valor Total em Estoque</h2>
            <p className="mt-2 text-md font-bold text-gray-700">{" R$ Saldo"}</p>
            <Link to="/" className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-700">
              Ver todos →</Link>
          </div>
        </div>

        <div className="bg-white rounded drop-shadow-md w-2/3 md:w-full p-4">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-gray-900">Itens em Baixa</h2>
            <p className="mt-2 text-md font-bold text-gray-700">{"Items filtro com saldo < 10"}</p>
            <Link to="/" className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-700">
              Ver todos →</Link>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col md:flex-row gap-3 md:justify-end mx-auto">
        <button onClick={abrirModalEntrada} className="flex items-center justify-center">
          <div className="flex justify-center items-center w-64 text-white p-5 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors">
            <h3 className="text-lg font-semibold  ">Registrar Entrada</h3>
          </div>
        </button>

        <div className="py-7">
          <FormulariosModal ref={modalRefEntrada} fecharModal={fecharModalEntrada}>
            <EntradaMaterial fecharModal={fecharModalEntrada} />
          </FormulariosModal>
        </div>

        <button onClick={abrirModalSaida} className="flex items-center justify-center">
          <div className="flex justify-center items-center w-64 text-white p-5 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors">
            <h3 className="text-lg font-semibold ">Registrar Saída</h3>
          </div>
        </button>

        <div className="py-7">
          <FormulariosModal ref={modalRefSaida} fecharModal={fecharModalSaida}>
            <SaidaMaterial fecharModal={fecharModalSaida} />
          </FormulariosModal>
        </div>
      </div>
    </div>
  );
}
