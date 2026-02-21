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

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [initial, setInitial] = useState<string>("");
  const [start, setStart] = useState(false);
  const [mode, setMode] = useState<"work" | "break">(() => {
    return (localStorage.getItem("pomo_mode") as "work" | "break") || "work";
  });
  const [time, setTime] = useState<number>(mode === "work" ? 25 * 60 : 5 * 60);
  const [sessions, setSessions] = useState<{ day: string; minutes: number }[]>(() => {
    const saved = localStorage.getItem("sessions");
    return saved ? JSON.parse(saved) : [];
  });
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
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

  const totalTime = mode === "work" ? 25 * 60 : 5 * 60;
  const progressPercent = ((totalTime - time) / totalTime) * 100;


  useEffect(() => {
    if (start) {
      timerRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setStart(false);

   
            audioRef.current?.play();

            const today = new Date().toLocaleDateString("en-US", { weekday: "short" });
            setSessions((prevSessions) => {
              const existing = prevSessions.find((s) => s.day === today);
              if (existing) {
                return prevSessions.map((s) =>
                  s.day === today
                    ? { ...s, minutes: s.minutes + (mode === "work" ? 25 : 5) }
                    : s
                );
              } else {
                return [...prevSessions, { day: today, minutes: mode === "work" ? 25 : 5 }];
              }
            });

         
            if (Notification.permission === "granted") {
              new Notification(
                mode === "work"
                  ? "Work session complete! Time for a break "
                  : "Break over! Back to focus "
              );
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [start, mode]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("sessions", JSON.stringify(sessions));
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    localStorage.setItem("pomo_mode", mode);
  }, [tasks, sessions, darkMode, mode]);

 
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    audioRef.current = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
  }, []);

  useEffect(() => {
    document.title = start ? `(${formatTime(time)}) Pomodoro` : "Pomodoro App";
  }, [time, start]);

  return (
    <div 
      className="min-h-screen w-full relative transition-colors duration-500" 
      style={{ backgroundColor: darkMode ? undefined : lightBg, color: darkMode ? "#fff" : "var(--home-text)" }}
    >
      {darkMode && (
        <div style={{ background: meshBg }} className="fixed inset-0 z-0 transition-opacity duration-1000" />
      )}

      <Head darkMode={darkMode} mode={mode} />

      <div className="relative z-10 w-full px-4 py-10 md:px-10 lg:px-20 flex flex-col items-center">
   
        <div className="w-full max-w-7xl flex justify-end mb-4">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-white text-gray-800 -mt-5 text-sm font-bold shadow-md hover:bg-gray-300 transition-colors"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <div className="grid grid-cols-1 mt-3 lg:grid-cols-3 gap-12 w-full max-w-7xl items-start">
       
          <div className="order-2 lg:order-1 flex flex-col space-y-6 w-full">
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
            </div>
          </div>

        
          <div className="order-1 lg:order-2 flex flex-col items-center space-y-8">
            <div className="flex gap-4">
              <button 
                onClick={() => { setMode("work"); setTime(25*60); setStart(false); }}
                className={`px-6 py-2 rounded-full font-bold transition-all ${mode === "work" ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
              >
                Pomodoro
              </button>
              <button 
                onClick={() => { setMode("break"); setTime(5*60); setStart(false); }}
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
                onClick={() => { setStart(false); setTime(mode === "work" ? 25*60 : 5*60); }}
                style={{ borderColor: currentThemeColor, color: currentThemeColor }}
                className="px-8 py-2 border-2 font-semibold rounded-full hover:bg-white/10 transition-all"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="order-3 flex justify-center lg:justify-end">
            <Music mode={mode} />
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
            The Pomodoro Technique breaks work into intervals, traditionally 25 minutes in length, separated by short breaks.
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