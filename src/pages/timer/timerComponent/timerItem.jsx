import React, { useState, useEffect, useRef } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

function TimerItem({ id, hh, mm, ss, onDelete, permanent }) {
    const initialTotal = parseInt(hh) * 3600 + parseInt(mm) * 60 + parseInt(ss);
    const [totalSeconds, setTotalSeconds] = useState(initialTotal);
    const [isRunning, setIsRunning] = useState(false);
    const [endTime, setEndTime] = useState(null);
    const [isFirstRender, setIsFirstRender] = useState(true);
    const timerRef = useRef(null);
    const alarmRef = useRef();

    const formatTime = (time) => String(time).padStart(2, "0");
    const hour = Math.floor(totalSeconds / 3600);
    const minute = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const percentage = (totalSeconds / initialTotal) * 100;
    
    const timerColors = isRunning ? "rgb(59, 130, 246)" : "rgb(156, 163, 175)";

    useEffect(() => {
        const saved = localStorage.getItem(`timer-${id}`);
        if (saved) {
            const { savedEndTime, paused, remaining } = JSON.parse(saved);
            if (!paused && savedEndTime) {
                const rem = Math.max(0, Math.floor((savedEndTime - Date.now()) / 1000));
                setTotalSeconds(rem);
                setIsRunning(rem > 0);
                setEndTime(savedEndTime);
            } else {
                setTotalSeconds(remaining ?? initialTotal);
                setIsRunning(false);
            }
        }
        setIsFirstRender(false);
    }, [id, initialTotal]);
    
    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setTotalSeconds(prev => {
                    if (prev < 1) {
                        clearInterval(timerRef.current);
                        setIsRunning(false);
                        setTotalSeconds(initialTotal);
                        
                        if (alarmRef.current) {
                            alarmRef.current.loop = true;
                            alarmRef.current.play().catch(() => {});
                        }

                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [isRunning, initialTotal]);

    useEffect(() => {
        if (!isFirstRender) {
            localStorage.setItem(
                `timer-${id}`,
                JSON.stringify({
                    savedEndTime: isRunning ? endTime : null,
                    paused: !isRunning,
                    remaining: totalSeconds
                })
            );
        }
    }, [isRunning, totalSeconds, endTime, id, isFirstRender]);
    

    const handleStartPause = () => {
        if (isRunning) {
            setIsRunning(false);
            setEndTime(null);
            if (alarmRef.current) alarmRef.current.pause();
        } else {
            const newEnd = Date.now() + totalSeconds * 1000;
            setEndTime(newEnd);
            setIsRunning(true);
        }
    };

    const handleReset = () => {
        clearInterval(timerRef.current);
        setTotalSeconds(initialTotal);
        setIsRunning(false);
        setEndTime(null);
        if (alarmRef.current) {
            alarmRef.current.pause();
            alarmRef.current.currentTime = 0;
        }
    };

    const handleDelete = () => {
        clearInterval(timerRef.current);
        localStorage.removeItem(`timer-${id}`);
        if (alarmRef.current) {
            alarmRef.current.pause();
            alarmRef.current.currentTime = 0;
        }
        onDelete();
    };

    return (
        <div className="break-inside-avoid-column w-60 flex flex-col items-center rounded-xl bg-gray-900 gap-4 relative">
            <div className="flex flex-row items-center justify-between w-full text-gray-400 text-sm font-semibold">
                <div>
                    {formatTime(hh)}h {formatTime(mm)}m {formatTime(ss)}s Timer
                </div>
                {!permanent && (
                    <CloseIcon
                        sx={{ fontSize: 18 }}
                        className="text-gray-400 cursor-pointer hover:text-red-500 transition-colors"
                        onClick={handleDelete}
                    />
                )}
            </div>
            
            <div
                className="w-36 h-36 flex items-center justify-center rounded-full relative"
                style={{
                    background: `conic-gradient(${timerColors} ${percentage}%, transparent ${percentage}%)`,
                    transition: 'background 1s linear',
                }}
            >
                <div className="w-[95%] h-[95%] flex items-center justify-center rounded-full bg-gray-900">
                    <div className="font-bold text-2xl text-white">
                        {formatTime(hour)}:{formatTime(minute)}:{formatTime(seconds)}
                    </div>
                </div>
            </div>
            
            <div className="flex gap-4">
                <button
                    className="p-3 rounded-full bg-red-700 hover:bg-red-800 transition-colors text-white shadow-md"
                    onClick={handleReset}
                    aria-label="Reset timer"
                >
                    <RotateLeftIcon sx={{ fontSize: 30 }} />
                </button>
                <button
                    onClick={handleStartPause}
                    className="p-3 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors text-white shadow-md"
                    aria-label={isRunning ? "Pause timer" : "Start timer"}
                >
                    {isRunning ? (
                        <PauseIcon sx={{ fontSize: 30 }} />
                    ) : (
                        <PlayArrowIcon sx={{ fontSize: 30 }} />
                    )}
                </button>
            </div>
            <audio ref={alarmRef} src="alarmAudio.mp3" preload="auto" />
        </div>
    );
}

export default TimerItem;
