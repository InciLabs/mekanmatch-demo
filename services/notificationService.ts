import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Notification handler configuration
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationData {
  type: 'venue_update' | 'match' | 'message' | 'promotion' | 'alert';
  venueId?: string;
  matchId?: string;
  chatId?: string;
  userId?: string;
  title: string;
  body: string;
}

class NotificationService {
  private pushToken: string | null = null;

  // Request notification permissions
  async requestPermissions(): Promise<boolean> {
    try {
      if (!Device.isDevice) {
        console.log('Must use physical device for Push Notifications');
        return false;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  // Register for push notifications and get token
  async registerForPushNotifications(): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id', // Replace with your actual project ID
      });

      this.pushToken = token.data;
      console.log('Push token:', this.pushToken);

      // Configure notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#8B5CF6',
        });

        await Notifications.setNotificationChannelAsync('venue_updates', {
          name: 'Venue Updates',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#8B5CF6',
        });

        await Notifications.setNotificationChannelAsync('matches', {
          name: 'Matches',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#EC4899',
        });

        await Notifications.setNotificationChannelAsync('messages', {
          name: 'Messages',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#10B981',
        });
      }

      return this.pushToken;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }

  // Get current push token
  getPushToken(): string | null {
    return this.pushToken;
  }

  // Send local notification
  async sendLocalNotification(data: NotificationData): Promise<void> {
    try {
      const channelId = this.getChannelIdForType(data.type);
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: data.title,
          body: data.body,
          data: data,
          sound: 'default',
        },
        trigger: null, // Show immediately
        ...(Platform.OS === 'android' && { channelId }),
      });
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  }

  // Schedule notification for later
  async scheduleNotification(
    data: NotificationData,
    trigger: Notifications.NotificationTriggerInput
  ): Promise<void> {
    try {
      const channelId = this.getChannelIdForType(data.type);
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: data.title,
          body: data.body,
          data: data,
          sound: 'default',
        },
        trigger,
        ...(Platform.OS === 'android' && { channelId }),
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  // Get notification channel ID for type
  private getChannelIdForType(type: NotificationData['type']): string {
    switch (type) {
      case 'venue_update':
        return 'venue_updates';
      case 'match':
        return 'matches';
      case 'message':
        return 'messages';
      default:
        return 'default';
    }
  }

  // Handle notification received while app is running
  addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  }

  // Handle notification tapped
  addNotificationResponseReceivedListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  // Clear all notifications
  async clearAllNotifications(): Promise<void> {
    await Notifications.dismissAllNotificationsAsync();
  }

  // Get badge count
  async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  }

  // Set badge count
  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }

  // Cancel specific notification
  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  // Get all scheduled notifications
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  // Send push token to backend
  async sendTokenToBackend(token: string, userId: string): Promise<boolean> {
    try {
      // Replace with your actual backend endpoint
      const response = await fetch('http://localhost:5000/api/users/push-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          pushToken: token,
          platform: Platform.OS,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending token to backend:', error);
      return false;
    }
  }

  // Create notification data helpers
  static createVenueUpdateNotification(venueName: string, message: string): NotificationData {
    return {
      type: 'venue_update',
      title: `🔥 ${venueName} Update`,
      body: message,
    };
  }

  static createMatchNotification(userName: string): NotificationData {
    return {
      type: 'match',
      title: '💕 New Match!',
      body: `You and ${userName} liked each other!`,
    };
  }

  static createMessageNotification(senderName: string, message: string): NotificationData {
    return {
      type: 'message',
      title: `💬 ${senderName}`,
      body: message,
    };
  }

  static createPromotionNotification(title: string, message: string): NotificationData {
    return {
      type: 'promotion',
      title: `🎉 ${title}`,
      body: message,
    };
  }

  static createAlertNotification(title: string, message: string): NotificationData {
    return {
      type: 'alert',
      title: `🚨 ${title}`,
      body: message,
    };
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
