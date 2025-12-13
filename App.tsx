import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles as ThreeSparkles } from '@react-three/drei';
import IntroModal from './components/IntroModal';
import CardStack from './components/CardStack';
import ParticleCloud from './components/ParticleCloud';
import MusicPlayer from './components/MusicPlayer';
import { INITIAL_CARDS } from './constants';
import { CardContent } from './types';

function App() {
  const [name, setName] = useState<string | null>(null);
  const [cards, setCards] = useState<CardContent[]>(INITIAL_CARDS);
  const [shouldPlayMusic, setShouldPlayMusic] = useState(false);

  const handleNameSubmit = (enteredName: string) => {
    setName(enteredName);
    setShouldPlayMusic(true);
  };

  const handleNextCard = () => {
    setCards((prev) => {
      const newCards = [...prev];
      const first = newCards.shift();
      if (first) newCards.push(first);
      return newCards;
    });
  };

  const activeShape = cards[0].shape;

  return (
    <div className="relative w-full h-screen bg-[#3a0a0a] text-[#f8f5e6] overflow-hidden flex flex-col font-serif selection:bg-[#d4af37] selection:text-white">
      
      {/* Snow Effect Layer with Randomized Styles */}
      <div className="snow-container absolute inset-0 pointer-events-none z-30 opacity-60">
        {[...Array(50)].map((_, i) => {
           const left = Math.random() * 100;
           const animDuration = 10 + Math.random() * 10;
           const delay = Math.random() * 10;
           const size = 2 + Math.random() * 4;
           return (
             <div 
                key={i} 
                className="snowflake"
                style={{
                    left: `${left}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    animationDuration: `${animDuration}s`,
                    animationDelay: `-${delay}s`
                }}
             ></div>
           );
        })}
      </div>

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_120%,_#7a1d1d_0%,_#2a0202_70%,_#000000_100%)] z-0" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 z-0"></div>

      {/* Header */}
      <header className="relative z-20 w-full text-center py-4 md:py-8 select-none">
        <h1 className="font-christmas text-5xl md:text-7xl text-[#d4af37] drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] animate-pulse tracking-wider">
          Merry Christmas
        </h1>
        {name && (
          <p className="mt-2 text-xl font-christmas text-[#e5e7eb] opacity-90 tracking-wide animate-fade-in-up">
            Warm wishes for <span className="text-[#ff4d4d] border-b border-[#ff4d4d] pb-0.5">{name}</span>
          </p>
        )}
      </header>

      {/* Main Content Area */}
      <main className="relative z-20 flex-1 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl mx-auto px-4 pb-8 gap-10 md:gap-20">
        
        {/* Left: Card Stack */}
        <section className="w-full md:w-5/12 flex justify-center items-center h-[520px] md:perspective-1000">
          {name && (
            <CardStack 
              cards={cards} 
              onNext={handleNextCard} 
              userName={name} 
            />
          )}
        </section>

        {/* Right: 3D Scene */}
        <section className="w-full md:w-6/12 h-[350px] md:h-[600px] relative transition-all duration-1000 ease-out transform translate-y-0 opacity-100">
           
           {/* Glassmorphism Container */}
           <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden ring-1 ring-white/10">
               <Canvas camera={{ position: [0, 1, 8], fov: 45 }} gl={{ alpha: true }}>
                 <ambientLight intensity={0.8} />
                 <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffd700" />
                 <pointLight position={[-10, -5, 5]} intensity={1} color="#ff0000" />
                 
                 <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
                 <ThreeSparkles count={40} scale={5} size={3} speed={0.5} opacity={0.6} color="#ffffff" />
                 
                 {/* The Dynamic Cloud */}
                 <ParticleCloud shapeType={activeShape} />
                 
                 <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.0} enablePan={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />
               </Canvas>
           </div>

           {/* Decorative elements around 3D frame */}
           <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#d4af37] rounded-full blur-3xl opacity-20 animate-pulse"></div>
           <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#c41e3a] rounded-full blur-3xl opacity-20 animate-pulse"></div>
           
           <div className="absolute bottom-6 right-8 text-xs text-[#d4af37]/60 pointer-events-none font-serif tracking-widest uppercase">
             Interactive 3D Display
           </div>
        </section>

      </main>

      {/* Intro Modal */}
      {!name && <IntroModal onComplete={handleNameSubmit} />}

      {/* Music Player */}
      <MusicPlayer shouldPlay={shouldPlayMusic} />
      
      {/* Footer */}
      <footer className="absolute bottom-2 w-full text-center text-white/30 text-xs z-20 font-serif">
        Designed with ❤️ for Christmas | © Leo Wang
      </footer>
    </div>
  );
}

export default App;
