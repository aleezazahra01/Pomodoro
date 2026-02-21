interface HeadProps {
  darkMode: boolean;
  mode: "work" | "break";
}

const Head = ({ darkMode, mode }: HeadProps) => {
  const accentColor = mode === "work" ? "#E053A6" : "#3B82F6";

  return (
    <nav 
      className={`w-full py-5 px-8 flex flex-row items-center justify-between transition-all duration-700 backdrop-blur-md sticky top-0 z-50 border-b ${
        darkMode ? "border-white/5 bg-black/10" : "border-black/5 bg-white/10"
      }`}
    >
      <div className="flex flex-col group">
        <h1 
          style={{ fontFamily: "Gwendolyn, cursive" }} 
          className={`text-5xl font-bold transition-colors duration-700 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Pomodoro timer
        </h1>
      
       
      </div>


      <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-sm">
        <div 
          className="w-2 h-2 rounded-full animate-pulse" 
          style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
        />
        <span className="text-xs font-bold uppercase tracking-widest opacity-70">
          {mode === "work" ? "Deep Focus" : "Recharging"}
        </span>
      </div>
    </nav>
  );
};

export default Head;