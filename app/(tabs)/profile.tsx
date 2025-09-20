import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Image,
  RefreshControl,
  TextInput,
  Button as RNButton,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

// Mock auth context since we don't have it yet
interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  phoneNumber?: string;
}

const useAuth = () => ({
  user: {
    uid: 'user-1',
    displayName: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    phoneNumber: '+905551234567',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150',
  } as User,
  signOut: async () => {}
});

// Mock notification context
const useNotificationContext = () => ({
  sendLocalNotification: async (notification: any) => {}
});

// Mock notification service
const notificationService = {
  createVenueUpdateNotification: (venue: string, message: string) => ({
    title: venue,
    body: message,
    data: { type: 'venue_update' },
  }),
  createMatchNotification: (name: string) => ({
    title: 'Yeni Eşleşme!',
    body: `${name} ile eşleştiniz. Hemen sohbet etmeye başlayın!`,
    data: { type: 'new_match' },
  }),
};

// Types
type UserProfile = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  age: number;
  gender: string;
  interests: string[];
  profileImageUrl: string;
  subscriptionType: 'free' | 'premium' | 'elite';
  subscriptionExpiresAt: Date;
  createdAt: string;
  updatedAt: string;
};

const DEFAULT_AVATAR = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

const INTERESTS = [
  'cocktails', 'music', 'dancing', 'sports', 'art', 'travel', 'food', 'photography',
  'reading', 'gaming', 'movies', 'fashion', 'technology', 'hiking', 'fitness', 'cooking'
];

const getInterestEmoji = (interest: string) => {
  const emojiMap: { [key: string]: string } = {
    'cocktails': '🍸',
    'music': '🎵',
    'dancing': '💃',
    'sports': '⚽',
    'art': '🎨',
    'travel': '✈️',
    'food': '🍕',
    'photography': '📸',
  };
  return emojiMap[interest] || '⭐';
};

