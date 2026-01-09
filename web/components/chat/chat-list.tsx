"use client";

import { formatDistanceToNow } from "date-fns";
import { Conversation, ChatUser } from "@/types";
import { cn } from "@/lib/utils";

interface ChatListProps {
  conversations: Conversation[];
  selectedId?: string;
  currentUserId?: string;
  onSelect: (conversation: Conversation) => void;
}

export function ChatList({
  conversations,
  selectedId,
  currentUserId,
  onSelect,
}: ChatListProps) {
  const getOtherParticipant = (conversation: Conversation): ChatUser | null => {
    if (conversation.type === "direct") {
      return conversation.participants.find((p) => p._id !== currentUserId) || null;
    }
    return null;
  };

  const getConversationName = (conversation: Conversation): string => {
    if (conversation.type === "group" && conversation.name) {
      return conversation.name;
    }
    const other = getOtherParticipant(conversation);
    return other?.name || "Unknown";
  };

  const getConversationImage = (conversation: Conversation): string | null => {
    if (conversation.type === "group" && conversation.image) {
      return conversation.image;
    }
    const other = getOtherParticipant(conversation);
    return other?.profileImage || null;
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 p-8 text-center">
        <div>
          <p className="text-lg mb-2">No conversations yet</p>
          <p className="text-sm">Start a new conversation to begin chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
      {conversations.map((conversation) => {
        const name = getConversationName(conversation);
        const image = getConversationImage(conversation);
        const isSelected = conversation._id === selectedId;

        return (
          <button
            key={conversation._id}
            onClick={() => onSelect(conversation)}
            className={cn(
              "flex items-center gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer",
              isSelected && "bg-blue-50 dark:bg-blue-900/20"
            )}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {getInitials(name)}
                </div>
              )}
              {conversation.type === "group" && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">
                    {conversation.participants.length}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                  {name}
                </h3>
                {conversation.lastMessage && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                    {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), {
                      addSuffix: false,
                    })}
                  </span>
                )}
              </div>
              {conversation.lastMessage && (
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {conversation.lastMessage.messageType === "image"
                    ? "📷 Image"
                    : conversation.lastMessage.messageType === "file"
                      ? "📎 File"
                      : conversation.lastMessage.content}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
