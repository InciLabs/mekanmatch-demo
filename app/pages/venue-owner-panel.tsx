import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/hooks/use-app-state";
import { 
  ArrowLeft, 
  Store, 
  BarChart3, 
  Calendar,
  Utensils,
  Crown,
  Users,
  TrendingUp
} from "lucide-react";

export default function VenueOwnerPanel() {
  const [, setLocation] = useLocation();
  const { currentUser } = useAppState();
  const [selectedVenue] = useState("venue-1"); // Mock selected venue

  // Mock analytics data - in a real app this would come from the API
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['/api/venues', selectedVenue, 'analytics'],
    enabled: !!selectedVenue,
  });

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Please log in to access the venue owner panel</p>
          <Button onClick={() => setLocation("/login")} className="mt-4">
            Log In
          </Button>
        </div>
      </div>
    );
  }

  const mockAnalytics = {
    currentVisitors: 234,
    genderRatio: { male: 60, female: 40 },
    ageGroups: {
      "20-25": 15,
      "25-30": 45,
      "30-35": 30,
      "35+": 10,
    },
    hourlyTrend: [
      { hour: 18, male: 45, female: 25 },
      { hour: 20, male: 65, female: 35 },
      { hour: 22, male: 85, female: 55 },
      { hour: 24, male: 90, female: 65 },
      { hour: 26, male: 75, female: 45 },
      { hour: 28, male: 55, female: 30 },
    ],
    totalCheckins: 1847,
    averageStayTime: "2.5 hours",
    peakHours: "22:00 - 24:00",
  };

  const displayAnalytics: typeof mockAnalytics = analytics || mockAnalytics;

  return (
    <div className="min-h-screen bg-midnight animate-fade-in">
      {/* Header */}
      <div className="px-6 py-8 pt-12">
        <div className="flex items-center mb-6">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setLocation("/profile")}
            className="mr-4 text-white"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-montserrat font-bold text-white" data-testid="panel-title">
            Venue Dashboard
          </h2>
        </div>
      </div>

      {/* Venue Selector */}
      <div className="px-6 mb-8">
        <div className="glass-effect rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-neon-purple rounded-xl flex items-center justify-center mr-4">
              <Store className="text-white" />
            </div>
            <div>
              <h3 className="font-poppins font-semibold text-white" data-testid="venue-name">
                360 Istanbul
              </h3>
              <p className="text-sm text-gray-400" data-testid="venue-status">
                Beyoğlu • Active
              </p>
            </div>
          </div>
          <Button 
            variant="link" 
            className="text-neon-purple font-semibold text-sm p-0"
            data-testid="button-switch-venue"
          >
            Switch
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="px-6 mb-8">
        <h3 className="font-poppins font-semibold text-white mb-4" data-testid="analytics-title">
          Today's Analytics
        </h3>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card className="glass-effect border-none">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-montserrat font-bold text-neon-purple mb-1" data-testid="current-visitors">
                {displayAnalytics.currentVisitors}
              </div>
              <div className="text-xs text-gray-300">Current Visitors</div>
            </CardContent>
          </Card>
          <Card className="glass-effect border-none">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-montserrat font-bold text-electric-pink mb-1" data-testid="gender-ratio">
                {displayAnalytics.genderRatio.male}/{displayAnalytics.genderRatio.female}
              </div>
              <div className="text-xs text-gray-300">M/F Ratio</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Trend Chart */}
        <Card className="glass-effect border-none">
          <CardHeader className="pb-3">
            <CardTitle className="font-opensans font-semibold text-white text-base" data-testid="trend-title">
              Gender Ratio Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-24 bg-medium-gray rounded-lg flex items-end justify-around p-2">
              {displayAnalytics.hourlyTrend.slice(0, 5).map((data, index) => (
                <div key={index} className="flex flex-col items-center space-y-1">
                  <div 
                    className="w-4 bg-blue-400 rounded-t transition-all duration-500" 
                    style={{ height: `${(data.male / 100) * 60}px` }}
                  />
                  <div 
                    className="w-4 bg-pink-400 rounded-t transition-all duration-500" 
                    style={{ height: `${(data.female / 100) * 60}px` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>18:00</span>
              <span>20:00</span>
              <span>22:00</span>
              <span>Now</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-6 space-y-4 mb-8">
        <h3 className="font-poppins font-semibold text-white mb-4" data-testid="actions-title">
          Quick Actions
        </h3>
        
        <Button
          variant="ghost"
          className="w-full glass-effect rounded-xl p-4 flex items-center justify-between hover:bg-white/10"
          data-testid="button-update-menu"
        >
          <div className="flex items-center">
            <Utensils className="text-neon-purple mr-4 text-xl" />
            <div className="text-left">
              <h4 className="font-opensans font-semibold text-white">Update Menu</h4>
              <p className="text-sm text-gray-400">Add new items or change prices</p>
            </div>
          </div>
          <div className="text-gray-400">›</div>
        </Button>

        <Button
          variant="ghost"
          className="w-full glass-effect rounded-xl p-4 flex items-center justify-between hover:bg-white/10"
          data-testid="button-add-event"
        >
          <div className="flex items-center">
            <Calendar className="text-electric-pink mr-4 text-xl" />
            <div className="text-left">
              <h4 className="font-opensans font-semibold text-white">Add Event</h4>
              <p className="text-sm text-gray-400">Create new events and promotions</p>
            </div>
          </div>
          <div className="text-gray-400">›</div>
        </Button>

        <Button
          variant="ghost"
          className="w-full glass-effect rounded-xl p-4 flex items-center justify-between hover:bg-white/10"
          data-testid="button-view-analytics"
        >
          <div className="flex items-center">
            <BarChart3 className="text-yellow-400 mr-4 text-xl" />
            <div className="text-left">
              <h4 className="font-opensans font-semibold text-white">View Analytics</h4>
              <p className="text-sm text-gray-400">Detailed insights and trends</p>
            </div>
          </div>
          <div className="text-gray-400">›</div>
        </Button>

        <Button
          variant="ghost"
          className="w-full glass-effect rounded-xl p-4 flex items-center justify-between hover:bg-white/10"
          data-testid="button-upgrade-plan"
        >
          <div className="flex items-center">
            <Crown className="text-blue-400 mr-4 text-xl" />
            <div className="text-left">
              <h4 className="font-opensans font-semibold text-white">Upgrade Plan</h4>
              <p className="text-sm text-gray-400">Currently: Free Plan</p>
            </div>
          </div>
          <div className="text-gray-400">›</div>
        </Button>
      </div>

      {/* Current Events */}
      <div className="px-6 mb-8">
        <h3 className="font-poppins font-semibold text-white mb-4" data-testid="events-title">
          Active Events
        </h3>
        <Card className="glass-effect border-none">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-opensans font-semibold text-white" data-testid="event-name">
                  Happy Hour
                </h4>
                <p className="text-sm text-gray-400" data-testid="event-details">
                  20% off cocktails • Until 20:00
                </p>
              </div>
              <div className="text-right">
                <div className="text-green-400 text-sm font-semibold" data-testid="event-status">
                  Active
                </div>
                <div className="text-xs text-gray-400" data-testid="event-remaining">
                  2h remaining
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                size="sm"
                className="bg-neon-purple hover:bg-neon-purple/80"
                data-testid="button-edit-event"
              >
                Edit
              </Button>
              <Button 
                size="sm"
                variant="destructive"
                className="bg-red-500 hover:bg-red-500/80"
                data-testid="button-end-event"
              >
                End
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <div className="px-6 mb-8">
        <h3 className="font-poppins font-semibold text-white mb-4">Performance Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <Card className="glass-effect border-none">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="text-neon-purple mr-2 w-5 h-5" />
                <span className="text-lg font-semibold text-white">{displayAnalytics.totalCheckins}</span>
              </div>
              <div className="text-xs text-gray-300">Total Check-ins</div>
            </CardContent>
          </Card>
          <Card className="glass-effect border-none">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="text-electric-pink mr-2 w-5 h-5" />
                <span className="text-lg font-semibold text-white">{displayAnalytics.averageStayTime}</span>
              </div>
              <div className="text-xs text-gray-300">Avg Stay Time</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
