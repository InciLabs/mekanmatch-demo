import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationData } from '../services/notificationService';

interface NotificationContextType {
  badgeCount: number;
  isRegistered: boolean;
  pushToken: string | null;
  sendLocalNotification: (data: NotificationData) => Promise<void>;
  scheduleNotification: (
    data: NotificationData,
    trigger: any
  ) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  setBadgeCount: (count: number) => Promise<void>;
  updateBadgeCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
  userId?: string;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  userId,
}) => {
  const [badgeCount, setBadgeCount] = useState(0);
  const {
    isRegistered,
    pushToken,
    sendLocalNotification,
    scheduleNotification,
    clearAllNotifications,
    setBadgeCount: setBadgeCountService,
    updateBadgeCount: updateBadgeCountService,
  } = useNotifications(userId);

  const updateBadgeCount = async () => {
    try {
      const count = await updateBadgeCountService();
      setBadgeCount(count);
    } catch (error) {
      console.error('Error updating badge count:', error);
    }
  };

  const setBadgeCount = async (count: number) => {
    try {
      await setBadgeCountService(count);
      setBadgeCount(count);
    } catch (error) {
      console.error('Error setting badge count:', error);
    }
  };

  useEffect(() => {
    // Update badge count on mount
    updateBadgeCount();
  }, []);

  const contextValue: NotificationContextType = {
    badgeCount,
    isRegistered,
    pushToken,
    sendLocalNotification,
    scheduleNotification,
    clearAllNotifications,
    setBadgeCount,
    updateBadgeCount,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};
