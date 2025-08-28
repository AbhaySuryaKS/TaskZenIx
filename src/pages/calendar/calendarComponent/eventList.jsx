import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function EventList({ event, eventType, eventDate, eventTime, onDelete, onEdit }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const eventColors = (type) => {
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
        return events[type] || "bg-gray-500";
    };

    return (
        <div className="break-inside-avoid-column flex justify-between items-center p-3 rounded-lg mb-2 bg-gray-900 border border-gray-500">
            <div className="w-full flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{event}</h3>
                    <div className="relative">
                        <button
                            className="text-gray-400 hover:text-gray-300 ml-2"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <MoreVertIcon />
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-28 z-10 flex flex-col bg-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-lg animate-fadeIn">
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        onEdit();
                                    }}
                                    className="px-4 py-2 font-semibold border-b border-b-gray-700 hover:bg-gray-800 transition"
                                >
                                    <EditIcon fontSize="small" /> Edit
                                </button>
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        onDelete();
                                    }}
                                    className="px-4 py-2 font-semibold border-b border-b-gray-700 hover:bg-gray-800 transition"
                                >
                                    <DeleteIcon fontSize="small" /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                    <p className="text-xs text-gray-400">
                        {new Date(eventDate).toDateString()}
                    </p>
                    <p className="text-xs text-gray-400">
                        {eventTime}
                    </p>
                    <span
                        className={`px-2 py-1 text-xs rounded-xl ${eventColors(eventType)}`}
                    >
                        {eventType}
                    </span>
                </div>

                
            </div>
        </div>
    );
}

export default EventList;
