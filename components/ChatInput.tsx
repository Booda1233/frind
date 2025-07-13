import React, { useState, useRef } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string, image?: File) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if(imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((inputValue.trim() || imageFile) && !isLoading) {
      onSendMessage(inputValue.trim(), imageFile ?? undefined);
      setInputValue('');
      removeImage();
    }
  };

  return (
    <div className="bg-[var(--bg-dark)]/70 backdrop-blur-sm p-2 sm:p-4 flex-shrink-0 border-t border-[var(--border-color)]">
      {imagePreview && (
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-2 p-1 border border-[var(--border-color)] rounded-lg bg-[var(--bg-surface)]">
          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded" />
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center border-2 border-[var(--bg-dark)] hover:bg-red-600 transition-colors"
            aria-label="Remove image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] flex items-center justify-center shrink-0 hover:text-white transition-all duration-200 hover:scale-110"
          aria-label="Attach image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
            <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06l2.755-2.754a.75.75 0 0 1 1.06 0l3.078 3.077a.75.75 0 0 0 1.06 0l4.22-4.22a.75.75 0 0 1 1.06 0l3.079 3.078v-9.44H3v9.44Z" clipRule="evenodd" />
          </svg>
        </button>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
            id="image-upload"
        />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
          className="flex-grow bg-[var(--bg-surface)] text-white rounded-full py-2.5 sm:py-3 px-4 sm:px-5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition duration-300 border border-transparent focus:border-[var(--primary)]/30"
          disabled={isLoading}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={isLoading || (!inputValue.trim() && !imageFile)}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] text-white flex items-center justify-center shrink-0 disabled:bg-slate-600 disabled:from-slate-500 disabled:to-slate-600 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[var(--primary)]/30 transition-all duration-200 hover:scale-110"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;