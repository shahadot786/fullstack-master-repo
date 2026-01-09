"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendMessageDto } from "@/types";
import { Send, Image, X, Loader2, Smile } from "lucide-react";
import { uploadApi } from "@/lib/api/upload";
import dynamic from "next/dynamic";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Dynamically import EmojiPicker to avoid SSR issues
const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
});

interface MessageInputProps {
  onSend: (message: SendMessageDto) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({
  onSend,
  disabled,
  placeholder = "Type a message...",
}: MessageInputProps) {
  const [content, setContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if ((!content.trim() && !uploadedImageUrl) || disabled || isSending) return;

    try {
      setIsSending(true);

      const message: SendMessageDto = {};

      if (uploadedImageUrl) {
        message.messageType = "image";
        message.imageUrl = uploadedImageUrl;
        message.content = content.trim() || undefined;
      } else {
        message.messageType = "text";
        message.content = content.trim();
      }

      await onSend(message);

      // Clear state
      setContent("");
      setPreviewImage(null);
      setUploadedImageUrl(null);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const result = await uploadApi.uploadFile(file, "chat-images");
      setUploadedImageUrl(result.url);
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image. Please try again.");
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setUploadedImageUrl(null);
  };

  const onEmojiClick = (emojiData: any) => {
    setContent((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
      {/* Image preview */}
      {previewImage && (
        <div className="mb-3 relative inline-block">
          <img
            src={previewImage}
            alt="Preview"
            className="h-24 w-auto rounded-lg object-cover"
          />
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
          )}
          <button
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-center gap-2">
        {/* Image upload button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className="shrink-0"
        >
          <Image className="w-5 h-5 text-gray-500" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        {/* Emoji picker button */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={disabled || isSending}
              className="shrink-0"
            >
              <Smile className="w-5 h-5 text-gray-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 border-none shadow-none" side="top" align="start">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </PopoverContent>
        </Popover>

        {/* Text input */}
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isSending}
          className="flex-1"
        />

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={
            (!content.trim() && !uploadedImageUrl) ||
            disabled ||
            isSending ||
            isUploading
          }
          size="icon"
          className="shrink-0"
        >
          {isSending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  );
}

