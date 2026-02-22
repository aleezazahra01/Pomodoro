# Pomodoro Timer

## Overview
Pomodoro Timer is a web application designed to enhance productivity using the Pomodoro technique. The app helps users focus on tasks by breaking work into timed intervals, separated by breaks. It combines task management, session tracking, and productivity insights to provide a comprehensive workflow tool.

The app includes features such as a todo list, notes, dark/light mode, music integration for focus, and visual insights into completed sessions.

---

## Features

- **Pomodoro & Break Modes**
  - Switch between work (Pomodoro) sessions and short breaks.
  - Default intervals: 25 minutes for work, 5 minutes for breaks.
  - Start, pause, and reset timers easily.

- **Customizable Themes**
  - Toggle between dark mode and light mode.
  - Background and UI adjust dynamically according to mode and session type.

- **Task Management**
  - Add tasks to a todo list.
  - Mark tasks as completed or remove them.
  - Tasks persist using `localStorage`.

- **Session Tracking & Insights**
  - Tracks daily work minutes.
  - Displays productivity stats via a responsive bar chart.
  - Shows completed sessions for the week to identify focus trends.

- **Audio Alerts & Notifications**
  - Plays sound when a session or break ends.
  - Browser notifications alert users when sessions finish.
  - Users can grant notification permissions for real-time updates.

- **Music Integration**
  - Optional background music to improve focus during sessions.
  - Music component changes dynamically based on session mode.

- **Responsive Design**
  - Fully responsive layout for mobile, tablet, and desktop devices.
  - Uses circular progress bar to visually show remaining time.

- **Visual & UX Enhancements**
  - Circular progress bar with dynamic color based on session type.
  - Gradient mesh background in dark mode.
  - Hover animations on icons for task and break illustrations.

- **Local Storage Persistence**
  - Tasks, sessions, theme, and mode are saved in localStorage.
  - Data persists between page reloads.

- **Notes & Todo Integration**
  - Users can add notes about tasks or sessions.
  - Provides insight into productivity habits.

---

## Tech Stack

- **Frontend:** React.js with TypeScript
- **Styling:** Tailwind CSS
- **Charts & Progress:** Recharts, react-circular-progressbar
- **Audio & Notifications:** HTML5 Audio, Browser Notification API
- **Deployment:** Vercel

---

