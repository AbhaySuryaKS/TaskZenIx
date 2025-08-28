import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DoneAllIcon from '@mui/icons-material/DoneAll'; 
import UnarchiveIcon from '@mui/icons-material/Unarchive';

function TaskItem({ task, dueDate, taskType, onDone, onUndo, onDelete, isComplete, onEdit }) {
    const [isPopup, setIsPopup] = useState(false);

    const handleDoneToggle = () => {
        if (isComplete) {
            onUndo();
        } else {
            onDone();
        }
        setIsPopup(false);
    };

    const handleDelete = () => {
        onDelete();
        setIsPopup(false);
    };

    const handleEdit = () => {
        onEdit();
        setIsPopup(false);
    };

    const getPriorityColor = () => {
        switch (taskType.toLowerCase()) {
            case "high":
                return "text-red-400 bg-red-800/30";
            case "medium":
                return "text-orange-400 bg-orange-800/30";
            case "low":
                return "text-green-400 bg-green-800/30";
            default:
                return "text-gray-400 bg-gray-800/30";
        }
    };

    const getTaskStage = () => {
        const today = new Date().toISOString().split("T")[0];
        if (isComplete) {
            return "border-l-[5px] border-green-500";
        } else if (today === dueDate) {
            return "border-l-[5px] border-red-500";
        } else if (today < dueDate) {
            return "border-l-[5px] border-yellow-500";
        } else { 
            return "border-l-[5px] border-gray-500";
        }
    };

    return (
        <div className={`break-inside-avoid-column bg-gray-900 border border-gray-800 ${getTaskStage()} p-5 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 my-4 relative`}>
            <div className="flex flex-col justify-between h-full">
                <div className="w-full relative flex justify-between items-start">
                    <h2
                        className={`text-lg font-semibold ${
                            isComplete ? "text-gray-500 line-through" : "text-white"
                        } whitespace-pre-wrap break-words break-all max-w-[85%] leading-snug`}
                    >
                        {task}
                    </h2>
                    <MoreVertIcon
                        className="text-gray-400 cursor-pointer hover:text-white transition-colors duration-200"
                        onClick={() => setIsPopup(!isPopup)}
                    />
                    {isPopup && (
                        <div className="absolute right-0 top-full mt-2 w-36 z-10 flex flex-col bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-xl animate-fadeIn origin-top-right">
                            <button
                                onClick={handleDoneToggle}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition"
                            >
                                {isComplete ? <UnarchiveIcon fontSize="small" /> : <DoneAllIcon fontSize="small" />}
                                {isComplete ? "Undo" : "Done"}
                            </button>
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition"
                            >
                                <EditIcon fontSize="small" />
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-gray-700 transition"
                            >
                                <DeleteIcon fontSize="small" />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
                <div className="w-full flex justify-between items-center gap-2 mt-4 flex-wrap">
                    <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${getPriorityColor()}`}
                    >
                        {taskType} Priority
                    </span>
                    {isComplete && (
                        <span className="text-xs font-medium px-2.5 py-1 text-sky-400 bg-sky-800/30 rounded-full">
                            Completed
                        </span>
                    )}
                    <p className={`text-sm ${isComplete ? "text-gray-600" : "text-gray-500"}`}>
                        Due: {dueDate}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default TaskItem;