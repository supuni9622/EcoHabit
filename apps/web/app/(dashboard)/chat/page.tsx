'use client';

import { useState, useRef, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import { useAuthStore } from '../../../lib/store/auth.store';

interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  'How can I reduce plastic waste at home?',
  'What are the best recycling practices?',
  'How does composting help the environment?',
  'Tell me about e-waste recycling in Sri Lanka',
];

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  content:
    "Hi! I'm your EcoCoach powered by AI. I can help you with recycling tips, eco-friendly practices, and environmental questions. What would you like to know today?",
  type: 'assistant',
  timestamp: new Date(),
};

export default function ChatPage() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load chat history from Firestore on mount
  useEffect(() => {
    if (!user?.id || historyLoaded) return;

    const loadHistory = async () => {
      try {
        const q = query(
          collection(db, 'chatMessages'),
          where('userId', '==', user.id),
          orderBy('timestamp', 'asc'),
          limit(50)
        );
        const snap = await getDocs(q);
        if (snap.empty) {
          setHistoryLoaded(true);
          return;
        }

        const history: ChatMessage[] = snap.docs.map((d, i) => {
          const data = d.data();
          const ts = data.timestamp instanceof Timestamp
            ? data.timestamp.toDate()
            : new Date();
          return {
            id: d.id ?? `hist-${i}`,
            content: data.content as string,
            type: data.role === 'model' ? 'assistant' : 'user',
            timestamp: ts,
          };
        });

        if (history.length > 0) {
          setMessages([WELCOME_MESSAGE, ...history]);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      } finally {
        setHistoryLoaded(true);
      }
    };

    loadHistory();
  }, [user?.id, historyLoaded]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      content: content.trim(),
      type: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, userId: user?.id }),
      });

      const data = await res.json();
      const responseText = res.ok
        ? (data.message ?? 'Sorry, I had trouble getting a response.')
        : 'Sorry, I had trouble getting a response. Please try again.';

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        content: responseText,
        type: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          content: 'Sorry, I had trouble connecting. Please try again.',
          type: 'assistant',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="max-w-lg mx-auto flex flex-col h-[calc(100vh-130px)]">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">
            🤖
          </div>
          <div>
            <h1 className="font-bold text-gray-800">EcoCoach AI</h1>
            <p className="text-xs text-green-600">Online • Ready to help</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
        {/* Suggested prompts (only shown if just 1 message and history loaded) */}
        {messages.length === 1 && historyLoaded && (
          <div className="space-y-2">
            <p className="text-xs text-gray-400 text-center">Suggested questions</p>
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="w-full text-left bg-white border border-green-200 rounded-xl px-4 py-2.5 text-sm text-green-700 hover:bg-green-50 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {!historyLoaded && (
          <div className="text-center py-6">
            <div className="text-2xl animate-spin mb-2">⟳</div>
            <p className="text-xs text-gray-400">Loading conversation history...</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.type === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-base mr-2 flex-shrink-0 mt-1">
                🤖
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.type === 'user'
                  ? 'bg-green-600 text-white rounded-tr-sm'
                  : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-sm'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.type === 'user' ? 'text-green-100' : 'text-gray-400'
                }`}
              >
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-base mr-2 flex-shrink-0">
              🤖
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="px-4 py-3 bg-white border-t border-gray-100">
        <div className="flex items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about eco practices..."
            rows={1}
            className="flex-1 resize-none px-4 py-2.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 max-h-24 overflow-y-auto"
            style={{ minHeight: '42px' }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors disabled:opacity-50 flex-shrink-0"
          >
            ↑
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1.5 text-center">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
