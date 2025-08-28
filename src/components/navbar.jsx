import React, { useEffect, useState, useRef } from "react";
import { auth } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import ShortTextIcon from "@mui/icons-material/ShortText";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import AddTaskIcon from "@mui/icons-material/AddTask";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SettingsIcon from "@mui/icons-material/Settings";
import useAuth from "../context/useAuth"

function Navbar({ page }) {
    const [name, setName] = useState("");
    const [photo, setPhoto] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const { user, loading } = useAuth();
    const menuRef = useRef(null);

    const navigate = useNavigate();
    const [activeWindow, setActiveWindow] = useState("dashboard");

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setName(
                localStorage.getItem("username") ||
                currentUser.displayName ||
                "User"
            );
            setPhoto(localStorage.getItem("photoURL") || currentUser.photoURL);
        }
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        setActiveWindow(window.location.pathname.split("/").pop());
    }, []);

    const NavbarItems = [
        {
            icon: <SpaceDashboardIcon />,
            name: "Dashboard",
            path: "/dashboard",
            key: "dashboard"
        },
        {
            icon: <EditCalendarIcon />,
            name: "Calendar",
            path: "/calendar",
            key: "calendar"
        },
        {
            icon: <AccessAlarmIcon />,
            name: "Timer",
            path: "/timer",
            key: "timer"
        },
        {
            icon: <AddTaskIcon />,
            name: "Tasks",
            path: "/tasks",
            key: "tasks"
        },
        {
            icon: <EditNoteIcon />,
            name: "Notes",
            path: "/notes",
            key: "notes"
        },
        {
            icon: <SettingsIcon />,
            name: "Settings",
            path: "/settings",
            key: "settings"
        },
    ];

    return (
        <div className="flex items-center justify-between w-full bg-gray-950 border-b border-gray-500 shadow-md py-2 mb-2">
            <div ref={menuRef} className="flex items-center gap-4 relative">
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="p-1 rounded-full text-gray-300 hover:text-sky-400 hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring focus:ring-sky-500"
                    aria-label="Open navigation menu"
                >
                    <ShortTextIcon sx={{ fontSize: 30 }} />
                </button>
                {isOpen && (
                    <nav className="absolute top-full left-0 mt-3 bg-gray-900 rounded-full shadow-xl z-50 border border-gray-800 animate-fadeIn origin-top-left">
                        <div className="flex flex-col gap-1">
                            {NavbarItems.map((item) => (
                                <button
                                    key={item.key}
                                    className={`flex items-center gap-3 p-3 rounded-full transition-colors duration-200 
                                        ${activeWindow === item.key
                                            ? "text-sky-400 bg-gray-800 font-semibold"
                                            : "text-gray-300 hover:text-white hover:bg-gray-800"
                                        }`}
                                    onClick={() => {
                                        setActiveWindow(item.key);
                                        navigate(item.path);
                                        setIsOpen(false); 
                                    }}
                                >
                                    <span className="text-xl flex items-center justify-center">{item.icon}</span>
                                </button>
                            ))}
                        </div>
                    </nav>
                )}
                <img
                    src= "logo.png" 
                    alt="TaskZenIx Logo"
                    className="w-9 h-9 rounded-full object-cover shadow-md"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/36x36/2d3748/a0aec0?text=Logo"; }}
                />
                <div>
                    <h1 className="text-base font-bold text-white">TaskZenIx</h1>
                    <h2 className="text-sm font-medium text-gray-400">{page}</h2>
                </div>
            </div>
            {user ? (
                <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => navigate("/settings")}
                >
                    <img
                        src={photo || "https://placehold.co/32x32/2d3748/a0aec0?text=U"}
                        alt={`${name || "User"}'s profile`}
                            className="w-8 h-8 rounded-full object-cover border-2 border-indigo-600 shadow-md"
                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/32x32/2d3748/a0aec0?text=U"; }}
                       />
                </div>
                ) : (
                    <button
                        onClick={() => navigate("/auth")} 
                        className="h-fit flex px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 transition-colors duration-200 ease-in-out shadow-lg transform hover:scale-105 gap-2"
                    >
                        <span className="text-xs font-semibold">Signup</span>
                    </button>
                ) 
            }
        </div>
    );
}

export default Navbar;
