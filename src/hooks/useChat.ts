'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';
import type { Message } from '@/types/chat';
import type { Product } from '@/types/product';
import type { ChatRequest, ChatApiResponse } from '@/types/api';

export function useChat(sessionId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const payload: ChatRequest = {
        message: content,
        sessionId,
        history: messages.map((m) => ({ role: m.role, content: m.content })),
      };

      const { data } = await axios.post<ChatApiResponse>('/api/chat', payload);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        products: data.products,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, sessionId]);

  return { messages, isLoading, sendMessage };
}
