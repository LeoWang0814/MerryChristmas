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
      // Trigger callback immediately to satisfy browser autoplay policies
      onComplete(name); 
    }
  };

  // If fading, we still render but with 0 opacity to allow the exit animation visual if handled by parent or CSS
  // But here we rely on the parent (App) to mount/unmount or the modal to self-destruct via the callback state
  if (isFading && !name) return null; // Logic handled by parent state mostly

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-opacity duration-700 ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="relative w-full max-w-md p-8 m-4 bg-[#fdfbf7] rounded-xl shadow-[0_0_50px_rgba(212,175,55,0.4)] border-4 border-[#c41e3a] text-center transform transition-all animate-fade-in-up overflow-hidden">
        
        {/* Decorative ribbons */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#d4af37] to-transparent opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#d4af37] to-transparent opacity-20"></div>

        <div className="flex justify-center mb-6 text-[#c41e3a]">
          <Gift size={56} className="animate-bounce" />
        </div>
        
        <h2 className="text-4xl font-christmas text-[#c41e3a] mb-3 font-bold drop-shadow-sm">
          Merry Christmas
        </h2>
        <p className="text-[#5a4a42] mb-8 font-serif italic text-lg">
          To unlock your holiday surprise,<br/>please enter your name.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name..."
            className="px-4 py-4 text-xl text-center text-gray-900 border-2 border-[#d4af37]/50 rounded-lg focus:outline-none focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 bg-white shadow-inner font-serif placeholder:text-gray-400 transition-all"
            autoFocus
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="group relative px-6 py-4 bg-[#c41e3a] text-[#fdfbf7] font-bold text-lg rounded-lg shadow-lg hover:bg-[#a01830] hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Open Card
              <Sparkles size={20} className="group-hover:rotate-45 transition-transform duration-500" />
            </span>
            {/* Button Shine Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default IntroModal;