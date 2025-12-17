import React from 'react';
import { CardContent, ShapeType } from '../types';
import { TreePine, Gift, Snowflake, Star, ArrowRight } from 'lucide-react';

interface CardStackProps {
  cards: CardContent[];
  onNext: () => void;
  userName: string;
}

const CardStack: React.FC<CardStackProps> = ({ cards, onNext, userName }) => {
  
  const getIcon = (shape: ShapeType) => {
    switch (shape) {
      case ShapeType.TREE: return <TreePine className="text-[#1a472a] w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />;
      case ShapeType.SLEIGH: return <Snowflake className="text-[#1e3a8a] w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />;
      case ShapeType.GIFT: return <Gift className="text-[#991b1b] w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />;
      default: return <TreePine />;
    }
  };

  const getThemeColors = (shape: ShapeType) => {
      switch (shape) {
          case ShapeType.TREE: return { border: 'border-[#2d5a27]', title: 'text-[#1a472a]', accent: 'bg-[#f0f7f0]' };
          case ShapeType.SLEIGH: return { border: 'border-[#1e3a8a]', title: 'text-[#1e3a8a]', accent: 'bg-[#f0f4f8]' };
          case ShapeType.GIFT: return { border: 'border-[#991b1b]', title: 'text-[#991b1b]', accent: 'bg-[#fff0f0]' };
          default: return { border: 'border-gray-800', title: 'text-gray-900', accent: 'bg-white' };
      }
  };

  return (
    // Wrapper: centers the stack in the available Flex area
    <div className="relative w-full h-full flex items-center justify-center">
      
      {/* 
         Card Constraints:
         - Width: 90%
         - Height: Maximize usage to ensure "full" look.
      */}
      <div className="relative w-[90%] max-w-[440px] h-[94%] max-h-[560px] lg:h-[78%] lg:max-h-[600px] perspective-1000">
        
        {cards.map((card, index) => {
          if (index > 2) return null;

          const theme = getThemeColors(card.shape);

          // Stacking logic
          const yOffset = index * 8; 
          const zOffset = -index * 30; 
          const scale = 1 - index * 0.05;
          const zIndex = 30 - index * 10;
          const opacity = index === 0 ? 1 : Math.max(0.4, 1 - index * 0.4);
          const rotate = index === 0 ? 0 : (index % 2 === 0 ? 2 : -2);

          return (
            <div
              key={card.id}
              onClick={index === 0 ? onNext : undefined}
              className={`
                  absolute inset-0
                  origin-bottom
                  transition-all duration-700 cubic-bezier(0.25, 0.8, 0.25, 1)
                  ${index === 0 ? 'cursor-pointer hover:-translate-y-1' : 'pointer-events-none'}
              `}
              style={{
                transform: `translate3d(0, ${yOffset}px, ${zOffset}px) scale(${scale}) rotate(${rotate}deg)`,
                zIndex: zIndex,
                opacity: opacity,
              }}
            >
              {/* Card Surface */}
              <div className={`
                  relative w-full h-full
                  rounded-2xl 
                  bg-[#fffcf5] 
                  shadow-[0_8px_30px_rgba(0,0,0,0.25),_0_0_0_1px_rgba(0,0,0,0.05)]
                  overflow-hidden
                  flex flex-col
                  border border-[#eaddcf]
              `}>
                  
                {/* Texture: Cream Paper */}
                <div className="absolute inset-0 opacity-50 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply"></div>
                
                {/* Decorative Frame */}
                <div className={`absolute inset-3 md:inset-5 border-2 border-dashed opacity-25 rounded-xl pointer-events-none ${theme.border}`}></div>
                
                {/* Content Layout: Flex Column */}
                {/* Added explicit padding-bottom to ensure text doesn't hit the absolute footer */}
                <div className="relative z-10 flex flex-col h-full p-6 md:p-10 pb-16 text-center">
                  
                  {/* --- Header Section --- */}
                  <div className="flex flex-col items-center gap-2 md:gap-4 shrink-0">
                      {/* Icon */}
                      <div className={`p-3 md:p-4 rounded-full ${theme.accent} shadow-sm border border-black/5 ring-4 ring-white/50`}>
                        {getIcon(card.shape)}
                      </div>

                      {/* Title */}
                      <h3 className={`font-christmas text-3xl sm:text-4xl md:text-5xl ${theme.title} drop-shadow-sm leading-none pt-1`}>
                        {card.title}
                      </h3>

                      {/* Divider */}
                      <div className="flex items-center gap-3 opacity-40 w-3/4 mt-1">
                          <div className="h-px bg-current flex-1"></div>
                          <Star size={12} className="text-[#d4af37]" fill="#d4af37" />
                          <div className="h-px bg-current flex-1"></div>
                      </div>
                  </div>

                  {/* --- Text Section --- 
                      Adjustments:
                      - flex-1 and justify-center to vertically center the text in the remaining space.
                  */}
                  <div className="flex-1 flex items-center justify-center w-full px-1 py-2">
                     <p className="
                        text-[#5a4a42] font-serif 
                        text-[15px] sm:text-[17px] lg:text-[19px]
                        leading-[1.8] sm:leading-[1.9] lg:leading-[2.0]
                        text-justify indent-8 sm:indent-10
                        tracking-wide
                     ">
                        {card.text.replace('[Name]', userName)}
                     </p>
                  </div>

                </div>

                {/* --- Footer Section (ABSOLUTE POSITIONED) --- */}
                {/* 
                    Moved outside the flex flow to guarantee position relative to the card bottom.
                    This prevents long text from pushing the footer off-screen.
                */}
                <div className={`
                    absolute bottom-0 left-0 w-full z-20
                    flex justify-center items-center gap-2
                    text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase
                    text-[#c41e3a] opacity-60
                    transition-opacity duration-300
                    pb-5 md:pb-6
                    ${index === 0 ? 'opacity-100' : 'opacity-0'}
                `}>
                   <span>Tap to Continue</span>
                   <ArrowRight size={14} className="animate-pulse" />
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CardStack;