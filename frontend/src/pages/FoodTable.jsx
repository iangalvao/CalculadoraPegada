import React, { useEffect, useState } from 'react';
import socket from '../socket';

// Proteins allowed via barcode
const VALID_PROTEINS = ['CARNE DE BOI', 'CARNE DE PORCO', 'FRANGO', 'PEIXE', 'SOJA', 'OVO', 'TOFU', 'FEIJÃO', 'LENTILHA', 'TWIX', 'KITKAT', 'TABACO', 'SEDA', 'FILTRO'];

const daysOfWeek = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo',
];


const initialTable = daysOfWeek.map(() => ({ breakfast: [], mainMeals: [] }));

export default function WeeklyProteinTable() {
    const [table, setTable] = useState(initialTable);
    const [currentDay, setCurrentDay] = useState(0);
    const [currentMeal, setCurrentMeal] = useState('breakfast');

    useEffect(() => {
        socket.on('barcode_scanned', ({ code }) => {
            if (VALID_PROTEINS.includes(code)) {
                setTable((prev) => {
                    const updated = [...prev];
                    updated[currentDay][currentMeal] = [...new Set([...updated[currentDay][currentMeal], code])];
                    return updated;
                });
            }
        });
        return () => socket.off('barcode_scanned');
    }, [currentDay, currentMeal]);

    const removeItem = (dayIdx, mealType, item) => {
        setTable((prev) => {
            const updated = [...prev];
            updated[dayIdx][mealType] = updated[dayIdx][mealType].filter((i) => i !== item);
            return updated;
        });
    };

    const renderItems = (items, dayIdx, mealType) => {
        const count = items.length;

        if (count === 0) return null;
        if (count === 1) {
            return (
                <div className="flex justify-center items-center h-full">
                    <span
                        className="bg-[rgb(81,99,184)] text-white px-2 py-1 rounded-full cursor-pointer text-xs"
                        onClick={() => removeItem(dayIdx, mealType, items[0])}
                    >
                        {items[0]} ✕
                    </span>
                </div>
            );
        }
        if (count === 2) {
            return (
                <div className="flex justify-center items-center h-full gap-2">
                    {items.slice(0, 2).map((item) => (
                        <span
                            key={item}
                            className="bg-[rgb(81,99,184)] text-white px-2 py-1 rounded-full cursor-pointer text-xs"
                            onClick={() => removeItem(dayIdx, mealType, item)}
                        >
                            {item} ✕
                        </span>
                    ))}
                </div>
            );
        }
        return (
            <div className="w-full h-full flex justify-center items-center">
                <div className="grid grid-cols-2 grid-rows-2 gap-2">
                    {items.slice(0, 4).map((item) => (
                        <span
                            key={item}
                            className="bg-[rgb(81,99,184)] text-white px-2 py-1 text-center rounded-full cursor-pointer text-xs"
                            onClick={() => removeItem(dayIdx, mealType, item)}
                        >
                            {item} ✕
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-[#5163b8] text-white min-h-screen px-4 py-6">
            <h1 className="text-3xl font-bold mb-2">Monte seu cardápio de proteínas da semana</h1>
            <p className="text-md mb-6">Escaneie os alimentos proteicos que você consumiu em cada refeição.</p>

            <div className="overflow-x-auto h-[70vh]">
                <table className="table-auto border-collapse w-full h-full">
                    <thead>
                        <tr>
                            <th className="border border-[rgb(80,255,40)] p-2">Dia</th>
                            <th className="border border-[rgb(80,255,40)] p-2">Café da Manhã</th>
                            <th className="border border-[rgb(80,255,40)] p-2">Almoço & Jantar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {daysOfWeek.map((day, idx) => (
                            <tr key={day} className="h-[10%]">
                                <td className="border border-[rgb(80,255,40)] p-2 font-bold align-top">{day}</td>

                                <td className={`border border-[rgb(80,255,40)] p-2 align-top ${idx === currentDay && currentMeal === 'breakfast' ? 'bg-[rgb(80,255,40)] text-black' : ''}`}>
                                    {renderItems(table[idx].breakfast, idx, 'breakfast')}
                                </td>

                                <td className={`border border-[rgb(80,255,40)] p-2 align-top ${idx === currentDay && currentMeal === 'mainMeals' ? 'bg-[rgb(80,255,40)] text-black' : ''}`}>
                                    {renderItems(table[idx].mainMeals, idx, 'mainMeals')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex gap-4 items-center">
                <label htmlFor="day" className="text-lg">Selecionar dia:</label>
                <select
                    id="day"
                    value={currentDay}
                    onChange={(e) => setCurrentDay(parseInt(e.target.value))}
                    className="text-black rounded p-1"
                >
                    {daysOfWeek.map((d, i) => (
                        <option key={d} value={i}>{d}</option>
                    ))}
                </select>

                <label htmlFor="meal" className="text-lg ml-4">Refeição:</label>
                <select
                    id="meal"
                    value={currentMeal}
                    onChange={(e) => setCurrentMeal(e.target.value)}
                    className="text-black rounded p-1"
                >
                    <option value="breakfast">Café da Manhã</option>
                    <option value="mainMeals">Almoço & Jantar</option>
                </select>
            </div>
        </div>
    );
}
