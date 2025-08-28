import { useEffect } from "react";

function Toast({ type = "success", message, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
    const borderColor = type === "success" ? "border-green-300" : "border-red-300";

    return (
        <div className={`fixed top-5 right-1/2 translate-x-1/2 translate-y-1/2 z-[999999] px-4 py-3 rounded-xl shadow-md border text-center ${bgColor} ${borderColor} animate-slide-in`}>
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
}

export default Toast;
