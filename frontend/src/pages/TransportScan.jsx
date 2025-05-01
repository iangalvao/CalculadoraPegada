import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalc } from '../context/CalculatorContext';
import socket from '../socket';
import Header from '../components/Header';
import TabsPanel from '../components/TabsPanel';
import MiddleContent from '../components/MiddleContent';
import FooterButtons from '../components/FooterButtons';

const categories = ['TRANSPORTE', 'ELETRODOMÉSTICOS', 'ALIMENTAÇÃO'];

export default function TransportScan() {
  const { answers, update } = useCalc();
  const selected = answers.transport;
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('barcode_scanned', (data) => update('transport', data.code));
    return () => socket.off('barcode_scanned');
  }, [update]);

  return (
    <div className="border-4 border-[rgb(80,255,40)] flex flex-col h-[85vh] w-[93vw] bg-[#5163b8] text-white">
      <Header />
      <TabsPanel categories={categories} current="TRANSPORTE" />
      <MiddleContent
        prompt="Aponte o leitor para seu principal meio de transporte"
        selected={selected}
        onClear={() => update('transport', null)}
      />
      <FooterButtons
        selected={selected}
        onBack={() => navigate(-1)}
        onSkip={() => {
          update('transport', null);
          navigate('/transport_secundary');
        }}
        onConfirm={() => selected && navigate('/transport_secundary')}
      />
    </div>
  );
}
