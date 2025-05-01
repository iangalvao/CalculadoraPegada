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
    const selected = answers.secundary_transport;
    const navigate = useNavigate();

    useEffect(() => {
        socket.on('barcode_scanned', (data) => add_value('secundary_transport', data.code));
        return () => socket.off('barcode_scanned');
    }, [update]);

    return (
        <div className="border-4 border-[rgb(80,255,40)] flex flex-col h-[85vh] w-[93vw] bg-[#5163b8] text-white">
            <Header />
            <TabsPanel categories={categories} current="TRANSPORTE" />
            <MiddleContent
                prompt="E quais outros meios de transporte você utiliza? Aponte o leitor!"
                selected={selected}
                onClear={(item) => remove_value('secundary_transport', item)}
            />
            <FooterButtons
                selected={selected}
                onBack={() => navigate(-1)}
                onSkip={() => {
                    update('secundary_transport', []);
                    navigate('/appliances');
                }}
                onConfirm={() => selected && navigate('/appliances')}
            />
        </div>
    );
}
