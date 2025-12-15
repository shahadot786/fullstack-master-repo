import { ComingSoonPage } from '@/components/ComingSoonPage';
import { FileText } from 'lucide-react';

export default function NotesPage() {
  return (
    <ComingSoonPage
      serviceName="Notes"
      description="Create, organize, and manage your notes with rich text editing, categories, and powerful search capabilities."
      icon={<FileText size={40} className="text-primary" />}
    />
  );
}
