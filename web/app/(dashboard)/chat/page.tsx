"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useWebSocket } from "@/hooks/use-websocket";
import {
  useConversations,
  useMessages,
  useSendMessage,
  useMarkAsRead,
  useCreateConversation,
  useUpdateConversation,
  useLeaveConversation,
} from "@/hooks/use-chat";
import { useShoutboxMessages, useSendShoutboxMessage } from "@/hooks/use-shoutbox";
import { ChatList } from "@/components/chat/chat-list";
import { ChatWindow } from "@/components/chat/chat-window";
import { ShoutboxWindow } from "@/components/chat/shoutbox-window";
import { MessageInput } from "@/components/chat/message-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderModal } from "@/components/ui/loader-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Conversation, Message, SendMessageDto, User } from "@/types";
import {
  Plus,
  MessageSquare,
  ArrowLeft,
  Search,
  Wifi,
  WifiOff,
  Loader2,
  Users,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  Settings,
  X,
  Camera,
  Check,
} from "lucide-react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { userApi } from "@/lib/api/user";

const USERS_PER_PAGE = 10;

type ChatMode = "private" | "shoutbox";

export default function ChatPage() {
  const [chatMode, setChatMode] = useState<ChatMode>("private");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();
  const [userPage, setUserPage] = useState(0);
  const [selectedNewChatUsers, setSelectedNewChatUsers] = useState<User[]>([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedGroupName, setEditedGroupName] = useState("");
  const [isUploadingGroupImage, setIsUploadingGroupImage] = useState(false);

  const queryClient = useQueryClient();
  const { isConnected } = useWebSocket();

  // Get current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api") + "/user/profile",
          { credentials: "include" }
        );
        if (response.ok) {
          const data = await response.json();
          setCurrentUserId(data.data._id);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  // Fetch all users for new chat dialog
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isFetching: isFetchingUsers,
  } = useQuery({
    queryKey: ["allUsers", userPage],
    queryFn: () => userApi.getAllUsers({ limit: USERS_PER_PAGE, skip: userPage * USERS_PER_PAGE }),
    enabled: isNewChatOpen && !!currentUserId,
  });

  // Private Chat Queries
  const { data: conversationsData, isLoading: isLoadingConversations } = useConversations();
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(selectedConversation?._id || "");
  const updateConversationMutation = useUpdateConversation(selectedConversation?._id || "");
  const leaveConversationMutation = useLeaveConversation();

  useEffect(() => {
    if (selectedConversation?.name) {
      setEditedGroupName(selectedConversation.name);
    }
  }, [selectedConversation]);

  // Shoutbox Queries
  const {
    data: shoutboxData,
    isLoading: isLoadingShoutbox,
    fetchNextPage: fetchNextShoutboxPage,
    hasNextPage: hasNextShoutboxPage,
    isFetchingNextPage: isFetchingNextShoutboxPage,
  } = useShoutboxMessages();

  // Mutations
  const sendMessageMutation = useSendMessage(selectedConversation?._id || "");
  const sendShoutboxMessageMutation = useSendShoutboxMessage();
  const markAsReadMutation = useMarkAsRead();
  const createConversationMutation = useCreateConversation();

  // Flatten messages from infinite query
  const messages: Message[] = useMemo(() => {
    if (!messagesData?.pages) return [];
    return messagesData.pages.flatMap((page) => page.data);
  }, [messagesData]);

  const shoutboxMessages = useMemo(() => {
    if (!shoutboxData?.pages) return [];
    const allMessages = shoutboxData.pages.flatMap((page) => page.data);
    // Safety check: Filter out any duplicates by _id that might have slipped through the cache logic
    const uniqueMessages = Array.from(new Map(allMessages.map(m => [m._id, m])).values());
    return uniqueMessages;
  }, [shoutboxData]);

  // Filter conversations by search query
  const filteredConversations = useMemo(() => {
    if (!conversationsData?.data) return [];
    if (!searchQuery.trim()) return conversationsData.data;

    return conversationsData.data.filter((conv) => {
      const name =
        conv.name || conv.participants.find((p) => p._id !== currentUserId)?.name || "";
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [conversationsData, searchQuery, currentUserId]);

  const filteredUsers = useMemo(() => {
    const users = usersData?.users || [];
    const otherUsers = users.filter((u) => u._id !== currentUserId);
    if (!userSearchQuery.trim()) return otherUsers;
    return otherUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
    );
  }, [usersData, userSearchQuery, currentUserId]);

  const totalUsers = usersData?.total || 0;
  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);
  const hasNextUserPage = userPage < totalPages - 1;
  const hasPrevUserPage = userPage > 0;

  useEffect(() => {
    if (selectedConversation?._id && chatMode === "private") {
      markAsReadMutation.mutate(selectedConversation._id);
    }
  }, [selectedConversation?._id, chatMode]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setChatMode("private");
  };

  const handleSendMessage = async (message: SendMessageDto) => {
    if (chatMode === "shoutbox") {
      if (message.content) {
        await sendShoutboxMessageMutation.mutateAsync(message.content);
      }
    } else {
      if (!selectedConversation) return;
      await sendMessageMutation.mutateAsync(message);
    }
  };

  const handleToggleSelectUser = (user: User) => {
    if (selectedNewChatUsers.find((u) => u._id === user._id)) {
      setSelectedNewChatUsers(selectedNewChatUsers.filter((u) => u._id !== user._id));
    } else {
      setSelectedNewChatUsers([...selectedNewChatUsers, user]);
    }
  };

  const handleCreateChat = async () => {
    if (selectedNewChatUsers.length === 0) return;

    try {
      const isGroup = selectedNewChatUsers.length > 1;
      const conversation = await createConversationMutation.mutateAsync({
        participantIds: selectedNewChatUsers.map((u) => u._id),
        type: isGroup ? "group" : "direct",
        name: isGroup ? newGroupName : undefined,
      });

      setSelectedConversation(conversation);
      setChatMode("private");
      setIsNewChatOpen(false);
      setSelectedNewChatUsers([]);
      setNewGroupName("");
      setUserSearchQuery("");
      setUserPage(0);
    } catch (error: any) {
      console.error("Failed to create conversation:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to start conversation";
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleUpdateGroupName = async () => {
    if (!editedGroupName.trim() || !selectedConversation) return;
    try {
      await updateConversationMutation.mutateAsync({ name: editedGroupName.trim() });
      setIsEditingName(false);
    } catch (error) {
      console.error("Failed to update group name:", error);
    }
  };

  const handleGroupImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedConversation) return;

    try {
      setIsUploadingGroupImage(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "chat-images");

      const response = await fetch(
        (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api") + "/upload",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        await updateConversationMutation.mutateAsync({ image: data.data.url });
      }
    } catch (error) {
      console.error("Failed to upload group image:", error);
    } finally {
      setIsUploadingGroupImage(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!selectedConversation) return;
    if (confirm("Are you sure you want to leave this group?")) {
      try {
        await leaveConversationMutation.mutateAsync(selectedConversation._id);
        setSelectedConversation(null);
        setIsSettingsOpen(false);
      } catch (error) {
        console.error("Failed to leave group:", error);
      }
    }
  };

  const handleBack = () => {
    setSelectedConversation(null);
  };

  const handleDialogClose = () => {
    setIsNewChatOpen(false);
    setUserSearchQuery("");
    setUserPage(0);
  };

  const getInitials = useCallback((name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  if (isLoadingConversations) {
    return <LoaderModal text="Loading Chats..." />;
  }

  return (
    <div className="flex h-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
      {/* Sidebar */}
      <div
        className={`${selectedConversation || chatMode === "shoutbox" ? "hidden md:flex" : "flex"
          } flex-col w-full md:w-80 lg:w-96 border-r border-gray-200 dark:border-gray-800`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Chat</h1>
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-gray-400" />
              )}
            </div>
            <Dialog open={isNewChatOpen} onOpenChange={(open) => (open ? setIsNewChatOpen(true) : handleDialogClose())}>
              <DialogTrigger asChild>
                <Button size="icon" variant="ghost" title="New Private Chat">
                  <Plus className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Start New Conversation
                  </DialogTitle>
                </DialogHeader>

                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex-1 overflow-y-auto mt-4 min-h-[300px] max-h-[400px]">
                  {isLoadingUsers || isFetchingUsers ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                      <p className="text-sm text-gray-500">Loading users...</p>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
                      <Users className="w-12 h-12 opacity-50" />
                      <p className="text-sm">
                        {userSearchQuery ? "No users found" : "No users available"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filteredUsers.map((user) => (
                        <button
                          key={user._id}
                          onClick={() => handleToggleSelectUser(user)}
                          disabled={createConversationMutation.isPending}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left disabled:opacity-50 ${selectedNewChatUsers.find((u) => u._id === user._id)
                            ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.profileImage} alt={user.name} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {user.email}
                            </p>
                          </div>
                          {selectedNewChatUsers.find((u) => u._id === user._id) && (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {!isLoadingUsers && totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUserPage((p) => Math.max(0, p - 1))}
                      disabled={!hasPrevUserPage || isFetchingUsers}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                    <span className="text-sm text-gray-500">
                      Page {userPage + 1} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUserPage((p) => p + 1)}
                      disabled={!hasNextUserPage || isFetchingUsers}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}

                {selectedNewChatUsers.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {selectedNewChatUsers.length > 1 && (
                      <div className="mb-4">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                          Group Name
                        </label>
                        <Input
                          placeholder="Enter group name (optional)"
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          className="w-full"
                        />
                      </div>
                    )}
                    <Button
                      onClick={handleCreateChat}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={createConversationMutation.isPending}
                    >
                      {createConversationMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Plus className="w-4 h-4 mr-2" />
                      )}
                      {selectedNewChatUsers.length > 1
                        ? `Create Group with ${selectedNewChatUsers.length} people`
                        : "Start Chat"}
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>

          {/* Mode Tabs */}
          <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-md transition-all ${chatMode === "private"
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              onClick={() => {
                setChatMode("private");
                setSelectedConversation(null);
              }}
            >
              <MessageSquare className="w-4 h-4" />
              Direct
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-md transition-all ${chatMode === "shoutbox"
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              onClick={() => setChatMode("shoutbox")}
            >
              <Megaphone className="w-4 h-4" />
              Shoutbox
            </button>
          </div>

          {chatMode === "private" && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Sidebar Content */}
        {chatMode === "private" ? (
          <div className="flex-1 overflow-y-auto">
            <ChatList
              conversations={filteredConversations}
              selectedId={selectedConversation?._id}
              currentUserId={currentUserId}
              onSelect={handleSelectConversation}
            />
          </div>
        ) : (
          <div className="flex-1 p-4 overflow-y-auto flex flex-col items-center justify-center text-center">
            <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
              <Megaphone className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Public Shoutbox</h3>
            <p className="text-xs text-gray-500 mb-4 px-4">
              Everyone in the system can see and send messages here. It's an open chat!
            </p>
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setChatMode("shoutbox")}
            >
              Join Discussion
            </Button>
          </div>
        )}
      </div>

      {/* Main Chat Window */}
      <div
        className={`${selectedConversation || chatMode === "shoutbox" ? "flex" : "hidden md:flex"
          } flex-col flex-1`}
      >
        {chatMode === "shoutbox" ? (
          <>
            {/* Shoutbox Header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-800 h-[73px]">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => {
                setChatMode("private");
                setSelectedConversation(null);
              }}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">Public Shoutbox</h2>
                  <p className="text-xs text-green-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Open to everyone
                  </p>
                </div>
              </div>
            </div>

            {/* Shoutbox Messages */}
            <div className="flex-1 overflow-hidden">
              {isLoadingShoutbox ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
              ) : (
                <ShoutboxWindow
                  messages={shoutboxMessages}
                  currentUserId={currentUserId}
                  isLoading={isFetchingNextShoutboxPage}
                  hasMore={hasNextShoutboxPage}
                  onLoadMore={() => fetchNextShoutboxPage()}
                />
              )}
            </div>

            {/* Shoutbox Input */}
            <MessageInput
              onSend={handleSendMessage}
              disabled={sendShoutboxMessageMutation.isPending}
              placeholder="Shout something to everyone..."
            />
          </>
        ) : selectedConversation ? (
          <>
            {/* Private Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-800 h-[73px]">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={handleBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md">
                  {(
                    selectedConversation.name ||
                    selectedConversation.participants.find((p) => p._id !== currentUserId)?.name ||
                    "?"
                  ).charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    {selectedConversation.name ||
                      selectedConversation.participants.find((p) => p._id !== currentUserId)?.name ||
                      "Unknown"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {selectedConversation.type === "group"
                      ? `${selectedConversation.participants.length} members`
                      : "Direct Message"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500"
                  onClick={() => setIsSettingsOpen(true)}
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Private Messages */}
            <div className="flex-1 overflow-hidden">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
              ) : (
                <ChatWindow
                  messages={messages}
                  currentUserId={currentUserId}
                  isLoading={isFetchingNextPage}
                  hasMore={hasNextPage}
                  onLoadMore={() => fetchNextPage()}
                />
              )}
            </div>

            {/* Private Input */}
            <MessageInput onSend={handleSendMessage} disabled={sendMessageMutation.isPending} />
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="p-6 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <MessageSquare className="w-12 h-12" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Welcome to Chat
            </h2>
            <p className="text-center max-w-xs mb-6">
              Select a conversation from the sidebar or jump into the Shoutbox to talk with everyone.
            </p>
            <div className="flex gap-4">
              <Button onClick={() => setIsNewChatOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </Button>
              <Button variant="outline" onClick={() => setChatMode("shoutbox")}>
                <Megaphone className="w-4 h-4 mr-2" />
                Join Shoutbox
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Group Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chat Settings</DialogTitle>
          </DialogHeader>
          {selectedConversation && (
            <div className="space-y-6 py-4">
              {/* Image Selection */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <Avatar className="w-24 h-24 text-2xl">
                    <AvatarImage src={selectedConversation.image} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {getInitials(selectedConversation.name || "Group")}
                    </AvatarFallback>
                  </Avatar>
                  {selectedConversation.type === "group" && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleGroupImageUpload}
                        disabled={isUploadingGroupImage}
                      />
                      {isUploadingGroupImage ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Camera className="w-6 h-6" />
                      )}
                    </label>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{selectedConversation.name || "Group Chat"}</h3>
                  <p className="text-sm text-gray-500">{selectedConversation.participants.length} members</p>
                </div>
              </div>

              {/* Edit Name Section */}
              {selectedConversation.type === "group" && (
                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Group Name</label>
                    {isEditingName ? (
                      <div className="flex gap-2">
                        <Input
                          value={editedGroupName}
                          onChange={(e) => setEditedGroupName(e.target.value)}
                          placeholder="Enter group name"
                          autoFocus
                        />
                        <Button onClick={handleUpdateGroupName} disabled={updateConversationMutation.isPending}>
                          {updateConversationMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Save"
                          )}
                        </Button>
                        <Button variant="ghost" onClick={() => setIsEditingName(false)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <span className="text-sm">{selectedConversation.name || "Unnamed Group"}</span>
                        <Button variant="ghost" size="sm" onClick={() => setIsEditingName(true)}>
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Participants List */}
              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <label className="text-sm font-medium">Participants</label>
                <div className="max-h-[200px] overflow-y-auto space-y-2">
                  {selectedConversation.participants.map((participant) => (
                    <div key={participant._id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 text-xs">
                        <AvatarImage src={participant.profileImage} />
                        <AvatarFallback>{getInitials(participant.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{participant.name}</p>
                        <p className="text-xs text-gray-500 truncate">{participant.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6">
                <Button
                  variant="destructive"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleLeaveGroup}
                >
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                  Leave Group
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
