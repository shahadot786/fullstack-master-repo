import { ComingSoonPage } from '@/components/ComingSoonPage';
import { Cloud } from 'lucide-react';

export default function WeatherPage() {
  return (
    <ComingSoonPage
      serviceName="Weather"
      description="Get accurate weather forecasts, alerts, and historical data for any location worldwide."
      icon={<Cloud size={40} className="text-primary" />}
    />
  );
}
