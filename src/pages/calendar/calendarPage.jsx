import { useEffect, useState, useRef } from "react";
import Navbar from "../../components/navbar";
import DateBox from "./calendarComponent/dateBox";
import AddIcon from "@mui/icons-material/Add";
import EventTypeInfo from "./calendarComponent/eventTypeInfo";
import EventList from "./calendarComponent/eventList";
import CloseIcon from "@mui/icons-material/Close";
import Toast from "../../components/Toast";
import Calendar from "./calendarComponent/calendar";

function CalendarPage() {
    const [dates, setDates] = useState([]);
    const [showAddBar, setShowAddBar] = useState(false);
    const [event, setEvent] = useState("");
    const [events, setEvents] = useState([]);
    const [editEventId, setEditEventId] = useState(null);
    const [isPermanent, setIsPermanent] = useState(false);
    const [eventDate, setEventDate] = useState("");
    const [eventType, setEventType] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [toast, setToast] = useState(null);
    const [filter, setFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [eventFromTime, setEventFromTime] = useState("");
    const [eventToTime, setEventToTime] = useState("");
    const [eventTime, setEventTime] = useState("");
    const scrollRef = useRef(null);
    const today = new Date();

    useEffect(() => {
        const storedEvents = localStorage.getItem("events");
        if (storedEvents) {
            setEvents(JSON.parse(storedEvents));
        }
        setIsFirstRender(false);
    }, []);

    useEffect(() => {
        if (!isFirstRender) {
            localStorage.setItem("events", JSON.stringify(events));
        }
    }, [events, isFirstRender]);

    useEffect(() => {
        if(!isFirstRender) {
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);
            const arr = [];
            for (let i = 0; i <= 30; i++) {
                const dateObj = new Date(todayDate);
                dateObj.setDate(todayDate.getDate() + i);
                const hasEvent = events.some(event => {
                    const eventParsedDate = new Date(event.eventDate + "T00:00:00");
                    eventParsedDate.setHours(0, 0, 0, 0);
                    if (event.isPermanent) {
                        return (
                            eventParsedDate.getDate() === dateObj.getDate() &&
                            eventParsedDate.getMonth() === dateObj.getMonth()
                        );
                    } else {
                        return eventParsedDate.toDateString() === dateObj.toDateString();
                    }
                });
                arr.push({
                    id: i,
                    fullDate: dateObj,
                    day: dateObj.toLocaleString("default", { weekday: "short" }),
                    hasEvent: hasEvent,
                });
            }
            setDates(arr);
        }
    }, [events,isFirstRender]);

    const onDelete = (id) => {
        setEvents(prev => prev.filter(e => e.id !== id));
        setToast({ type: "success", message: "Event deleted successfully!" });
    };

    const editEvent = (id) => {
        const ev = events.find(e => e.id === id);
        if (ev) {
            setEditEventId(ev.id);
            setEvent(ev.event);
            setEventDate(ev.eventDate);
            setEventType(ev.eventType);
            setEventTime(ev.eventTime);
            setIsPermanent(ev.isPermanent);
            setShowAddBar(true);
        }
    };

    const handleAddEvent = () => {
        if (!event.trim() || !eventDate || !eventType || !eventFromTime || !eventToTime) {
            setToast({ type: "error", message: "Please fill all the fields!" });
            return;
        }

        if (editEventId) {
            setEvents((prev) =>
                prev.map((e) =>
                    e.id === editEventId
                        ? { ...e, event: event.trim(), eventDate, eventType, eventTime, isPermanent }
                        : e
                )
            );
            setEditEventId(null);
            setToast({ type: "success", message: "Event updated successfully!" });
        } else {
            const newEvent = {
                id: Date.now(),
                event: event.trim(),
                eventDate : eventDate,
                eventType: eventType,
                eventTime: eventFromTime + " - " + eventToTime,
                isPermanent: isPermanent
            };
            setEvents((prev) => [...prev, newEvent]);
            setToast({ type: "success", message: "Event added successfully!" });
        }

        setEvent("");
        setEventDate("");
        setEventFromTime("");
        setEventToTime("");
        setEventType("");
        setIsPermanent(false);
        setShowAddBar(false);
    };

    const filteredEvents = events
        .filter(ev => {
            const evDate = new Date(ev.eventDate + "T00:00:00");
            const todayNormalized = new Date(today);
            todayNormalized.setHours(0, 0, 0, 0);

            if (filter === "Today") {
                return evDate.toDateString() === todayNormalized.toDateString();
            } else if (filter === "Upcoming") {
                return evDate > todayNormalized;
            } else if (filter === "Repeating") {
                return ev.isPermanent;
            } else if (filter !== "All") {
                return ev.eventType === filter;
            }
            return true;
        })
        .filter(ev => ev.event.toLowerCase().includes(searchTerm.toLowerCase()));

    const eventTypeList = [
        "Anniversary / Birthday", "Appointment", "Conference", "Deadline", "Exam",
        "Festival", "Hackathon", "Interview", "Lecture", "Meeting", "Party", "Payments",
        "Seminar", "Submission", "Tournament", "Vacation / Holiday", "Webinar", "Workshop", "Other"
    ];

    return (
        <div className="w-full min-h-screen flex flex-col bg-gray-950 text-white p-3">
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
            <Navbar page={"Calendar"} />
            <div className="flex flex-col h-full w-full max-w-7xl mx-auto p-3">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-1">Calendar Events</h1>
                    <p className="text-base text-gray-400">
                        Organize, tag, and keep track of important dates.
                    </p>
                </div>
                <div
                    ref={scrollRef}
                    className="w-full mt-4 flex flex-row overflow-x-auto space-x-3 pb-4 no-scrollbar border-b border-gray-700 mb-6"
                >
                    {dates.map((d) => (
                        <DateBox
                            key={d.id}
                            fullDate={d.fullDate}
                            day={d.day}
                            event={d.hasEvent}
                        />
                    ))}
                </div>
        
                <div className="w-full mt-6 flex flex-col lg:flex-row gap-8">
                    <Calendar calendarEvents={events} />
                    <EventTypeInfo />
                </div>
                <div className="pt-8">
                    <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-xl outline-none border border-gray-700 focus:ring-2 focus:ring-blue-500 shadow-md w-full sm:w-auto placeholder-gray-500"
                        />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-gray-800 text-white px-4 py-3 rounded-xl outline-none border border-gray-700 shadow-md cursor-pointer w-full sm:w-auto text-sm"
                        >
                            <option value="All" className="bg-gray-800 text-white">All Events</option>
                            <option value="Today" className="bg-gray-800 text-white">Today</option>
                            <option value="Upcoming" className="bg-gray-800 text-white">Upcoming</option>
                            <option value="Repeating" className="bg-gray-800 text-white">Repeating</option>
                            {eventTypeList
                                .filter((type) => events.some((ev) => ev.eventType === type))
                                .map((type) => (
                                    <option key={type} value={type} className="bg-gray-800 text-white">
                                        {type}
                                    </option>
                                ))}
                        </select>
                    </div>
                    {filteredEvents.length === 0 ? (
                        <p className="text-gray-500 text-center py-10">No events found for this filter or search.</p>
                    ) : (
                        filteredEvents.map((ev) => (
                            <EventList
                                key={ev.id}
                                event={ev.event}
                                eventType={ev.eventType}
                                eventDate={ev.eventDate}
                                eventTime={ev.eventTime}
                                onDelete={() => onDelete(ev.id)}
                                onEdit={() => editEvent(ev.id)}
                            />
                        ))
                    )}
                </div>
            </div>
        
            {!showAddBar && (
                <button
                    onClick={() => {
                        setShowAddBar(true);
                        setEvent("");
                        setEventDate("");
                        setEventType("");
                        setIsPermanent(false);
                        setEditEventId(null);
                    }}
                    className="fixed bottom-6 right-6 bg-sky-600 p-4 rounded-full shadow-lg hover:bg-sky-700 transition-colors z-50 flex items-center justify-center"
                    aria-label="Add new event"
                >
                    <AddIcon sx={{ fontSize: 28 }} className="text-white" />
                </button>
            )}
        
            {showAddBar && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-70 z-40 backdrop-blur-sm"
                        onClick={() => setShowAddBar(false)}
                    ></div>
                    <div className="w-[90%] max-w-md fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 bg-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700 animate-fadeIn">
                        <div className="flex justify-between items-center w-full mb-2">
                            <h2 className="text-xl font-bold">{editEventId ? "Edit Event" : "Add New Event"}</h2>
                            <button
                                onClick={() => {
                                    setShowAddBar(false);
                                    setEvent("");
                                    setEventDate("");
                                    setEventType("");
                                    setIsPermanent(false);
                                    setEditEventId(null);
                                }}
                                className="text-gray-400 hover:text-white transition-colors p-1 rounded-full"
                                aria-label="Close modal"
                            >
                                <CloseIcon sx={{ fontSize: 24 }} />
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Event Title"
                            onChange={(e) => setEvent(e.target.value)}
                            value={event}
                            className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-sm"
                        />
                        <select
                            value={eventType}
                            onChange={(e) => setEventType(e.target.value)}
                            className="w-full text-gray-300 bg-gray-800 p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none cursor-pointer"
                        >
                            <option value="" className="bg-gray-800">Select event type</option>
                            {eventTypeList.map((type) => (
                                <option key={type} value={type} className="bg-gray-800 text-white">
                                    {type}
                                </option>
                            ))}
                        </select>
                        <input
                            placeholder="Event Date"
                            type="date"
                            value={eventDate}
                            className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-sm"
                            onChange={(e) => setEventDate(e.target.value)}
                        />
                        <input
                            placeholder="From"
                            type="time"
                            value={eventFromTime}
                            className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-sm"
                            onChange={(e) => setEventFromTime(e.target.value)}
                        />
                        <input
                            placeholder="To"
                            type="time"
                            value={eventToTime}
                            className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-sm"
                            onChange={(e) => setEventToTime(e.target.value)}
                        />
                        <div className="flex items-center gap-3 w-full justify-start">
                            <input
                                type="checkbox"
                                id="isPermanent"
                                checked={isPermanent}
                                onChange={(e) => setIsPermanent(e.target.checked)}
                                className="w-5 h-5 accent-blue-600 rounded-sm"
                            />
                            <label htmlFor="isPermanent" className="text-sm text-gray-300">
                                Repeats every year on same date
                            </label>
                        </div>
                        <div className="flex justify-end gap-3 w-full pt-2">
                            <button
                                onClick={handleAddEvent}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition shadow-md text-sm"
                            >
                                {editEventId ? "Update Event" : "Add Event"}
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddBar(false);
                                    setEvent("");
                                    setEventDate("");
                                    setEventType("");
                                    setIsPermanent(false);
                                    setEditEventId(null);
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

export default CalendarPage;