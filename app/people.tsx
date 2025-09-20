import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Components
import { Button, Badge } from './components/ui';

// Hooks
import { useAppState } from './hooks/use-app-state';

// Types
import type { VenueWithStats, UserInVenue } from './lib/types/schema';

// Mock data and utilities
const mockUsers: UserInVenue[] = [
  {
    id: '1',
    name: 'Alex',
    age: 28,
    profession: 'Software Engineer',
    university: 'Istanbul Technical University',
    profileImageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    interests: ['technology', 'hiking', 'photography'],
    checkedInAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: '2',
    name: 'Zeynep',
    age: 25,
    profession: 'Graphic Designer',
    university: 'Bogazici University',
    profileImageUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
    interests: ['art', 'travel', 'food'],
    checkedInAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  // Add more mock users as needed
];

const getInterestEmoji = (interest: string): string => {
  const emojiMap: Record<string, string> = {
    technology: '💻',
    hiking: '🥾',
    photography: '📸',
    art: '🎨',
    travel: '✈️',
    food: '🍔',
    music: '🎵',
    sports: '⚽',
    reading: '📚',
    gaming: '🎮',
    movies: '🎬',
    fashion: '👗',
  };
  return emojiMap[interest.toLowerCase()] || '✨';
};

const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const getTimeColor = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) return 'text-green-400';
  if (diffInHours < 3) return 'text-yellow-400';
  return 'text-red-400';
};

export default function PeopleScreen() {
  const { venueId } = useLocalSearchParams<{ venueId: string }>();
  const router = useRouter();
  const { currentUser } = useAppState();
  const [activeFilter, setActiveFilter] = useState('all');

  const { data: venues = [] } = useQuery<VenueWithStats[]>({
    queryKey: ['/api/venues'],
  });

  const { data: people = [], isLoading } = useQuery<UserInVenue[]>({
    queryKey: ['/api/venues', venueId, 'people'],
    enabled: !!venueId,
  });

  const venue = venues.find(v => v.id === venueId);

  if (!venue || !currentUser) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Venue not found or not logged in</Text>
        <Button onPress={() => router.push('/(tabs)')} style={styles.homeButton}>
          <Text style={styles.buttonText}>Go Home</Text>
        </Button>
      </View>
    );
  }

  // Use mock data if API doesn't return enough people
  const displayPeople = people.length > 0 ? people : mockUsers;

  const handleStartConversation = () => {
    // In a real app, this would open a chat interface
    router.push('/chats');
  };

  const renderPersonCard = ({ item: person }: { item: UserInVenue }) => (
    <TouchableOpacity 
      style={styles.personCard}
      onPress={() => router.push(`/(tabs)/profile/${person.id}` as any)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: person.profileImageUrl }}
        style={styles.personImage}
        resizeMode="cover"
      />
      <Text style={styles.personName} numberOfLines={1}>
        {person.name}, {person.age}
      </Text>
      <Text style={styles.personInfo} numberOfLines={1}>
        {person.profession} • {person.university}
      </Text>
      <View style={styles.interestsContainer}>
        {person.interests?.slice(0, 2).map((interest) => (
          <Badge
            key={interest}
            variant="outline"
            style={styles.interestBadge}
            textStyle={styles.interestText}
          >
            {getInterestEmoji(interest)}
          </Badge>
        ))}
      </View>
      <Text style={[styles.timeText, { color: getTimeColor(person.checkedInAt).includes('green') ? '#34D399' : 
                                       getTimeColor(person.checkedInAt).includes('yellow') ? '#FBBF24' : '#F87171' }]}>
        {getTimeAgo(person.checkedInAt)}
      </Text>
    </TouchableOpacity>
  );

  const filters = [
    { id: 'all', label: `All (${displayPeople.length})` },
    { id: 'similar-age', label: 'Similar Age' },
    { id: 'common-interests', label: 'Common Interests' },
    { id: 'recently-joined', label: 'Recently Joined' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>People Here Now</Text>
          <Text style={styles.headerSubtitle}>
            {venue.currentVisitors} people at {venue.name}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Ionicons name="filter" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterItem,
              activeFilter === filter.id && styles.filterItemActive
            ]}
            onPress={() => setActiveFilter(filter.id)}
            activeOpacity={0.7}
          >
            <Text 
              style={[
                styles.filterText,
                activeFilter === filter.id && styles.filterTextActive
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* People Grid */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      ) : (
        <FlatList
          data={displayPeople}
          renderItem={renderPersonCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.peopleGrid}
          ListFooterComponent={
            displayPeople.length > 6 ? (
              <View style={styles.loadMoreContainer}>
                <Button 
                  variant="outline"
                  style={[styles.loadMoreButton, { borderColor: '#4B5563' }]}
                >
                  <Text style={[styles.loadMoreText, { color: '#9CA3AF' }]}>
                    Load More People
                  </Text>
                </Button>
              </View>
            ) : null
          }
        />
      )}

      {/* Fixed Bottom Action */}
      <LinearGradient
        colors={['transparent', '#111827']}
        style={styles.bottomGradient}
      >
        <View style={styles.bottomActions}>
          <Button 
            onPress={handleStartConversation}
            style={[styles.chatButton, { backgroundColor: '#3B82F6' }]}
          >
            <Ionicons name="chatbubble-ellipses" size={16} color="white" style={styles.chatIcon} />
            <Text style={[styles.chatButtonText, { color: 'white', marginLeft: 8 }]}>
              Start Conversation
            </Text>
          </Button>
          
          <TouchableOpacity 
            style={styles.likeButton}
            activeOpacity={0.8}
          >
            <Ionicons name="heart" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827', // bg-midnight
  },
  notFoundContainer: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    color: '#9CA3AF',
    fontSize: 18,
    marginBottom: 20,
  },
  homeButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(31, 41, 55, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 2,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(31, 41, 55, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterItem: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#1F2937',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  filterItemActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  filterText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  peopleGrid: {
    padding: 16,
  },
  personCard: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 12,
    margin: 4,
    alignItems: 'center',
    maxWidth: '48%',
  },
  personImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
  },
  personName: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 2,
  },
  personInfo: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 8,
    width: '100%',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 8,
  },
  interestBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    margin: 2,
    borderRadius: 12,
  },
  interestText: {
    color: 'white',
    fontSize: 12,
  },
  timeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  loadMoreContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 100,
  },
  loadMoreButton: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  loadMoreText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  bottomActions: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatButton: {
    flex: 1,
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  chatButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  chatIcon: {
    marginRight: 8,
  },
  likeButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
