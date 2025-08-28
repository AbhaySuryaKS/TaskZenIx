import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import CloseIcon from "@mui/icons-material/Close";
import Navbar from "../../components/navbar";
import NotesItem from "./notesComponent/notesItem";
import Toast from "../../components/Toast";

function NotesPage() {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");
    const [toast, setToast] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isFirstRender, setIsFirstRender] = useState(true);

    useEffect(() => {
        const savedNotes = localStorage.getItem("notes");
        if (savedNotes) {
            setNotes(JSON.parse(savedNotes));
        }
        setIsFirstRender(false);
    }, []);

    useEffect(() => {
        if (!isFirstRender) {
            localStorage.setItem("notes", JSON.stringify(notes));
        }
    }, [notes, isFirstRender]);

    const handleAddNote = () => {
        if (!newNote.trim()) {
            setToast({ type: "error", message: "Note cannot be empty!" });
            return;
        }

        if (editingIndex !== null) {
            const updated = [...notes];
            updated[editingIndex].text = newNote;
            updated[editingIndex].date = new Date();
            setNotes(updated);
            setEditingIndex(null);
            setToast({ type: "success", message: "Note updated successfully!" });
        } else {
            setNotes([{ text: newNote, date: new Date() }, ...notes]);
            setToast({ type: "success", message: "Note added successfully!" });
        }
        setNewNote("");
        setShowAddModal(false);
    };

    const handleEditNote = (index) => {
        setNewNote(notes[index].text);
        setEditingIndex(index);
        setShowAddModal(true);
    };

    const handleDeleteNote = (index) => {
        setNotes(notes.filter((_, i) => i !== index));
        setToast({ type: "success", message: "Note deleted successfully!" });
    };

    const filteredNotes = notes
        .filter((n) => n.text.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) =>
            sortOrder === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
        );

    return (
        <div className="w-full min-h-screen flex flex-col bg-gray-950 text-white p-3 relative">
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}

            <Navbar page={"My Notes"} />

            <div className="w-full max-w-7xl mx-auto p-3">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-1">My Notes</h1>
                    <p className="text-base text-gray-400">Capture your ideas and reminders.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                    <div className="flex items-center bg-gray-800 rounded-xl px-4 py-2 flex-1 w-full sm:w-auto shadow-md border border-gray-700">
                        <SearchIcon className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent outline-none text-white w-full text-sm placeholder-gray-500"
                        />
                    </div>

                    <div className="flex items-center bg-gray-800 rounded-xl px-4 py-2 shadow-md border border-gray-700">
                        <SortIcon className="text-gray-400 mr-2" />
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="bg-transparent outline-none text-white text-sm cursor-pointer"
                        >
                            <option value="desc" className="bg-gray-800 text-white">Newest First</option>
                            <option value="asc" className="bg-gray-800 text-white">Oldest First</option>
                        </select>
                    </div>
                </div>

                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 mt-4">
                    {filteredNotes.length === 0 ? (
                        <p className="text-gray-500 text-center col-span-full py-10">No notes found. Click the '+' button to add one!</p>
                    ) : (
                        filteredNotes.map((note, index) => (
                            <div key={index} className="break-inside-avoid mb-4">
                                <NotesItem
                                    note={note}
                                    onEdit={() => handleEditNote(index)}
                                    onDelete={() => handleDeleteNote(index)}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>

            {!showAddModal && (
                <button
                    onClick={() => {
                        setShowAddModal(true);
                        setNewNote("");
                        setEditingIndex(null);
                    }}
                    className="fixed bottom-6 right-6 bg-sky-600 p-4 rounded-full shadow-lg hover:bg-sky-700 transition-colors z-50 flex items-center justify-center"
                    aria-label="Add new note"
                >
                    <AddIcon sx={{ fontSize: 28 }} className="text-white" />
                </button>
            )}

            {showAddModal && (
                <>
                    <div
                        className="fixed inset-0 bg-opacity-70 z-40 backdrop-blur-sm"
                        onClick={() => setShowAddModal(false)}
                    ></div>
                    <div className="w-[90%] max-w-md fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 bg-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700">
                        <div className="flex justify-between items-center w-full mb-2">
                            <h2 className="text-xl font-bold">{editingIndex !== null ? "Edit Note" : "Add New Note"}</h2>
                            <button
                                onClick={() => {
                                    setNewNote("");
                                    setEditingIndex(null);
                                    setShowAddModal(false);
                                }}
                                className="text-gray-400 hover:text-white transition-colors p-1 rounded-full"
                                aria-label="Close modal"
                            >
                                <CloseIcon sx={{ fontSize: 24 }} />
                            </button>
                        </div>
                        <textarea
                            placeholder="Write your note here..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            className="w-full min-h-[150px] bg-gray-800 p-3 rounded-lg flex-1 outline-none text-white resize-y text-sm border border-gray-700 focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="w-full flex justify-end gap-3 pt-2">
                            <button
                                onClick={handleAddNote}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2 rounded-lg transition shadow-md"
                            >
                                {editingIndex !== null ? "Update Note" : "Add Note"}
                            </button>
                            <button
                                onClick={() => {
                                    setNewNote("");
                                    setEditingIndex(null);
                                    setShowAddModal(false);
                                }}
                                className="border border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white px-5 py-2 font-bold rounded-lg transition shadow-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default NotesPage;