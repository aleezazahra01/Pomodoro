import { useRef, useState, useEffect } from "react"
import { FaPlay, FaPause, FaVolumeUp, FaForward, FaBackward } from "react-icons/fa"


const tracks = [
  { 
    name: "Rain", 
    file: "/sounds/rain.mp3", 
    cover: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=500&h=200&fit=crop" 
  },
  { 
    name: "Thunderstorm", 
    file: "/sounds/rain2.mp3", 
    cover: "https://images.unsplash.com/photo-1511300636408-a63a89df3482?w=500&h=200&fit=crop" 
  },
  { 
    name: "Quiet Cafe", 
    file: "/sounds/cafe.mp3", 
    cover: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=200&fit=crop" 
  },
  { 
    name: "Wild Nature", 
    file: "/sounds/nature.mp3", 
    cover: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=200&fit=crop" 
  },
  { 
    name: "Ocean Waves", 
    file: "/sounds/rain3.mp3", 
    cover: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=500&h=200&fit=crop" 
  },
  { 
    name: "Deep Sea", 
    file: "/sounds/gamma-beats.mp3", 
    cover: "https://images.unsplash.com/photo-1439405326854-014607f694d7?w=500&h=200&fit=crop" 
  },
  { 
    name: "Red Focus", 
    file: "/sounds/focus-beats.mp3", 
    cover: "https://images.unsplash.com/photo-1547633513-333068e6f1f8?w=500&h=200&fit=crop" 
  },
];

interface MusicProps {
  mode: "work" | "break";
}

const Music = ({ mode }: MusicProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [trackIndex, setTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(0.5)

  const currentTrack = tracks[trackIndex]
  const isWork = mode === "work"
  const themeBg = isWork ? "bg-pink-600/20" : "bg-blue-600/20"
  const themeBorder = isWork ? "border-pink-300/30" : "border-blue-300/30"


  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load()
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false))
      }
    }
  }, [trackIndex])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => setProgress((audio.currentTime / audio.duration) * 100 || 0)
    const handleNext = () => setTrackIndex((prev) => (prev + 1) % tracks.length)

    audio.addEventListener("timeupdate", updateProgress)
    audio.addEventListener("ended", handleNext) // Auto-play next

    return () => {
      audio.removeEventListener("timeupdate", updateProgress)
      audio.removeEventListener("ended", handleNext)
    }
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(console.error)
    }
    setIsPlaying(!isPlaying)
  }

  const prevTrack = () => setTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length)
  const nextTrack = () => setTrackIndex((prev) => (prev + 1) % tracks.length)

  return (
    <div className="flex items-center justify-center py-2">
      <div className={`w-[420px] p-6 rounded-3xl ${themeBg} backdrop-blur-lg shadow-2xl text-white border ${themeBorder} transition-colors duration-500`}>
        
        <h2 className="text-xl font-semibold mb-1">Play Music :3</h2>
        <p className="text-sm opacity-80 mb-4">{currentTrack.name}</p>

        <div className="w-full h-24 mb-5 rounded-xl overflow-hidden shadow-md border border-white/10">
          <img src={currentTrack.cover} alt="cover" className="w-full h-full object-cover" />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <button onClick={prevTrack} className="text-xl opacity-70 hover:opacity-100 transition"><FaBackward /></button>
          
          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/40 transition flex items-center justify-center text-lg shadow-lg active:scale-95"
          >
            {isPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
          </button>

          <button onClick={nextTrack} className="text-xl opacity-70 hover:opacity-100 transition"><FaForward /></button>
        </div>

        <input
          type="range"
          value={progress}
          onChange={(e) => {
            if (!audioRef.current) return
            const val = Number(e.target.value)
            audioRef.current.currentTime = (val / 100) * audioRef.current.duration
            setProgress(val)
          }}
          className="w-full mb-5 accent-white h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
        />

        <div className="flex items-center gap-3 mb-5">
          <FaVolumeUp className="opacity-70 text-xs" />
          <input
            type="range" min="0" max="1" step="0.01" value={volume}
            onChange={(e) => {
              const val = Number(e.target.value)
              setVolume(val)
              if (audioRef.current) audioRef.current.volume = val
            }}
            className="w-full accent-white h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <select
          value={trackIndex}
          className="w-full bg-white/20 p-2 text-white rounded-lg outline-none border border-white/20 backdrop-blur-md cursor-pointer"
          onChange={(e) => setTrackIndex(Number(e.target.value))}
        >
          {tracks.map((track, idx) => (
            <option key={idx} value={idx} className="text-black">{track.name}</option>
          ))}
        </select>

        <audio 
  key={trackIndex} // This is the secret sauce!
  ref={audioRef} 
  src={currentTrack.file} 
  onCanPlay={() => {
    if (isPlaying) audioRef.current?.play().catch(console.error);
  }}
/>

      </div>
    </div>
  )
}

export default Music