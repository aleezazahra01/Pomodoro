import { Link } from "react-router-dom";

const Notfound = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]">
  
      <div 
        className="fixed inset-0 z-0 opacity-60"
        style={{
          background: "radial-gradient(at 0% 0%, hsla(328, 73%, 15%, 1) 0, transparent 50%), radial-gradient(at 100% 100%, hsla(217, 91%, 15%, 1) 0, transparent 50%)"
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 animate-in fade-in zoom-in duration-700">
        
 
        <h2 
          style={{ fontFamily: "Gwendolyn, cursive" }}
          className="text-[12rem] md:text-[16rem] leading-none text-white/10 select-none animate-pulse"
        >
          404
        </h2>

   
        <div className="-mt-16 md:-mt-24 space-y-6">
          <h1 
            style={{ fontFamily: "Gwendolyn, cursive" }}
            className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg"
          >
            Oops! You've drifted off...
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-md mx-auto">
            The page you are looking for doesn't exist. Maybe it's time for a break?
          </p>

       
          <div className="pt-8">
            <Link 
              to="/" 
              className="px-10 py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl shadow-xl shadow-pink-500/20 transition-all hover:scale-105 active:scale-95 inline-block"
            >
              Back to Focus
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-pink-500/20 rounded-full blur-[100px] animate-bounce duration-[5000ms]" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
    </div>
  );
};

export default Notfound;