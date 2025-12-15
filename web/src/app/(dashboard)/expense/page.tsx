import { ComingSoonPage } from '@/components/ComingSoonPage';
import { DollarSign } from 'lucide-react';

export default function ExpensePage() {
  return (
    <ComingSoonPage
      serviceName="Expense Tracker"
      description="Monitor your expenses, create budgets, and generate financial reports with powerful analytics."
      icon={<DollarSign size={40} className="text-primary" />}
    />
  );
}
