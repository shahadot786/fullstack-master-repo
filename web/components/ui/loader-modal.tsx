import { Loader2 } from "lucide-react";

interface LoaderModalProps {
    text?: string;
}

export function LoaderModal({ text = "Loading..." }: LoaderModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 flex flex-col items-center gap-4 min-w-[280px]">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400" />
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {text}
                </p>
            </div>
        </div>
    );
}
