import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, User, RefreshCw, Zap } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { UserProfile } from '../types';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

interface MentorChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  currentTopic?: string;
}

export const MentorChatDrawer: React.FC<MentorChatDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  currentTopic = 'Algorithms & DSA',
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'model',
      content: `Hey ${profile?.name || 'Engineer'}! I'm your AI Mentor. I don't give away easy answers—I train you to think like a Senior Engineer. What are you working on right now?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Test my understanding with a problem',
    'Why is my approach slow?',
    'Explain the intuition simply',
    'What edge cases am I forgetting?',
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const reply = await apiClient.mentorChat({
        message: text,
        history,
        profile,
        currentTopic,
      });

      const modelMsg: Message = {
        id: `msg_model_${Date.now()}`,
        role: 'model',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'model',
          content: 'Network hiccup! Let me refocus: what question or code snippet were you testing?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md mx-auto h-[85vh] flex flex-col rounded-t-3xl bg-slate-950 border-t border-x border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">Socratic AI Mentor</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">
                {currentTopic}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m) => {
            const isModel = m.role === 'model';
            return (
              <div
                key={m.id}
                className={`flex gap-2.5 ${isModel ? 'justify-start' : 'justify-end'}`}
              >
                {isModel && (
                  <div className="w-6 h-6 rounded-lg bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    isModel
                      ? 'bg-slate-900 border border-slate-800/80 text-slate-200'
                      : 'bg-blue-600 text-white font-medium rounded-tr-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      isModel ? 'text-slate-500' : 'text-blue-200'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-2 px-3 bg-slate-900/60 rounded-xl border border-slate-800/60 w-fit">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
              <span>Mentor is analyzing your code logic...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-3 py-2 bg-slate-900/60 border-t border-slate-800/60 overflow-x-auto flex gap-1.5 no-scrollbar">
          {quickPrompts.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-[10px] font-medium transition cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question or explain your thinking..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white disabled:opacity-50 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
