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
    const selected = answers.appliances;
    const navigate = useNavigate();

    useEffect(() => {
        socket.on('barcode_scanned', (data) => add_value('appliances', data.code));
        return () => socket.off('barcode_scanned');
    }, [update]);

    return (
        <div className="border-4 border-[rgb(80,255,40)] flex flex-col h-[85vh] w-[93vw] bg-[#5163b8] text-white">
            <Header />
            <TabsPanel categories={categories} current="ELETRODOMÉSTICOS" />
            <MiddleContent
                prompt="Quais eletrodomésticos têm em sua casa? Aponte o leitor!"
                selected={selected}
                onClear={(item) => remove_value('appliances', item)}
            />
            <FooterButtons
                selected={selected}
                onBack={() => navigate(-1)}
                onSkip={() => {
                    update('appliances', null);
                    navigate('/food');
                }}
                onConfirm={() => selected && navigate('/food')}
            />
        </div>
    );
}
