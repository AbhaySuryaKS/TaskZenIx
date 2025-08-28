import React, { useState, useEffect } from "react";
import CircleIcon from '@mui/icons-material/Circle';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import CloseIcon from "@mui/icons-material/Close";

import Navbar from "../../components/navbar";
import TaskItem from "./tasksComponent/taskItem";
import Toast from "../../components/Toast";

function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("earliest");
    const [due, setDue] = useState(0);
    const [overDue, setOverDue] = useState(0);
    const [done, setDone] = useState(0);
    const [toast, setToast] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [editTaskId, setEditTaskId] = useState(null);

    useEffect(() => {
        const storedDue = localStorage.getItem("due");
        const storedOverDue = localStorage.getItem("overDue");
        const storedDone = localStorage.getItem("done");
        const storedTasks = localStorage.getItem("tasks");
    
        if (storedDue) setDue(Number(storedDue));
        if (storedOverDue) setOverDue(Number(storedOverDue));
        if (storedDone) setDone(Number(storedDone));
        if (storedTasks) setTasks(JSON.parse(storedTasks));
    
        setIsFirstRender(false); 
    }, []);
    
    useEffect(() => {
        if (!isFirstRender) {
            localStorage.setItem("due", due.toString());
            localStorage.setItem("overDue", overDue.toString());
            localStorage.setItem("done", done.toString());
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
    }, [due, overDue, done, tasks, isFirstRender]);
    
    useEffect(() => {
        if(!isFirstRender) {
            try {
              localStorage.setItem("tasks", JSON.stringify(tasks));
            } catch (e) {
              console.warn("Failed to save tasks to localStorage:", e);
            }
        
            const today = new Date().toISOString().split("T")[0];
            let dueCount = 0;
            let overDueCount = 0;
            let doneCount = 0;
        
            tasks.forEach((t) => {
                if (t.isComplete) {
                    doneCount++;
                } else {
                    const taskDate = t.dueDate;
                    if (taskDate <= today) {
                        overDueCount++;
                    } else if (taskDate >= today) {
                        dueCount++;
                    }
                }
            });
        
            setDue(dueCount);
            setOverDue(overDueCount);
            setDone(doneCount);
        }
    }, [tasks, isFirstRender]);

    const handleAddTask = () => {
        if (!task.trim() || !dueDate || !priority) {
            setToast({ type: "error", message: "Fill all the fields!" });
            return;
        }

        if (editTaskId) {
            setTasks((prev) =>
                prev.map((t) =>
                    t.id === editTaskId
                        ? {
                            ...t,
                            task: task.trim(),
                            dueDate,
                            taskType: priority.charAt(0).toUpperCase() + priority.slice(1),
                        }
                        : t
                    )
                );
                setEditTaskId(null);
                setToast({ type: "success", message: "Task updated successfully!" });
        } else {
            const newTask = {
                id: Date.now(),
                task: task.trim(),
                dueDate,
                taskType: priority.charAt(0).toUpperCase() + priority.slice(1),
                isComplete: false,
            };
            setTasks((prev) => [...prev, newTask]);
            setToast({ type: "success", message: "Task added successfully!" });
        }
        
        setTask("");
        setDueDate("");
        setPriority("");
        setShowAddModal(false);
    };

    const markComplete = (taskObj) => {
        setTasks((prev) =>
            prev.map((t) => (t.id === taskObj.id ? { ...t, isComplete: true } : t))
        );
        setToast({ type: "success", message: "Task Completed successfully!" });
    };

    const undoTask = (taskObj) => {
        setTasks((prev) => {
            const updated = prev.map((t) =>
                t.id === taskObj.id ? { ...t, isComplete: false } : t
            );

            setDone((d) => Math.max(d - 1, 0));

            localStorage.setItem("tasks", JSON.stringify(updated));
            return updated;
        });
    };

    const deleteTask = (taskObj) => {
        setTasks((prev) => prev.filter((t) => t.id !== taskObj.id));
        setToast({ type: "success", message: "Task deleted successfully!" });
    };

    const displayedTasks = tasks
        .filter((t) => {
            const matchesSearch = t.task.toLowerCase().includes(searchQuery.toLowerCase());
 
            if (sortOption === "done") return t.isComplete && matchesSearch;
            if (["high", "medium", "low"].includes(sortOption))
                return t.taskType.toLowerCase() === sortOption && matchesSearch;
 
            return matchesSearch;
        })
        .sort((a, b) => {
            if (a.isComplete && !b.isComplete) return 1;
            if (!a.isComplete && b.isComplete) return -1;
        
            if (sortOption === "latest") {
                return new Date(b.dueDate) - new Date(a.dueDate);
            }
            return new Date(a.dueDate) - new Date(b.dueDate);
    });

    return (
        <div className="w-full min-h-screen flex flex-col bg-gray-950 text-white p-3">
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
            <Navbar page="Lists" />
            <div className="w-full h-full flex flex-col max-w-7xl p-3 mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-1">Task Manager</h1>
                    <p className="text-base text-gray-400">Organize and track your Tasks.</p>
                </div>
                <div className="w-full flex flex-wrap items-center justify-center sm:justify-evenly mt-3 gap-3 bg-gray-900 p-4 rounded-xl shadow-md border border-gray-800">
                    <p className="inline-flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full text-sm font-medium border border-gray-700">
                        <CircleIcon sx={{ fontSize: 10 }} className="text-green-400" /> {done} Done
                    </p>
                    <p className="inline-flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full text-sm font-medium border border-gray-700">
                        <CircleIcon sx={{ fontSize: 10 }} className="text-red-500" /> {overDue} Overdue
                    </p>
                    <p className="inline-flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full text-sm font-medium border border-gray-700">
                        <CircleIcon sx={{ fontSize: 10 }} className="text-yellow-400" /> {due} Due soon
                    </p>
                </div>
        
                <div className="h-full flex flex-col relative bg-gray-950 text-white mt-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                        <div className="flex items-center bg-gray-800 rounded-xl px-4 py-2 flex-1 w-full sm:w-auto shadow-md border border-gray-700">
                            <SearchIcon className="text-gray-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent outline-none text-white w-full text-sm placeholder-gray-500"
                            />
                        </div>
                        <div className="flex items-center bg-gray-800 rounded-xl px-4 py-2 shadow-md border border-gray-700">
                            <SortIcon className="text-gray-400 mr-2" />
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="bg-transparent outline-none text-white text-sm cursor-pointer"
                            >
                                <option value="earliest" className="bg-gray-800 text-white">Earliest First</option>
                                <option value="latest" className="bg-gray-800 text-white">Latest First</option>
                                <option value="high" className="bg-gray-800 text-white">High Priority</option>
                                <option value="medium" className="bg-gray-800 text-white">Medium Priority</option>
                                <option value="low" className="bg-gray-800 text-white">Low Priority</option>
                                <option value="done" className="bg-gray-800 text-white">Completed Tasks</option>
                            </select>
                        </div>
                    </div>
        
                    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 mt-4">
                        {displayedTasks.length === 0 ? (
                            <p className="text-gray-500 text-center col-span-full py-10">No tasks found. Click the '+' button to add one!</p>
                        ) 
                        : 
                        ( displayedTasks.map((t) => (
                            <TaskItem
                                key={t.id}
                                task={t.task}
                                dueDate={t.dueDate}
                                taskType={t.taskType}
                                isComplete={t.isComplete}
                                onDone={() => {
                                    if (!t.isComplete) {
                                        markComplete(t);
                                    } 
                                }}
                                onDelete={() => deleteTask(t)}
                                onUndo={() => undoTask(t)}
                                onEdit={() => {
                                    setTask(t.task);
                                    setDueDate(t.dueDate);
                                    setPriority(t.taskType.toLowerCase());
                                    setEditTaskId(t.id);
                                    setShowAddModal(true);
                                }}
                            />
                        )))}
                    </div>
                </div>
            </div>
            {!showAddModal && (
                <button
                    onClick={() => {
                        setShowAddModal(true);
                        setTask("");
                        setDueDate("");
                        setPriority("");
                        setEditTaskId(null);
                    }}
                    className="fixed bottom-6 right-6 bg-sky-600 p-4 rounded-full shadow-lg hover:bg-sky-700 transition-colors z-50 flex items-center justify-center"
                    aria-label="Add new task"
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
                    <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-[90%] bg-gray-900 text-white rounded-2xl shadow-xl p-6 space-y-6 border border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-bold">{editTaskId ? "Edit Task" : "Add New Task"}</h2>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setTask("");
                                    setDueDate("");
                                    setPriority("");
                                    setEditTaskId(null);
                                }}
                                className="text-gray-400 hover:text-white transition-colors p-1 rounded-full"
                                aria-label="Close modal"
                            >
                                <CloseIcon sx={{ fontSize: 24 }} />
                            </button>
                        </div>
                        <div>
                            <label htmlFor="text" className="block text-sm font-semibold mb-1 text-gray-300">
                                Task Description
                            </label>
                            <input
                                type="text"
                                id="text"
                                value={task}
                                onChange={(e) => setTask(e.target.value)}
                                placeholder="Enter your task"
                                className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-sm"
                            />
                        </div>
    
                        <div>
                            <label htmlFor="date" className="block text-sm font-semibold mb-1 text-gray-300">
                                Due Date
                            </label>
                            <input
                                type="date"
                                id="date"
                                min={new Date().toISOString().split("T")[0]}
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
    
                        <fieldset>
                            <legend className="text-sm font-semibold mb-3 text-gray-300">Priority</legend>
                            <div className="flex flex-col gap-3">
                                <label className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="priority"
                                        value="high"
                                        checked={priority === "high"}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="accent-red-500 w-5 h-5"
                                    />
                                    <span className="ml-3 text-red-400 font-medium text-base">High Priority</span>
                                </label>
                                <label className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="priority"
                                        value="medium"
                                        checked={priority === "medium"}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="accent-orange-500 w-5 h-5"
                                    />
                                    <span className="ml-3 text-orange-400 font-medium text-base">Medium Priority</span>
                                </label>
                                <label className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="priority"
                                        value="low"
                                        checked={priority === "low"}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="accent-green-500 w-5 h-5"
                                    />
                                    <span className="ml-3 text-green-400 font-medium text-base">Low Priority</span>
                                </label>
                            </div>
                        </fieldset>
    
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={handleAddTask}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 font-bold rounded-lg transition shadow-md text-sm"
                            >
                                {editTaskId ? "Update Task" : "Add Task"}
                            </button>
                            <button
                                onClick={() => { 
                                    setShowAddModal(false);
                                    setPriority("");
                                    setTask("");
                                    setDueDate("");
                                    setEditTaskId(null);
                                }}
                                className="border border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white px-6 py-3 font-bold rounded-lg transition shadow-md text-sm"
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

export default TasksPage;