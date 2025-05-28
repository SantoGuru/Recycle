import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../store/AuthContext";
import { Link } from 'react-router-dom';
import FormulariosModal from "../components/FormulariosModal";
import EntradaMaterial from "./EntradaMaterial";
import SaidaMaterial from "./SaidaMaterial";
import converterParaReal from "../helpers/convert-real";

export default function Dashboard() {
  const { userData } = useAuth();
  const token = userData?.token;

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

  const [totalMateriais, setTotalMateriais] = useState();
  const [quantidadeTotalKg, setQuantidadeTotalKg] = useState();
  const [valorTotal, setValorTotal] = useState();
  const [materiaisComEstoqueBaixo, setMateriaisComEstoqueBaixo] = useState([]);


  const carregarDados = async () => {
    try {
      const response = await
        fetch("http://localhost:8080/api/dashboard/resumo", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })
      const data = await response.json();

      setTotalMateriais(data.totalMateriais);
      setQuantidadeTotalKg(data.quantidadeTotalKg);
      setValorTotal(data.valorTotalEstoque);
      setMateriaisComEstoqueBaixo(data.materiaisComEstoqueBaixo);

    } catch {
      console.log('Falha ao carregar dados');
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <div className="mx-auto container px-8 pt-26 m-5">
      <div className="mb-8">
        <h1 className="text-3xl font-bold py-2 text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo ao sistema de controle de estoque</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center max-w-screen">
        <div className="bg-white rounded drop-shadow-md w-2/3 md:w-full p-4">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-gray-900">Total de Materiais</h2>
            <p className="mt-2 text-md font-bold text-gray-700">{totalMateriais}</p>
            <Link to="/materials" className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-700">
              Ver todos →</Link>
          </div>
        </div>

        <div className="bg-white rounded drop-shadow-md  w-2/3 md:w-full p-4">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-gray-900">Valor Total em Estoque</h2>
            <p className="mt-2 text-md font-bold text-gray-700">
              {valorTotal !== undefined ? `R$ ${converterParaReal(valorTotal)}` : "Erro ao carregar"}
            </p>
            <Link to="/stock" className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-700">
              Ver todos →</Link>
          </div>
        </div>

        <div className="bg-white rounded drop-shadow-md w-2/3 md:w-full p-4">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-gray-900">Itens em Baixa</h2>
            <p className="mt-2 text-md font-bold text-gray-700">{materiaisComEstoqueBaixo}</p>
            <Link to="/stock" className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-700">
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
            <EntradaMaterial fecharModal={fecharModalEntrada} atualizarEstoque={carregarDados} />
          </FormulariosModal>
        </div>

        <button onClick={abrirModalSaida} className="flex items-center justify-center">
          <div className="flex justify-center items-center w-64 text-white p-5 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors">
            <h3 className="text-lg font-semibold ">Registrar Saída</h3>
          </div>
        </button>

        <div className="py-7">
          <FormulariosModal ref={modalRefSaida} fecharModal={fecharModalSaida}>
            <SaidaMaterial fecharModal={fecharModalSaida} atualizarEstoque={carregarDados}/>
          </FormulariosModal>
        </div>
      </div>
    </div>
  );
}
