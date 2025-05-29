import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalc } from '../context/CalculatorContext';
import socket from '../socket';
import Header from '../components/Header';
import TabsPanel from '../components/TabsPanel';
import MiddleContent from '../components/MiddleContent';
import FooterButtons from '../components/FooterButtons';

const categories = ['TRANSPORTE', 'ELETRODOMÉSTICOS', 'ALIMENTAÇÃO'];

// ✅ Only allow valid secondary food codes
const VALID_FOODS = ['CARNE DE BOI', 'CARNE DE PORCO', 'FRANGO', 'PEIXE', 'SOJA', 'SALADA', 'KITKAT', 'ARROZ', 'FEIJÃO', 'LEGUMES', 'FRUTAS'];

export default function SecundaryTransportScan() {
    const { answers, update, add_value, remove_value } = useCalc();
    const selected = answers.secundary_food;
    const navigate = useNavigate();

    useEffect(() => {
        socket.on('barcode_scanned', (data) => {
            if (VALID_FOODS.includes(data.code)) {
                add_value('secundary_food', data.code);
            } else {
                console.warn(`Código de alimento inválido: ${data.code}`);
            }
        });
        return () => socket.off('barcode_scanned');
    }, [add_value]);

    return (
        <div className="border-4 border-[rgb(80,255,40)] flex flex-col h-[85vh] w-[93vw] bg-[#5163b8] text-white">
            <Header />
            <TabsPanel categories={categories} current="ALIMENTAÇÃO" />
            <MiddleContent
                prompt="E quais outros alimentos fazem parte do seu prato? Aponte o leitor!"
                selected={selected}
                onClear={(item) => remove_value('secundary_food', item)}
            />
            <FooterButtons
                selected={selected}
                onBack={() => navigate(-1)}
                onSkip={() => {
                    update('secundary_food', []);
                    navigate('/results');
                }}
                onConfirm={() => selected && navigate('/results')}
            />
        </div>
    );
}
