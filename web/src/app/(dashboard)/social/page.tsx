import { ComingSoonPage } from '@/components/ComingSoonPage';
import { Users } from 'lucide-react';

export default function SocialPage() {
  return (
    <ComingSoonPage
      serviceName="Social Network"
      description="Connect with others, share updates, and build your network with posts, likes, and comments."
      icon={<Users size={40} className="text-primary" />}
    />
  );
}
