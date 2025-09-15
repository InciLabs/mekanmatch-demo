import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAppState } from "@/hooks/use-app-state";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, MapPin, Crosshair, QrCode } from "lucide-react";
import type { VenueWithStats } from "@shared/schema";

export default function CheckinScreen() {
  const { venueId } = useParams<{ venueId: string }>();
  const [, setLocation] = useLocation();
  const { currentUser } = useAppState();
  const { toast } = useToast();
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
      return apiRequest("POST", "/api/checkins", {
        userId: currentUser?.id,
        venueId,
        isVisible: showToOthers,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/venues'] });
      toast({
        title: "Check-in Successful!",
        description: "You're now checked in to this venue",
      });
      setLocation(`/people/${venueId}`);
    },
    onError: () => {
      toast({
        title: "Check-in Failed",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

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

  const handleCheckin = () => {
    checkinMutation.mutate();
  };

  const handleScanQR = () => {
    toast({
      title: "QR Scanner",
      description: "QR code scanning would be implemented here",
    });
  };

  return (
    <div className="min-h-screen bg-midnight animate-fade-in">
      {/* Header */}
      <div className="px-6 py-8 pt-12">
        <div className="flex items-center justify-between mb-6">
          <Button
            size="icon"
            variant="outline"
            className="w-10 h-10 bg-medium-gray border-gray-600 rounded-full"
            onClick={() => setLocation(`/venue/${venueId}`)}
            data-testid="button-back"
          >
            <ArrowLeft className="text-white" />
          </Button>
          <h2 className="text-xl font-montserrat font-bold text-white" data-testid="checkin-title">
            Check In
          </h2>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Venue Info */}
      <div className="px-6 mb-8">
        <div className="glass-effect rounded-xl p-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-neon-purple to-electric-pink rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="text-white text-2xl" />
          </div>
          <h3 className="text-xl font-montserrat font-bold text-white mb-2" data-testid="venue-name">
            {venue.name}
          </h3>
          <p className="text-gray-300 mb-4" data-testid="venue-address">
            {venue.address}
          </p>
          
          {/* Distance & Accuracy */}
          <div className="flex justify-center space-x-6 text-sm">
            <div className="text-center">
              <div className="text-green-400 font-semibold" data-testid="distance">12m</div>
              <div className="text-gray-400">Distance</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-semibold" data-testid="accuracy">98%</div>
              <div className="text-gray-400">GPS Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Check-in Methods */}
      <div className="px-6 space-y-4 mb-8">
        <h3 className="font-poppins font-semibold text-white mb-4" data-testid="methods-title">
          Choose Check-in Method
        </h3>
        
        {/* GPS Check-in */}
        <div 
          className={`glass-effect rounded-xl p-4 border-2 cursor-pointer ${
            checkinMethod === 'gps' ? 'border-green-400' : 'border-gray-600'
          }`}
          onClick={() => setCheckinMethod('gps')}
          data-testid="method-gps"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-400 rounded-xl flex items-center justify-center mr-4">
              <Crosshair className="text-black text-xl" />
            </div>
            <div className="flex-1">
              <h4 className="font-poppins font-semibold text-white">GPS Verification</h4>
              <p className="text-sm text-gray-300">Automatic location-based check-in</p>
            </div>
            {checkinMethod === 'gps' && (
              <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full"></div>
              </div>
            )}
          </div>
        </div>

        {/* QR Code Option */}
        <div 
          className={`glass-effect rounded-xl p-4 border cursor-pointer ${
            checkinMethod === 'qr' ? 'border-neon-purple' : 'border-gray-600'
          }`}
          onClick={() => setCheckinMethod('qr')}
          data-testid="method-qr"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-medium-gray rounded-xl flex items-center justify-center mr-4">
              <QrCode className="text-gray-400 text-xl" />
            </div>
            <div className="flex-1">
              <h4 className="font-poppins font-semibold text-white">QR Code Scan</h4>
              <p className="text-sm text-gray-300">Scan venue's QR code to verify</p>
            </div>
            <Button 
              size="sm"
              variant="outline"
              className="text-neon-purple border-neon-purple bg-transparent"
              onClick={handleScanQR}
              data-testid="button-scan-qr"
            >
              Scan
            </Button>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="px-6 mb-8">
        <h3 className="font-poppins font-semibold text-white mb-4" data-testid="privacy-title">
          Privacy Options
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-opensans font-semibold text-white">Show me to others</h4>
              <p className="text-sm text-gray-400">Let other users see you're here</p>
            </div>
            <Switch
              checked={showToOthers}
              onCheckedChange={setShowToOthers}
              data-testid="switch-show-to-others"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-opensans font-semibold text-white">Share my interests</h4>
              <p className="text-sm text-gray-400">Help others find common interests</p>
            </div>
            <Switch
              checked={shareInterests}
              onCheckedChange={setShareInterests}
              data-testid="switch-share-interests"
            />
          </div>
        </div>
      </div>

      {/* Check-in Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-midnight via-midnight to-transparent">
        <Button 
          className="w-full btn-primary mb-4 animate-pulse-neon" 
          onClick={handleCheckin}
          disabled={checkinMutation.isPending}
          data-testid="button-complete-checkin"
        >
          {checkinMutation.isPending ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Checking In...
            </div>
          ) : (
            'Complete Check-in'
          )}
        </Button>
        <p className="text-center text-xs text-gray-400" data-testid="privacy-notice">
          By checking in, you agree to share your presence at this venue with other users
        </p>
      </div>
    </div>
  );
}
