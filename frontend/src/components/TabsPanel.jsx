export default function TabsPanel({ categories, current }) {
    return (
        <div className="grid grid-cols-3 w-3/5 border-2 border-[rgb(80,255,40)] h-64 mx-auto">
            {categories.map((cat) => (
                <div
                    key={cat}
                    className={`text-center text-xl font-semibold py-6 border-2 border-r border-[rgb(80,255,40)] last:border-r-2 justify-center items-center flex
              ${cat === current ? 'bg-[rgb(80,255,40)] text-[#5163b8]' : ''}`}
                >
                    {cat}
                </div>
            ))}
        </div>
    );
}

