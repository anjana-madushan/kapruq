export interface Session {
  id: string;
  createdAt: Date;
  intent?: string;
  context: Record<string, unknown>;
}
