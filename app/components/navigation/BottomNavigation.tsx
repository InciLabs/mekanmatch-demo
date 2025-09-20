import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Home, Bell, User, MessageCircle } from 'lucide-react-native';

interface BottomNavigationProps {
  activeRoute: string;
}

export function BottomNavigation({ activeRoute }: BottomNavigationProps) {
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === '/home' && (activeRoute === '/home' || activeRoute === '/')) {
      return true;
    }
    return activeRoute === path;
  };

  const navigate = (path: string) => {
    // expo-router's type system expects specific route strings; cast to any for dynamic paths
    router.push(path as any);
  };

  const TabButton = ({ 
    path, 
    icon: Icon, 
    label 
  }: { 
    path: string; 
    icon: React.ComponentType<{ size: number; color: string }>;
    label: string;
  }) => {
    const active = isActive(path);
    const color = active ? '#8B5CF6' : '#9CA3AF'; // neon-purple : gray-400
    
    return (
      <TouchableOpacity 
        style={styles.tabButton}
        onPress={() => navigate(path)}
        activeOpacity={0.7}
      >
        <Icon size={24} color={color} />
        <Text style={[styles.tabLabel, { color }]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TabButton path="/home" icon={Home} label="Home" />
        <TabButton path="/chats" icon={MessageCircle} label="Chats" />
        <TabButton path="/notifications" icon={Bell} label="Alerts" />
        <TabButton path="/profile" icon={User} label="Profile" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#111827', // bg-midnight
    borderTopWidth: 1,
    borderTopColor: '#374151', // border-gray-700
    paddingBottom: 16, // Safe area for iPhone X+
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  tabButton: {
    alignItems: 'center',
    padding: 8,
    flex: 1,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'OpenSans_400Regular',
  },
});
