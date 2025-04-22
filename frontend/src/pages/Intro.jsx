import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// export default function Intro() {
//   const nav = useNavigate();
//   return (
//     <motion.div
//       className="text-center space-y-8 max-w-lg"
//       initial={{ opacity: 0, y: 40 }}
//       animate={{ opacity: 1, y: 0 }}
//     >
//       <h1 className="text-4xl font-bold leading-tight">
//         Pegada de Carbono:<br/>
//         Quanto você emite sem perceber?
//       </h1>
//       <p className="text-lg">
//         Produzir e transportar o que consumimos tem um custo para o planeta:
//         a emissão de gases do efeito estufa. <br/><br/>
//         Descubra o impacto do seu estilo de vida estimando sua pegada de carbono!
//       </p>
//       <button
//         onClick={() => nav('/Intro')}
//         className="bg-white text-primary font-semibold rounded-2xl px-8 py-4 shadow-lg hover:scale-105 transition">
//         TOQUE AQUI PARA COMEÇAR
//       </button>
//     </motion.div>
//   );
// }

import React from 'react';

export default function Intro() {
  const nav = useNavigate();
  return (
    <div className="flex h-screen w-screen bg-[#5163b8] text-white p-4">
      {/* LEFT SIDE */}
      <div className="flex flex-col w-1/2 ml-8 mt-12 mb-12">
        {/* Top-left */}
        <div className="border-2 border-[rgb(80,255,40)] p-6 flex items-center h-1/3 justify-left">
          <div>
            {/* The text in this div should be centralized vertically and left-aligned */}
            <h1 className="text-6xl font-extrabold ml-10">PEGADA DE CARBONO:</h1>
            <h2 className="text-6xl font-semibold ml-10">QUANTO VOCÊ EMITE<br></br> SEM PERCEBER?</h2>
          </div>
        </div>
        {/* Bottom-left. This should have a good margin for the text. */}

        <div className="border-2 border-[rgb(80,255,40)] p-6 h-2/3 flex items-center justify-center">
          <div className="text-4xl font-medium space-y-10 m ml-10 mr-10">
            <p>
              Produzir e transportar o que consumimos tem um custo para o planeta: a emissão de gases do efeito estufa.
            </p>
            <p>
              Descubra o impacto do seu estilo de vida estimando sua pegada de carbono!
            </p>
            <p>
              Basta seguir as instruções na tela e usar o leitor de códigos para escolher os itens que você consome.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col w-1/2 mr-8 mt-12 mb-12">
        {/* Top-right */}
        <div className="border-2 border-[rgb(80,255,40)] flex justify-center items-center h-1/3">
          <img src="/logo.png" alt="Logo Energia SouWatt" className="max-h-48" />
        </div>
        {/* Bottom-right */}
        <div className="border-2 border-[rgb(80,255,40)] flex justify-center items-center h-2/3">
          <button 
            onClick={() => nav('/state')} 
            className="text-white font-semibold underline text-4xl hover:text-green-300">
            TOQUE AQUI PARA COMEÇAR
          </button>
        </div>
      </div>
    </div>
  );
}
