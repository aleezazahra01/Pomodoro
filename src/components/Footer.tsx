const Footer = ({ darkMode }: { darkMode: boolean }) => {

  const textColor = darkMode ? "#ffffff" : "#1f2937";
  const bgColor = darkMode ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.2)";

  return (
    <footer 
      className="w-full mt-20 py-10 border-t transition-all duration-700 backdrop-blur-md"
      style={{ 
        backgroundColor: bgColor, 
        color: textColor,
        borderColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
      }}
    >
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start">
          <span 
            style={{ fontFamily: "Gwendolyn, cursive" }} 
            className="text-4xl font-bold"
          >
            Pomodoro
          </span>
          <p className="text-sm opacity-60">
            Master your time, one session at a time.
          </p>
        </div>
        
        <div className="flex gap-8 text-sm font-medium">
          <a 
            href="https://github.com/aleezazahra01/Pomodoro.git" 
            className="hover:opacity-50 transition-opacity"
            target="_blank" 
            rel="noreferrer"
          >
            Contribute
          </a>
          <a 
            href="https://github.com/aleezazahra01/Pomodoro.git" 
            className="hover:opacity-50 transition-opacity"
            target="_blank" 
            rel="noreferrer"
          >
            Source code
          </a>
          
        </div>

        <div className="text-xs opacity-40 italic">
          &copy; {new Date().getFullYear()} Built for Flow by Aleeza Zahra with 🩷 
        </div>
      </div>
    </footer>
  );
};

export default Footer;