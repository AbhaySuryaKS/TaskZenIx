import { useEffect,useState } from 'react'
import CalendarDateBox from './calendarDateBox';

function Calendar({calendarEvents}) {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState(calendarEvents || []);
    const [viewMode, setViewMode] = useState("days");
    const today = new Date();

    useEffect(() => {
        setEvents(calendarEvents || []);
    }, [calendarEvents]);

    function generateMonth(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const dates = [];
        
        for (let i = 0; i < firstDay.getDay(); i++) {
            dates.push(null);
        }
        for (let d = 1; d <= lastDay.getDate(); d++) {
            dates.push(new Date(year, month, d));
        }
        return dates;
    }

    const monthDates = generateMonth(currentYear, currentMonth);
    
    const goToPrevMonth = () => {
        setCurrentMonth((prev) => {
            if (prev === 0) {
                setCurrentYear((y) => y - 1);
                return 11;
            }
            return prev - 1;
        });
    };

    const goToNextMonth = () => {
        setCurrentMonth((prev) => {
            if (prev === 11) {
                setCurrentYear((y) => y + 1);
                return 0;
            }
            return prev + 1;
        });
    };

    return (
        <div className="break-inside-avoid-column flex-1 bg-gray-900 p-6 rounded-xl shadow-2xl border border-gray-800">
            <div className="flex justify-between items-center mb-5">
                <button
                    onClick={goToPrevMonth}
                    className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                >
                    &lt;
                </button>
                <h2
                    className="text-2xl font-bold cursor-pointer text-white hover:text-gray-300 transition-colors"
                    onClick={() =>
                        setViewMode(viewMode === "days" ? "months" : "days")
                    }
                >
                    {viewMode === "days" &&
                        new Date(currentYear, currentMonth).toLocaleString("default", {
                            month: "long",
                            year: "numeric"
                        })}
                    {viewMode === "months" && currentYear}
                    {viewMode === "years" && "Select Year"}
                </h2>
                <button
                    onClick={goToNextMonth}
                    className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                >
                    &gt;
                </button>
            </div>
            {viewMode === "years" && (
                <div className="grid grid-cols-4 gap-3 max-h-80 overflow-y-auto no-scrollbar">
                    {Array.from({ length: 201 }, (_, i) => currentYear - 100 + i).map((year) => {
                        const isCurrent = year === today.getFullYear();
                        const isSelected = year === currentYear;
                        return (
                            <div
                                key={year}
                                className={`p-3 text-center rounded-lg cursor-pointer font-medium
                                    ${isSelected && !isCurrent ? "bg-blue-800/50 text-white" : ""}
                                    ${isCurrent ? "bg-blue-600 text-white" : ""}
                                    ${!isSelected && !isCurrent ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : ""}
                                    transition-colors duration-200`}
                                onClick={() => {
                                    setCurrentYear(year);
                                    setViewMode("months");
                                }}
                            >
                                {year}
                            </div>
                        );
                    })}
                </div>
            )}
            {viewMode === "months" && (
                <div>
                    <h2
                        className="text-2xl font-bold text-center cursor-pointer mb-5 text-white hover:text-gray-300 transition-colors"
                        onClick={() => setViewMode("years")}
                    >
                        {currentYear}
                    </h2>
                    <div className="grid grid-cols-3 gap-3">
                        {Array.from({ length: 12 }, (_, i) =>
                            new Date(currentYear, i).toLocaleString("default", {
                                month: "short"
                            })).map((m, i) => {
                                const isCurrent = i === today.getMonth() && currentYear === today.getFullYear();
                                const isSelected = i === currentMonth && currentYear === selectedDate.getFullYear();
                                return (
                                    <div
                                        key={m}
                                        className={`p-3 text-center rounded-lg cursor-pointer font-medium
                                            ${isSelected && !isCurrent ? "bg-blue-800/50 text-white" : ""}
                                            ${isCurrent ? "bg-blue-600 text-white" : ""}
                                            ${!isSelected && !isCurrent ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : ""}
                                            transition-colors duration-200`}
                                        onClick={() => {
                                            setCurrentMonth(i);
                                            setViewMode("days");
                                        }}
                                    >
                                        {m}
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}
            {viewMode === "days" && (
                <div>
                    <div className="grid grid-cols-7 text-center font-bold text-gray-400 mb-2">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                            <div key={d} className="text-sm">{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 text-center font-bold place-items-center">
                        {monthDates.map((date, idx) => {
                            if (!date) {
                                return <div key={idx} className="w-16 h-16" />;
                            }
                            const isTodayCell = date.toDateString() === today.toDateString();
                            const isSelectedCell = selectedDate.toDateString() === date.toDateString();
                            const matchedEvents = events.filter(ev => {
                                const evDate = new Date(ev.eventDate + "T00:00:00"); 
                                evDate.setHours(0,0,0,0)
                                if (ev.isPermanent) {
                                    return (
                                        date.getDate() === evDate.getDate() &&
                                        date.getMonth() === evDate.getMonth() &&
                                        date.getFullYear() >= evDate.getFullYear() 
                                    );
                                } else {
                                    return evDate.toDateString() === date.toDateString();
                                }
                            });
                            return (
                                <div key={idx} className="w-full h-full flex items-center justify-center p-0.5">
                                    <CalendarDateBox
                                        date={date.getDate()}
                                        eventTypes={matchedEvents.map(ev => ev.eventType)}
                                        isToday={isTodayCell}
                                        isSelected={isSelectedCell}
                                        onClick={() => setSelectedDate(date)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Calendar
