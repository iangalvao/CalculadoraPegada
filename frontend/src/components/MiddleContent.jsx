export default function MiddleContent({ prompt, selected, onClear }) {
    const isArray = Array.isArray(selected);

    return (
        <div className="flex-grow m-2 flex flex-col gap-4 items-center justify-center">
            <h2 className="text-3xl font-bold text-center max-w-3xl">{prompt}</h2>

            {selected && (
                isArray ? (
                    <div className="flex flex-wrap justify-center gap-4 mb-4">
                        {selected.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => onClear(item)}
                                className="flex items-center justify-between space-x-4 px-6 py-3 rounded-xl"
                                style={{ backgroundColor: 'rgb(80,255,40)', color: 'rgb(81,94,b8)' }}
                            >
                                <span className="text-2xl font-bold">{item}</span>
                                <span className="text-2xl font-bold">×</span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <button
                        onClick={onClear}
                        className="flex items-center justify-between space-x-4 px-6 py-3 rounded-xl mx-auto mb-8"
                        style={{ backgroundColor: 'rgb(80,255,40)', color: 'rgb(81,94,b8)' }}
                    >
                        <span className="text-2xl font-bold">{selected}</span>
                        <span className="text-2xl font-bold">×</span>
                    </button>
                )
            )}
        </div>
    );
}
