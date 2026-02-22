import { useState, useRef, useEffect } from "react";
import coffee from "../assets/undraw_coffee-time_98vi.svg";
import clock from "../assets/undraw_time-management_4ss6.svg";
import focus from "../assets/undraw_taking-notes_oyqz.svg";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Music from "../components/Music";

import Head from '../components/Head'
import Foot from "../components/Footer"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Home = () => {
  type Task = {
    text: string;
    completed: boolean;
  };

  const [mode, setMode] = useState<"work" | "break">("work");
  const [darkMode, setDarkMode] = useState(true);
  const [time, setTime] = useState<number>(25 * 60);
  const [start, setStart] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [initial, setInitial] = useState<string>("");

  const [sessions, setSessions] = useState<{ day: string; minutes: number }[]>(() => {
    const saved = localStorage.getItem("sessions");
    return saved ? JSON.parse(saved) : [];
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const pink = "#E053A6";
  const blue = "#3B82F6";
  const currentThemeColor = mode === "work" ? pink : blue;

  const meshBg = mode === "work"
      ? "radial-gradient(at 0% 0%, hsla(328, 73%, 15%, 1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(328, 73%, 5%, 1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(280, 73%, 10%, 1) 0, transparent 50%), #0a0a0a"
      : "radial-gradient(at 0% 0%, hsla(217, 91%, 15%, 1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(217, 91%, 5%, 1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(240, 91%, 10%, 1) 0, transparent 50%), #0a0a0a";

  const lightBg = mode === "work" ? "var(--home--bg)" : "#e0f2fe";

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const addTask = () => {
    if (initial.trim() === "") return;
    setTasks([...tasks, { text: initial, completed: false }]);
    setInitial("");
  };

  // Logic to handle the end of a timer
  const handleSwitch = () => {
    audioRef.current?.play();
    const today = new Date().toLocaleDateString("en-US", { weekday: "short" });

    if (mode === "work") {
      const nextCount = sessionCount + 1;
      setSessionCount(nextCount);
      setMode("break");
      
      const isLongBreak = nextCount > 0 && nextCount % 4 === 0;
      setTime(isLongBreak ? 15 * 60 : 5 * 60);

      setSessions((prevSessions) => {
        const existing = prevSessions.find((s) => s.day === today);
        if (existing) {
          return prevSessions.map((s) =>
            s.day === today ? { ...s, minutes: s.minutes + 25 } : s
          );
        } else {
          return [...prevSessions, { day: today, minutes: 25 }];
        }
      });

      if (Notification.permission === "granted") {
        new Notification(isLongBreak ? "Time for a 15-min Long Break!" : "Work done! Take a break.");
      }
    } else {
      setMode("work");
      setTime(25 * 60);
      if (Notification.permission === "granted") {
        new Notification("Break over! Focus time.");
      }
    }
  };

  // Main Timer Effect
  useEffect(() => {
    if (start && time > 0) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (time === 0 && start) {
      handleSwitch();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [start, time, mode]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("sessions", JSON.stringify(sessions));
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [tasks, sessions, darkMode]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    audioRef.current = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
  }, []);

  useEffect(() => {
    document.title = start ? `(${formatTime(time)}) Pomodoro` : "Pomodoro App";
  }, [time, start]);

  const totalPossibleTime = mode === "work" ? 25 * 60 : (sessionCount > 0 && sessionCount % 4 === 0 ? 15 * 60 : 5 * 60);
  const progressPercent = ((totalPossibleTime - time) / totalPossibleTime) * 100;

  return (
    <div 
      className="min-h-screen w-full relative transition-colors duration-500" 
      style={{ 
        backgroundColor: darkMode ? undefined : lightBg, 
        color: darkMode ? "#fff" : "var(--home-text)" 
      }}
    >
      {darkMode && (
        <div style={{ background: meshBg }} className="fixed inset-0 z-0 transition-opacity duration-1000" />
      )}

      <Head darkMode={darkMode} mode={mode} setDarkMode={setDarkMode}/>

      <div className="relative z-10 w-full px-4 py-10 md:px-10 lg:px-20 flex flex-col items-center">
        <div className="grid grid-cols-1 mt-3 lg:grid-cols-3 gap-12 w-full max-w-7xl items-start">
        {/* TASK LIST SECTION */}
<div className="order-2 lg:order-1 lg:mr-9 lg:mt-24 flex flex-col space-y-6 w-full">
  <div className="flex gap-2">
    <input
      onKeyDown={(e) => e.key === "Enter" && addTask()}
      onChange={(e) => setInitial(e.target.value)}
      value={initial}
      className={`flex-1 p-3 rounded-lg border focus:outline-none focus:ring-2 shadow-sm ${darkMode ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-400" : "bg-white border-gray-200 focus:ring-pink-300"}`}
      placeholder="What are you working on?"
    />
    <button
      onClick={addTask}
      style={{ backgroundColor: currentThemeColor }}
      className="text-white px-6 py-2 rounded-lg transition-colors shadow-sm font-bold"
    >
      Add
    </button>
  </div>

  <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
    {tasks.map((t, index) => (
      <div
        key={index}
        className={`flex items-center justify-between p-4 rounded-xl shadow-sm border-l-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}
        style={{ borderLeftColor: currentThemeColor }}
      >
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={t.completed}
            onChange={() => {
              const newTasks = [...tasks];
              newTasks[index].completed = !newTasks[index].completed;
              setTasks(newTasks);
            }}
            className="w-5 h-5 cursor-pointer accent-blue-500"
          />
          <span className={`${t.completed ? "line-through text-gray-400" : "font-medium"}`}>
            {t.text}
          </span>
        </div>
        <button onClick={() => setTasks(tasks.filter((_, i) => i !== index))} className="text-gray-400 hover:text-red-500">✕</button>
      </div>
    ))}

    {/* NEW PLACEHOLDER CARD - Fills the blank space */}
    <div 
      className={`mt-4 p-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all duration-500 ${darkMode ? "bg-gray-800/20" : "bg-gray-50/50"}`}
      style={{ borderColor: `${currentThemeColor}44` }} // Adds 44 for low opacity/alpha
    >
      <div 
        className="mb-3 p-3 rounded-full bg-opacity-10" 
        style={{ backgroundColor: `${currentThemeColor}22`, color: currentThemeColor }}
      >
        {mode === "work" ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )}
      </div>
      <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        {mode === "work" 
          ? "Stay focused! One task at a time." 
          : "Time to recharge. Grab some water!"}
      </p>
      {tasks.length === 0 && (
        <p className="text-xs mt-2 opacity-50">Your task list is currently empty.</p>
      )}
    </div>
  </div>
</div>
          {/*tasks session*/}

          <div className="order-1 lg:order-2 flex flex-col items-center space-y-8">
            <div className="flex gap-4">
              <button 
                onClick={() => { setMode("work"); setTime(25*60); setStart(false); }}
                className={`px-6 py-2 rounded-full font-bold transition-all ${mode === "work" ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
              >
                Pomodoro
              </button>
              <button 
                onClick={() => { 
                  setMode("break"); 
                  setTime((sessionCount > 0 && sessionCount % 4 === 0) ? 15*60 : 5*60); 
                  setStart(false); 
                }}
                className={`px-6 py-2 rounded-full font-bold transition-all ${mode === "break" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
              >
                Break
              </button>
            </div>

            <div className="w-64 md:w-82">
              <CircularProgressbar
                value={progressPercent}
                text={formatTime(time)}
                styles={buildStyles({
                  textColor: darkMode ? "#ffffff" : "#333",
                  pathColor: currentThemeColor,
                  trailColor: darkMode ? (mode === "work" ? "#333" : "#1e293b") : "#f3f4f6",
                  textSize: "18px",
                  pathTransitionDuration: 0.5,
                })}
              />
            </div>                                                        

            <div className="flex gap-4">
              <button
                onClick={() => setStart(!start)}
                style={{ backgroundColor: currentThemeColor }}
                className="px-8 py-2 text-white font-semibold rounded-full shadow-md transition-all active:scale-95"
              >
                {start ? "Pause" : "Start"}
              </button>
              <button
                onClick={() => { setStart(false); setTime(mode === "work" ? 25*60 : (sessionCount > 0 && sessionCount % 4 === 0 ? 15*60 : 5*60)); }}
                style={{ borderColor: currentThemeColor, color: currentThemeColor }}
                className="px-8 py-2 border-2 font-semibold rounded-full hover:bg-white/10 transition-all"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="order-3 w-full flex justify-center lg:justify-end">
            <div className="w-[90%] lg:mt-8 sm:w-[70%] md:w-[320px] lg:w-full">
              <Music mode={mode} />
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl mt-20">
          <div className={`p-8 rounded-3xl shadow-sm border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
            <h2 className={`text-2xl font-bold mb-8 flex items-center gap-2`}>
              <span className="w-2 h-8 rounded-full" style={{ backgroundColor: currentThemeColor }}></span>
              Focus Insights
            </h2>
            <div className="h-72 w-full">
              {sessions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                  <p>Complete your first session to see statistics</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sessions}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#444" : "#f0f0f0"} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#999'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#999'}} />
                    <Tooltip contentStyle={{ backgroundColor: darkMode ? "#333" : "#fff", border: "none" }} />
                    <Bar dataKey="minutes" fill={currentThemeColor} radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div className={`w-full max-w-6xl mt-12 mb-20 rounded-3xl p-10 flex flex-col items-center text-center transition-colors duration-500 ${darkMode ? "bg-gray-800/50" : (mode === "work" ? "bg-pink-50" : "bg-blue-50")}`}>
          <h1 style={{ fontFamily: "Poppins, sans-serif" }} className="text-3xl font-bold mb-6">How does it work?</h1>
          <p className={`leading-relaxed max-w-2xl mb-10 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            The Pomodoro Technique breaks work into intervals, traditionally 25 minutes in length, separated by short breaks. After 4 sessions, take a longer 15-minute break!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            <div className="flex flex-col items-center gap-4">
              <img src={clock} alt="timer" className="h-24 w-auto hover:scale-110 transition-transform" />
              <span className="font-semibold">Timed Focus</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <img src={focus} alt="focus" className="h-24 w-auto hover:scale-110 transition-transform" />
              <span className="font-semibold">Task Management</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <img src={coffee} alt="coffee" className="h-24 w-auto hover:scale-110 transition-transform" />
              <span className="font-semibold">Healthy Breaks</span>
            </div>
          </div>
        </div>
      </div>
      <Foot darkMode={darkMode} />
    </div>
  );
};

export default Home;
