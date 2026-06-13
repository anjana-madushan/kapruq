'use client';

import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useShoppingContext } from '@/context/ShoppingContext';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import SuggestedPrompts from './SuggestedPrompts';

export default function ChatPanel() {
  const { messages, isLoading, sendMessage } = useShoppingContext();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <p className="text-2xl">🛒</p>
            <p className="text-base font-medium text-zinc-700 dark:text-zinc-300">
              Hi! I&apos;m KapruQ.
            </p>
            <p className="max-w-xs text-sm text-zinc-400">
              Tell me what you&apos;re looking for, or pick a suggestion below.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-zinc-100 px-4 py-2.5 text-sm text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  KapruQ is thinking…
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {isEmpty && <SuggestedPrompts onSelect={sendMessage} />}
      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
}
