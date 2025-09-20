import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export type NotificationType = 'match' | 'message' | 'venue_update' | 'promotion' | 'alert';

export interface NotificationData {
  type: NotificationType;
  matchId?: string;
  chatId?: string;
  venueId?: string;
  title?: string;
  body?: string;
  [key: string]: any;
}

async function getPermissionsAsync(): Promise<boolean> {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  }
  return false;
}

export const notificationService = {
  async registerForPushNotifications(): Promise<string | null> {
    const granted = await getPermissionsAsync();
    if (!granted) return null;
    const token = await Notifications.getExpoPushTokenAsync();
    const value: any = (token as any)?.data ?? token;
    return typeof value === 'string' ? value : null;
  },

  async sendTokenToBackend(token: string, userId: string): Promise<void> {
    // TODO: implement backend call
    console.log('[notificationService] sendTokenToBackend', { token, userId });
  },

  addNotificationReceivedListener(listener: (notification: Notifications.Notification) => void) {
    return Notifications.addNotificationReceivedListener(listener);
  },

  addNotificationResponseReceivedListener(listener: (response: Notifications.NotificationResponse) => void) {
    return Notifications.addNotificationResponseReceivedListener(listener);
  },

  async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  },

  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  },

  async clearAllNotifications(): Promise<void> {
    await Promise.all([
      Notifications.dismissAllNotificationsAsync(),
      Notifications.cancelAllScheduledNotificationsAsync(),
      Notifications.setBadgeCountAsync(0)
    ]);
  },

  async sendLocalNotification(data: NotificationData): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: data.title || 'Notification',
        body: data.body || '',
        data: data as unknown as Record<string, unknown>,
      },
      trigger: null,
    });
  },

  async scheduleNotification(data: NotificationData, trigger: Notifications.NotificationTriggerInput): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: data.title || 'Notification',
        body: data.body || '',
        data: data as unknown as Record<string, unknown>,
      },
      trigger,
    });
  },

};

export default notificationService;
