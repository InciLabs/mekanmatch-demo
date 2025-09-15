import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/hooks/use-app-state";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Camera } from "lucide-react";

const INTERESTS = [
  { id: 'cocktails', label: '🍸 Cocktails' },
  { id: 'live-music', label: '🎵 Live Music' },
  { id: 'dancing', label: '💃 Dancing' },
  { id: 'craft-beer', label: '🍻 Craft Beer' },
  { id: 'karaoke', label: '🎤 Karaoke' },
  { id: 'rooftop', label: '🌃 Rooftop' },
];

export default function ProfileSetupScreen() {
  const [, setLocation] = useLocation();
  const { currentUser, setCurrentUser } = useAppState();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleComplete = async () => {
    if (!name || !age || !gender) {
      toast({
        title: "Incomplete Profile",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!currentUser) {
      toast({
        title: "Error",
        description: "No user session found",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/complete-profile", {
        userId: currentUser.id,
        name,
        age: parseInt(age),
        gender,
        interests: selectedInterests,
      });
      
      const data = await response.json();
      setCurrentUser(data.user);
      
      toast({
        title: "Profile Complete!",
        description: "Welcome to MekanMatch",
      });
      
      setLocation("/home");
    } catch (error) {
      toast({
        title: "Failed to Complete Profile",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight via-dark-gray to-midnight animate-fade-in">
      {/* Header */}
      <div className="px-6 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/verify")}
            className="mr-4 text-white"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-montserrat font-bold text-white" data-testid="setup-title">
            Complete Your Profile
          </h2>
        </div>
      </div>

      {/* Profile Form */}
      <div className="px-6 space-y-6">
        {/* Photo Upload */}
        <div className="text-center">
          <div className="w-24 h-24 bg-medium-gray rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-gray-600">
            <Camera className="text-gray-400 text-2xl" />
          </div>
          <Button 
            variant="link" 
            className="text-neon-purple font-semibold p-0" 
            data-testid="button-add-photo"
          >
            Add Photo
          </Button>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-opensans font-medium mb-2" data-testid="name-label">
            Name
          </label>
          <Input 
            type="text" 
            className="input-field" 
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-testid="input-name"
          />
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-opensans font-medium mb-2" data-testid="age-label">
            Age
          </label>
          <Input 
            type="number" 
            className="input-field" 
            placeholder="25"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min="18"
            max="100"
            data-testid="input-age"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-opensans font-medium mb-2" data-testid="gender-label">
            Gender
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['male', 'female', 'other'].map((genderOption) => (
              <Button
                key={genderOption}
                variant="outline"
                className={`py-3 ${
                  gender === genderOption 
                    ? 'bg-neon-purple border-neon-purple text-white' 
                    : 'bg-medium-gray border-gray-600 text-white hover:border-neon-purple'
                }`}
                onClick={() => setGender(genderOption)}
                data-testid={`button-gender-${genderOption}`}
              >
                {genderOption.charAt(0).toUpperCase() + genderOption.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-opensans font-medium mb-2" data-testid="interests-label">
            Interests
          </label>
          <div className="grid grid-cols-2 gap-2">
            {INTERESTS.map((interest) => (
              <Button
                key={interest.id}
                variant="outline"
                className={`py-2 px-3 text-sm ${
                  selectedInterests.includes(interest.id)
                    ? 'bg-neon-purple border-neon-purple text-white'
                    : 'bg-medium-gray border-gray-600 text-white hover:border-neon-purple'
                }`}
                onClick={() => handleInterestToggle(interest.id)}
                data-testid={`button-interest-${interest.id}`}
              >
                {interest.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <div className="pt-6 pb-8">
          <Button 
            className="w-full btn-primary" 
            onClick={handleComplete}
            disabled={isLoading}
            data-testid="button-complete"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Completing Profile...
              </div>
            ) : (
              'Complete Profile'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
