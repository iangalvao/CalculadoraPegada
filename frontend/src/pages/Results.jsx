import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useCalc } from '../context/CalculatorContext';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ResultsPage() {
  const { answers, resetAnswers } = useCalc();

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // <-- for navigation

  useEffect(() => {
    if (!answers) return;

    const payload = {
      estado: answers.estado,
      transporte: answers.transporte,
      secundary_transport: answers.secundary_transport,
      appliances: answers.appliances,
      food: answers.food,
      secundary_food: answers.secundary_food
    };

    fetch('http://10.50.4.159:5174/footprint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(r => r.ok ? r.json() : r.text().then(t => { throw new Error(t); }))
      .then(data => setResult(data))
      .catch(err => setError(err.message));
  }, [answers]);
  const total = result?.total_tCO2?.toFixed(1) ?? '...';

  const graphData = {
    labels: ['Você', 'Média', 'Meta 2030'],
    datasets: [{
      label: 'TonCO₂/ano',
      data: [result?.total_tCO2 ?? 0, 10, 1.5],
      backgroundColor: '#00ff90',
    }],
  };
  
  const graphOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Comparativo de Emissões' },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: 'white' }, grid: { color: '#444' } },
      x: { ticks: { color: 'white' }, grid: { color: '#444' } }
    }
  };
  const handleRestart = () => {
    resetAnswers();
    navigate("/");
  };
  return (
    <div className="flex flex-col h-screen w-screen bg-[#5864a3] text-white p-4">
      <div className="h-1/3 w-full border-2 border-green-500 flex items-center justify-center text-4xl font-bold">
        {error
          ? <>ERRO: {error}</>
          : <>VOCÊ EMITE AO MENOS&nbsp;{total}&nbsp;TONELADAS DE CO₂ EM UM ANO</>
        }
      </div>

      <div className="h-2/3 w-full flex">
        <div className="w-1/2 border-2 border-green-500 p-4">
          <Bar data={graphData} options={graphOptions} />
        </div>

        <div className="w-1/2 border-2 border-green-500 p-4 flex flex-row">
          <div className="flex-grow flex">
            <div className="w-3/4 flex items-center justify-center">
              <img src="/public/seeg.png" alt="SEEG Logo" className="w-full h-auto" />
            </div>
                  <div className="mt-4 flex justify-center">
        <button 
          onClick={handleRestart}
          className="text-white px-6 py-2 rounded-xl text-xl shadow-lg"
        >
          REINICIAR
        </button>
      </div>
          </div>
        </div>
      </div>

      {/* Reiniciar button */}

    </div>
  );
}
