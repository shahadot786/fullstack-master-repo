import { ComingSoonPage } from '@/components/ComingSoonPage';
import { Truck } from 'lucide-react';

export default function DeliveryPage() {
  return (
    <ComingSoonPage
      serviceName="Delivery"
      description="Track and manage deliveries with real-time updates, route optimization, and delivery confirmations."
      icon={<Truck size={40} className="text-primary" />}
    />
  );
}
