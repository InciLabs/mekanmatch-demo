import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useAppState } from "@/hooks/use-app-state";
import { ArrowLeft, Filter, Heart, MessageCircle } from "lucide-react";
import { mockUsers, getInterestEmoji, getTimeAgo, getTimeColor } from "@/lib/mock-data";
import type { VenueWithStats, UserInVenue } from "@shared/schema";

export default function PeopleScreen() {
  const { venueId } = useParams<{ venueId: string }>();
  const [, setLocation] = useLocation();
  const { currentUser } = useAppState();
  const [activeFilter, setActiveFilter] = useState("all");

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
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Venue not found or not logged in</p>
          <Button onClick={() => setLocation("/home")} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  // Use mock data if API doesn't return enough people
  const displayPeople = people.length > 0 ? people : mockUsers.map(user => ({
    ...user,
    checkedInAt: user.checkedInAt,
  }));

  const handleStartConversation = () => {
    // In a real app, this would open a chat interface
    setLocation("/home");
  };

  return (
    <div className="min-h-screen bg-midnight pb-24 animate-fade-in">
      {/* Header */}
      <div className="px-6 py-8 pt-12">
        <div className="flex items-center justify-between mb-6">
          <Button
            size="icon"
            variant="outline"
            className="w-10 h-10 bg-medium-gray border-gray-600 rounded-full"
            onClick={() => setLocation(`/checkin/${venueId}`)}
            data-testid="button-back"
          >
            <ArrowLeft className="text-white" />
          </Button>
          <div className="text-center">
            <h2 className="text-xl font-montserrat font-bold text-white" data-testid="people-title">
              People Here Now
            </h2>
            <p className="text-sm text-gray-300" data-testid="people-count">
              {venue.currentVisitors} people at {venue.name}
            </p>
          </div>
          <Button
            size="icon"
            variant="outline"
            className="w-10 h-10 bg-medium-gray border-gray-600 rounded-full"
            data-testid="button-filter"
          >
            <Filter className="text-white" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {[
            { id: "all", label: `All (${displayPeople.length})` },
            { id: "similar-age", label: "Similar Age" },
            { id: "common-interests", label: "Common Interests" },
            { id: "recently-joined", label: "Recently Joined" },
          ].map((filter) => (
            <Button
              key={filter.id}
              size="sm"
              className={`whitespace-nowrap ${
                activeFilter === filter.id
                  ? "bg-neon-purple text-white"
                  : "bg-medium-gray text-gray-300 hover:bg-medium-gray/80"
              }`}
              onClick={() => setActiveFilter(filter.id)}
              data-testid={`filter-${filter.id}`}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* People Grid */}
      <div className="px-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-purple"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {displayPeople.map((person) => (
              <div
                key={person.id}
                className="glass-effect rounded-xl p-4 text-center hover:scale-[1.02] transition-transform cursor-pointer"
                data-testid={`person-card-${person.id}`}
              >
                <img
                  src={person.profileImageUrl}
                  alt={person.name}
                  className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                />
                <h3 className="font-poppins font-semibold text-white text-sm" data-testid={`person-name-${person.id}`}>
                  {person.name}, {person.age}
                </h3>
                <p className="text-xs text-gray-400 mb-2" data-testid={`person-info-${person.id}`}>
                  {person.profession} • {person.university}
                </p>
                <div className="flex justify-center space-x-1 mb-3">
                  {person.interests?.slice(0, 2).map((interest) => (
                    <Badge
                      key={interest}
                      variant="outline"
                      className="text-xs bg-neon-purple/20 border-neon-purple/30 text-white px-2 py-1"
                    >
                      {getInterestEmoji(interest)}
                    </Badge>
                  ))}
                </div>
                <div className={`text-xs ${getTimeColor(person.checkedInAt)}`} data-testid={`person-time-${person.id}`}>
                  {getTimeAgo(person.checkedInAt)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {!isLoading && displayPeople.length > 6 && (
          <div className="text-center mb-6">
            <Button 
              variant="outline"
              className="bg-medium-gray border-gray-600 text-white hover:bg-medium-gray/80"
              data-testid="button-load-more"
            >
              Load More People
            </Button>
          </div>
        )}
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-midnight via-midnight to-transparent">
        <div className="flex space-x-3">
          <Button 
            className="flex-1 btn-primary"
            onClick={handleStartConversation}
            data-testid="button-start-conversation"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Start Conversation
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="w-12 h-12 bg-medium-gray border-gray-600 rounded-xl"
            data-testid="button-like"
          >
            <Heart className="text-gray-400" />
          </Button>
        </div>
      </div>

      <BottomNavigation onNavigate={setLocation} />
    </div>
  );
}
