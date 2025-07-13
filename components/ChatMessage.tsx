import React from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  avatar: string;
  onPlayAudio: (text: string, messageId: string) => void;
  isSpeaking: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, avatar, onPlayAudio, isSpeaking }) => {
  const isAi = message.sender === 'ai';

  const bubbleClasses = isAi
    ? 'bg-gradient-to-br from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] text-white rounded-bl-none'
    : 'bg-[var(--bg-surface-hover)] text-[var(--text-main)] rounded-br-none';
  
  const containerClasses = isAi ? 'justify-start' : 'justify-end';
  const avatarOrder = isAi ? 'order-first' : 'order-last';
  const animationClass = isAi ? 'animate-slide-in-left' : 'animate-slide-in-right';

  return (
    <div className={`flex w-full my-3 items-end gap-3 ${containerClasses} ${animationClass}`}>
      <img src={avatar} alt="avatar" className={`w-9 h-9 rounded-full flex-shrink-0 ${avatarOrder} bg-[var(--bg-surface)] shadow-md self-end`} />
      <div className={`flex items-end gap-2 max-w-[80%] ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`w-full px-4 py-3 rounded-2xl shadow-lg ${bubbleClasses}`}>
          {message.imageUrl && (
            <img 
              src={message.imageUrl} 
              alt="User upload" 
              className="rounded-lg mb-2 max-h-60 w-full object-cover border-2 border-white/10" 
            />
          )}
          {message.text && <p className="text-base font-normal whitespace-pre-wrap" dir="auto">{message.text}</p>}
        </div>
        {isAi && message.text && (
            <button
                onClick={() => onPlayAudio(message.text, message.id)}
                className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors p-1.5 rounded-full hover:bg-white/10 self-center flex-shrink-0"
                aria-label={isSpeaking ? "إيقاف الصوت" : "تشغيل الصوت"}
            >
                {isSpeaking ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--primary)] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                )}
            </button>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;