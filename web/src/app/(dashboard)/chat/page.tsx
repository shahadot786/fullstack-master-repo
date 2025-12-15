import { ComingSoonPage } from '@/components/ComingSoonPage';
import { MessageSquare } from 'lucide-react';

export default function ChatPage() {
  return (
    <ComingSoonPage
      serviceName="Chat"
      description="Real-time messaging platform with group chats, file sharing, and instant notifications."
      icon={<MessageSquare size={40} className="text-primary" />}
    />
  );
}
