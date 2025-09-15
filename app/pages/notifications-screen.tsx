import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useAppState } from "@/hooks/use-app-state";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Flame, Percent, UserPlus, Calendar, Crown } from "lucide-react";
import type { Notification } from "@shared/schema";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "alert":
      return <Flame className="text-electric-pink" />;
    case "promotion":
      return <Percent className="text-yellow-500" />;
    case "social":
      return <UserPlus className="text-neon-purple" />;
    case "event":
      return <Calendar className="text-green-500" />;
    case "subscription":
      return <Crown className="text-blue-500" />;
    default:
      return <Flame className="text-gray-400" />;
  }
};

const getBorderColor = (type: string) => {
  switch (type) {
    case "alert":
      return "border-l-electric-pink";
    case "promotion":
      return "border-l-yellow-500";
    case "social":
      return "border-l-neon-purple";
    case "event":
      return "border-l-green-500";
    case "subscription":
      return "border-l-blue-500";
    default:
      return "border-l-gray-400";
  }
};

const getTimeAgo = (date: Date | string) => {
  const now = new Date();
  const notificationDate = new Date(date);
  const diffMs = now.getTime() - notificationDate.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

export default function NotificationsScreen() {
  const [, setLocation] = useLocation();
  const { currentUser } = useAppState();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ['/api/notifications', currentUser?.id],
    enabled: !!currentUser?.id,
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      // Mark all notifications as read
      await Promise.all(
        notifications.map(notification =>
          apiRequest("PATCH", `/api/notifications/${notification.id}/read`, {})
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    },
  });

  const handleNotificationAction = (notification: Notification) => {
    switch (notification.type) {
      case "alert":
        setLocation("/home");
        break;
      case "promotion":
        setLocation("/home");
        break;
      case "social":
        // In a real app, this would open the user's profile
        setLocation("/profile");
        break;
      case "event":
        setLocation("/home");
        break;
      case "subscription":
        setLocation("/subscription");
        break;
      default:
        break;
    }
  };

  const getActionText = (notification: Notification) => {
    switch (notification.type) {
      case "alert":
        return "View Venues";
      case "promotion":
        return "Get Directions";
      case "social":
        return "View Profile";
      case "event":
        return "Add to Calendar";
      case "subscription":
        return "Upgrade";
      default:
        return "View";
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Please log in to view notifications</p>
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
          <h2 className="text-2xl font-montserrat font-bold text-white" data-testid="notifications-title">
            Notifications
          </h2>
          <Button
            variant="link"
            className="text-neon-purple font-semibold text-sm p-0"
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
            data-testid="button-mark-all-read"
          >
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-6 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-purple"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-medium-gray rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-lg font-poppins font-semibold text-white mb-2">No Notifications</h3>
            <p className="text-gray-400">You're all caught up! Check back later for updates.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`glass-effect rounded-xl p-4 border-l-4 ${getBorderColor(notification.type)} ${
                !notification.isRead ? 'bg-white/5' : ''
              }`}
              data-testid={`notification-${notification.id}`}
            >
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-poppins font-semibold text-white mb-1" data-testid={`notification-title-${notification.id}`}>
                    {notification.title}
                  </h3>
                  <p className="text-sm text-gray-300 mb-2" data-testid={`notification-message-${notification.id}`}>
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400" data-testid={`notification-time-${notification.id}`}>
                      {getTimeAgo(notification.createdAt || new Date())}
                    </span>
                    <Button
                      size="sm"
                      variant="link"
                      className="text-neon-purple text-sm font-semibold p-0"
                      onClick={() => handleNotificationAction(notification)}
                      data-testid={`notification-action-${notification.id}`}
                    >
                      {getActionText(notification)}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNavigation onNavigate={setLocation} />
    </div>
  );
}
