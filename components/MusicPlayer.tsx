import React, { useState, useRef, useEffect } from 'react';
import { Pause, Play, Music } from 'lucide-react';

// Using a stable, public domain MP3 from Archive.org to ensure playback works across all environments
// Local relative paths often fail in bundlers/sandboxes if not configured as static assets.
const audioSrc = 'https://ia800806.us.archive.org/18/items/WeWishYouAMerryChristmas_178/We_Wish_You_a_Merry_Christmas.mp3';

interface MusicPlayerProps {
  shouldPlay: boolean;
}

const FADE_STEP = 0.05;
const MAX_VOLUME = 0.4;
const FADE_INTERVAL = 100; // ms

const MusicPlayer: React.FC<MusicPlayerProps> = ({ shouldPlay }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const startFadeIn = () => {
      const audio = audioRef.current;
      if (!audio) return;
      
      if (fadeInterval.current) clearInterval(fadeInterval.current);
      
      fadeInterval.current = setInterval(() => {
        if (audio.volume < MAX_VOLUME) {
          audio.volume = Math.min(MAX_VOLUME, audio.volume + FADE_STEP);
        } else {
          if (fadeInterval.current) clearInterval(fadeInterval.current);
        }
      }, FADE_INTERVAL);
  };

  const attemptPlay = () => {
      if (!audioRef.current) return;
      const audio = audioRef.current;

      setIsLoading(true);

      // Reset volume if starting from silence
      if (audio.paused) {
        audio.volume = 0;
      }

      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
            .then(() => {
                setIsPlaying(true);
                setIsLoading(false);
                startFadeIn();
            })
            .catch(err => {
                console.warn("Playback prevented:", err);
                setIsPlaying(false);
                setIsLoading(false);
            });
      }
  };

  const fadeOut = () => {
    if (fadeInterval.current) clearInterval(fadeInterval.current);
    const audio = audioRef.current;
    if (!audio) return;

    fadeInterval.current = setInterval(() => {
      if (audio.volume > 0) {
        const newVol = audio.volume - FADE_STEP;
        audio.volume = Math.max(0, newVol);
      } else {
        audio.volume = 0;
        audio.pause();
        setIsPlaying(false); // Ensure state sync
        if (fadeInterval.current) clearInterval(fadeInterval.current);
      }
    }, FADE_INTERVAL);
  };

  const handleStop = () => {
      if (!audioRef.current) return;
      // Optimistically update UI for better feel
      setIsPlaying(false);
      fadeOut();
  }

  // Handle auto-play signal
  useEffect(() => {
    if (shouldPlay && !isPlaying) {
        attemptPlay();
    }
  }, [shouldPlay]);

  const togglePlay = () => {
    if (isPlaying) {
      handleStop();
    } else {
      attemptPlay();
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
      const mediaError = e.currentTarget.error;
      // Only log, don't crash the app. The UI will just show pause state.
      console.warn("Audio error:", mediaError);
      setIsPlaying(false);
      setIsLoading(false);
  };

  return (
    <div className="fixed top-4 right-4 md:top-8 md:right-8 z-[100] flex flex-col items-center gap-2">
      <audio 
        ref={audioRef} 
        src={audioSrc}
        loop 
        preload="auto"
        onError={handleError}
        crossOrigin="anonymous"
      />
      
      <button
        onClick={togglePlay}
        className="relative group transition-transform active:scale-95 cursor-pointer outline-none"
        title={isPlaying ? "Pause Music" : "Play Music"}
      >
        {/* Vinyl Disc (z-10) */}
        <div className={`
            relative w-16 h-16 rounded-full bg-[#1a1a1a] border-4 border-[#2a2a2a] shadow-2xl flex items-center justify-center overflow-hidden z-10
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

        {/* Record Player Arm (z-20) */}
        <div 
            className="absolute -top-5 right-1 w-16 h-4 origin-right transition-transform duration-700 ease-in-out z-20 pointer-events-none"
            style={{
                // Rotate to 5deg to touch the record, -30deg to rest
                transform: isPlaying ? 'rotate(5deg)' : 'rotate(-30deg)'
            }}
        >
             <div className="w-full h-1 bg-gray-400 rounded-full shadow-sm"></div>
             <div className="absolute left-0 -top-1 w-3 h-4 bg-gray-600 rounded-sm"></div>
        </div>
        
        {/* Play/Pause Button Overlay (z-30) */}
        <div className="absolute -bottom-2 -right-2 bg-[#d4af37] text-[#4a0404] p-2 rounded-full shadow-lg border-2 border-[#fdfbf7] hover:bg-[#eac44e] transition-colors z-30">
            {isLoading ? (
               <div className="animate-spin w-3.5 h-3.5 border-2 border-[#4a0404] border-t-transparent rounded-full"></div>
            ) : isPlaying ? (
               <Pause size={14} fill="currentColor" /> 
            ) : (
               <Play size={14} fill="currentColor" />
            )}
        </div>
        
        {/* Musical Notes Particle Effect (Visible when playing) */}
        {isPlaying && (
            <>
                <Music size={12} className="absolute -top-4 right-0 text-[#d4af37] animate-bounce opacity-80" style={{ animationDuration: '2s' }} />
                <Music size={10} className="absolute -top-8 -right-4 text-[#c41e3a] animate-bounce opacity-60" style={{ animationDuration: '1.5s', animationDelay: '0.5s' }} />
            </>
        )}
      </button>
    </div>
  );
};

export default MusicPlayer;