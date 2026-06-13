import type { Metadata } from 'next';
import AppShell from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'KapruQ — Chat',
};

export default function ChatPage() {
  return <AppShell />;
}
