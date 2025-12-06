import React from 'react';
import { CardContent, ShapeType } from '../types';
import { TreePine, Gift, Snowflake, Star, HeartHandshake } from 'lucide-react';

interface CardStackProps {
  cards: CardContent[];
  onNext: () => void;
  userName: string;
}

const CardStack: React.FC<CardStackProps> = ({ cards, onNext, userName }) => {
  
  const getIcon = (shape: ShapeType) => {
    switch (shape) {
      case ShapeType.TREE: return <TreePine className="text-[#1a472a]" size={40} />;
      case ShapeType.SLEIGH: return <Snowflake className="text-[#1e3a8a]" size={40} />;
      case ShapeType.GIFT: return <Gift className="text-[#991b1b]" size={40} />;
      default: return <TreePine />;
    }
  };

  const getCardTheme = (shape: ShapeType) => {
      switch (shape) {
          case ShapeType.TREE: return 'border-[#2d5a27] bg-[#f0f7f0]';
          case ShapeType.SLEIGH: return 'border-[#1e3a8a] bg-[#f0f4f8]';
          case ShapeType.GIFT: return 'border-[#991b1b] bg-[#fff0f0]';
          default: return 'border-gray-800 bg-white';
      }
  };

  return (
    <div className="relative w-full max-w-[400px] h-[520px] perspective-1000 mx-auto mt-4 select-none group">
      {cards.map((card, index) => {
        if (index > 2) return null;

        const yOffset = index * -12;
        const scale = 1 - index * 0.04;
        const zIndex = 30 - index * 10;
        const opacity = 1 - index * 0.15;
        const rotate = index === 0 ? 0 : (index % 2 === 0 ? 2 : -2);

        return (
          <div
            key={card.id}
            onClick={index === 0 ? onNext : undefined}
            className={`absolute top-0 left-0 w-full h-full transition-all duration-700 cubic-bezier(0.25, 0.8, 0.25, 1) cursor-pointer ${
                index === 0 ? 'hover:-translate-y-6 hover:rotate-1 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : 'shadow-xl'
            }`}
            style={{
              transform: `translate3d(0, ${yOffset}px, ${-index * 20}px) scale(${scale}) rotate(${rotate}deg)`,
              zIndex: zIndex,
              opacity: opacity,
              transformOrigin: 'bottom center',
            }}
          >
            {/* Card Main Body */}
            <div className={`
                relative h-full rounded-2xl overflow-hidden
                border-[1px] border-opacity-30
                flex flex-col
                bg-[#fffcf5]
            `}>
                
              {/* Paper Texture Overlay */}
              <div className="absolute inset-0 opacity-40 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply"></div>
              
              {/* Border Decor */}
              <div className={`absolute inset-3 border-2 border-dashed opacity-50 rounded-xl pointer-events-none ${getCardTheme(card.shape).split(' ')[0]}`}></div>
              
              {/* Corner Decorations - Positioned safely inside the inset-3 (12px) border */}
              <div className="absolute top-6 left-6 p-1 text-[#d4af37] opacity-60"><Star size={20} /></div>
              <div className="absolute top-6 right-6 p-1 text-[#d4af37] opacity-60"><Star size={20} /></div>
              
              {/* Content Container */}
              <div className="flex-1 m-4 p-5 flex flex-col items-center text-center relative z-10">
                
                {/* Icon Stamp */}
                <div className="mb-4 p-4 rounded-full bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] border border-gray-100 ring-4 ring-opacity-20 ring-[#d4af37]">
                  {getIcon(card.shape)}
                </div>

                {/* Title */}
                <h3 className="font-christmas text-4xl text-[#c41e3a] mb-3 font-bold drop-shadow-sm tracking-wide">
                  {card.title}
                </h3>

                {/* Decorative Divider */}
                <div className="flex items-center gap-2 mb-4 opacity-70">
                    <div className="h-[1px] w-12 bg-[#d4af37]"></div>
                    <HeartHandshake size={16} className="text-[#d4af37]" />
                    <div className="h-[1px] w-12 bg-[#d4af37]"></div>
                </div>

                {/* Text Content */}
                <div className="text-[#4a4a4a] leading-relaxed font-serif text-lg overflow-y-auto pr-1 custom-scrollbar scroll-smooth">
                   <p className="indent-4 text-justify">
                      {card.text.replace('[Name]', userName)}
                   </p>
                </div>

                {/* Footer Decor */}
                <div className="mt-auto pt-4 w-full flex justify-between items-center text-xs font-serif text-[#888] italic">
                   <span>Christmas Collection</span>
                   <span className="animate-pulse text-[#c41e3a] font-semibold">Click to flip &rarr;</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardStack;