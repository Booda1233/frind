import React, { useState, useEffect } from 'react';
import type { UserData } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newUserData: UserData) => void;
  userData: UserData;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, userData }) => {
  const [currentUserName, setCurrentUserName] = useState(userData.userName);
  const [currentAiName, setCurrentAiName] = useState(userData.aiName);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setCurrentUserName(userData.userName);
        setCurrentAiName(userData.aiName);
    }
  }, [isOpen, userData]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (currentUserName.trim() && currentAiName.trim()) {
      setIsSaving(true);
      const newUserData = {
        ...userData,
        userName: currentUserName.trim(),
        aiName: currentAiName.trim(),
        userAvatar: `https://api.dicebear.com/8.x/adventurer/svg?seed=${currentUserName.trim()}`,
        aiAvatar: `https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=${currentAiName.trim()}`,
      };
      // Simulate save time for visual feedback
      setTimeout(() => {
          onSave(newUserData);
          setIsSaving(false);
      }, 500);
    }
  };

  const canSave = currentUserName.trim() !== '' && currentAiName.trim() !== '' && !isSaving;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity animate-in fade-in duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div 
        className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-md text-white transform transition-all animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <h2 id="settings-title" className="text-2xl font-bold mb-6 text-center">الإعدادات</h2>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">اسمك</label>
            <input
              id="userName"
              type="text"
              value={currentUserName}
              onChange={(e) => setCurrentUserName(e.target.value)}
              className="w-full bg-[var(--bg-dark)] text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition border border-slate-700 focus:border-[var(--primary)]"
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="aiName" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">اسم صديقك</label>
            <input
              id="aiName"
              type="text"
              value={currentAiName}
              onChange={(e) => setCurrentAiName(e.target.value)}
              className="w-full bg-[var(--bg-dark)] text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition border border-slate-700 focus:border-[var(--primary)]"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 mt-8">
          <button 
            onClick={onClose}
            className="py-2.5 px-6 rounded-lg bg-slate-600 hover:bg-slate-500 transition-colors duration-200 font-semibold"
          >
            إلغاء
          </button>
          <button 
            onClick={handleSave}
            disabled={!canSave}
            className="py-2.5 px-6 rounded-lg bg-gradient-to-br from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] hover:shadow-lg hover:shadow-[var(--primary)]/30 font-semibold transition-all duration-200 disabled:from-slate-500 disabled:to-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;