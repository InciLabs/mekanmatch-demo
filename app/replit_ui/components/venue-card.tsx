import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import type { VenueWithStats } from "@shared/schema";
import { CrowdBar } from "@/components/crowd-bar";

interface VenueCardProps {
  venue: VenueWithStats;
  onClick: () => void;
}

export function VenueCard({ venue, onClick }: VenueCardProps) {
  const densityColor = venue.crowdDensity === 'high' ? 'bg-electric-pink' : 
                      venue.crowdDensity === 'medium' ? 'bg-yellow-500' : 'bg-green-500';
  
  const densityText = venue.crowdDensity.toUpperCase();

  return (
    <Card 
      className="glass-effect rounded-xl overflow-hidden border-l-4 border-l-neon-purple cursor-pointer hover:scale-[1.02] transition-transform duration-200"
      onClick={onClick}
      data-testid={`venue-card-${venue.id}`}
    >
      <img 
        src={venue.imageUrl || "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"} 
        alt={venue.name}
        className="w-full h-32 object-cover" 
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-poppins font-semibold text-white">{venue.name}</h3>
            <div className="text-sm text-gray-300 flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{venue.distance ? `${venue.distance.toFixed(1)} km • ` : ''}{venue.district}</span>
            </div>
          </div>
          <div className="text-right">
            <Badge className={`${densityColor} px-2 py-1 rounded-full text-xs font-semibold text-black`}>
              {densityText}
            </Badge>
          </div>
        </div>

        <CrowdBar 
          malePercentage={venue.genderRatio.male}
          femalePercentage={venue.genderRatio.female}
          totalPeople={venue.currentVisitors}
        />

        <div className="flex items-center justify-between text-xs text-gray-300 mt-3">
          <span className="flex items-center space-x-2">
            {venue.features?.slice(0, 2).map(feature => (
              <span key={feature}>
                {getFeatureIcon(feature)} {formatFeature(feature)}
              </span>
            ))}
          </span>
          <span className={`font-semibold ${venue.isOpen ? 'text-neon-purple' : 'text-red-400'}`}>
            {venue.isOpen ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>
    </Card>
  );
}

function getFeatureIcon(feature: string): string {
  const icons: Record<string, string> = {
    'cocktails': '🍸',
    'dancing': '💃',
    'rooftop': '🌃',
    'live-music': '🎵',
    'craft-beer': '🍻',
    'karaoke': '🎤',
    'underground': '🌊',
    'casual': '😎',
  };
  return icons[feature] || '🎉';
}

function formatFeature(feature: string): string {
  return feature.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}
