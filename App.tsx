import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles as ThreeSparkles } from '@react-three/drei';
import IntroModal from './components/IntroModal';
import CardStack from './components/CardStack';
import ParticleCloud from './components/ParticleCloud';
import { INITIAL_CARDS } from './constants';
import { CardContent } from './types';

function App() {
  const [name, setName] = useState<string | null>(null);
  const [cards, setCards] = useState<CardContent[]>(INITIAL_CARDS);

  const handleNameSubmit = (enteredName: string) => {
    setName(enteredName);
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
    // ROOT: Uniform Background Color (#3a0a0a), No Scrolling
    <div className="relative w-full h-[100dvh] bg-[#3a0a0a] text-[#f8f5e6] overflow-hidden flex flex-col font-serif select-none">
      
      {/* 1. Snow Layer (Global) */}
      <div className="snow-container absolute inset-0 pointer-events-none z-20">
        {[...Array(30)].map((_, i) => (
           <div 
              key={i} 
              className="snowflake"
              style={{
                  left: `${Math.random() * 100}%`,
                  width: `${2 + Math.random() * 3}px`,
                  height: `${2 + Math.random() * 3}px`,
                  animationDuration: `${15 + Math.random() * 20}s`,
                  animationDelay: `-${Math.random() * 10}s`
              }}
           />
        ))}
      </div>

      {/* 2. Texture Layer */}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 z-0 pointer-events-none mix-blend-overlay"></div>

      {/* 3. Header - Adjusted padding to be tighter */}
      <header className="absolute top-0 left-0 right-0 z-30 pt-3 pb-1 text-center pointer-events-none">
        <h1 className="font-christmas text-3xl md:text-5xl lg:text-6xl text-[#d4af37] drop-shadow-md tracking-wider">
          Merry Christmas
        </h1>
        {name && (
          <div className="mt-0.5 text-xs md:text-lg text-white/80 font-christmas">
            For <span className="text-[#ff5c5c] border-b border-[#ff5c5c]/40 mx-1">{name}</span>
          </div>
        )}
      </header>

      {/* 4. Main Layout Area */}
      {/* 
         Logic:
         - Mobile: 32% Top (3D), 68% Bottom (Cards). Slight adjustment to give 3D more presence than 30%.
         - Desktop: 45% Left (Cards), 55% Right (3D).
      */}
      <main className="relative z-10 flex-1 w-full h-full flex flex-col lg:flex-row pt-14 pb-6 lg:pt-0 lg:pb-0">
        
        {/* --- 3D SCENE CONTAINER --- */}
        <section className="
           relative w-full 
           flex-[0_0_32%] lg:flex-[0_0_55%] lg:h-full
           order-1 lg:order-2
           flex items-center justify-center
           overflow-hidden
        ">
           <Canvas 
              // Zoomed in slightly (z=10 instead of 12) to fill the "empty" space
              camera={{ position: [0, 0, 10], fov: 45 }} 
              gl={{ alpha: true, antialias: true }} 
              dpr={[1, 2]}
            >
             <ambientLight intensity={0.6} />
             {/* @ts-ignore */}
             <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffd700" />
             {/* @ts-ignore */}
             <pointLight position={[-10, -5, 5]} intensity={0.8} color="#ff4d4d" />
             
             {/* Increased star count to reduce emptiness */}
             <Stars radius={80} depth={40} count={1500} factor={4} saturation={0} fade speed={0.5} />
             <ThreeSparkles count={20} scale={5} size={2} speed={0.3} opacity={0.3} color="#fff" />
             
             <group position={[0, -0.5, 0]}>
               <ParticleCloud shapeType={activeShape} />
             </group>
             
             <OrbitControls 
                enableZoom={false} 
                autoRotate 
                autoRotateSpeed={0.8} 
                enablePan={false} 
                maxPolarAngle={Math.PI / 1.7} 
                minPolarAngle={Math.PI / 2.5} 
             />
           </Canvas>
        </section>

        {/* --- CARDS CONTAINER --- */}
        <section className="
            relative w-full
            flex-1 lg:h-full lg:flex-[0_0_45%]
            order-2 lg:order-1
            flex items-center justify-center
            px-4 pb-2
        ">
           {name && (
             <CardStack 
                cards={cards} 
                onNext={handleNextCard} 
                userName={name} 
             />
           )}
        </section>

      </main>

      {/* Intro Modal */}
      {!name && <IntroModal onComplete={handleNameSubmit} />}
      
      {/* Footer */}
      <footer className="absolute bottom-2 w-full text-center text-white/30 text-[10px] sm:text-xs z-40 font-serif">
        Designed with ❤️ for Christmas | © Leo Wang | <a href="https://github.com/LeoWang0814/MerryChristmas" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 underline decoration-white/20 transition-colors">Github Repository</a>
      </footer>
    </div>
  );
}

export default App;