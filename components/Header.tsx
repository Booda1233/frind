import React from 'react';

interface HeaderProps {
  aiName: string;
  aiAvatar: string;
  onOpenSettings: () => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ aiName, onOpenSettings, onToggleSidebar }) => {
  return (
    <header className="bg-[var(--bg-dark)]/70 backdrop-blur-sm px-2 sm:px-4 py-3 flex items-center justify-between shadow-md z-20 flex-shrink-0 border-b border-[var(--border-color)]">
      {/* Menu Button */}
      <div className="flex justify-start w-12">
        <button 
          onClick={onToggleSidebar} 
          className="text-[var(--text-secondary)] hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          aria-label="قائمة المحادثات"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Centered User Info */}
      <div className="flex-grow flex items-center flex-col text-center overflow-hidden">
        <h1 className="text-base sm:text-lg font-bold text-white truncate w-full px-1">{aiName}</h1>
        <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--primary)]"></span>
            </span>
            <p className="text-xs text-[var(--primary)] font-semibold">متصل الآن</p>
        </div>
      </div>

      {/* Settings Button */}
      <div className="flex justify-end w-12">
        <button 
          onClick={onOpenSettings} 
          className="text-[var(--text-secondary)] hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          aria-label="الإعدادات"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;