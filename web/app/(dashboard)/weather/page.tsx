import { ServiceUnavailable } from "@/components/service-unavailable";

export default function WeatherPage() {
  return <ServiceUnavailable serviceName="Weather" />;
}
