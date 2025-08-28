import { useEffect, useState } from "react";
import { auth } from "../../../firebase/auth.js";
import { DateWeather } from "./weather&DateBox.jsx";

function IntroText() {
    const [greetText, setGreetText] = useState("Morning");
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreetText("Morning");
        else if (hour < 18) setGreetText("Afternoon");
        else if (hour < 21) setGreetText("Evening");
        else setGreetText("Night");
    }, []);

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUserName(localStorage.getItem("username") || currentUser.displayName || "Student");
        }
    }, []);

    return (
        <div className="flex flex-wrap gap-3 justify-between">
            <div className="flex flex-col">
                    <h2 className="text-xl font-bold leading-tight">
                    Good {greetText}, {userName || "User"}!
                </h2>
                <p className="text-sm text-gray-300 font-medium">
                    Here's your productivity overview for today.
                </p>
            </div>
            <DateWeather />
        </div>
    );
}

export default IntroText;
