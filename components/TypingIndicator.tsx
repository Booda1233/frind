
import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center justify-start my-3 gap-3 animate-slide-in-left">
        <div className="w-9 h-9 rounded-full flex-shrink-0 bg-[var(--bg-surface)] shadow-md"></div>
        <div className="bg-gradient-to-br from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] px-4 py-3 rounded-2xl rounded-bl-none shadow-lg flex items-center space-x-1" style={{direction: 'ltr'}}>
            <div className="w-2 h-2 rounded-full bg-white/70 animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 rounded-full bg-white/70 animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 rounded-full bg-white/70 animate-bounce"></div>
        </div>
    </div>
  );
};

export default TypingIndicator;