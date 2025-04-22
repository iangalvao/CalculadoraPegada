import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalc } from '../context/CalculatorContext';
import socket from '../socket';
const categories = ['TRANSPORTE', 'ELETRODOMÉSTICOS', 'ALIMENTAÇÃO'];

export default function TransportScan() {
  const { answers, update } = useCalc();
  const selected = answers.transport;
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('barcode_scanned', (data) => {
      // aqui você pode validar o dado se quiser
      update('transport', data.code);
      console.log('Barcode scanned:', data);
    });

    return () => socket.off('barcode_scanned');
  }, [update]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#5163b8] text-white p-4">
      {/* Header */}
      <div className="border-2 border-[rgb(80,255,40)] p-4">
        <div className="flex justify-between items-center mb-4">
          <img src="/logo.png" alt="Logo" className="h-16" />
        </div>
        {/* Tabs */}
        <div className="grid grid-cols-3 w-3/5 border border-[rgb(80,255,40)] h-64  mx-auto">
          {categories.map((cat) => (
            <div
              key={cat}
              className={`text-center text-xl font-semibold py-6 border-r border-[rgb(80,255,40)] last:border-r-0 justify-center items-center flex
                ${cat === 'TRANSPORTE' ? 'bg-[rgb(80,255,40)] text-[#5163b8]' : ''}`}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>

      {/* Middle content */}
      <div className="flex-grow border-2 border-[rgb(80,255,40)] m-2 flex items-center justify-center">
        <h2 className="text-3xl font-bold text-center max-w-3xl">
          Aponte o leitor para seu principal meio de transporte
        </h2>
        {selected && (
        <button
          onClick={() => update('transport', null)}
          className="flex items-center justify-between space-x-4 px-6 py-3 rounded-xl mx-auto mb-8"
          style={{
            backgroundColor: 'rgb(80,255,40)',
            color: '#5163b8',
          }}
        >
          <span className="text-2xl font-bold">{selected}</span>
          <span className="text-2xl font-bold">×</span>
        </button>
      )}

      </div>

      {/* Footer buttons */}
      <div className="grid grid-cols-3 border-2 border-[rgb(80,255,40)] text-center text-white text-2xl font-bold mt-2">
        <div
          className="border border-[rgb(80,255,40)] py-4 hover:bg-[rgb(80,255,40)] cursor-pointer"
          onClick={() => navigate(-1)}
        >
          VOLTAR
        </div>
        <div
          className="border border-[rgb(80,255,40)] py-4 hover:bg-[rgb(80,255,40)] cursor-pointer"
          onClick={() => {
            update('transport', null);
            navigate('/transport_secundary'); 
          }}
        >
          PULAR
        </div>
        <div
          className={`border border-[rgb(80,255,40)] py-4 ${
            selected ? 'hover:bg-[rgb(80,255,40)] cursor-pointer' : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={() => {
            if (selected) navigate('/transport_secundary');
          }}
        >
          CONFIRMAR
        </div>
      </div>
    </div>
  );
}
