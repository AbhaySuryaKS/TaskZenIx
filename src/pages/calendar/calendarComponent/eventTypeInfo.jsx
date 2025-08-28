import React from 'react';

function EventTypeInfo() {
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
        "Vacation / Holiday": "bg-teal-700",
        "Webinar": "bg-emerald-700",
        "Workshop": "bg-orange-700",
        "Other": "bg-zinc-500",
        "Multiple Events": "bg-gray-400" 
    };

    return (
        <div className="h-fit flex-1 bg-gray-900 p-6 rounded-xl shadow-2xl border border-gray-800">
            <div className="flex flex-wrap gap-x-6 gap-y-3">
                {Object.entries(events).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                        <span className={`w-3.5 h-3.5 rounded-full ${value}`}></span>
                        <span className="text-sm text-gray-300">{key}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EventTypeInfo;