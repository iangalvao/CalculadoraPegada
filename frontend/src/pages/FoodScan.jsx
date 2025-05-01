import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalc } from '../context/CalculatorContext';
import socket from '../socket';
import Header from '../components/Header';
import TabsPanel from '../components/TabsPanel';
import MiddleContent from '../components/MiddleContent';
import FooterButtons from '../components/FooterButtons';

const categories = ['TRANSPORTE', 'ELETRODOMÉSTICOS', 'ALIMENTAÇÃO'];

export default function SecundaryTransportScan() {
    const { answers, update, add_value, remove_value } = useCalc();
    const selected = answers.food;
    const navigate = useNavigate();

    useEffect(() => {
        socket.on('barcode_scanned', (data) => update('food', data.code));
        return () => socket.off('barcode_scanned');
    }, [update]);

    return (
        <div className="border-4 border-[rgb(80,255,40)] flex flex-col h-[85vh] w-[93vw] bg-[#5163b8] text-white">
            <Header />
            <TabsPanel categories={categories} current="ALIMENTAÇÃO" />
            <MiddleContent
                prompt="Qual proteína você mais come? Aponte o leitor!"
                selected={selected}
                onClear={(item) => update('food', null)}
            />
            <FooterButtons
                selected={selected}
                onBack={() => navigate(-1)}
                onSkip={() => {
                    update('food', []);
                    navigate('/food_secundary');
                }}
                onConfirm={() => selected && navigate('/food_secundary')}
            />
        </div>
    );
}