const getSubscriptionBadge = (subscriptionType: string) => {
  switch (subscriptionType) {
    case 'premium':
      return {
        text: 'Premium',
        color: '#8B5CF6',
        icon: 'diamond' as const,
      };
    case 'elite':
      return {
        text: 'Elite',
        color: '#EC4899',
        icon: 'star' as const,
      };
    default:
      return {
        text: 'Free',
        color: '#6B7280',
        icon: 'person' as const,
      };
  }
};

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  
  // Mock user data for development
  const mockUser = {
    uid: 'user-1',
    displayName: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    phoneNumber: '+905551234567',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150',
  } as const;
  const { sendLocalNotification } = useNotificationContext();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    interests: [] as string[],
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // In a real app, you would fetch the user's profile from your API
      // const response = await apiRequest('GET', '/api/profile');
      // setProfile(response.data);

      // Mock data for now
      setTimeout(() => {
        setProfile({
          id: user.uid,
          name: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber || '', // Provide default empty string if undefined
          age: 28,
          gender: 'male',
          interests: ['cocktails', 'music', 'dancing'],
          profileImageUrl: user.photoURL,
          subscriptionType: 'premium',
          subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setLoading(false);
        setRefreshing(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile');
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProfile();
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              // @ts-ignore - We know this is a valid route
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Error signing out:', error);
            }
          },
        },
      ]
    );
  };

  const handleTestNotification = async () => {
    const notification = {
      title: '360 Istanbul',
      body: 'Happy Hour başladı! 20% indirim.',
      data: { type: 'venue_update' },
    } as const;
    await sendLocalNotification(notification);
  };

  const handleTestMatchNotification = async () => {
    const notification = {
      title: 'Yeni Eşleşme!',
      body: 'Elif ile eşleştiniz. Hemen sohbet etmeye başlayın!',
      data: { type: 'new_match' },
    } as const;
    await sendLocalNotification(notification);
  };

  const handleEditProfile = () => {
    if (!profile) return;

    setEditing(true);
    setFormData({
      name: profile.name,
      age: profile.age.toString(),
      gender: profile.gender,
      interests: [...profile.interests],
    });
  };

  const handleSaveProfile = async () => {
    try {
      // In a real app, you would update the profile via API
      // await apiRequest('PATCH', '/api/profile', formData);

      // For now, just update local state
      setProfile(prev => ({
        ...prev!,
        name: formData.name,
        age: parseInt(formData.age, 10) || 0,
        gender: formData.gender,
        interests: formData.interests,
        updatedAt: new Date().toISOString(),
      }));

      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSettings = () => {
    console.log('Settings');
  };

  const handleSubscription = () => {
    console.log('Subscription');
  };

  const handleHelp = () => {
    console.log('Help');
  };

  const handleVenueOwner = () => {
    console.log('Venue owner');
  };

  const renderMenuItem = (item: typeof menuItems[number] & { color?: string }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={[
        styles.menuIcon,
        { backgroundColor: item.color ? `${item.color}20` : 'rgba(156, 163, 175, 0.1)' }
      ]}>
        <Ionicons 
          name={item.icon} 
          size={20} 
          color={item.color || '#9CA3AF'} 
        />
      </View>
      <View style={styles.menuText}>
        <Text style={styles.menuTitle}>{item.title}</Text>
        <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#6B7280" />
    </TouchableOpacity>
  );

  if (loading && !profile) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ color: '#E5E7EB', fontSize: 16, marginBottom: 20 }}>Profile not found</Text>
        <RNButton title="Retry" onPress={fetchProfile} color="#8B5CF6" />
      </View>
    );
  }

  const subscriptionBadge = getSubscriptionBadge(profile.subscriptionType);

  const menuItems = [
    {
      icon: 'settings' as const,
      title: 'Settings',
      subtitle: 'Privacy, notifications, and more',
      onPress: handleSettings,
    },
    {
      icon: subscriptionBadge.icon as 'star' | 'diamond' | 'person',
      title: 'Subscription',
      subtitle: `${subscriptionBadge.text} • Expires ${profile.subscriptionExpiresAt.toLocaleDateString()}`,
      onPress: handleSubscription,
      color: subscriptionBadge.color,
    },
    {
      icon: 'business' as const, // Using 'business' instead of 'store' which might not exist
      title: 'Venue Owner',
      subtitle: 'Manage your venue listings',
      onPress: handleVenueOwner,
    },
    {
      icon: 'help-circle' as const,
      title: 'Help & Support',
      subtitle: 'FAQ, contact us, and feedback',
      onPress: handleHelp,
    },
    {
      icon: 'notifications' as const,
      title: 'Test Notifications',
      subtitle: 'Send test push notifications',
      onPress: handleTestNotification,
    },
  ] as const;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#8B5CF6']}
            tintColor="#8B5CF6"
          />
        }
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <Image 
            source={{ uri: profile.profileImageUrl || DEFAULT_AVATAR }} 
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.email}>{profile.email}</Text>
            <View style={styles.subscriptionBadge}>
              <Ionicons name={subscriptionBadge.icon} size={16} color={subscriptionBadge.color} />
              <Text style={[styles.subscriptionExpiry, { color: subscriptionBadge.color }]}>
                {subscriptionBadge.text}
              </Text>
              {profile.subscriptionExpiresAt > new Date() && (
                <Text style={styles.subscriptionExpiry}>
                  Expires {profile.subscriptionExpiresAt.toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.accountSection}>
          <Text style={styles.accountTitle}>Account</Text>
          <View style={{gap: 12}}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{profile.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{profile.phoneNumber || 'Not provided'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>
                {new Date(profile.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Interests */}
        <View style={{marginBottom: 24}}>
          <Text style={{fontSize: 16, fontWeight: '600', color: '#F9FAFB', marginBottom: 12}}>Interests</Text>
          <View style={styles.interestsList}>
            {profile.interests.length > 0 ? (
              profile.interests.map((interest) => (
                <View key={interest} style={styles.interestTag}>
                  <Text style={styles.interestEmoji}>{getInterestEmoji(interest)}</Text>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))
            ) : (
              <Text style={{color: '#9CA3AF', textAlign: 'center'}}>No interests selected</Text>
            )}
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <View key={index}>
              {renderMenuItem(item)}
            </View>
          ))}
        </View>

        {/* Sign Out Button */}
        <View style={{marginBottom: 24}}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={18} color="#EF4444" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    color: '#F9FAFB',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 8,
  },
  subscriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  subscriptionExpiry: {
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  accountSection: {
    marginBottom: 24, 
    backgroundColor: '#1F2937', 
    borderRadius: 12, 
    padding: 16
  },
  accountTitle: {
    color: '#F3F4F6', 
    fontSize: 18, 
    fontWeight: '600', 
    marginBottom: 16
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  infoValue: {
    color: '#E5E7EB',
    fontSize: 14,
  },
  interestsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  interestTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  interestEmoji: {
    marginRight: 4,
  },
  interestText: {
    color: '#E5E7EB',
    fontSize: 14,
  },
  menuContainer: {
    gap: 8,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    marginRight: 8,
  },
  menuTitle: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  chevron: {
    marginLeft: 8,
  },
  signOutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  signOutText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: 24,
  },
  notFoundText: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  input: {
    backgroundColor: '#1F2937',
    color: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 4,
  },
  picker: {
    backgroundColor: '#1F2937',
    color: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
});
