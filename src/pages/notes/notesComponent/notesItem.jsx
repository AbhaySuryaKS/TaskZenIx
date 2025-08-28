import { useState, useRef, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function NotesItem({ note, onEdit, onDelete }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="break-inside-avoid-column bg-gray-900 border border-gray-500 p-5 rounded-xl shadow-2xl hover:shadow-lg transition-all duration-300 m-2 flex flex-col justify-between">
            <div className="flex justify-between items-start w-full">
                <p className="whitespace-pre-wrap break-words break-all max-w-[85%] text-gray-200 text-base leading-snug">
                    {note.text}
                </p>
                
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded-full"
                        aria-label="More options"
                    >
                        <MoreVertIcon sx={{ fontSize: 20 }} />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-32 z-10 flex flex-col bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-xl animate-fadeIn">
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    onEdit();
                                }}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition"
                            >
                                <EditIcon fontSize="small" /> Edit
                            </button>
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    onDelete();
                                }}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-gray-700 transition"
                            >
                                <DeleteIcon fontSize="small" /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <span className="text-xs text-gray-500 mt-4 self-end">
                {new Date(note.date).toLocaleString()}
            </span>
        </div>
    );
}

export default NotesItem;