import { ComingSoonPage } from '@/components/ComingSoonPage';
import { Link as LinkIcon } from 'lucide-react';

export default function URLShortPage() {
  return (
    <ComingSoonPage
      serviceName="URL Shortener"
      description="Create short, memorable links with custom aliases, analytics, and QR code generation."
      icon={<LinkIcon size={40} className="text-primary" />}
    />
  );
}
