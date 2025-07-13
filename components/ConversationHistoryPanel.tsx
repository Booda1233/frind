import React from 'react';
import type { Conversation } from '../types';

interface ConversationHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
}

const ConversationHistoryPanel: React.FC<ConversationHistoryPanelProps> = ({
  isOpen,
  onClose,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
}) => {
  if (!isOpen) return null;

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if(window.confirm("هل أنت متأكد أنك تريد حذف هذه المحادثة؟ سيتم حذفها نهائياً.")) {
      onDeleteConversation(id);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-panel-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-300"
        onClick={onClose}
      ></div>

      {/* Panel */}
      <div 
        className={`fixed top-0 bottom-0 bg-[var(--bg-surface)] border-l border-[var(--border-color)] w-full max-w-sm text-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out
                   ${isOpen ? 'translate-x-0' : 'translate-x-full'} right-0`}
        dir="rtl"
      >
        <header className="p-4 border-b border-[var(--border-color)] flex-shrink-0 flex items-center justify-between">
          <h2 id="history-panel-title" className="text-xl font-bold">المحادثات</h2>
          <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-white p-1 rounded-full hover:bg-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
          </button>
        </header>

        <div className="p-3 flex-shrink-0 border-b border-[var(--border-color)]">
            <button
                onClick={onNewChat}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-br from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] text-white hover:shadow-lg hover:shadow-[var(--primary)]/30 transition-all duration-300 font-bold"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                محادثة جديدة
            </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          {conversations.length > 0 ? (
            <ul className="space-y-1">
              {conversations.map((convo) => (
                <li key={convo.id}>
                  <button
                    onClick={() => onSelectConversation(convo.id)}
                    className={`w-full text-right p-3 rounded-lg transition-colors flex items-center justify-between group relative
                                ${convo.id === activeConversationId ? 'bg-[var(--primary)]/20 text-white' : 'hover:bg-white/10 text-[var(--text-secondary)] hover:text-white'}`}
                  >
                    {convo.id === activeConversationId && <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] rounded-r-full"></div>}
                    <span className="truncate pr-2 font-semibold">{convo.title}</span>
                    <span 
                      onClick={(e) => handleDeleteClick(e, convo.id)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                      aria-label="حذف المحادثة"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-[var(--text-secondary)] mt-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 5.523-4.477 10-10 10S1 17.523 1 12 5.477 2 11 2s10 4.477 10 10z" />
                </svg>
                <p className="mt-4 font-semibold">لا توجد محادثات محفوظة</p>
                <p className="text-sm">ابدأ محادثة جديدة لتظهر هنا.</p>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default ConversationHistoryPanel;