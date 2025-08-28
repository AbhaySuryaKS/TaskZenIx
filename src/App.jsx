import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/protectedRout";
import RedirectIfAuth from "./routes/redirectIfAuth";

import Dashboard from "./pages/dashboard/dashboardPage";
import AuthenticationPage from "./pages/auth/authPage";
import CalendarPage from "./pages/calendar/calendarPage";
import TasksPage from "./pages/tasks/tasksPage";
import TimerPage from "./pages/timer/timerPage";
import NotesPage from "./pages/notes/notesPage";
import SettingsPage from "./pages/settings/settingsPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/timer" element={<TimerPage />} />
                <Route path="/tasks" element={<TasksPage />} />

                <Route
                    path="/calendar"
                    element={
                        <ProtectedRoute>
                            <CalendarPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <SettingsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/notes"
                    element={
                        <ProtectedRoute>
                            <NotesPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/auth"
                    element={
                        <RedirectIfAuth>
                            <AuthenticationPage />
                        </RedirectIfAuth>
                    }
                />

                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
