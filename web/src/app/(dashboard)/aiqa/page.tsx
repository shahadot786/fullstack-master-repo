import { ComingSoonPage } from '@/components/ComingSoonPage';
import { Brain } from 'lucide-react';

export default function AIQAPage() {
  return (
    <ComingSoonPage
      serviceName="AI Q&A"
      description="Ask questions and get intelligent answers powered by advanced AI technology."
      icon={<Brain size={40} className="text-primary" />}
    />
  );
}
