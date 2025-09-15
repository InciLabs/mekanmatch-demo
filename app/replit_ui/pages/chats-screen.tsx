import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useAppState } from "@/hooks/use-app-state";
import { ArrowLeft, MessageCircle, Heart } from "lucide-react";
import { getTimeAgo } from "@/lib/mock-data";
import type { ChatWithUser } from "@shared/schema";

export default function ChatsScreen() {
  const [, setLocation] = useLocation();
  const { currentUser } = useAppState();

  const { data: chats = [], isLoading } = useQuery<ChatWithUser[]>({
    queryKey: ['/api/users', currentUser?.id, 'chats'],
    enabled: !!currentUser?.id,
  });

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Please log in to view your chats</p>
          <Button onClick={() => setLocation("/login")} className="mt-4">
            Log In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight pb-20 animate-fade-in">
      {/* Header */}
      <div className="px-6 py-8 pt-12">
        <div className="flex items-center justify-between mb-6">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setLocation("/profile")}
            className="text-white"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-montserrat font-bold text-white" data-testid="chats-title">
            Messages
          </h2>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Chats List */}
      <div className="px-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-purple"></div>
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-medium-gray rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-xl font-poppins font-semibold text-white mb-2">No Messages Yet</h3>
            <p className="text-gray-400 mb-6">Start matching with people to begin conversations</p>
            <Button 
              onClick={() => setLocation("/home")}
              className="btn-primary"
              data-testid="button-start-matching"
            >
              Start Matching
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="glass-effect rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => setLocation(`/chat/${chat.id}`)}
                data-testid={`chat-${chat.id}`}
              >
                <div className="flex items-center">
                  <div className="relative">
                    <img
                      src={chat.otherUser.profileImageUrl || "https://images.unsplash.com/photo-1494790108755-2616b612b977?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"}
                      alt={chat.otherUser.name || 'User'}
                      className="w-14 h-14 rounded-full object-cover border-2 border-neon-purple/30"
                    />
                    {/* Online indicator (mock) */}
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-midnight"></div>
                  </div>
                  
                  <div className="flex-1 ml-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-poppins font-semibold text-white" data-testid={`chat-name-${chat.id}`}>
                        {chat.otherUser.name || 'Unknown User'}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {chat.unreadCount > 0 && (
                          <Badge 
                            className="bg-electric-pink text-white px-2 py-1 text-xs rounded-full"
                            data-testid={`unread-count-${chat.id}`}
                          >
                            {chat.unreadCount}
                          </Badge>
                        )}
                        <span className="text-xs text-gray-400" data-testid={`chat-time-${chat.id}`}>
                          {chat.lastMessage ? getTimeAgo(chat.lastMessage.createdAt || '') : getTimeAgo(chat.createdAt || '')}
                        </span>
                      </div>
                    </div>
                    
                    <p 
                      className={`text-sm ${chat.unreadCount > 0 ? 'text-white font-medium' : 'text-gray-400'} truncate`}
                      data-testid={`chat-preview-${chat.id}`}
                    >
                      {chat.lastMessage?.content || 'You matched! Say hello 👋'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mock New Matches Section */}
        {chats.length > 0 && (
          <div className="mt-8">
            <h3 className="font-poppins font-semibold text-white mb-4" data-testid="new-matches-title">
              New Matches
            </h3>
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {[...Array(5)].map((_, index) => (
                <div 
                  key={index}
                  className="flex-shrink-0 text-center cursor-pointer"
                  data-testid={`new-match-${index}`}
                >
                  <div className="relative">
                    <img
                      src={`https://images.unsplash.com/photo-${1507003211169 + index}?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100`}
                      alt="New match"
                      className="w-16 h-16 rounded-full object-cover border-2 border-electric-pink"
                    />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-electric-pink rounded-full flex items-center justify-center">
                      <Heart className="text-white w-3 h-3" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 truncate w-16">
                    User {index + 1}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNavigation onNavigate={setLocation} />
    </div>
  );
}