import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/hooks/use-app-state";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Send, Heart, MoreVertical } from "lucide-react";
import { getTimeAgo } from "@/lib/mock-data";
import type { Message, ChatWithUser } from "@shared/schema";

export default function ChatDetailScreen() {
  const { chatId } = useParams<{ chatId: string }>();
  const [, setLocation] = useLocation();
  const { currentUser } = useAppState();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messageText, setMessageText] = useState("");

  const { data: chat } = useQuery<ChatWithUser>({
    queryKey: ['/api/users', currentUser?.id, 'chats'],
    select: (chats) => chats?.find(c => c.id === chatId),
    enabled: !!currentUser?.id && !!chatId,
  });

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['/api/chats', chatId, 'messages'],
    enabled: !!chatId,
    refetchInterval: 3000, // Refetch every 3 seconds for "real-time" updates
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", "/api/messages", {
        chatId,
        senderId: currentUser?.id,
        content,
      });
    },
    onSuccess: () => {
      setMessageText("");
      queryClient.invalidateQueries({ queryKey: ['/api/chats', chatId, 'messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUser?.id, 'chats'] });
    },
    onError: () => {
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PATCH", `/api/chats/${chatId}/read/${currentUser?.id}`, {});
    },
  });

  useEffect(() => {
    if (chatId && currentUser?.id) {
      markReadMutation.mutate();
    }
  }, [chatId, currentUser?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageText.trim() || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate(messageText.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Please log in to view chats</p>
          <Button onClick={() => setLocation("/login")} className="mt-4">
            Log In
          </Button>
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Chat not found</p>
          <Button onClick={() => setLocation("/chats")} className="mt-4">
            Back to Chats
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight flex flex-col animate-fade-in">
      {/* Header */}
      <div className="px-6 py-4 pt-12 bg-dark-gray border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setLocation("/chats")}
              className="mr-3 text-white"
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center">
              <img
                src={chat.otherUser.profileImageUrl || "https://images.unsplash.com/photo-1494790108755-2616b612b977?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"}
                alt={chat.otherUser.name || 'User'}
                className="w-10 h-10 rounded-full object-cover border border-neon-purple/30"
              />
              <div className="ml-3">
                <h3 className="font-poppins font-semibold text-white" data-testid="chat-user-name">
                  {chat.otherUser.name || 'Unknown User'}
                </h3>
                <p className="text-xs text-gray-400" data-testid="chat-user-status">
                  Active now
                </p>
              </div>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="text-white"
            data-testid="button-menu"
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-purple"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-neon-purple to-electric-pink rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-white text-2xl" />
            </div>
            <h3 className="text-lg font-poppins font-semibold text-white mb-2">You Matched!</h3>
            <p className="text-gray-400 mb-4">
              Start the conversation with {chat.otherUser.name}
            </p>
            <div className="space-y-2">
              <Button 
                variant="outline"
                className="bg-medium-gray border-gray-600 text-white hover:bg-medium-gray/80"
                onClick={() => setMessageText("Hey! 👋")}
                data-testid="suggested-message-1"
              >
                Hey! 👋
              </Button>
              <Button 
                variant="outline"
                className="bg-medium-gray border-gray-600 text-white hover:bg-medium-gray/80"
                onClick={() => setMessageText("Nice to match with you! 😊")}
                data-testid="suggested-message-2"
              >
                Nice to match with you! 😊
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => {
              const isMyMessage = message.senderId === currentUser.id;
              const showTimestamp = index === 0 || 
                new Date(message.createdAt || '').getTime() - new Date(messages[index - 1].createdAt || '').getTime() > 5 * 60 * 1000;

              return (
                <div key={message.id}>
                  {showTimestamp && (
                    <div className="text-center my-4">
                      <span className="text-xs text-gray-400 bg-medium-gray px-3 py-1 rounded-full">
                        {getTimeAgo(message.createdAt || '')}
                      </span>
                    </div>
                  )}
                  <div 
                    className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                    data-testid={`message-${message.id}`}
                  >
                    <div 
                      className={`max-w-xs px-4 py-2 rounded-2xl ${
                        isMyMessage 
                          ? 'bg-gradient-to-r from-neon-purple to-electric-pink text-white' 
                          : 'bg-medium-gray text-white'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="px-6 py-4 bg-dark-gray border-t border-gray-700">
        <div className="flex items-center space-x-3">
          <Input
            type="text"
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-medium-gray border-gray-600 text-white placeholder-gray-400 rounded-full px-4 py-2"
            data-testid="message-input"
          />
          <Button
            size="icon"
            className={`rounded-full ${
              messageText.trim() 
                ? 'bg-gradient-to-r from-neon-purple to-electric-pink hover:opacity-90' 
                : 'bg-medium-gray'
            }`}
            onClick={handleSendMessage}
            disabled={!messageText.trim() || sendMessageMutation.isPending}
            data-testid="button-send"
          >
            <Send className="text-white w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}