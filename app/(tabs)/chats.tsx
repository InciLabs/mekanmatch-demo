import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock chat data
const mockChats = [
  {
    id: 'chat-1',
    otherUser: {
      id: 'user-1',
      name: 'Elif',
      profileImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150',
    },
    lastMessage: {
      content: 'Hey! How was your night at Klein?',
      createdAt: new Date(Date.now() - 5 * 60000), // 5 minutes ago
      senderId: 'user-1',
    },
    unreadCount: 2,
  },
  {
    id: 'chat-2',
    otherUser: {
      id: 'user-2',
      name: 'Can',
      profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150',
    },
    lastMessage: {
      content: 'See you at 360 Istanbul tonight?',
      createdAt: new Date(Date.now() - 30 * 60000), // 30 minutes ago
      senderId: 'user-2',
    },
    unreadCount: 0,
  },
  {
    id: 'chat-3',
    otherUser: {
      id: 'user-3',
      name: 'Zeynep',
      profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150',
    },
    lastMessage: {
      content: 'Thanks for the great conversation! 😊',
      createdAt: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
      senderId: 'user-3',
    },
    unreadCount: 1,
  },
];

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

export default function ChatsScreen() {
  const handleChatPress = (chatId: string) => {
    // Navigate to chat detail
    console.log('Navigate to chat:', chatId);
  };

  const renderChatItem = (chat: any) => (
    <TouchableOpacity
      key={chat.id}
      style={styles.chatItem}
      onPress={() => handleChatPress(chat.id)}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={24} color="#9CA3AF" />
        </View>
        {chat.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{chat.unreadCount}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.userName}>{chat.otherUser.name}</Text>
          <Text style={styles.timeText}>{formatTimeAgo(chat.lastMessage.createdAt)}</Text>
        </View>
        <Text 
          style={[
            styles.lastMessage,
            chat.unreadCount > 0 && styles.lastMessageUnread
          ]}
          numberOfLines={1}
        >
          {chat.lastMessage.content}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {mockChats.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={60} color="#6B7280" />
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptySubtitle}>
              Start matching with people at venues to begin conversations
            </Text>
          </View>
        ) : (
          <View style={styles.chatsList}>
            {mockChats.map(renderChatItem)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  chatsList: {
    paddingHorizontal: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#374151',
    borderRadius: 12,
    marginVertical: 6,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4B5563',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#8B5CF6',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  lastMessage: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  lastMessageUnread: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
