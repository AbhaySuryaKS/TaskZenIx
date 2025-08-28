import React from 'react';

function CalendarDateBox({ date, eventTypes, isToday, isSelected, onClick }) {
    const eventColors = (eventType) => {
        const events = {
            "Anniversary / Birthday": "bg-pink-500",
            "Appointment": "bg-indigo-600",
            "Conference": "bg-sky-700",
            "Deadline": "bg-red-600",
            "Exam": "bg-rose-800",
            "Festival": "bg-fuchsia-600",
            "Hackathon": "bg-orange-500",
            "Interview": "bg-yellow-800",
            "Lecture": "bg-cyan-400",
            "Meeting": "bg-blue-400",
            "Party": "bg-purple-500",
            "Payments": "bg-lime-600",
            "Seminar": "bg-green-500",
            "Submission": "bg-amber-500",
            "Tournament": "bg-violet-700",
            "Vacation / Holiday": "bg-teal-900",
            "Webinar": "bg-emerald-700",
            "Workshop": "bg-orange-700",
            "Other": "bg-zinc-500",
        };
        return events[eventType]; 
    };

    const dateTextColor = isToday || isSelected ? "text-white" : "text-gray-300";

    return (
        <button
            onClick={onClick}
            className={`
                w-14 h-14 flex flex-col items-center justify-center rounded-xl transition-all duration-200
                ${isToday ? "bg-blue-600 border border-blue-400" : ""}
                ${isSelected && !isToday ? "bg-blue-800/50 border border-blue-500" : ""}
                overflow-hidden relative
            `}
        >
            <span className={`text-lg font-bold ${dateTextColor}`}>{date}</span>
                <div className="flex flex-wrap justify-center gap-0.5 mt-1 px-1">
                    {eventTypes.length > 1 ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span>
                    ) :
                    eventTypes.length === 1 ? (
                        <span
                            className={`w-2.5 h-2.5 rounded-full ${eventColors(eventTypes[0])}`}
                        ></span>
                    ) : null}
                </div>
        </button>
    );
}

export default CalendarDateBox;