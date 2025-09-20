// User related types
export interface UserInVenue {
  id: string;
  name: string;
  age: number;
  profession: string;
  university: string;
  profileImageUrl: string;
  interests: string[];
  checkedInAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Venue related types
export interface Venue {
  id: string;
  name: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  images: string[];
  rating: number;
  ratingCount: number;
  openingHours: {
    [key: string]: {
      open: string;
      close: string;
    };
  } | string; // Can be either object or string format
  isOpen: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  phone?: string;
  website?: string;
}

export interface VenueWithStats extends Omit<Venue, 'openingHours' | 'images' | 'description' | 'address' | 'tags'> {
  checkInsCount: number;
  activeUsersCount: number;
  averageRating: number;
  currentVisitors: number;
  imageUrl?: string;
  crowdDensity?: number;
  genderRatio?: {
    male: number;
    female: number;
  };
  priceRange?: 1 | 2 | 3; // 1: $, 2: $$, 3: $$$
  musicType?: string;
  description: string; // Made required in the extended interface
  openingHours: string; // Override to be string type
  address: string; // Keep as required
  tags: string[]; // Keep as required array
  phone: string; // Make required in extended interface
  website?: string; // Keep optional
}

// Check-in related types
export interface CheckIn {
  id: string;
  userId: string;
  venueId: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Match related types
export interface Match {
  id: string;
  users: string[]; // Array of user IDs
  venueId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: string;
  updatedAt: string;
}

// Notification related types
export interface Notification {
  id: string;
  userId: string;
  type: 'match' | 'message' | 'system' | 'venue_update';
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, any>;
  createdAt: string;
}

// Message related types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

// Subscription related types
export type SubscriptionTier = 'free' | 'premium' | 'vip';

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  startDate: string;
  endDate: string;
  isActive: boolean;
  paymentMethod?: string;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form related types
export interface FormField<T> {
  value: T;
  error?: string;
  touched: boolean;
  validate: (value: T) => string | undefined;
}

// Location types
export interface Location {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
}

// Generic types for API pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
