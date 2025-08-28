import React, { useState, useEffect, useRef } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ReplayIcon from "@mui/icons-material/Replay";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";

const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
};

const getInitialState = () => {
    const savedState = localStorage.getItem("pomodoroState");
    if (savedState) {
        return JSON.parse(savedState);
    }
    return null;
};

function Pomodoro() {
    const initialState = getInitialState();

    const [workTime, setWorkTime] = useState(initialState?.workTime || 25);
    const [breakTime, setBreakTime] = useState(initialState?.breakTime || 5);
    const [longBreakTime, setLongBreakTime] = useState(initialState?.longBreakTime || 15);
    const [cycles, setCycles] = useState(initialState?.cycles || 4);

    const [secondsLeft, setSecondsLeft] = useState(() => {
        if (initialState?.savedIsRunning && initialState?.savedEndTime) {
            const remaining = Math.max(0, Math.floor((initialState.savedEndTime - Date.now()) / 1000));
            return remaining;
        }
        return initialState?.savedSecondsLeft || initialState?.workTime * 60 || 25 * 60;
    });

    const [isRunning, setIsRunning] = useState(initialState?.savedIsRunning || false);
    const [timerPhase, setTimerPhase] = useState(initialState?.savedTimerPhase || "work");
    const [currentCycle, setCurrentCycle] = useState(initialState?.savedCurrentCycle || 0);
    const [showSettings, setShowSettings] = useState(false);
    const alarmRef = useRef();
    const intervalRef = useRef(null);
    const isFirstRenderRef = useRef(true);

    const toggleStart = () => {
        setIsRunning((prev) => !prev);
    };

    const resetTimer = () => {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setTimerPhase("work");
        setCurrentCycle(0);
        setSecondsLeft(workTime * 60);
        localStorage.removeItem("pomodoroState");
    };

    useEffect(() => {
        if (!isFirstRenderRef.current) {
            const stateToSave = {
                savedSecondsLeft: secondsLeft,
                savedIsRunning: isRunning,
                savedTimerPhase: timerPhase,
                savedCurrentCycle: currentCycle,
                workTime,
                breakTime,
                longBreakTime,
                cycles,
                savedEndTime: isRunning ? Date.now() + secondsLeft * 1000 : null,
            };
            localStorage.setItem("pomodoroState", JSON.stringify(stateToSave));
        } else {
            isFirstRenderRef.current = false;
        }
    }, [secondsLeft, isRunning, timerPhase, currentCycle, workTime, breakTime, longBreakTime, cycles]);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setSecondsLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current);
                        if (alarmRef.current) {
                            alarmRef.current.play().catch(() => {});
                        }
                        if (timerPhase === "work") {
                            const nextCycle = currentCycle + 1;
                            setCurrentCycle(nextCycle);
                            if (nextCycle === cycles) {
                                setTimerPhase("longBreak");
                                return longBreakTime * 60;
                            } else {
                                setTimerPhase("break");
                                return breakTime * 60;
                            }
                        } else if (timerPhase === "break") {
                            setTimerPhase("work");
                            return workTime * 60;
                        } else if (timerPhase === "longBreak") {
                            setTimerPhase("work");
                            setIsRunning(false);
                            setCurrentCycle(0);
                            return workTime * 60;
                        }
                        if (alarmRef.current) {
                            alarmRef.current.play().catch(() => {});
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning, timerPhase, currentCycle, cycles, workTime, breakTime, longBreakTime]);

    useEffect(() => {
        if (!isRunning) {
            setSecondsLeft(workTime * 60);
        }
    }, [workTime, isRunning]);

    const currentPhaseTotalTime =
        timerPhase === "work" ? workTime * 60 :
        timerPhase === "break" ? breakTime * 60 :
        longBreakTime * 60;

    const percentage = currentPhaseTotalTime > 0 ? (secondsLeft / currentPhaseTotalTime) * 100 : 0;

    const timerColors = {
        work: "rgb(59, 130, 246)",
        break: "rgb(22, 163, 74)",
        longBreak: "rgb(124, 58, 237)",
    };
    const currentColor = timerColors[timerPhase];

    return (
        <div className="break-inside-avoid-column p-6 bg-gray-900 text-white rounded-xl shadow-2xl mx-auto w-full relative overflow-hidden md:max-w-xl border border-gray-800">
            <div className="relative text-center mb-6">
                <h1 className="text-xl font-bold mb-1">Pomodoro Timer</h1>
                <p className="text-gray-400 font-semibold uppercase tracking-wide text-sm">
                    {timerPhase === "work" && "Work Session"}
                    {timerPhase === "break" && "Short Break"}
                    {timerPhase === "longBreak" && "Long Break"}
                </p>
                <button
                    onClick={() => setShowSettings(true)}
                    className="absolute top-0 right-0 flex items-center justify-center text-white p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors shadow-md"
                    aria-label="edit settings"
                >
                    <SettingsIcon sx={{ fontSize: 25 }} />
                </button>
            </div>
    
            <div className="flex flex-row items-center justify-center gap-6 mb-6">     
                <div className="flex flex-col items-center justify-center relative w-57 h-57">
                    <div
                        className="absolute inset-0 rounded-full"
                        style={{
                            background: `conic-gradient(${currentColor} ${percentage}%, transparent ${percentage}%)`,
                            transition: 'background 1s linear',
                            maskImage: 'radial-gradient(transparent 70%, black 70%)',
                        }}
                    />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <h2 className="text-5xl font-mono">{formatTime(secondsLeft)}</h2>
                    </div>
                    <div className="absolute bottom-1/6 left-1/2 transform -translate-x-1/2 flex items-end justify-center gap-5">
                        <button
                            onClick={toggleStart}
                            className="flex items-center justify-center text-white p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors shadow-md"
                            aria-label={isRunning ? "pause" : "start"}
                        >
                            {isRunning ? <PauseIcon sx={{ fontSize: 28 }} /> : <PlayArrowIcon sx={{ fontSize: 28 }} />}
                        </button>
                        <button
                            onClick={resetTimer}
                            className="flex items-center justify-center text-white p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors shadow-md"
                            aria-label="reset"
                        >
                            <ReplayIcon sx={{ fontSize: 28 }} />
                        </button>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <span>{currentCycle}/{cycles}</span>
                    <div className="w-2.5 h-60 bg-gray-700 rotate-180 rounded-full overflow-hidden">
                        <div
                            className="bg-green-500 h-2.5 transition-all duration-900"
                            style={{ height: `${(currentCycle / cycles) * 100}%` }}
                        />
                    </div>
                    <span>Cycles</span>
                </div>
            </div>
            {showSettings && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
                    <div className="bg-gray-900 p-8 rounded-xl w-full max-w-xs shadow-2xl border border-gray-700 animate-fadeIn">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Edit Settings</h2>
                            <button
                                onClick={() => setShowSettings(false)}
                                className="text-gray-400 hover:text-white transition-colors p-1 rounded-full"
                                aria-label="Close settings"
                            >
                                <CloseIcon sx={{ fontSize: 24 }} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <label className="block text-gray-300">
                                Work Time (min):
                                <input
                                    type="number"
                                    min="1"
                                    max="99"
                                    value={workTime}
                                    onChange={(e) => setWorkTime(Number(e.target.value))}
                                    className="w-full p-3 mt-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 text-sm"
                                />
                            </label>
                            <label className="block text-gray-300">
                                Break Time (min):
                                <input
                                    type="number"
                                    min="1"
                                    max="99"
                                    value={breakTime}
                                    onChange={(e) => setBreakTime(Number(e.target.value))}
                                    className="w-full p-3 mt-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-700 text-sm"
                                />
                            </label>
                            <label className="block text-gray-300">
                                Long Break (min):
                                <input
                                    type="number"
                                    min="1"
                                    max="99"
                                    value={longBreakTime}
                                    onChange={(e) => setLongBreakTime(Number(e.target.value))}
                                    className="w-full p-3 mt-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700 text-sm"
                                />
                            </label>
                            <label className="block text-gray-300">
                                Cycles:
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={cycles}
                                    onChange={(e) => setCycles(Number(e.target.value))}
                                    className="w-full p-3 mt-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-700 text-sm"
                                />
                            </label>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowSettings(false)}
                                className="px-6 py-3 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors text-sm font-semibold shadow-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    resetTimer();
                                    setShowSettings(false);
                                }}
                                className="px-6 py-3 bg-green-600 rounded-lg text-white hover:bg-green-500 transition-colors text-sm font-semibold shadow-md"
                            >
                                Save Settings
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <audio ref={alarmRef} src="alarmAudio.mp3" preload="auto" />
        </div>
    );
}

export default Pomodoro;