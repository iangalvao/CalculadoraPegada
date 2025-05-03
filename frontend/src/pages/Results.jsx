import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useCalc } from '../context/CalculatorContext';
// import { QRCode } from 'qrcode.react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Dummy calculation
const calculateTotal = (answers) => {
    return 42; // substitua com lógica real depois
};

export default function ResultsPage() {
    const { answers } = useCalc();
    const total = calculateTotal(answers);

    // Gráfico dummy
    const graphData = {
        labels: ['Você', 'Média', 'Melhor', 'Pior', 'Meta 2030'],
        datasets: [
            {
                label: 'TonCO₂/ano',
                data: [42, 10, 2, 100, 1.5],
                backgroundColor: '#00ff90',
            },
        ],
    };

    const graphOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Comparativo de Emissões' },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { color: 'white' },
                grid: { color: '#444' }
            },
            x: {
                ticks: { color: 'white' },
                grid: { color: '#444' }
            },
        }
    };

    return (
        <div className="flex flex-col h-screen w-screen bg-[#5864a3] text-white p-4">
            {/* Resultado principal */}
            <div className="h-1/3 w-full border-2 border-green-500 flex items-center justify-center text-4xl font-bold">
                VOCÊ EMITE AO MENOS {total} TONELADAS DE CO₂ EM UM ANO
            </div>

            {/* Parte inferior */}
            <div className="h-2/3 w-full flex">
                {/* Gráfico */}
                <div className="w-1/2 border-2 border-green-500 p-4">
                    <Bar data={graphData} options={graphOptions} />
                </div>

                {/* Detalhamento + QR Code */}
                <div className="w-1/2 border-2 border-green-500 p-4 flex flex-col">
                    <div className="flex-grow flex">
                        <div className="w-3/4 p-4 text-lg space-y-4">
                            <h2 className="text-4xl font-bold">PARA SABER MAIS:</h2>
                            <p className='text-2xl'><strong>Transporte:</strong>CADA LITRO DE GASOLINA USADO NO SEU CARRO EMITE 3.2KG DE CO2</p>
                            <p className='text-2xl'><strong>Alimentação:</strong> CADA QUILO DE CARNE BOVINA EMITE 1.7KG DE CO2</p>
                            {/* Adicione mais detalhes aqui */}
                        </div>
                        <div className="w-1/4 flex items-center justify-center">
                            <p className='text-2xl'>QRCODE</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
