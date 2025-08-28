import React, { useState, useRef, useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Toast from "../../components/Toast";
import Navbar from "../../components/navbar";
import Pomodoro from "./timerComponent/pomodoro";
import TimerItem from "./timerComponent/timerItem";

function TimerPage() {
    const [timers, setTimers] = useState([]);
    const [hh, setHh] = useState(0);
    const [mm, setMm] = useState(0);
    const [ss, setSs] = useState(0);
    const [formVisible, setFormVisible] = useState(false);
    const [showAddBar, setShowAddBar] = useState(true);
    const [values, setValues] = useState({ hh: "", mm: "", ss: "" });
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [toast, setToast] = useState(null);
    const hourRef = useRef(null);
    const minuteRef = useRef(null);
    const secondRef = useRef(null);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("timers") || "[]");
        if (stored.length > 0) {
            setTimers(stored);
            if (stored.length >= 20) {
                setShowAddBar(false);
            }
        } else {
            const defaultTimer = { id: "permanent", hh: 0, mm: 5, ss: 0, permanent: true };
            setTimers([defaultTimer]);
            localStorage.setItem("timers", JSON.stringify([defaultTimer]));
        }
        setIsFirstRender(false);
    }, []);

    useEffect(() => {
        if(!isFirstRender) {
            localStorage.setItem("timers", JSON.stringify(timers));
            setShowAddBar(timers.length < 20);
        }
    }, [timers, isFirstRender]);

    const handleAddTimer = () => {
        if (hh === 0 && mm === 0 && ss === 0) {
            setToast({ type: "error", message: "Timer cannot be empty" });
            return;
        }

        if (timers.length >= 20) {
            setToast({ type: "success", message: "Timer added successfully!" }); 
            return;
        }
        setTimers((prev) => [
            ...prev,
            { hh, mm, ss, id: Date.now(), permanent: false }
        ]);
        setFormVisible(false);
        setHh(0);
        setMm(0);
        setSs(0);
        setValues({ hh: "", mm: "", ss: "" });
    };

    const handleChange = (e, field, nextRef) => {
        let val = e.target.value.replace(/\D/g, "");
        if (val.length > 2) val = val.slice(0, 2);

        setValues((prev) => ({ ...prev, [field]: val }));

        const numVal = val === "" ? 0 : Number(val);
        if (field === "hh") setHh(numVal);
        if (field === "mm") setMm(numVal);
        if (field === "ss") setSs(numVal);

        if (val.length === 2 && nextRef && nextRef.current) {
            nextRef.current.focus();
        }
    };

    const handleKeyDown = (e, field, prevRef) => {
        if (e.key === "Backspace" && values[field] === "" && prevRef && prevRef.current) {
            prevRef.current.focus();
        }
    };

    const handleDeleteTimer = (id, permanent) => {
        if (permanent) return;
        setTimers((prev) => prev.filter(timer => timer.id !== id));
        setToast({ type: "success", message: "Timer deleted successfully!" });
    };

    return (
        <div className="w-full min-h-screen relative flex flex-col bg-gray-950 text-white p-3">
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
            <Navbar page={"Timer"} />
            <div className="w-full h-full flex flex-col max-w-7xl p-3 mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-1">Timer & Pomodoro</h1>
                    <p className="text-base text-gray-400">
                        Stay productive with focused timers.
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-evenly gap-2">
                    {timers.map((t) => (
                        <div
                            className="w-fit p-4 bg-gray-900 border border-gray-700 shadow-xl rounded-2xl overflow-hidden"
                        >
                            <TimerItem
                                key={t.id}
                                id={t.id}
                                hh={t.hh}
                                mm={t.mm}
                                ss={t.ss}
                                permanent={t.permanent}
                                onDelete={() => handleDeleteTimer(t.id, t.permanent)}
                            />
                        </div> 
                    ))}
                    <div className="w-60 h-70 p-4 bg-gray-900 rounded-xl shadow-2xl border border-gray-800 flex flex-col items-center justify-center min-h-[240px]">
                        {showAddBar && (
                            <button
                                onClick={() => {
                                    setFormVisible(true);
                                    setValues({ hh: "", mm: "", ss: "" });
                                    setHh(0);
                                    setMm(0);
                                    setSs(0);
                                }}
                                className="flex items-center justify-center rounded-full bg-sky-600 hover:bg-sky-700 transition-colors shadow-lg p-4"
                                aria-label="Add new timer"
                            >
                                <AddIcon sx={{ fontSize: 48 }} className="text-white" />
                            </button>
                        )}
                        <span className="mt-4 text-center text-sm font-semibold text-gray-400">Add New Timer</span>
                    </div>
                </div>
                
                <div className="w-full mt-10 flex justify-center">
                    <Pomodoro/>
                </div>
            </div>

            {formVisible && (
                <>
                    <div
                        className="fixed inset-0 bg-opacity-70 z-40 backdrop-blur-sm"
                        onClick={() => setFormVisible(false)}
                    ></div>
                    <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 max-w-sm w-[90%] bg-gray-900 text-white rounded-2xl shadow-xl p-6 space-y-6 border border-gray-700 animate-fadeIn">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Set New Timer</h2>
                            <button
                                onClick={() => setFormVisible(false)}
                                className="text-gray-400 hover:text-white transition-colors p-1 rounded-full"
                                aria-label="Close modal"
                            >
                                <CloseIcon sx={{ fontSize: 24 }} />
                            </button>
                        </div>
                        <div className="flex justify-center items-end gap-4">
                            <label className="flex flex-col items-center">
                                <input
                                    ref={hourRef}
                                    type="text"
                                    value={values.hh}
                                    onChange={(e) => handleChange(e, "hh", minuteRef)}
                                    onKeyDown={(e) => handleKeyDown(e, "hh", null)}
                                    maxLength={2}
                                    className="w-20 p-3 rounded-lg bg-gray-800 text-white text-center text-3xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 border border-gray-700"
                                    placeholder="00"
                                />
                                <span className="text-gray-400 text-xs mt-2">Hours</span>
                            </label>
                            <span className="text-3xl font-mono text-gray-400">:</span>
                            <label className="flex flex-col items-center">
                                <input
                                    ref={minuteRef}
                                    type="text"
                                    value={values.mm}
                                    onChange={(e) => handleChange(e, "mm", secondRef)}
                                    onKeyDown={(e) => handleKeyDown(e, "mm", hourRef)}
                                    maxLength={2}
                                    className="w-20 p-3 rounded-lg bg-gray-800 text-white text-center text-3xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 border border-gray-700"
                                    placeholder="00"
                                />
                                <span className="text-gray-400 text-xs mt-2">Minutes</span>
                            </label>
                            <span className="text-3xl font-mono text-gray-400">:</span>
                            <label className="flex flex-col items-center">
                                <input
                                    ref={secondRef}
                                    type="text"
                                    value={values.ss}
                                    onChange={(e) => handleChange(e, "ss", null)}
                                    onKeyDown={(e) => handleKeyDown(e, "ss", minuteRef)}
                                    maxLength={2}
                                    className="w-20 p-3 rounded-lg bg-gray-800 text-white text-center text-3xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 border border-gray-700"
                                    placeholder="00"
                                />
                                <span className="text-gray-400 text-xs mt-2">Seconds</span>
                            </label>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={handleAddTimer}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 font-bold rounded-lg transition shadow-md text-sm"
                            >
                                Add Timer
                            </button>
                            <button
                                onClick={() => setFormVisible(false)}
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

export default TimerPage;