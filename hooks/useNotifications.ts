import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { notificationService, NotificationData } from '../services/notificationService';

export const useNotifications = (userId?: string) => {
  const router = useRouter();
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    // Register for push notifications
    const registerNotifications = async () => {
      try {
        const token = await notificationService.registerForPushNotifications();
        if (token) {
          setPushToken(token);
          setIsRegistered(true);
          
          // Send token to backend if userId is available
          if (userId) {
            await notificationService.sendTokenToBackend(token, userId);
          }
        }
      } catch (error) {
        console.error('Failed to register for notifications:', error);
      }
    };

    registerNotifications();

    // Listen for notifications received while app is running
    notificationListener.current = notificationService.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
        // Handle notification received while app is in foreground
        handleNotificationReceived(notification);
      }
    );

    // Listen for notification taps
    responseListener.current = notificationService.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification tapped:', response);
        handleNotificationTap(response);
      }
    );

    return () => {
      notificationListener.current?.remove?.();
      responseListener.current?.remove?.();
    };
  }, [userId]);

  const handleNotificationReceived = (notification: Notifications.Notification) => {
    const data = notification.request.content.data as unknown as NotificationData;
    
    // Update badge count
    updateBadgeCount();
    
    // Show in-app notification or update UI based on type
    switch (data.type) {
      case 'match':
        // Could show a modal or update match count
        break;
      case 'message':
        // Could update chat list or show message preview
        break;
      case 'venue_update':
        // Could update venue data
        break;
    }
  };

  const handleNotificationTap = (response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data as unknown as NotificationData;
    
    // Navigate based on notification type
    switch (data.type) {
      case 'match':
        if (data.matchId) {
          router.push({ pathname: '/matches/[id]', params: { id: String(data.matchId) } } as any);
        } else {
          router.push('/(tabs)/profile' as any);
        }
        break;
      case 'message':
        if (data.chatId) {
          router.push({ pathname: '/chat/[id]', params: { id: String(data.chatId) } } as any);
        } else {
          router.push('/(tabs)/chats' as any);
        }
        break;
      case 'venue_update':
        if (data.venueId) {
          router.push({ pathname: '/venue/[id]', params: { id: String(data.venueId) } } as any);
        } else {
          router.push('/(tabs)' as any);
        }
        break;
      case 'promotion':
      case 'alert':
        router.push('/(tabs)/notifications' as any);
        break;
      default:
        router.push('/(tabs)' as any);
    }
  };

  const updateBadgeCount = async () => {
    try {
      const count = await notificationService.getBadgeCount();
      // You could update a global state or context here
      console.log('Badge count:', count);
    } catch (error) {
      console.error('Error getting badge count:', error);
    }
  };

  const sendLocalNotification = async (data: NotificationData) => {
    await notificationService.sendLocalNotification(data);
  };

  const scheduleNotification = async (
    data: NotificationData,
    trigger: Notifications.NotificationTriggerInput
  ) => {
    await notificationService.scheduleNotification(data, trigger);
  };

  const clearAllNotifications = async () => {
    await notificationService.clearAllNotifications();
  };

  const setBadgeCount = async (count: number) => {
    await notificationService.setBadgeCount(count);
  };

  return {
    pushToken,
    isRegistered,
    sendLocalNotification,
    scheduleNotification,
    clearAllNotifications,
    setBadgeCount,
    updateBadgeCount,
  };
};
