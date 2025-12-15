import { ComingSoonPage } from '@/components/ComingSoonPage';
import { ShoppingBag } from 'lucide-react';

export default function ShopPage() {
  return (
    <ComingSoonPage
      serviceName="Shop"
      description="Complete e-commerce solution with product management, shopping cart, and secure checkout."
      icon={<ShoppingBag size={40} className="text-primary" />}
    />
  );
}
