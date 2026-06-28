'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { sendChatMessage } from '../../lib/services/ai-chat';
import type { ChatMessage as ChatMsg } from '../../lib/services/ai-chat';

export interface ChatInterfaceProps {
  className?: string;
  placeholder?: string;
}

const INITIAL_MESSAGE: ChatMsg = {
  id: '0',
  content:
    "Hi! I'm your EcoCoach. Ask me anything about recycling, sustainability, or eco-friendly living!",
  type: 'assistant',
  timestamp: new Date(),
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  className,
  placeholder = 'Ask about eco practices...',
}) => {
  const [messages, setMessages] = useState<ChatMsg[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const send = async () => {
    if (!input.trim() || isTyping) return;
    const text = input.trim();
    setInput('');

    const userMsg: ChatMsg = {
      id: crypto.randomUUID(),
      content: text,
      type: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const result = await sendChatMessage(text, messages);
    setIsTyping(false);

    const assistantMsg: ChatMsg = {
      id: crypto.randomUUID(),
      content: result.success ? result.message : 'Sorry, try again.',
      type: 'assistant',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMsg]);
  };

  return (
    <div className={`flex flex-col ${className ?? ''}`}>
      <div className="flex-1 overflow-y-auto space-y-3 p-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder={placeholder}
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={send}
          disabled={!input.trim() || isTyping}
          className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 disabled:opacity-50"
        >
          ↑
        </button>
      </div>
    </div>
  );
};
