# Productivity Web App

A modern productivity web app built with **React** that helps you manage your time and tasks effectively.  
It combines a **Calendar Event Tagger**, **Pomodoro Timer and Alarm**, **Task Manager**, **Notes Container**, and **Settings Panel** — all secured with **Google Firebase Authentication**.

---

## Features

- **Calendar Event Tagger** – Add, edit, and manage your events easily.
- **Pomodoro Timer and Alarm** – Stay focused with a customizable timer.
- **Task Manager** – Create, update, and organize your to-dos.
- **Notes Container** – Keep your notes in one place for quick access.
- **Google Firebase Authentication** – Secure login and user management.

---

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Authentication:** Firebase Auth (Google OAuth)
- **Storage:** LocalStorage
- **State Management:** Redux

---

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/AbhaySuryaKS/TaskZenIx.git
   cd TaskZenIx
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Add your Firebase configuration to `.env`:
     ```
     VITE_FIREBASE_API_KEY=your-api-key
     VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
     VITE_FIREBASE_PROJECT_ID=your-project-id
     VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
     VITE_FIREBASE_APP_ID=your-app-id
     ```
4. **Start the development server**
   ```bash
   npm start
   ```

---

## Usage

- **Sign In:** Log in securely with your Google account.
- **Calendar:** Tag and manage your daily events.
- **Pomodoro Timer:** Start/stop timers and alarms for focused work sessions.
- **Tasks:** Add, mark as complete, edit, and delete to-dos.
- **Notes:** Create and organize notes for quick access.
- **Settings:** Adjust theme, notifications, and account preferences.

---

## Credits

Made by [Abhay Surya K S](https://github.com/AbhaySuryaKS/)  
Inspired by the productivity community!
