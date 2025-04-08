import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export default function EntradaMaterial() {

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const navigate = useNavigate();

  const [materiais, setMateriais] = useState([]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-blue-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-white">Registrar Entrada de Material</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">

        <div className="grid grid-cols-3 gap-4">
          
          <div className='flex flex-col'>

            <label className="form-label">
              Material
            </label>

            <select className="input-field bg-gray-300 rounded" required >
              <option value={0}>Selecione um material</option>
              {materiais.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.nome} ({material.unidade})
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col'>

            <div>
              <label className="form-label">
                Quantidade
              </label>
              <input
                type="number"
                className="input-field bg-gray-300 rounded text-right w-full y-15"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className='flex flex-col'>
            <div>
              <label className="form-label">
                Preço Unitário (R$)
              </label>

              <input
                type="number"
                className="input-field bg-gray-300 rounded text-right w-full y-30"
                placeholder="0.0"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button type="button" className="bg-red-500 rounded px-4 py-2 text-white" onClick={() => navigate("/Dashboard")}>
            Cancelar
          </button>
          <button type="submit" className="bg-blue-600 rounded px-4 py-2 text-white">
            Registrar
          </button>
        </div>

      </form>
    </div>
  );
};
