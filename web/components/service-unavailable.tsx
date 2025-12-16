import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Construction, ArrowLeft } from "lucide-react";

interface ServiceUnavailableProps {
  serviceName: string;
}

export function ServiceUnavailable({ serviceName }: ServiceUnavailableProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full mb-4">
              <Construction className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {serviceName} Coming Soon
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              This service is currently under development and will be available soon.
            </p>
          </div>
          <div className="space-y-3">
            <Link href="/todos">
              <Button className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go to Todos
              </Button>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Meanwhile, check out our Todo service which is fully functional!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
