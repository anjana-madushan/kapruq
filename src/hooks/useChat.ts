'use client';

import { useState, useCallback } from 'react';
import type { Message } from '@/types/chat';
import type { Product, ProductCategory } from '@/types/product';

// Minimal shape that need from the MCP search result items
interface RawProduct {
  id: string;
  name: string;
  summary?: string;
  price?: { amount?: number | null; currency?: string };
  image_url?: string | null;
  in_stock?: boolean;
  category?: { slug?: string };
}

function mapCategory(slug = ''): ProductCategory {
  if (/gift|birthday|flower|cake|chocolate/i.test(slug)) return 'gifts';
  if (/grocer|food|beverage/i.test(slug)) return 'groceries';
  if (/electron|tech|phone|computer/i.test(slug)) return 'electronics';
  if (/home|furniture|kitchen/i.test(slug)) return 'home';
  if (/fashion|cloth|apparel|shirt/i.test(slug)) return 'fashion';
  return 'everyday';
}

function toProduct(raw: RawProduct): Product {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.summary ?? '',
    price: raw.price?.amount ?? 0,
    currency: 'LKR',
    imageUrl: raw.image_url ?? '',
    category: mapCategory(raw.category?.slug),
    inStock: raw.in_stock ?? false,
  };
}

export function useChat(
  sessionId: string,
  onProducts?: (products: Product[]) => void
) {
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

    const assistantId = crypto.randomUUID();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          sessionId,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error('Chat request failed');

      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', content: '', timestamp: new Date() },
      ]);

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let sseBuffer = '';
      let firstText = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        sseBuffer += decoder.decode(value, { stream: true });

        // Split on SSE event boundaries
        const events = sseBuffer.split('\n\n');
        sseBuffer = events.pop() ?? '';

        for (const event of events) {
          const dataLine = event.split('\n').find((l) => l.startsWith('data: '));
          if (!dataLine) continue;

          try {
            const parsed = JSON.parse(dataLine.slice(6)) as {
              type: string;
              content?: string;
              items?: RawProduct[];
            };

            if (parsed.type === 'text' && parsed.content) {
              if (firstText) {
                setIsLoading(false);
                firstText = false;
              }
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + parsed.content }
                    : m
                )
              );
            } else if (parsed.type === 'products' && parsed.items?.length) {
              onProducts?.(parsed.items.map(toProduct));
            }
          } catch {
            // malformed event — skip
          }
        }
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setIsLoading(false);
    }
  }, [messages, sessionId, onProducts]);

  return { messages, isLoading, sendMessage };
}
