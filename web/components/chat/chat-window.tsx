"use client";

import { useRef, useEffect } from "react";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";
import { Message, ChatUser } from "@/types";
import { cn } from "@/lib/utils";
import { Check, CheckCheck, Image as ImageIcon } from "lucide-react";

interface ChatWindowProps {
  messages: Message[];
  currentUserId?: string;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function ChatWindow({
  messages,
  currentUserId,
  isLoading,
  hasMore,
  onLoadMore,
}: ChatWindowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Handle scroll for loading more messages
  const handleScroll = () => {
    if (containerRef.current && hasMore && !isLoading) {
      const { scrollTop } = containerRef.current;
      if (scrollTop < 100) {
        onLoadMore?.();
      }
    }
  };

  const getSenderInfo = (message: Message): ChatUser | null => {
    if (typeof message.senderId === "object") {
      return message.senderId;
    }
    return null;
  };

  const isOwnMessage = (message: Message): boolean => {
    const sender = getSenderInfo(message);
    return sender?._id === currentUserId || message.senderId === currentUserId;
  };

  const formatMessageTime = (dateString: string): string => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, "HH:mm");
    }
    if (isYesterday(date)) {
      return `Yesterday ${format(date, "HH:mm")}`;
    }
    return format(date, "MMM d, HH:mm");
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <p className="text-lg mb-2">No messages yet</p>
          <p className="text-sm">Send a message to start the conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex flex-col gap-3 p-4 overflow-y-auto h-full"
    >
      {/* Load more indicator */}
      {isLoading && (
        <div className="flex justify-center py-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
        </div>
      )}

      {/* Messages */}
      {messages.map((message, index) => {
        const sender = getSenderInfo(message);
        const isOwn = isOwnMessage(message);
        const showAvatar =
          !isOwn &&
          (index === 0 ||
            getSenderInfo(messages[index - 1])?._id !== sender?._id);

        return (
          <div
            key={message._id}
            className={cn(
              "flex gap-2 max-w-[80%]",
              isOwn ? "self-end flex-row-reverse" : "self-start"
            )}
          >
            {/* Avatar */}
            {!isOwn && showAvatar && sender && (
              <div className="shrink-0">
                {sender.profileImage ? (
                  <img
                    src={sender.profileImage}
                    alt={sender.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-xs font-semibold">
                    {getInitials(sender.name)}
                  </div>
                )}
              </div>
            )}

            {/* Spacer for alignment when no avatar */}
            {!isOwn && !showAvatar && <div className="w-8" />}

            {/* Message bubble */}
            <div
              className={cn(
                "rounded-2xl px-4 py-2 max-w-full break-words",
                isOwn
                  ? "bg-blue-500 text-white rounded-br-sm"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm"
              )}
            >
              {/* Sender name for group chats */}
              {!isOwn && showAvatar && sender && (
                <p className="text-xs font-medium text-blue-500 dark:text-blue-400 mb-1">
                  {sender.name}
                </p>
              )}

              {/* Message content */}
              {message.isDeleted ? (
                <p className="italic opacity-60">This message was deleted</p>
              ) : message.messageType === "image" && message.imageUrl ? (
                <div className="relative">
                  <img
                    src={message.imageUrl}
                    alt="Shared image"
                    className="rounded-lg max-w-[300px] max-h-[300px] object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(message.imageUrl, "_blank")}
                  />
                  {message.content && (
                    <p className="mt-2">{message.content}</p>
                  )}
                </div>
              ) : message.messageType === "file" ? (
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded">
                    📎
                  </div>
                  <div>
                    <p className="font-medium">{message.fileName || "File"}</p>
                    {message.fileSize && (
                      <p className="text-xs opacity-75">
                        {(message.fileSize / 1024).toFixed(1)} KB
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}

              {/* Time and read status */}
              <div
                className={cn(
                  "flex items-center gap-1 mt-1 text-xs",
                  isOwn ? "text-white/70 justify-end" : "text-gray-500 dark:text-gray-400"
                )}
              >
                <span>{formatMessageTime(message.createdAt)}</span>
                {isOwn && (
                  message.readBy.length > 1 ? (
                    <CheckCheck className="w-3.5 h-3.5" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}
