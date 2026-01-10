"use client";

import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShoutboxMessage } from "@/lib/api/shoutbox";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";

interface ShoutboxWindowProps {
  messages: ShoutboxMessage[];
  currentUserId?: string;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function ShoutboxWindow({
  messages,
  currentUserId,
  isLoading,
  hasMore,
  onLoadMore,
}: ShoutboxWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onScroll={(e) => {
          const { scrollTop } = e.currentTarget;
          if (scrollTop === 0 && hasMore && !isLoading && onLoadMore) {
            onLoadMore();
          }
        }}
      >
        {hasMore && (
          <div className="flex justify-center p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLoadMore}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Load older messages
            </Button>
          </div>
        )}

        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-sm">No messages yet. Be the first to shout!</p>
          </div>
        )}

        {messages.map((message) => {
          const isOwn = message.senderId._id === currentUserId;

          return (
            <div
              key={message._id}
              className={`flex items-start gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"
                }`}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage
                  src={message.senderId.profileImage}
                  alt={message.senderId.name}
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-[10px]">
                  {getInitials(message.senderId.name)}
                </AvatarFallback>
              </Avatar>

              <div
                className={`flex flex-col space-y-1 max-w-[70%] ${isOwn ? "items-end" : "items-start"
                  }`}
              >
                {!isOwn && (
                  <span className="text-xs font-medium text-gray-500 ml-1">
                    {message.senderId.name}
                  </span>
                )}
                <div
                  className={`px-3 py-2 rounded-2xl text-sm ${isOwn
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-tl-none shadow-sm"
                    }`}
                >
                  {message.content}
                </div>
                <span className="text-[10px] text-gray-400 px-1">
                  {formatDistanceToNow(new Date(message.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

// Internal Button component mock for simplicity or import if available
import { Button } from "@/components/ui/button";
