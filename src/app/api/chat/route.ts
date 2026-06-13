import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runAgent } from '@/lib/ai/agent';
import { getMemory, setMemory } from '@/lib/ai/memory';

const ChatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  sessionId: z.string().uuid(),
  history: z
    .array(z.object({ role: z.enum(['user', 'assistant']), content: z.string() }))
    .optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = ChatRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
  }

  const { message, sessionId, history } = parsed.data;
  const memory = getMemory(sessionId);

  const response = await runAgent({ message, sessionId, history });

  if (response.intent) {
    setMemory(sessionId, { lastIntent: response.intent });
  }

  return NextResponse.json(response);
}
