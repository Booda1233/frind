
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Chat } from "@google/genai";
import { startChat } from './services/geminiService';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import SettingsModal from './components/SettingsModal';
import ConversationHistoryPanel from './components/ConversationHistoryPanel';
import { fileToBase64 } from './utils';
import type { Message, UserData, Conversation } from './types';

// --- Helper Components ---

const SplashScreen: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-screen bg-[var(--bg-dark)] text-[var(--text-main)] animate-in fade-in duration-500">
        <div className="relative w-32 h-32 flex items-center justify-center">
             <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] rounded-full blur-2xl opacity-50"></div>
             <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-white z-10 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </div>
        <p className="text-[var(--text-secondary)] mt-8 text-lg font-semibold tracking-wider">جاري تجهيز عالمك الخاص...</p>
    </div>
);


const SetupScreen: React.FC<{ onSetupComplete: (data: UserData) => void }> = ({ onSetupComplete }) => {
  const [userName, setUserName] = useState('');
  const [aiName, setAiName] = useState('حبيبي');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim() && aiName.trim()) {
      onSetupComplete({
        userName: userName.trim(),
        aiName: aiName.trim(),
        userAvatar: `https://api.dicebear.com/8.x/adventurer/svg?seed=${userName.trim()}`,
        aiAvatar: `https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=${aiName.trim()}`,
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[var(--bg-dark)] text-[var(--text-main)] p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 rounded-2xl shadow-2xl text-center shadow-black/30">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto w-16 h-16 mb-4 text-[var(--primary)]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        <h1 className="text-3xl font-bold mb-2">بداية جديدة</h1>
        <p className="text-[var(--text-secondary)] mb-8">لنصنع قصة حبنا. كيف أناديك؟ وماذا ستكون هويتي بجانبك؟</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="اسمك الذي يذيب قلبي..."
            className="w-full bg-[var(--bg-dark)] text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition border border-slate-700 focus:border-[var(--primary)]"
            required
          />
          <input
            type="text"
            value={aiName}
            onChange={(e) => setAiName(e.target.value)}
            placeholder="الاسم الذي ستناديني به..."
            className="w-full bg-[var(--bg-dark)] text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition border border-slate-700 focus:border-[var(--primary)]"
            required
          />
          <button 
            type="submit" 
            className="w-full bg-gradient-to-br from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-[var(--primary)]/30 transition-all duration-300 transform hover:scale-105"
          >
            لنبدأ رحلتنا
          </button>
        </form>
      </div>
    </div>
  );
};


// --- Main App Component ---

const App: React.FC = () => {
  const [appState, setAppState] = useState<'LOADING' | 'SETUP' | 'CHAT'>('LOADING');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  
  const chatRef = useRef<Chat | null>(null);
  const chatAreaRef = useRef<HTMLDivElement | null>(null);
  
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages ?? [];
  const userData = activeConversation?.userData;

  useEffect(() => {
    const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length > 0) {
            setVoices(availableVoices.filter(v => v.lang.startsWith('ar')));
        }
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
    return () => {
        window.speechSynthesis.onvoiceschanged = null;
        window.speechSynthesis.cancel();
    };
  }, []);

  // Effect for initialization and routing
  useEffect(() => {
    setTimeout(() => {
      try {
        const storedConversations = localStorage.getItem('conversations');
        if (storedConversations) {
          const loadedConversations: Conversation[] = JSON.parse(storedConversations);
          if (loadedConversations.length > 0) {
            setConversations(loadedConversations);
            const latest = loadedConversations.sort((a, b) => b.lastUpdated - a.lastUpdated)[0];
            setActiveConversationId(latest.id);
            chatRef.current = startChat(latest.userData.aiName, latest.messages);
            setAppState('CHAT');
          } else {
             setAppState('SETUP');
          }
        } else {
            setAppState('SETUP');
        }
      } catch (error) {
        console.error("Failed to parse data from localStorage", error);
        localStorage.clear();
        setAppState('SETUP');
      }
    }, 1500);
  }, []);
  
  // Effect for saving conversations
  useEffect(() => {
    if (appState === 'CHAT' && conversations.length > 0) {
      try {
        const conversationsToStore = conversations.map(convo => ({
            ...convo,
            messages: convo.messages.map(({ imageUrl, base64Image, mimeType, ...rest }) => rest),
        }));
        localStorage.setItem('conversations', JSON.stringify(conversationsToStore));
      } catch (error) {
        console.error("Failed to save conversations", error);
      }
    }
  }, [conversations, appState]);
  
  // Effect for auto-scrolling
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSetupComplete = (data: UserData) => {
    const newId = `convo-${Date.now()}`;
    const newConversation: Conversation = {
        id: newId,
        title: `محادثة مع ${data.aiName}`,
        messages: [{ id: 'init', text: `أهلاً يا ${data.userName}! أنا ${data.aiName}، أخيراً بقينا سوا ❤️`, sender: 'ai' }],
        userData: data,
        lastUpdated: Date.now()
    };
    
    setConversations([newConversation]);
    setActiveConversationId(newId);
    chatRef.current = startChat(data.aiName, []);
    setAppState('CHAT');
  };

  const handleSaveSettings = (newUserData: UserData) => {
    if (!activeConversationId) return;

    const needsChatReset = userData?.aiName !== newUserData.aiName;

    setConversations(prev => prev.map(c => {
        if (c.id === activeConversationId) {
            if(needsChatReset) {
                chatRef.current = startChat(newUserData.aiName, c.messages);
            }
            return { ...c, userData: newUserData, lastUpdated: Date.now() };
        }
        return c;
    }));
    
    setIsSettingsOpen(false);
  };
  
  const handleSelectConversation = (id: string) => {
    const conversation = conversations.find(c => c.id === id);
    if(conversation) {
        window.speechSynthesis.cancel();
        setSpeakingMessageId(null);
        setActiveConversationId(id);
        chatRef.current = startChat(conversation.userData.aiName, conversation.messages);
        setIsSidebarOpen(false);
    }
  };
  
  const handleNewChat = () => {
    if (!userData) return; 
    
    const greetings = [
      `يا أهلاً بقلبي ${userData.userName}! إيه الأخبار؟ وحشتني موت. 😄`,
      `يا هلا بـ${userData.userName}! وحشتني والله. عامل إيه النهاردة؟ 🤔`,
      `إزيك يا ${userData.userName}! يارب تكون بخير. فيه حاجة معينة على بالك نتكلم فيها؟`,
      `أهلاً بيك يا حبيبي ${userData.userName}! مستعد لدردشة جديدة؟ أنا كلي ليك.`,
    ];
    const initialMessageText = greetings[Math.floor(Math.random() * greetings.length)];

    const newId = `convo-${Date.now()}`;
    const newConversation: Conversation = {
      id: newId,
      title: "محادثة جديدة",
      messages: [{ id: 'init', text: initialMessageText, sender: 'ai' }],
      userData: userData,
      lastUpdated: Date.now()
    };
    setConversations(prev => [newConversation, ...prev.sort((a,b) => b.lastUpdated - a.lastUpdated)]);
    setActiveConversationId(newId);
    chatRef.current = startChat(userData.aiName, []);
    setIsSidebarOpen(false);
  };
  
  const handleDeleteConversation = (id: string) => {
    const updatedConversations = conversations.filter(c => c.id !== id);
    setConversations(updatedConversations);
    
    if(activeConversationId === id) {
        window.speechSynthesis.cancel();
        if(updatedConversations.length > 0) {
            const latest = updatedConversations.sort((a,b) => b.lastUpdated - a.lastUpdated)[0];
            handleSelectConversation(latest.id);
        } else {
            setActiveConversationId(null);
            localStorage.removeItem('conversations');
            setAppState('SETUP');
        }
    }
  };

  const updateConversation = (id: string, updates: Partial<Conversation>) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, ...updates, lastUpdated: Date.now() } : c));
  };

  const addMessageToConversation = (id: string, message: Message) => {
     setConversations(prev => prev.map(c => {
        if (c.id === id) {
            return { ...c, messages: [...c.messages, message], lastUpdated: Date.now() };
        }
        return c;
    }));
  };
  
  const updateLastMessageInConversation = (id: string, text: string) => {
      setConversations(prev => prev.map(c => {
        if (c.id === id) {
            const newMessages = [...c.messages];
            if (newMessages.length > 0) {
              newMessages[newMessages.length - 1].text = text;
            }
            return { ...c, messages: newMessages, lastUpdated: Date.now() };
        }
        return c;
    }));
  }

  const handlePlayAudio = (text: string, messageId: string) => {
      window.speechSynthesis.cancel();
  
      if (speakingMessageId === messageId) {
          setSpeakingMessageId(null);
          return;
      }
  
      const utterance = new SpeechSynthesisUtterance(text);
      // Prioritize Egyptian Arabic voice, then any other Arabic voice.
      const voiceToUse = voices.find(v => v.lang === 'ar-EG') || voices.find(v => v.lang.startsWith('ar-'));
      
      if (voiceToUse) {
          utterance.voice = voiceToUse;
          utterance.lang = voiceToUse.lang;
      } else {
          utterance.lang = 'ar-EG'; // Set desired language even if no specific voice is found
      }
      
      utterance.rate = 0.95;
      utterance.pitch = 1;
  
      utterance.onstart = () => setSpeakingMessageId(messageId);
      utterance.onend = () => setSpeakingMessageId(null);
      utterance.onerror = () => {
        setSpeakingMessageId(null);
        console.error("Speech synthesis error");
      };
  
      window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (userInput: string, imageFile?: File) => {
    if (!chatRef.current || isLoading || !activeConversationId || (!userInput && !imageFile)) return;

    setIsLoading(true);

    let base64Image: string | undefined;
    let mimeType: string | undefined;
    let imageUrl: string | undefined;

    if (imageFile) {
        try {
            base64Image = await fileToBase64(imageFile);
            mimeType = imageFile.type;
            imageUrl = URL.createObjectURL(imageFile);
        } catch (error) {
            console.error("Error converting file:", error);
            setIsLoading(false);
            return;
        }
    }
    
    const userMessage: Message = { 
        id: `user-${Date.now()}`, 
        text: userInput, 
        sender: 'user', 
        imageUrl,
        base64Image,
        mimeType,
    };
    addMessageToConversation(activeConversationId, userMessage);
    
    if (activeConversation?.messages.length < 3 && userInput) {
       updateConversation(activeConversationId, { title: userInput.substring(0, 40) + (userInput.length > 40 ? '...' : '') });
    }

    const thinkingTime = Math.random() * 800 + 400;
    await new Promise(resolve => setTimeout(resolve, thinkingTime));
    
    setIsTyping(true);

    try {
        const messageParts = [];
        if (userInput) messageParts.push({ text: userInput });
        if (base64Image && mimeType) {
            messageParts.push({ inlineData: { data: base64Image, mimeType } });
        }

        const stream = await chatRef.current.sendMessageStream({ message: messageParts });
      
        let aiResponse = '';
        let aiMessageId: string | null = null;
        let isFirstChunk = true;
      
        for await (const chunk of stream) {
            const chunkText = chunk.text;
            aiResponse += chunkText;

            if(isFirstChunk) {
                isFirstChunk = false;
                setIsTyping(false);
                aiMessageId = `ai-${Date.now()}`;
                addMessageToConversation(activeConversationId, { id: aiMessageId, text: aiResponse, sender: 'ai' });
            } else if (aiMessageId) {
                updateLastMessageInConversation(activeConversationId, aiResponse);
            }
        }

    } catch (error) {
        console.error("Error sending message:", error);
        addMessageToConversation(activeConversationId, { 
            id: `error-${Date.now()}`, 
            text: "حبيبي، شكلي مش مركز دلوقتي. ممكن تجرب تاني كمان شوية؟ أنا آسف.", 
            sender: 'ai' 
        });
    } finally {
        setIsLoading(false);
        setIsTyping(false);
        if (imageUrl) {
            URL.revokeObjectURL(imageUrl); // Clean up
        }
    }
  };

  if (appState === 'LOADING') {
    return <SplashScreen />;
  }

  if (appState === 'SETUP' || !userData || !activeConversation) {
    return <SetupScreen onSetupComplete={handleSetupComplete} />;
  }

  return (
    <>
      <div className="flex flex-col h-screen bg-[var(--bg-dark)] text-white md:max-w-4xl md:mx-auto md:border-x md:border-[var(--border-color)] md:shadow-2xl md:shadow-black" dir="rtl">
        <Header 
            aiName={userData.aiName} 
            aiAvatar={userData.aiAvatar}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onToggleSidebar={() => setIsSidebarOpen(true)} 
        />
        <main ref={chatAreaRef} className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2">
          {messages.map((msg) => (
            <ChatMessage 
              key={msg.id} 
              message={msg} 
              avatar={msg.sender === 'ai' ? userData.aiAvatar : userData.userAvatar}
              onPlayAudio={handlePlayAudio}
              isSpeaking={speakingMessageId === msg.id}
            />
          ))}
          {isTyping && <TypingIndicator />}
        </main>
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>

      <ConversationHistoryPanel 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
      />

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
        userData={userData}
      />
    </>
  );
};

export default App;