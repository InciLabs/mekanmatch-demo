import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/hooks/use-app-state";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Heart, X, MessageCircle, Sparkles } from "lucide-react";
import { getInterestEmoji } from "@/lib/mock-data";
import type { MatchCandidate } from "@shared/schema";

export default function MatchingScreen() {
  const { venueId } = useParams<{ venueId: string }>();
  const [, setLocation] = useLocation();
  const { currentUser } = useAppState();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const { data: candidates = [], isLoading } = useQuery<MatchCandidate[]>({
    queryKey: ['/api/venues', venueId, 'match-candidates', currentUser?.id],
    enabled: !!venueId && !!currentUser?.id,
  });

  const createMatchMutation = useMutation({
    mutationFn: async ({ candidateId, isLike }: { candidateId: string; isLike: boolean }) => {
      return apiRequest("POST", "/api/matches", {
        user1Id: currentUser?.id,
        user2Id: candidateId,
        venueId: venueId,
        status: isLike ? "pending" : "declined",
      });
    },
    onSuccess: async (response) => {
      const data = await response.json();
      if (data.isMatch) {
        toast({
          title: "🎉 It's a Match!",
          description: "You both liked each other. Start chatting now!",
        });
        // Navigate to chat after a short delay
        setTimeout(() => {
          setLocation(`/chat/${data.chatId}`);
        }, 2000);
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process swipe",
        variant: "destructive",
      });
    },
  });

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Please log in to use matching</p>
          <Button onClick={() => setLocation("/login")} className="mt-4">
            Log In
          </Button>
        </div>
      </div>
    );
  }

  const currentCandidate = candidates[currentIndex];

  const handleSwipe = (isLike: boolean) => {
    if (!currentCandidate || isAnimating || createMatchMutation.isPending) return;

    setIsAnimating(true);
    setSwipeDirection(isLike ? 'right' : 'left');

    createMatchMutation.mutate({ 
      candidateId: currentCandidate.id, 
      isLike 
    });

    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsAnimating(false);
      setSwipeDirection(null);
    }, 300);
  };

  const handleSuperLike = () => {
    if (!currentCandidate || isAnimating) return;
    
    toast({
      title: "✨ Super Like!",
      description: "You super liked them! This will notify them immediately.",
    });
    
    handleSwipe(true);
  };

  if (!venueId) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Venue not found</p>
          <Button onClick={() => setLocation("/home")} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight via-dark-gray to-midnight animate-fade-in">
      {/* Header */}
      <div className="px-6 py-8 pt-12">
        <div className="flex items-center justify-between mb-6">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setLocation(`/venue/${venueId}`)}
            className="text-white"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-montserrat font-bold text-white" data-testid="matching-title">
            Find Your Match
          </h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setLocation("/chats")}
            className="text-white"
            data-testid="button-chats"
          >
            <MessageCircle className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Cards Container */}
      <div className="px-6 flex-1 flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-purple"></div>
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-medium-gray rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-xl font-poppins font-semibold text-white mb-2">No More Profiles</h3>
            <p className="text-gray-400 mb-6">You've seen everyone who's currently at this venue</p>
            <Button 
              onClick={() => setLocation(`/venue/${venueId}`)}
              className="btn-primary"
              data-testid="button-back-to-venue"
            >
              Back to Venue
            </Button>
          </div>
        ) : currentIndex >= candidates.length ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-neon-purple to-electric-pink rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="text-white text-3xl" />
            </div>
            <h3 className="text-xl font-poppins font-semibold text-white mb-2">All Caught Up!</h3>
            <p className="text-gray-400 mb-6">You've reviewed all potential matches at this venue</p>
            <div className="space-y-3">
              <Button 
                onClick={() => setLocation("/chats")}
                className="w-full btn-primary"
                data-testid="button-view-matches"
              >
                View Your Matches
              </Button>
              <Button 
                onClick={() => setLocation(`/venue/${venueId}`)}
                variant="outline"
                className="w-full bg-medium-gray border-gray-600 text-white"
                data-testid="button-back-to-venue"
              >
                Back to Venue
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative w-full max-w-sm">
            {/* Current Card */}
            <div 
              className={`relative glass-effect rounded-2xl overflow-hidden transition-all duration-300 ${
                isAnimating ? (swipeDirection === 'right' ? 'translate-x-full rotate-12' : '-translate-x-full -rotate-12') : ''
              } ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
              data-testid={`candidate-card-${currentCandidate?.id}`}
            >
              <img 
                src={currentCandidate?.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"} 
                alt={currentCandidate?.name}
                className="w-full h-96 object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              
              {/* Profile Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-montserrat font-bold" data-testid={`candidate-name-${currentCandidate?.id}`}>
                    {currentCandidate?.name}, {currentCandidate?.age}
                  </h3>
                  <div className="text-sm text-gray-300" data-testid={`candidate-distance-${currentCandidate?.id}`}>
                    {Math.round(currentCandidate?.distance || 0)}m away
                  </div>
                </div>
                
                <p className="text-sm text-gray-300 mb-3" data-testid={`candidate-info-${currentCandidate?.id}`}>
                  {currentCandidate?.profession} • {currentCandidate?.university}
                </p>
                
                {/* Common Interests */}
                {currentCandidate?.commonInterests && currentCandidate.commonInterests.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-1">Common Interests</p>
                    <div className="flex flex-wrap gap-1">
                      {currentCandidate.commonInterests.slice(0, 3).map((interest) => (
                        <span 
                          key={interest}
                          className="bg-neon-purple/30 px-2 py-1 rounded-full text-xs"
                          data-testid={`common-interest-${interest}`}
                        >
                          {getInterestEmoji(interest)} {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Interests */}
                <div className="flex flex-wrap gap-1">
                  {currentCandidate?.interests?.slice(0, 4).map((interest) => (
                    <span 
                      key={interest}
                      className="bg-white/20 px-2 py-1 rounded-full text-xs"
                      data-testid={`interest-${interest}`}
                    >
                      {getInterestEmoji(interest)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Next Card Preview */}
            {candidates[currentIndex + 1] && (
              <div className="absolute inset-0 glass-effect rounded-2xl overflow-hidden -z-10 scale-95 opacity-50">
                <img 
                  src={candidates[currentIndex + 1].profileImageUrl || "https://images.unsplash.com/photo-1494790108755-2616b612b977?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"} 
                  alt={candidates[currentIndex + 1].name}
                  className="w-full h-96 object-cover" 
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {currentCandidate && currentIndex < candidates.length && (
        <div className="px-6 pb-8">
          <div className="flex justify-center space-x-6">
            <Button
              size="icon"
              className="w-16 h-16 bg-medium-gray hover:bg-red-500 rounded-full border-2 border-gray-600 hover:border-red-500"
              onClick={() => handleSwipe(false)}
              disabled={isAnimating || createMatchMutation.isPending}
              data-testid="button-pass"
            >
              <X className="text-white text-2xl" />
            </Button>
            
            <Button
              size="icon"
              className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 rounded-full shadow-lg"
              onClick={handleSuperLike}
              disabled={isAnimating || createMatchMutation.isPending}
              data-testid="button-super-like"
            >
              <Sparkles className="text-white text-2xl" />
            </Button>

            <Button
              size="icon"
              className="w-16 h-16 bg-gradient-to-r from-neon-purple to-electric-pink hover:from-neon-purple/80 hover:to-electric-pink/80 rounded-full shadow-lg"
              onClick={() => handleSwipe(true)}
              disabled={isAnimating || createMatchMutation.isPending}
              data-testid="button-like"
            >
              <Heart className="text-white text-2xl" />
            </Button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-xs text-gray-400">
              {currentIndex + 1} of {candidates.length} profiles
            </p>
          </div>
        </div>
      )}
    </div>
  );
}