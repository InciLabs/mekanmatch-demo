import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim1 = useRef(new Animated.Value(0.3)).current;
  const pulseAnim2 = useRef(new Animated.Value(0.2)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Check authentication status (mock)
    const checkAuth = async () => {
      // Simulate checking stored auth token
      await new Promise(resolve => setTimeout(resolve, 1000));
      // For demo, always return false (not authenticated)
      setIsAuthenticated(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      // Scale up
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      // Slide up
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
      // Continuous rotation for spinner
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ),
      // Pulse animations for background elements
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim1, {
            toValue: 0.6,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim1, {
            toValue: 0.3,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim2, {
            toValue: 0.5,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim2, {
            toValue: 0.2,
            duration: 2500,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    // Navigate after delay
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth/login');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      
      {/* Animated background elements */}
      <View style={styles.backgroundElements}>
        <Animated.View
          style={[
            styles.backgroundBlur1,
            {
              opacity: pulseAnim1,
              transform: [
                {
                  scale: pulseAnim1,
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.backgroundBlur2,
            {
              opacity: pulseAnim2,
              transform: [
                {
                  scale: pulseAnim2,
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.backgroundBlur3,
            {
              opacity: pulseAnim1,
              transform: [
                {
                  scale: pulseAnim2,
                },
              ],
            },
          ]}
        />
      </View>

      {/* Main content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim }
            ],
          },
        ]}
      >
        {/* Logo with icon */}
        <View style={styles.logoContainer}>
          <Animated.View
            style={[
              styles.logoIcon,
              {
                transform: [{ rotate: rotateInterpolate }],
              },
            ]}
          >
            <Ionicons name="location" size={40} color="#8B5CF6" />
          </Animated.View>
          <Text style={styles.logoText}>MekanMatch</Text>
          <Text style={styles.tagline}>See the crowd. Join the vibe.</Text>
        </View>

        {/* Loading indicator */}
        <View style={styles.loadingContainer}>
          <Animated.View
            style={[
              styles.spinner,
              {
                transform: [{ rotate: rotateInterpolate }],
              },
            ]}
          >
            <View style={styles.spinnerInner} />
          </Animated.View>
        </View>
      </Animated.View>

      {/* Bottom text */}
      <Animated.View style={[styles.bottomContainer, { opacity: fadeAnim }]}>
        <Text style={styles.loadingText}>Loading your nightlife experience...</Text>
        <Text style={styles.versionText}>v1.0.0</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundElements: {
    position: 'absolute',
    width: width,
    height: height,
  },
  backgroundBlur1: {
    position: 'absolute',
    top: height * 0.2,
    left: width * 0.2,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#8B5CF6',
  },
  backgroundBlur2: {
    position: 'absolute',
    bottom: height * 0.2,
    right: width * 0.2,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EC4899',
  },
  backgroundBlur3: {
    position: 'absolute',
    top: height * 0.6,
    left: width * 0.1,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textShadowColor: '#8B5CF6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  tagline: {
    fontSize: 18,
    color: '#D1D5DB',
    textAlign: 'center',
    fontWeight: '300',
  },
  loadingContainer: {
    marginBottom: 48,
  },
  spinner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#8B5CF6',
    borderTopColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#8B5CF6',
    opacity: 0.3,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 8,
  },
  versionText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});
