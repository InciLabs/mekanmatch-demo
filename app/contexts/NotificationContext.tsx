import React, { createContext, useContext, useState, useEffect } from 'react';
import { notificationService } from '@services/notificationService';

export interface NotificationContextValue {
  userId: string | null;
  badgeCount: number;
  notify: (title: string, body?: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  setBadgeCount: (count: number) => Promise<void>;
  updateBadgeCount: () => Promise<number>; // Now returns Promise<number>
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export interface NotificationProviderProps {
  userId: string | null;
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ userId, children }) => {
  const [badgeCount, setBadgeCountState] = useState(0);

  const updateBadgeCount = async (): Promise<number> => {
    try {
      const count = await notificationService.getBadgeCount();
      setBadgeCountState(count);
      return count;
    } catch (error) {
      console.error('Error updating badge count:', error);
      return 0;
    }
  };

  const notify = async (title: string, body?: string): Promise<void> => {
    try {
      await notificationService.sendLocalNotification({ 
        type: 'alert', // Default type for general notifications
        title, 
        body 
      });
      await updateBadgeCount();
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await notificationService.clearAllNotifications();
      await updateBadgeCount();
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const setBadgeCount = async (count: number) => {
    try {
      await notificationService.setBadgeCount(count);
      setBadgeCountState(count);
    } catch (error) {
      console.error('Error setting badge count:', error);
    }
  };

  // Update badge count on mount
  useEffect(() => {
    updateBadgeCount();
  }, []);

  return (
    <NotificationContext.Provider 
      value={{ 
        userId, 
        badgeCount,
        notify, 
        clearAllNotifications,
        setBadgeCount,
        updateBadgeCount
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextValue => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// For backward compatibility
export const useNotificationContext = useNotification;

export default NotificationContext;
