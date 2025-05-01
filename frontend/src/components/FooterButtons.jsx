export default function FooterButtons({ selected, onBack, onSkip, onConfirm }) {
    return (
        <div className="grid grid-cols-3 border-2 border-[rgb(80,255,40)] text-center text-white text-2xl font-bold">
            <div className="border-2 border-[rgb(80,255,40)] py-4 hover:bg-[rgb(80,255,40)] cursor-pointer" onClick={onBack}>
                VOLTAR
            </div>
            <div className="border-2 border-[rgb(80,255,40)] py-4 hover:bg-[rgb(80,255,40)] cursor-pointer" onClick={onSkip}>
                PULAR
            </div>
            <div
                className={`border-2 border-[rgb(80,255,40)] py-4 ${selected ? 'hover:bg-[rgb(80,255,40)] cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                onClick={() => selected && onConfirm()}
            >
                CONFIRMAR
            </div>
        </div>
    );
}
