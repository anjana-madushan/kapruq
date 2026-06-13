// Placeholder: Kapruka MCP client
// Replace with actual MCP transport in Phase 2

export interface McpClientConfig {
  baseUrl: string;
  apiKey?: string;
}

const defaultConfig: McpClientConfig = {
  baseUrl: process.env.KAPRUKA_MCP_URL ?? 'http://localhost:3001',
  apiKey: process.env.KAPRUKA_MCP_API_KEY,
};

export async function mcpRequest<T>(
  tool: string,
  args: Record<string, unknown>,
  config: McpClientConfig = defaultConfig
): Promise<T> {
  throw new Error(`MCP not yet connected. Tool: ${tool}`);
}
