import { 
  users, venues, checkins, events, menuItems, notifications, matches, chats, messages,
  type User, type InsertUser, type Venue, type InsertVenue,
  type Checkin, type InsertCheckin, type Event, type InsertEvent,
  type MenuItem, type InsertMenuItem, type Notification, type InsertNotification,
  type Match, type InsertMatch, type Chat, type InsertChat, type Message, type InsertMessage,
  type VenueWithStats, type UserInVenue, type ChatWithUser, type MatchCandidate
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByPhone(phoneNumber: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User>;

  // Venues
  getAllVenues(): Promise<VenueWithStats[]>;
  getVenue(id: string): Promise<Venue | undefined>;
  getVenuesWithStats(): Promise<VenueWithStats[]>;
  createVenue(venue: InsertVenue): Promise<Venue>;
  updateVenue(id: string, updates: Partial<InsertVenue>): Promise<Venue>;

  // Check-ins
  createCheckin(checkin: InsertCheckin): Promise<Checkin>;
  getUserCheckins(userId: string): Promise<Checkin[]>;
  getVenueCheckins(venueId: string): Promise<Checkin[]>;
  getUsersInVenue(venueId: string): Promise<UserInVenue[]>;
  checkoutUser(userId: string, venueId: string): Promise<void>;

  // Events
  getVenueEvents(venueId: string): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;

  // Menu Items
  getVenueMenu(venueId: string): Promise<MenuItem[]>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;

  // Notifications
  getUserNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(id: string): Promise<void>;

  // Matches
  getMatchCandidates(userId: string, venueId: string): Promise<MatchCandidate[]>;
  createMatch(match: InsertMatch): Promise<Match>;
  getUserMatches(userId: string): Promise<Match[]>;
  updateMatchStatus(matchId: string, status: string): Promise<Match>;

  // Chats
  getUserChats(userId: string): Promise<ChatWithUser[]>;
  createChat(chat: InsertChat): Promise<Chat>;
  getChatMessages(chatId: string): Promise<Message[]>;
  sendMessage(message: InsertMessage): Promise<Message>;
  markMessagesRead(chatId: string, userId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private venues: Map<string, Venue> = new Map();
  private checkins: Map<string, Checkin> = new Map();
  private events: Map<string, Event> = new Map();
  private menuItems: Map<string, MenuItem> = new Map();
  private notifications: Map<string, Notification> = new Map();
  private matches: Map<string, Match> = new Map();
  private chats: Map<string, Chat> = new Map();
  private messages: Map<string, Message> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock venues
    const mockVenues = [
      {
        id: "venue-1",
        name: "360 Istanbul",
        address: "Istiklal Caddesi No:163, Beyoğlu",
        district: "Beyoğlu",
        latitude: "41.0362",
        longitude: "28.9795",
        imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        venueType: "rooftop",
        priceRange: 3,
        musicGenres: ["house", "deep-house"],
        features: ["cocktails", "dancing", "rooftop"],
        openingHours: { "mon-sun": "18:00-02:00" },
        isActive: true,
        ownerId: "owner-1",
        createdAt: new Date(),
      },
      {
        id: "venue-2",
        name: "Klein",
        address: "Kadıköy Merkez",
        district: "Kadıköy",
        latitude: "40.9936",
        longitude: "29.0215",
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        venueType: "club",
        priceRange: 2,
        musicGenres: ["electronic", "techno"],
        features: ["dancing", "underground", "live-music"],
        openingHours: { "mon-sun": "22:00-04:00" },
        isActive: true,
        ownerId: "owner-2",
        createdAt: new Date(),
      },
      {
        id: "venue-3",
        name: "Arkaoda",
        address: "Cihangir",
        district: "Cihangir",
        latitude: "41.0325",
        longitude: "28.9784",
        imageUrl: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        venueType: "bar",
        priceRange: 2,
        musicGenres: ["indie", "alternative"],
        features: ["craft-beer", "live-music", "casual"],
        openingHours: { "mon-sun": "19:00-02:00" },
        isActive: true,
        ownerId: "owner-3",
        createdAt: new Date(),
      }
    ];

    mockVenues.forEach(venue => this.venues.set(venue.id, venue as Venue));

    // Mock events
    const mockEvents = [
      {
        id: "event-1",
        venueId: "venue-1",
        title: "DJ Mahmut Orhan Live Set",
        description: "International DJ performance with amazing house music",
        eventDate: new Date(),
        startTime: "22:00",
        endTime: "02:00",
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        isActive: true,
        createdAt: new Date(),
      }
    ];

    mockEvents.forEach(event => this.events.set(event.id, event as Event));

    // Mock menu items
    const mockMenuItems = [
      {
        id: "menu-1",
        venueId: "venue-1",
        name: "Signature Cocktail",
        description: "Gin, elderflower, citrus",
        price: "85.00",
        category: "cocktails",
        isAvailable: true,
      },
      {
        id: "menu-2",
        venueId: "venue-1",
        name: "Premium Whiskey",
        description: "Selection of single malts",
        price: "150.00",
        category: "spirits",
        isAvailable: true,
      }
    ];

    mockMenuItems.forEach(item => this.menuItems.set(item.id, item as MenuItem));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByPhone(phoneNumber: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.phoneNumber === phoneNumber);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...userData,
      id,
      name: userData.name || null,
      age: userData.age || null,
      gender: userData.gender || null,
      interests: userData.interests || null,
      profileImageUrl: userData.profileImageUrl || null,
      subscriptionType: userData.subscriptionType || null,
      subscriptionExpiresAt: userData.subscriptionExpiresAt || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      throw new Error("User not found");
    }
    const updatedUser: User = {
      ...existingUser,
      ...updates,
      name: updates.name !== undefined ? updates.name : existingUser.name,
      age: updates.age !== undefined ? updates.age : existingUser.age,
      gender: updates.gender !== undefined ? updates.gender : existingUser.gender,
      interests: updates.interests !== undefined ? updates.interests : existingUser.interests,
      profileImageUrl: updates.profileImageUrl !== undefined ? updates.profileImageUrl : existingUser.profileImageUrl,
      subscriptionType: updates.subscriptionType !== undefined ? updates.subscriptionType : existingUser.subscriptionType,
      subscriptionExpiresAt: updates.subscriptionExpiresAt !== undefined ? updates.subscriptionExpiresAt : existingUser.subscriptionExpiresAt,
      updatedAt: new Date(),
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllVenues(): Promise<VenueWithStats[]> {
    return this.getVenuesWithStats();
  }

  async getVenue(id: string): Promise<Venue | undefined> {
    return this.venues.get(id);
  }

  async getVenuesWithStats(): Promise<VenueWithStats[]> {
    const venues = Array.from(this.venues.values());
    return venues.map(venue => {
      const checkins = Array.from(this.checkins.values()).filter(
        checkin => checkin.venueId === venue.id && !checkin.checkedOutAt
      );
      
      const users = checkins.map(checkin => this.users.get(checkin.userId)).filter(Boolean) as User[];
      const maleCount = users.filter(user => user.gender === 'male').length;
      const femaleCount = users.filter(user => user.gender === 'female').length;
      const totalCount = users.length;

      let crowdDensity: 'low' | 'medium' | 'high' = 'low';
      if (totalCount > 150) crowdDensity = 'high';
      else if (totalCount > 50) crowdDensity = 'medium';

      // Mock some realistic data for demo
      const mockTotal = Math.floor(Math.random() * 300) + 50;
      const mockMaleRatio = Math.random() * 0.4 + 0.4; // 40-80%
      const mockMale = Math.floor(mockTotal * mockMaleRatio);
      const mockFemale = mockTotal - mockMale;

      return {
        ...venue,
        currentVisitors: mockTotal,
        genderRatio: {
          male: Math.round((mockMale / mockTotal) * 100),
          female: Math.round((mockFemale / mockTotal) * 100),
        },
        crowdDensity: mockTotal > 200 ? 'high' : mockTotal > 100 ? 'medium' : 'low',
        isOpen: true,
      };
    });
  }

  async createVenue(venueData: InsertVenue): Promise<Venue> {
    const id = randomUUID();
    const venue: Venue = {
      ...venueData,
      id,
      latitude: venueData.latitude || null,
      longitude: venueData.longitude || null,
      imageUrl: venueData.imageUrl || null,
      priceRange: venueData.priceRange || null,
      musicGenres: venueData.musicGenres || null,
      features: venueData.features || null,
      openingHours: venueData.openingHours || null,
      isActive: venueData.isActive !== undefined ? venueData.isActive : null,
      ownerId: venueData.ownerId || null,
      createdAt: new Date(),
    };
    this.venues.set(id, venue);
    return venue;
  }

  async updateVenue(id: string, updates: Partial<InsertVenue>): Promise<Venue> {
    const existingVenue = this.venues.get(id);
    if (!existingVenue) {
      throw new Error("Venue not found");
    }
    const updatedVenue: Venue = {
      ...existingVenue,
      name: updates.name !== undefined ? updates.name : existingVenue.name,
      address: updates.address !== undefined ? updates.address : existingVenue.address,
      district: updates.district !== undefined ? updates.district : existingVenue.district,
      latitude: updates.latitude !== undefined ? updates.latitude : existingVenue.latitude,
      longitude: updates.longitude !== undefined ? updates.longitude : existingVenue.longitude,
      imageUrl: updates.imageUrl !== undefined ? updates.imageUrl : existingVenue.imageUrl,
      venueType: updates.venueType !== undefined ? updates.venueType : existingVenue.venueType,
      priceRange: updates.priceRange !== undefined ? updates.priceRange : existingVenue.priceRange,
      musicGenres: updates.musicGenres !== undefined ? updates.musicGenres : existingVenue.musicGenres,
      features: updates.features !== undefined ? updates.features : existingVenue.features,
      openingHours: updates.openingHours !== undefined ? updates.openingHours : existingVenue.openingHours,
      isActive: updates.isActive !== undefined ? updates.isActive : existingVenue.isActive,
      ownerId: updates.ownerId !== undefined ? updates.ownerId : existingVenue.ownerId,
    };
    this.venues.set(id, updatedVenue);
    return updatedVenue;
  }

  async createCheckin(checkinData: InsertCheckin): Promise<Checkin> {
    const id = randomUUID();
    const checkin: Checkin = {
      ...checkinData,
      id,
      checkedInAt: new Date(),
      checkedOutAt: checkinData.checkedOutAt || null,
      isVisible: checkinData.isVisible !== undefined ? checkinData.isVisible : null,
    };
    this.checkins.set(id, checkin);
    return checkin;
  }

  async getUserCheckins(userId: string): Promise<Checkin[]> {
    return Array.from(this.checkins.values()).filter(checkin => checkin.userId === userId);
  }

  async getVenueCheckins(venueId: string): Promise<Checkin[]> {
    return Array.from(this.checkins.values()).filter(
      checkin => checkin.venueId === venueId && !checkin.checkedOutAt
    );
  }

  async getUsersInVenue(venueId: string): Promise<UserInVenue[]> {
    const checkins = await this.getVenueCheckins(venueId);
    const users = checkins.map(checkin => {
      const user = this.users.get(checkin.userId);
      if (!user) return null;
      
      return {
        id: user.id,
        name: user.name || 'Anonymous',
        age: user.age || 25,
        profileImageUrl: user.profileImageUrl,
        interests: user.interests || [],
        checkedInAt: checkin.checkedInAt?.toISOString() || '',
        university: this.getRandomUniversity(),
        profession: this.getRandomProfession(),
      };
    }).filter(Boolean) as UserInVenue[];

    // Add some mock users for demo
    const mockUsers: UserInVenue[] = [
      {
        id: "mock-1",
        name: "Elif",
        age: 27,
        profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b977?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        interests: ["cocktails", "music"],
        checkedInAt: new Date().toISOString(),
        university: "ODTÜ",
        profession: "Marketing",
      },
      {
        id: "mock-2",
        name: "Can",
        age: 29,
        profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        interests: ["music", "dancing"],
        checkedInAt: new Date(Date.now() - 15 * 60000).toISOString(),
        university: "Galatasaray",
        profession: "Software Dev",
      },
      {
        id: "mock-3",
        name: "Zeynep",
        age: 25,
        profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        interests: ["cocktails", "rooftop"],
        checkedInAt: new Date(Date.now() - 5 * 60000).toISOString(),
        university: "İTÜ",
        profession: "Designer",
      },
      {
        id: "mock-4",
        name: "Mert",
        age: 31,
        profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        interests: ["craft-beer", "live-music"],
        checkedInAt: new Date(Date.now() - 30 * 60000).toISOString(),
        university: "Boğaziçi",
        profession: "Finance",
      },
      {
        id: "mock-5",
        name: "Selin",
        age: 26,
        profileImageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        interests: ["dancing", "karaoke"],
        checkedInAt: new Date().toISOString(),
        university: "Mimar Sinan",
        profession: "Artist",
      },
      {
        id: "mock-6",
        name: "Arda",
        age: 28,
        profileImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        interests: ["music", "live-music"],
        checkedInAt: new Date(Date.now() - 20 * 60000).toISOString(),
        university: "Bilgi",
        profession: "Musician",
      },
    ];

    return [...users, ...mockUsers];
  }

  private getRandomUniversity(): string {
    const universities = ["ODTÜ", "Boğaziçi", "İTÜ", "Galatasaray", "Bilgi", "Mimar Sinan", "Koç", "Sabancı"];
    return universities[Math.floor(Math.random() * universities.length)];
  }

  private getRandomProfession(): string {
    const professions = ["Software Dev", "Designer", "Marketing", "Finance", "Artist", "Musician", "Engineer", "Consultant"];
    return professions[Math.floor(Math.random() * professions.length)];
  }

  async checkoutUser(userId: string, venueId: string): Promise<void> {
    const checkin = Array.from(this.checkins.values()).find(
      c => c.userId === userId && c.venueId === venueId && !c.checkedOutAt
    );
    if (checkin) {
      checkin.checkedOutAt = new Date();
      this.checkins.set(checkin.id, checkin);
    }
  }

  async getVenueEvents(venueId: string): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => event.venueId === venueId);
  }

  async createEvent(eventData: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const event: Event = {
      ...eventData,
      id,
      description: eventData.description || null,
      startTime: eventData.startTime || null,
      endTime: eventData.endTime || null,
      imageUrl: eventData.imageUrl || null,
      isActive: eventData.isActive !== undefined ? eventData.isActive : null,
      createdAt: new Date(),
    };
    this.events.set(id, event);
    return event;
  }

  async getVenueMenu(venueId: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(item => item.venueId === venueId);
  }

  async createMenuItem(itemData: InsertMenuItem): Promise<MenuItem> {
    const id = randomUUID();
    const item: MenuItem = {
      ...itemData,
      id,
      description: itemData.description || null,
      isAvailable: itemData.isAvailable !== undefined ? itemData.isAvailable : null,
    };
    this.menuItems.set(id, item);
    return item;
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    // Mock notifications for demo
    const mockNotifications: Notification[] = [
      {
        id: "notif-1",
        userId,
        title: "🔥 Kadıköy is buzzing tonight!",
        message: "Klein and Arkaoda are 70% full with great M/F ratio",
        type: "alert",
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60000),
      },
      {
        id: "notif-2",
        userId,
        title: "Happy Hour at 360 Istanbul",
        message: "20% off all cocktails until 20:00 tonight!",
        type: "promotion",
        isRead: false,
        createdAt: new Date(Date.now() - 60 * 60000),
      },
      {
        id: "notif-3",
        userId,
        title: "Someone liked your profile",
        message: "Elif from 360 Istanbul wants to connect with you",
        type: "social",
        isRead: false,
        createdAt: new Date(Date.now() - 3 * 60 * 60000),
      },
      {
        id: "notif-4",
        userId,
        title: "New Event Added",
        message: "DJ Mahmut Orhan live set tomorrow at Klein",
        type: "event",
        isRead: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60000),
      },
      {
        id: "notif-5",
        userId,
        title: "Premium Benefits Available",
        message: "Upgrade to see who's at venues before checking in",
        type: "subscription",
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60000),
      },
    ];

    return mockNotifications;
  }

  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const notification: Notification = {
      ...notificationData,
      id,
      userId: notificationData.userId || null,
      isRead: notificationData.isRead !== undefined ? notificationData.isRead : null,
      createdAt: new Date(),
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationRead(id: string): Promise<void> {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.isRead = true;
      this.notifications.set(id, notification);
    }
  }

  async getMatchCandidates(userId: string, venueId: string): Promise<MatchCandidate[]> {
    const currentUser = this.users.get(userId);
    if (!currentUser) return [];

    const usersInVenue = await this.getUsersInVenue(venueId);
    const existingMatches = Array.from(this.matches.values()).filter(
      match => match.user1Id === userId || match.user2Id === userId
    );
    const matchedUserIds = new Set(
      existingMatches.map(match => match.user1Id === userId ? match.user2Id : match.user1Id)
    );

    return usersInVenue
      .filter(user => user.id !== userId && !matchedUserIds.has(user.id))
      .map(user => {
        const commonInterests = (currentUser.interests || []).filter(interest => 
          (user.interests || []).includes(interest)
        );
        
        return {
          ...user,
          distance: Math.random() * 50 + 5, // Mock distance
          commonInterests,
        };
      });
  }

  async createMatch(matchData: InsertMatch): Promise<Match> {
    const id = randomUUID();
    const match: Match = {
      ...matchData,
      id,
      status: matchData.status || null,
      createdAt: new Date(),
    };
    this.matches.set(id, match);
    return match;
  }

  async getUserMatches(userId: string): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(
      match => (match.user1Id === userId || match.user2Id === userId) && match.status === 'matched'
    );
  }

  async updateMatchStatus(matchId: string, status: string): Promise<Match> {
    const match = this.matches.get(matchId);
    if (!match) {
      throw new Error("Match not found");
    }
    match.status = status;
    this.matches.set(matchId, match);
    return match;
  }

  async getUserChats(userId: string): Promise<ChatWithUser[]> {
    const userChats = Array.from(this.chats.values()).filter(
      chat => chat.user1Id === userId || chat.user2Id === userId
    );

    return userChats.map(chat => {
      const otherUserId = chat.user1Id === userId ? chat.user2Id : chat.user1Id;
      const otherUser = this.users.get(otherUserId);
      const chatMessages = Array.from(this.messages.values())
        .filter(msg => msg.chatId === chat.id)
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      
      const unreadCount = chatMessages.filter(msg => 
        msg.senderId !== userId && !msg.isRead
      ).length;

      return {
        ...chat,
        otherUser: otherUser || {
          id: otherUserId,
          name: "Unknown User",
          phoneNumber: "",
          age: null,
          gender: null,
          interests: null,
          profileImageUrl: null,
          subscriptionType: null,
          subscriptionExpiresAt: null,
          createdAt: null,
          updatedAt: null,
        },
        lastMessage: chatMessages[0] || undefined,
        unreadCount,
      };
    });
  }

  async createChat(chatData: InsertChat): Promise<Chat> {
    const id = randomUUID();
    const chat: Chat = {
      ...chatData,
      id,
      lastMessageAt: new Date(),
      createdAt: new Date(),
    };
    this.chats.set(id, chat);
    return chat;
  }

  async getChatMessages(chatId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(msg => msg.chatId === chatId)
      .sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
  }

  async sendMessage(messageData: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...messageData,
      id,
      isRead: messageData.isRead !== undefined ? messageData.isRead : null,
      createdAt: new Date(),
    };
    this.messages.set(id, message);

    // Update chat's last message time
    const chat = this.chats.get(messageData.chatId);
    if (chat) {
      chat.lastMessageAt = new Date();
      this.chats.set(chat.id, chat);
    }

    return message;
  }

  async markMessagesRead(chatId: string, userId: string): Promise<void> {
    const chatMessages = Array.from(this.messages.values()).filter(
      msg => msg.chatId === chatId && msg.senderId !== userId
    );
    
    chatMessages.forEach(msg => {
      msg.isRead = true;
      this.messages.set(msg.id, msg);
    });
  }
}

export const storage = new MemStorage();
