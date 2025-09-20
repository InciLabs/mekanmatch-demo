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
import { useNotificationContext } from '../../contexts/NotificationContext';

// Mock notification data
const mockNotifications = [
  {
    id: 'notif-1',
    title: '🔥 Kadıköy is buzzing tonight!',
    message: 'Klein and Arkaoda are 70% full with great M/F ratio',
    type: 'alert',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60000), // 2 minutes ago
  },
  {
    id: 'notif-2',
    title: 'Happy Hour at 360 Istanbul',
    message: '20% off all cocktails until 20:00 tonight!',
    type: 'promotion',
    isRead: false,
    createdAt: new Date(Date.now() - 60 * 60000), // 1 hour ago
  },
  {
    id: 'notif-3',
    title: 'Someone liked your profile',
    message: 'Elif from 360 Istanbul wants to connect with you',
    type: 'social',
    isRead: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60000), // 3 hours ago
  },
  {
    id: 'notif-4',
    title: 'New Event Added',
    message: 'DJ Mahmut Orhan live set tomorrow at Klein',
    type: 'event',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60000), // 1 day ago
  },
  {
    id: 'notif-5',
    title: 'Premium Benefits Available',
    message: 'Upgrade to see who\'s at venues before checking in',
    type: 'subscription',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60000), // 2 days ago
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'alert':
      return <Ionicons name="flame" size={24} color="#EC4899" />;
    case 'promotion':
      return <Ionicons name="pricetag" size={24} color="#F59E0B" />;
    case 'social':
      return <Ionicons name="heart" size={24} color="#8B5CF6" />;
    case 'event':
      return <Ionicons name="calendar" size={24} color="#10B981" />;
    case 'subscription':
      return <Ionicons name="diamond" size={24} color="#3B82F6" />;
    default:
      return <Ionicons name="notifications" size={24} color="#9CA3AF" />;
  }
};

const getBorderColor = (type: string) => {
  switch (type) {
    case 'alert':
      return '#EC4899';
    case 'promotion':
      return '#F59E0B';
    case 'social':
      return '#8B5CF6';
    case 'event':
      return '#10B981';
    case 'subscription':
      return '#3B82F6';
    default:
      return '#9CA3AF';
  }
};

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

export default function NotificationsScreen() {
  const { badgeCount, clearAllNotifications } = useNotificationContext();

  const handleNotificationPress = (notificationId: string) => {
    // Mark as read and handle action
    console.log('Notification pressed:', notificationId);
  };

  const handleClearAll = async () => {
    await clearAllNotifications();
  };

  const renderNotificationItem = (notification: any) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationItem,
        { borderLeftColor: getBorderColor(notification.type) },
        notification.isRead && styles.notificationRead
      ]}
      onPress={() => handleNotificationPress(notification.id)}
    >
      <View style={styles.notificationIcon}>
        {getNotificationIcon(notification.type)}
      </View>
      
      <View style={styles.notificationContent}>
        <Text style={[
          styles.notificationTitle,
          !notification.isRead && styles.notificationTitleUnread
        ]}>
          {notification.title}
        </Text>
        <Text style={styles.notificationMessage}>
          {notification.message}
        </Text>
        <Text style={styles.notificationTime}>
          {formatTimeAgo(notification.createdAt)}
        </Text>
      </View>
      
      {!notification.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerRight}>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
          {unreadCount > 0 && (
            <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {mockNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-outline" size={60} color="#6B7280" />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptySubtitle}>
              We'll notify you about venues, matches, and updates
            </Text>
          </View>
        ) : (
          <View style={styles.notificationsList}>
            {mockNotifications.map(renderNotificationItem)}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  unreadBadge: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  unreadBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8B5CF6',
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
  notificationsList: {
    paddingHorizontal: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#374151',
    borderRadius: 12,
    marginVertical: 6,
    borderLeftWidth: 4,
    position: 'relative',
  },
  notificationRead: {
    backgroundColor: '#2D3748',
  },
  notificationIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    color: '#D1D5DB',
    marginBottom: 4,
  },
  notificationTitleUnread: {
    fontWeight: '600',
    color: '#FFFFFF',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B5CF6',
  },
});
