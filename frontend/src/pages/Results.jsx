// Results.jsx
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useCalc } from '../context/CalculatorContext';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ResultsPage() {
  const { answers } = useCalc();       // answers comes from your form context
  const [result, setResult] = useState(null);   // { total_tCO2, elec_tCO2, ... }
  const [error, setError] = useState(null);

  /* ------------------------------------------------------------------ */
  /* 1. Hit backend as soon as answers are ready                         */
  useEffect(() => {
    if (!answers) return;              // wait until questionnaire is filled
    const payload = {
      estado: answers.estado,
      transporte: answers.transporte,
      secundary_transport: answers.secundary_transport,
      appliances: answers.appliances,
      food: answers.food,
      secundary_food: answers.secundary_food

      // add the rest of the fields you mapped in seeg_calc_lo.py
    };

    fetch('http://10.50.4.159:5174/footprint', {   // ← or :8080 if you skip proxy
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(r => r.ok ? r.json() : r.text().then(t => { throw new Error(t); }))
      .then(data => setResult(data))
      .catch(err => setError(err.message));
  }, [answers]);
  /* ------------------------------------------------------------------ */

  /* 2. Prepare dynamic values for UI                                   */
  const total = result?.total_tCO2?.toFixed(1) ?? '...';
  const elec = result?.elec_tCO2 ?? 0;
  const graphData = {
    labels: ['Você', 'Média', 'Melhor', 'Pior', 'Meta 2030'],
    datasets: [{
      label: 'TonCO₂/ano',
      data: [result?.total_tCO2 ?? 0, 10, 2, 100, 1.5],
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

  /* 3. Render                                                         */
  return (
    <div className="flex flex-col h-screen w-screen bg-[#5864a3] text-white p-4">
      {/* Headline */}
      <div className="h-1/3 w-full border-2 border-green-500 flex items-center justify-center text-4xl font-bold">
        {error
          ? <>ERRO: {error}</>
          : <>VOCÊ EMITE AO MENOS&nbsp;{total}&nbsp;TONELADAS DE CO₂ EM UM ANO</>
        }
      </div>

      {/* Bottom half */}
      <div className="h-2/3 w-full flex">
        {/* Chart */}
        <div className="w-1/2 border-2 border-green-500 p-4">
          <Bar data={graphData} options={graphOptions} />
        </div>

        {/* Details & QR placeholder */}
        <div className="w-1/2 border-2 border-green-500 p-4 flex flex-col">
          <div className="flex-grow flex">
            <div className="w-3/4 p-4 text-lg space-y-4">
              <h2 className="text-4xl font-bold">PARA SABER MAIS:</h2>
              <p className="text-2xl">
                <strong>Eletricidade:</strong> {elec.toFixed(2)} t CO₂/ano vindo da conta de luz
              </p>
              {/* add more breakdowns */}
            </div>
            <div className="w-1/4 flex items-center justify-center">
              <p className="text-2xl">QRCODE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
