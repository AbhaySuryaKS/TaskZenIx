function DateBox({ day, fullDate, event }) {
    const checkEvent = (event) => {
        if (event) {
            return "border-green-500";
        }
        return "border-gray-700";
    };

    return (
        <div className={`flex flex-col flex-shrink-0 items-center justify-center bg-gray-900 border ${checkEvent(event)} px-4 py-3 rounded-xl shadow-md transition-all duration-300 w-20`}>
            <div className="text-center text-xs font-semibold text-gray-400">
                {day}
            </div>
            <div className="text-center text-3xl font-bold text-white leading-none">
                {fullDate.getDate()}
            </div>
            <div className="flex flex-col items-center gap-0.5 mt-1">
                <span className="text-xxs text-gray-500 leading-tight">
                    {fullDate.toLocaleString("default", { month: "short" })}
                </span>
                <span className="text-xxs text-gray-500 leading-tight">
                    {fullDate.getFullYear()}
                </span>
            </div>
        </div>
    );
}

export default DateBox;