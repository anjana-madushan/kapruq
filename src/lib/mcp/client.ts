const MCP_URL = 'https://mcp.kapruka.com/mcp';

let _sessionId: string | null = null;

async function parseSse(response: Response): Promise<unknown> {
  const text = await response.text();
  const dataLine = text.split('\n').find((l) => l.startsWith('data: '));
  if (!dataLine) throw new Error('Empty MCP response');

  const envelope = JSON.parse(dataLine.slice(6)) as {
    result?: unknown;
    error?: { code: number; message: string };
  };

  if (envelope.error) {
    throw new Error(`MCP ${envelope.error.code}: ${envelope.error.message}`);
  }
  return envelope.result;
}

async function ensureSession(): Promise<string> {
  if (_sessionId) return _sessionId;

  const res = await fetch(MCP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'kapruq', version: '1.0.0' },
      },
    }),
  });

  if (!res.ok) throw new Error(`MCP init failed: ${res.status}`);

  _sessionId = res.headers.get('mcp-session-id') ?? '';
  await parseSse(res);
  return _sessionId;
}

export async function callTool(name: string, args: Record<string, unknown>): Promise<string> {
  const sessionId = await ensureSession();

  const res = await fetch(MCP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
      'mcp-session-id': sessionId,
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: { name, arguments: args },
    }),
  });

  // Session expired — reinitialise once and retry
  if (res.status === 404 || res.status === 401) {
    _sessionId = null;
    return callTool(name, args);
  }

  const result = (await parseSse(res)) as {
    content: Array<{ type: string; text: string }>;
  };

  return result.content.find((c) => c.type === 'text')?.text ?? '';
}
