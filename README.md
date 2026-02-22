# Pomodoro Timer

## Overview
Pomodoro Timer is a web application designed to enhance productivity using the Pomodoro technique. The app helps users focus on tasks by breaking work into timed intervals, separated by breaks. It combines task management, session tracking, and productivity insights to provide a comprehensive workflow tool.

The app includes features such as a todo list, notes, dark/light mode, music integration for focus, and visual insights into completed sessions.

---

## Features
Automated Pomodoro Cycles: The timer no longer just stops at zero. It intelligently switches from Work mode to Break mode automatically, keeping your flow going without manual input.

Dynamic Long Break Logic: Integrated the "true" Pomodoro methodology where the app tracks your progress. After every 4 focus sessions, the timer automatically scales up to a 15-minute Long Break instead of the standard 5 minutes.
Smart Session Tracking: Added a session counter (sessionCount) that manages your work/break transitions behind the scenes while keeping the UI clean and focused.
Intelligent Progress Calculation: The circular progress bar now dynamically adapts its percentage based on whether you are in a Work, Short Break, or Long Break session.
Context-Aware Notifications: Browser notifications now specify exactly what stage you are entering—alerting you specifically when it’s time for that well-earned long break.
Persistent State Management: Your session counts and focus minutes are saved to localStorage, so your progress towards a long break isn't lost if you refresh the pag

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


- **Music Integration**
  - Optional background music to improve focus during sessions.
  - Music component changes dynamically based on session mode.

- **Responsive Design**
  - Fully responsive layout for mobile, tablet, and desktop devices.
  - Uses circular progress bar to visually show remaining time.

- **Local Storage Persistence**
  - Tasks, sessions, theme, and mode are saved in localStorage.
  - Data persists between page reloads.

---

## Tech Stack

- **Frontend:** React.js with TypeScript
- **Styling:** Tailwind CSS
- **Charts & Progress:** Recharts, react-circular-progressbar
- **Audio & Notifications:** HTML5 Audio, Browser Notification API
- **Deployment:** Vercel

---

