import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCheckinSchema, insertEventSchema, insertNotificationSchema, insertMatchSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/verify-phone", async (req, res) => {
    try {
      const { phoneNumber, code } = req.body;
      
      // Mock SMS verification - always succeed for demo
      if (code !== "1234") {
        return res.status(400).json({ message: "Invalid verification code" });
      }

      let user = await storage.getUserByPhone(phoneNumber);
      if (!user) {
        user = await storage.createUser({ phoneNumber });
      }

      res.json({ user, isNewUser: !user.name });
    } catch (error) {
      res.status(500).json({ message: "Failed to verify phone number" });
    }
  });

  app.post("/api/auth/complete-profile", async (req, res) => {
    try {
      const { userId, name, age, gender, interests } = req.body;
      
      const user = await storage.updateUser(userId, {
        name,
        age,
        gender,
        interests,
      });

      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users/push-token", async (req, res) => {
    try {
      const { userId, pushToken, platform } = req.body;
      
      // In a real app, you would store this in the database
      console.log(`Push token registered for user ${userId}:`, pushToken, platform);
      
      res.json({ success: true, message: "Push token registered" });
    } catch (error) {
      res.status(500).json({ message: "Failed to register push token" });
    }
  });

  app.patch("/api/users/:id/subscription", async (req, res) => {
    try {
      const { subscriptionType, duration } = req.body;
      
      let expiresAt: Date;
      const now = new Date();
      
      switch (duration) {
        case 'daily':
          expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          break;
        case 'weekly':
          expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        case 'monthly':
          expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          break;
        case 'yearly':
          expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      }

      const user = await storage.updateUser(req.params.id, {
        subscriptionType,
        subscriptionExpiresAt: expiresAt,
      });

      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: "Failed to update subscription" });
    }
  });

  // Venue routes
  app.get("/api/venues", async (req, res) => {
    try {
      const venues = await storage.getVenuesWithStats();
      res.json(venues);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch venues" });
    }
  });

  app.get("/api/venues/:id", async (req, res) => {
    try {
      const venue = await storage.getVenue(req.params.id);
      if (!venue) {
        return res.status(404).json({ message: "Venue not found" });
      }
      res.json(venue);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch venue" });
    }
  });

  app.get("/api/venues/:id/events", async (req, res) => {
    try {
      const events = await storage.getVenueEvents(req.params.id);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/venues/:id/menu", async (req, res) => {
    try {
      const menu = await storage.getVenueMenu(req.params.id);
      res.json(menu);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu" });
    }
  });

  app.get("/api/venues/:id/people", async (req, res) => {
    try {
      const people = await storage.getUsersInVenue(req.params.id);
      res.json(people);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch people" });
    }
  });

  // Check-in routes
  app.post("/api/checkins", async (req, res) => {
    try {
      const checkinData = insertCheckinSchema.parse(req.body);
      const checkin = await storage.createCheckin(checkinData);
      res.json(checkin);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid checkin data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create checkin" });
    }
  });

  app.post("/api/checkins/:userId/:venueId/checkout", async (req, res) => {
    try {
      await storage.checkoutUser(req.params.userId, req.params.venueId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to checkout" });
    }
  });

  // Notification routes
  app.get("/api/notifications/:userId", async (req, res) => {
    try {
      const notifications = await storage.getUserNotifications(req.params.userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      await storage.markNotificationRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // Analytics routes (for venue owners)
  app.get("/api/venues/:id/analytics", async (req, res) => {
    try {
      const checkins = await storage.getVenueCheckins(req.params.id);
      const users = await storage.getUsersInVenue(req.params.id);
      
      // Mock analytics data
      const analytics = {
        currentVisitors: users.length,
        genderRatio: {
          male: Math.round(Math.random() * 40 + 40),
          female: Math.round(Math.random() * 40 + 40),
        },
        ageGroups: {
          "20-25": Math.round(Math.random() * 20 + 10),
          "25-30": Math.round(Math.random() * 30 + 30),
          "30-35": Math.round(Math.random() * 25 + 20),
          "35+": Math.round(Math.random() * 15 + 5),
        },
        hourlyTrend: Array.from({ length: 6 }, (_, i) => ({
          hour: 18 + i * 2,
          male: Math.round(Math.random() * 50 + 30),
          female: Math.round(Math.random() * 40 + 20),
        })),
        totalCheckins: checkins.length,
        averageStayTime: "2.5 hours",
        peakHours: "22:00 - 24:00",
      };

      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Match routes
  app.get("/api/venues/:venueId/match-candidates/:userId", async (req, res) => {
    try {
      const candidates = await storage.getMatchCandidates(req.params.userId, req.params.venueId);
      res.json(candidates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch match candidates" });
    }
  });

  app.post("/api/matches", async (req, res) => {
    try {
      const matchData = insertMatchSchema.parse(req.body);
      const match = await storage.createMatch(matchData);
      
      // Check if both users swiped right on each other
      const existingMatch = Array.from((storage as any).matches.values()).find(
        (m: any) => m.user1Id === matchData.user2Id && m.user2Id === matchData.user1Id && m.status === "pending"
      );
      
      if (existingMatch && typeof existingMatch === "object" && "id" in existingMatch) {
        // It's a match!
        await storage.updateMatchStatus((existingMatch as { id: string }).id, "matched");
        await storage.updateMatchStatus(match.id, "matched");
        
        // Create a chat
        const chat = await storage.createChat({
          matchId: match.id,
          user1Id: matchData.user1Id,
          user2Id: matchData.user2Id,
        });
        
        res.json({ match, isMatch: true, chatId: chat.id });
      } else {
        res.json({ match, isMatch: false });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid match data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create match" });
    }
  });

  app.get("/api/users/:userId/matches", async (req, res) => {
    try {
      const matches = await storage.getUserMatches(req.params.userId);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });

  // Chat routes
  app.get("/api/users/:userId/chats", async (req, res) => {
    try {
      const chats = await storage.getUserChats(req.params.userId);
      res.json(chats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chats" });
    }
  });

  app.get("/api/chats/:chatId/messages", async (req, res) => {
    try {
      const messages = await storage.getChatMessages(req.params.chatId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.sendMessage(messageData);
      res.json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.patch("/api/chats/:chatId/read/:userId", async (req, res) => {
    try {
      await storage.markMessagesRead(req.params.chatId, req.params.userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark messages as read" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
