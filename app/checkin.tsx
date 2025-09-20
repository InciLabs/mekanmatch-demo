import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Components
import { Button, Switch } from './components/ui';

// Hooks
import { useAppState } from './hooks/use-app-state';
import { useToast } from './hooks/use-toast';

// Types
import type { VenueWithStats } from './lib/types/schema';

// Mock API
const apiRequest = async (method: string, endpoint: string, data?: any) => {
  // This would be replaced with actual API calls
  console.log(`API ${method} ${endpoint}`, data);
  return new Promise((resolve) => setTimeout(() => resolve({}), 1000));
};

export default function CheckinScreen() {
  const { venueId } = useLocalSearchParams<{ venueId: string }>();
  const router = useRouter();
  const { currentUser } = useAppState();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  
  const [checkinMethod, setCheckinMethod] = useState<'gps' | 'qr'>('gps');
  const [showToOthers, setShowToOthers] = useState(true);
  const [shareInterests, setShareInterests] = useState(true);

  const { data: venues = [] } = useQuery<VenueWithStats[]>({
    queryKey: ['/api/venues'],
  });

  const venue = venues.find(v => v.id === venueId);

  const checkinMutation = useMutation({
    mutationFn: async () => {
      if (!venueId) throw new Error('Venue ID is required');
      return apiRequest("POST", "/api/checkins", {
        userId: currentUser?.id,
        venueId,
        isVisible: showToOthers,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/venues'] });
      showToast("You have successfully checked in to this venue.", "success");
      // Navigate to people tab with venueId as a query parameter
      router.push({
        pathname: '/(tabs)/people',
        params: { venueId }
      } as any);
    },
    onError: (error) => {
      showToast(
        error instanceof Error ? error.message : "Failed to check in. Please try again.",
        "error"
      );
    },
  });

  const handleCheckin = () => {
    checkinMutation.mutate();
  };

  const handleScanQR = (e: { stopPropagation: () => void }) => {
    e?.stopPropagation?.();
    showToast("QR code scanning would be implemented here", "info");
  };

  if (!venue || !currentUser) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Venue not found or not logged in</Text>
        <Button onPress={() => router.replace('/(tabs)')} style={styles.homeButton}>
          <Text style={styles.buttonText}>Go Home</Text>
        </Button>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Check In</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        {/* Venue Info */}
        <View style={styles.venueCard}>
          <View style={styles.venueIconContainer}>
            <Ionicons name="location" size={32} color="white" />
          </View>
          <Text style={styles.venueName} numberOfLines={1}>
            {venue.name}
          </Text>
          <Text style={styles.venueAddress} numberOfLines={1}>
            {venue.address}
          </Text>
          
          {/* Distance & Accuracy */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12m</Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#4ADE80' }]}>98%</Text>
              <Text style={styles.statLabel}>GPS Accuracy</Text>
            </View>
          </View>
        </View>

        {/* Check-in Methods */}
        <Text style={styles.sectionTitle}>
          Choose Check-in Method
        </Text>
        
        {/* GPS Check-in */}
        <TouchableOpacity 
          style={[
            styles.methodCard,
            checkinMethod === 'gps' && styles.methodCardActive
          ]}
          onPress={() => setCheckinMethod('gps')}
          activeOpacity={0.8}
        >
          <View style={[styles.methodIcon, { backgroundColor: '#4ADE80' }]}>
            <Ionicons name="navigate" size={24} color="black" />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>GPS Verification</Text>
            <Text style={styles.methodDescription}>Automatic location-based check-in</Text>
          </View>
          {checkinMethod === 'gps' && (
            <View style={styles.radioActive}>
              <View style={styles.radioInner} />
            </View>
          )}
        </TouchableOpacity>

        {/* QR Code Option */}
        <TouchableOpacity 
          style={[
            styles.methodCard,
            checkinMethod === 'qr' && styles.methodCardActive
          ]}
          onPress={() => setCheckinMethod('qr')}
          activeOpacity={0.8}
        >
          <View style={[styles.methodIcon, { backgroundColor: '#1F2937' }]}>
            <Ionicons name="qr-code" size={24} color="#9CA3AF" />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>QR Code Scan</Text>
            <Text style={styles.methodDescription}>Scan venue's QR code to verify</Text>
          </View>
          <Button 
            onPress={(e: { stopPropagation: () => void }) => {
              e.stopPropagation();
              handleScanQR(e);
            }}
            variant="outline"
            style={styles.scanButton}
          >
            <Text style={styles.scanButtonText}>Scan</Text>
          </Button>
        </TouchableOpacity>

        {/* Privacy Settings */}
        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>
          Privacy Options
        </Text>
        
        <View style={styles.privacyCard}>
          <View style={styles.privacyItem}>
            <View>
              <Text style={styles.privacyTitle}>Show me to others</Text>
              <Text style={styles.privacyDescription}>
                Let other users see you're here
              </Text>
            </View>
            <Switch
              value={showToOthers}
              onValueChange={setShowToOthers}
            />
          </View>
          
          <View style={styles.privacyItem}>
            <View>
              <Text style={styles.privacyTitle}>Share my interests</Text>
              <Text style={styles.privacyDescription}>
                Help others find common interests
              </Text>
            </View>
            <Switch
              value={shareInterests}
              onValueChange={setShareInterests}
            />
          </View>
        </View>
        
        {/* Spacer for the bottom button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Check-in Button */}
      <LinearGradient
        colors={['transparent', '#111827']}
        style={styles.footerGradient}
      >
        <View style={styles.footerContent}>
          <Button 
            onPress={handleCheckin}
            disabled={checkinMutation.isPending}
            style={styles.checkinButton}
          >
            {checkinMutation.isPending ? (
              <ActivityIndicator color="#111827" />
            ) : (
              <Text style={styles.checkinButtonText}>
                {checkinMethod === 'gps' ? 'Check In with GPS' : 'Check In with QR'}
              </Text>
            )}
          </Button>
          <Text style={styles.privacyNotice}>
            By checking in, you agree to share your presence at this venue with other users
          </Text>
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 120, // Extra padding for the fixed button
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
    paddingBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(31, 41, 55, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerPlaceholder: {
    width: 40,
  },
  venueCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  venueIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  venueName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
    maxWidth: '100%',
  },
  venueAddress: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: '100%',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginLeft: 24,
    marginBottom: 16,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  methodCardActive: {
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  radioActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#8B5CF6',
  },
  scanButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderColor: '#8B5CF6',
    backgroundColor: 'transparent',
  },
  scanButtonText: {
    color: '#8B5CF6',
    fontWeight: '500',
  },
  privacyCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  privacyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  privacyTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  privacyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  privacyDescription: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  footerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  footerContent: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
  },
  checkinButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  checkinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingSpinner: {
    marginRight: 8,
  },
  privacyNotice: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
  },
});
