import React, { useState } from 'react';
import { Sparkles, Gift } from 'lucide-react';

interface IntroModalProps {
  onComplete: (name: string) => void;
}

const IntroModal: React.FC<IntroModalProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [isFading, setIsFading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setIsFading(true);
      setTimeout(() => onComplete(name), 600); // Wait for fade out
    }
  };

  if (isFading && !name) return null; 

  return (
    <div className={`
        fixed inset-0 z-50 
        flex items-center justify-center 
        bg-black/60 backdrop-blur-lg 
        transition-all duration-700 ease-out
        px-4
        ${isFading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'}
    `}>
      <div className="
        relative w-full max-w-[360px] sm:max-w-[420px] 
        p-8 sm:p-10 
        bg-[#fffcf5] 
        rounded-2xl 
        shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] 
        border border-[#eaddcf]
        text-center 
        transform transition-transform
      ">
        
        {/* Subtle texture */}
        <div className="absolute inset-0 opacity-40 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply rounded-2xl"></div>

        {/* Golden Border Frame */}
        <div className="absolute inset-3 border border-[#d4af37] opacity-30 rounded-xl pointer-events-none"></div>
        <div className="absolute inset-3.5 border border-[#d4af37] opacity-20 rounded-xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
            <div className="mb-6 text-[#c41e3a] bg-red-50 p-4 rounded-full ring-1 ring-red-100 shadow-inner">
              <Gift size={40} className="animate-bounce sm:w-12 sm:h-12" strokeWidth={1.5} />
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-christmas text-[#c41e3a] mb-3 font-bold drop-shadow-sm">
              Merry Christmas
            </h2>
            <p className="text-[#7d6e64] mb-8 font-serif italic text-base sm:text-lg">
              A magical holiday greeting awaits...
            </p>
            
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="
                    w-full px-4 py-3 sm:py-4 
                    text-lg text-center text-[#2a0a0a] 
                    bg-white border border-[#d6d3d1] rounded-lg 
                    focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] 
                    shadow-sm placeholder:text-gray-400 placeholder:italic
                    font-serif transition-all
                "
                autoFocus
              />
              <button
                type="submit"
                disabled={!name.trim()}
                className="
                    group w-full relative overflow-hidden
                    px-6 py-3 sm:py-4 
                    bg-[#c41e3a] text-[#fffcf5] 
                    font-bold text-lg tracking-wide rounded-lg 
                    shadow-md hover:shadow-lg hover:bg-[#a01830] hover:-translate-y-0.5
                    transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                "
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Open Card
                  <Sparkles size={18} className="group-hover:rotate-180 transition-transform duration-700" />
                </span>
                {/* Shine effect */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
              </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default IntroModal;