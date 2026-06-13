'use client';

import { useState, useEffect } from 'react';
import type { Session } from '@/types/session';

function createSession(): Session {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    context: {},
  };
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(createSession());
  }, []);

  const updateContext = (patch: Record<string, unknown>) => {
    setSession((prev) => prev ? { ...prev, context: { ...prev.context, ...patch } } : prev);
  };

  return { session, updateContext };
}
