import React, { createContext, useContext } from 'react';

export interface NotificationContextValue {
  userId: string | null;
  notify: (title: string, body?: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export interface NotificationProviderProps {
  userId: string | null;
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ userId, children }) => {
  const notify = (title: string, body?: string) => {
    // Placeholder noop for now. Integrate with Expo Notifications or a backend later.
    console.log('[Notification]', { title, body, userId });
  };

  return (
    <NotificationContext.Provider value={{ userId, notify }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextValue => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
};

export default NotificationContext;
