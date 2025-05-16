import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalc } from '../context/CalculatorContext';

const states = [
  "Acre", "Espírito Santo", "Paraíba", "Rondônia",
  "Alagoas", "Goiás", "Paraná", "Roraima",
  "Amapá", "Maranhão", "Pernambuco", "Santa Catarina",
  "Amazonas", "Mato Grosso", "Piauí", "São Paulo",
  "Bahia", "Mato Grosso do Sul", "Rio de Janeiro", "Sergipe",
  "Ceará", "Minas Gerais", "Rio Grande do Norte", "Tocantins",
  "Distrito Federal", "Pará", "Rio Grande do Sul", ""
];

export default function SelectState() {
  const { answers, update, resetAnswers } = useCalc();
  const selectedState = answers.state;
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen w-screen bg-[#5163b8] text-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center border-2 border-[rgb(80,255,40)] p-2">
        <img src="/logo.png" alt="Logo" className="h-16" />
        <h1 className="text-4xl font-extrabold text-center w-full -ml-16">
          SELECIONE O ESTADO EM QUE VOCÊ MORA
        </h1>
      </div>

      {/* Grid of states */}
      <div className="grid grid-cols-4 grid-rows-7 gap-px flex-grow border-2 border-[rgb(80,255,40)] m-2  max-h-[70vh] overflow-y-auto">
        {states.map((state, index) => (
          <div
            key={index}
            onClick={() => update('state', state)}
            className={`border border-[rgb(80,255,40)] flex items-center justify-center text-2xl font-medium cursor-pointer 
              ${selectedState === state ? 'bg-[rgb(80,255,40)] font-bold' : 'hover:bg-[rgb(80,255,40)] p-2'}`}
          >
            {state}
          </div>
        ))}
      </div>

      {/* Bottom buttons */}
      <div className="grid grid-cols-3 border-2 border-[rgb(80,255,40)] text-center text-white text-2xl font-bold mt-2">
        <div
          className="border border-[rgb(80,255,40)] py-4 hover:bg-[rgb(80,255,40)] cursor-pointer"
          onClick={() => {
            resetAnswers();
            navigate("/");
          }}
          
        >
          RECOMEÇAR
        </div>
        <div
          className="border border-[rgb(80,255,40)] py-4 hover:bg-[rgb(80,255,40)] cursor-pointer"
          onClick={() => {
            update('state', null);
            navigate('/transport'); // skip logic
          }}
        >
          PULAR
        </div>
        <div
          className={`border border-[rgb(80,255,40)] py-4 ${
            selectedState ? 'hover:bg-[rgb(80,255,40)] cursor-pointer' : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={() => {
            if (selectedState) navigate('/transport');
          }}
        >
          CONFIRMAR
        </div>
      </div>
    </div>
  );
}
