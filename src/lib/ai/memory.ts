// Placeholder: in-memory session context store
// Replace with persistent storage (Redis, DB) in future phases

const store = new Map<string, Record<string, unknown>>();

export function getMemory(sessionId: string): Record<string, unknown> {
  return store.get(sessionId) ?? {};
}

export function setMemory(sessionId: string, patch: Record<string, unknown>): void {
  const existing = store.get(sessionId) ?? {};
  store.set(sessionId, { ...existing, ...patch });
}

export function clearMemory(sessionId: string): void {
  store.delete(sessionId);
}
