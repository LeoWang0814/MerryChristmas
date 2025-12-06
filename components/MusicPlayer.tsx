import React, { useState, useRef, useEffect } from 'react';
import { Pause, Play, Music } from 'lucide-react';
import { AUDIO_URL } from '../constants';

interface MusicPlayerProps {
  shouldPlay: boolean;
}

// Fallback URL in case local file is missing (Kevin MacLeod - We Wish You a Merry Christmas)
const FALLBACK_URL = "https://upload.wikimedia.org/wikipedia/commons/e/e0/We_Wish_You_a_Merry_Christmas_%28Kevin_MacLeod%29_%28ISRC_USUAN1100306%29.mp3";

const MusicPlayer: React.FC<MusicPlayerProps> = ({ shouldPlay }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentSrc = useRef(AUDIO_URL);

  const attemptPlay = async () => {
      if (!audioRef.current) return;
      try {
          audioRef.current.volume = 0.3;
          await audioRef.current.play();
          setIsPlaying(true);
          setHasError(false);
      } catch (err) {
          console.warn("Playback prevented or failed:", err);
          setIsPlaying(false);
      }
  };

  // Handle auto-play signal
  useEffect(() => {
    if (shouldPlay) {
        attemptPlay();
    }
  }, [shouldPlay]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      attemptPlay();
    }
  };

  const handleError = () => {
      console.warn("Local audio file failed to load. Switching to fallback.");
      if (currentSrc.current === AUDIO_URL && audioRef.current) {
          // Switch to fallback
          currentSrc.current = FALLBACK_URL;
          audioRef.current.src = FALLBACK_URL;
          audioRef.current.load();
          if (shouldPlay) attemptPlay();
      } else {
          setHasError(true);
      }
  };

  if (hasError) return null; // Hide if totally failed

  return (
    <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50 flex flex-col items-center gap-2">
      <audio 
        ref={audioRef} 
        src={AUDIO_URL}
        loop 
        onError={handleError}
      />
      
      <button
        onClick={togglePlay}
        className="relative group transition-transform active:scale-95 cursor-pointer outline-none"
        title={isPlaying ? "Pause Music" : "Play Music"}
      >
        {/* Record Player Arm */}
        <div className={`absolute -top-4 right-2 w-16 h-4 origin-right transition-transform duration-700 ease-in-out z-0 pointer-events-none
            ${isPlaying ? 'rotate-12' : '-rotate-12'}
        `}>
             <div className="w-full h-1 bg-gray-400 rounded-full shadow-sm"></div>
             <div className="absolute left-0 -top-1 w-3 h-4 bg-gray-600 rounded-sm"></div>
        </div>

        {/* Vinyl Disc */}
        <div className={`
            relative w-16 h-16 rounded-full bg-[#1a1a1a] border-4 border-[#2a2a2a] shadow-2xl flex items-center justify-center overflow-hidden
            ${isPlaying ? 'animate-[spin_3s_linear_infinite]' : ''}
        `}>
           {/* Grooves */}
           <div className="absolute inset-1 rounded-full border border-gray-700/50"></div>
           <div className="absolute inset-3 rounded-full border border-gray-700/50"></div>
           <div className="absolute inset-5 rounded-full border border-gray-700/50"></div>
           
           {/* Label */}
           <div className="w-6 h-6 bg-[#c41e3a] rounded-full border-2 border-[#d4af37] flex items-center justify-center relative z-10 shadow-inner">
              <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
           </div>
           
           {/* Shine */}
           <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-full pointer-events-none"></div>
        </div>
        
        {/* Play/Pause Button Overlay */}
        <div className="absolute -bottom-2 -right-2 bg-[#d4af37] text-[#4a0404] p-2 rounded-full shadow-lg border-2 border-[#fdfbf7] hover:bg-[#eac44e] transition-colors z-20">
            {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
        </div>
      </button>
    </div>
  );
};

export default MusicPlayer;