import IntroText from "./dashboardComponents/introText";
import Navbar from "../../components/navbar";
import TimerItem from "../timer/timerComponent/timerItem";
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useState, useEffect } from "react";
import useAuth from "../../context/useAuth";
import EventList from "../calendar/calendarComponent/eventList";
import NotesItem from "../notes/notesComponent/notesItem";
import TaskItem from "../tasks/tasksComponent/taskItem";
import Pomodoro from "../timer/timerComponent/pomodoro";
import { WeatherBox } from "./dashboardComponents/weather&DateBox";
import Calendar from "../calendar/calendarComponent/calendar";
import PrePageLoaders from "../../components/prePageLoaders";
function Dashboard() {
    const [events, setEvents] = useState(null);
    const [tasks, setTasks] = useState(null);
    const [notes, setNotes] = useState(null);
    const { user, loading } = useAuth();

    useEffect(() => {
        const getEvents = localStorage.getItem("events");
        const getTasks = localStorage.getItem("tasks");
        const getNotes = localStorage.getItem("notes");

        const today = new Date().toISOString().slice(0, 10);
 
        if (getEvents) {
            const allEvents = JSON.parse(getEvents);
            const todaysEvents = allEvents.filter(event => event.eventDate === today);
            setEvents(todaysEvents.length > 0 ? todaysEvents : null);
        } else {
            setEvents(null);
        }

        if (getTasks) {
            const allTasks = JSON.parse(getTasks);
            const todaysTasks = allTasks.filter(task => task.dueDate === today);
            setTasks(todaysTasks.length > 0 ? todaysTasks : null);
        } else {
            setTasks(null);
        }

        if (getNotes) {
            const allNotes = JSON.parse(getNotes);
            const firstTwoNotes = allNotes.slice(0, 2);
            setNotes(firstTwoNotes.length > 0 ? firstTwoNotes : null);
        } else {
            setNotes(null);
        }
    }, []);

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-950 text-white p-3">
            {loading ? (
                <PrePageLoaders />
            ) : (
                <>
                    <Navbar page={"Dashboard"} />
                    <div className="max-w-7xl mx-auto p-3">
                        <IntroText />
                        <div className="my-8">
                            <div className="flex flex-wrap justify-start gap-2 mt-6">
                                {!user ?  (
                                        <button
                                            onClick={() => navigate("/auth")} 
                                            className="h-fit flex bg-sky-600 text-white px-5 py-3 rounded-xl hover:bg-sky-700 transition-colors duration-200 ease-in-out shadow-lg transform hover:scale-105 gap-2"
                                        >
                                            <span className="text-xs font-semibold">Join Today</span>
                                        </button>
                                    ):(
                                        <>
                                            <button
                                                className="h-fit flex flex-row items-center justify-center bg-indigo-500 text-white px-5 py-3 rounded-xl hover:bg-indigo-600 transition-colors duration-200 ease-in-out shadow-lg transform hover:scale-105 gap-2"
                                                onClick={() => navigate("/tasks")}
                                            >
                                                <AddIcon sx={{ fontSize: 20 }} />
                                                <span className="text-xs font-medium mt-1">Add Task</span>
                                            </button>
                                            <button gap-2
                                                className="h-fit flex flex-row items-center justify-center bg-gray-800 text-gray-300 px-5 py-3 rounded-xl hover:bg-gray-700 transition-colors duration-200 ease-in-out shadow-lg transform hover:scale-105 gap-2"
                                                onClick={() => navigate("/timer")}
                                            >
                                                <AccessTimeIcon sx={{ fontSize: 20 }} />
                                                <span className="text-xs font-medium mt-1">Start Timer</span>
                                            </button>
                                            <button
                                                className="h-fit flex flex-row items-center justify-center bg-gray-800 text-gray-300 px-5 py-3 rounded-xl hover:bg-gray-700 transition-colors duration-200 ease-in-out shadow-lg transform hover:scale-105 gap-2"
                                                onClick={() => navigate("/calendar")}
                                            >
                                                <EventNoteIcon sx={{ fontSize: 20 }} />
                                                <span className="text-xs font-medium mt-1">Add Event</span>
                                            </button>
                                        </>
                                    )
                                }
                            </div>
                            <div className="columns-1 md:columns-2 gap-4 mt-10">
                                <div className="break-inside-avoid my-4">
                                    <WeatherBox />
                                </div>
                                {user ? (
                                    <div  
                                        className="break-inside-avoid my-4"
                                        onClick={() => navigate("/calendar")}
                                    >
                                        <Calendar 
                                            calendarEvents={events}
                                        />
                                    </div>
                                ) : null}
                                <div
                                    className="break-inside-avoid my-4 bg-gray-900 border border-gray-700 rounded-2xl p-4 flex flex-col justify-between cursor-pointer"
                                    onClick={() => navigate("/timer")}
                                >
                                    <div className="text-md font-bold mb-4">Focus Timer</div>
                                    <div 
                                        className="flex justify-center"
                                    >
                                        <TimerItem
                                            id={"permanent"}
                                            hh={"00"}
                                            mm={"05"}
                                            ss={"00"}
                                            permanent={true}
                                        />
                                    </div>
                                </div>
                                {user ? (
                                    <>
                                        <div
                                            className="break-inside-avoid my-4 bg-gray-900 border border-gray-700 rounded-2xl p-4 flex flex-col justify-between cursor-pointer"
                                            onClick={() => navigate("/calendar")}
                                            >
                                                <h2 className="text-md font-bold mb-4">Today's Schedule</h2>
                                                <div className="flex-grow flex flex-col justify-center items-center">
                                                    {events ? (
                                                        <div className="space-y-4 w-full">
                                                            {events.map((event, index) => (
                                                                <EventList
                                                                    key={index}
                                                                    event={event.event}
                                                                    eventDate={event.eventDate}
                                                                    eventTime={event.eventTime}
                                                                    eventType={event.eventType}
                                                                />
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-gray-500 italic text-center py-8">No events scheduled for today.</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="break-inside-avoid-column my-4 bg-gray-900 border border-gray-700 rounded-2xl p-5 flex flex-col justify-between cursor-pointer"
                                                onClick={() => navigate("/notes")}
                                            >
                                                <h2 className="text-md font-bold mb-4">Recent Notes</h2>
                                                <div className="flex-grow flex flex-col justify-center items-center">
                                                    {notes ? (
                                                        <div className="space-y-4 w-full">
                                                            {notes.map((note, index) => (
                                                                <NotesItem
                                                                    key={index}
                                                                    note={note}
                                                                />
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-gray-500 italic text-center py-8">You have no notes.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    ) : null
                                }
                                
        
                                <div className="break-inside-avoid my-4 bg-gray-900 border border-gray-700 rounded-2xl p-5 flex flex-col justify-between cursor-point"
                                    onClick={() => navigate("/tasks")}
                                >
                                    <h2 className="text-md font-bold mb-4">Today's Tasks</h2>
                                    <div className="flex-grow flex flex-col justify-center items-center">
                                        {tasks ? (
                                            <div className="space-y-4 w-full">
                                                {tasks.map((task, index) => (
                                                    <TaskItem
                                                        key={index}
                                                        task={task.task}
                                                        dueDate={task.dueDate}
                                                        taskType={task.taskType}
                                                        isComplete={task.isComplete}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 italic text-center py-8">No tasks scheduled for today.</p>
                                        )}
                                    </div>
                                </div>
        
                                <div
                                    className="break-inside-void my-4"
                                    onClick={() => navigate("/timer")}
                                >
                                    <Pomodoro/>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Dashboard;