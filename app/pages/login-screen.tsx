import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/hooks/use-app-state";
import { useToast } from "@/hooks/use-toast";

export default function LoginScreen() {
  const [, setLocation] = useLocation();
  const { phoneNumber, setPhoneNumber } = useAppState();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate SMS sending delay
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Verification Code Sent",
        description: "Please check your messages for the verification code",
      });
      setLocation("/verify");
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: "Social Login",
      description: `${provider} login would be implemented here`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight via-dark-gray to-midnight flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex-1 flex flex-col justify-center px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-montserrat font-bold mb-2 neon-glow" data-testid="app-title">
            MekanMatch
          </h1>
          <p className="text-gray-300 font-opensans" data-testid="app-tagline">
            See the crowd. Join the vibe.
          </p>
        </div>

        {/* Phone Input */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-opensans font-medium mb-2" data-testid="phone-label">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <span className="text-gray-400">+90</span>
              </div>
              <Input 
                type="tel" 
                className="input-field pl-12" 
                placeholder="5XX XXX XX XX"
                value={phoneNumber.replace('+90', '')}
                onChange={(e) => setPhoneNumber('+90' + e.target.value)}
                data-testid="input-phone"
              />
            </div>
          </div>

          {/* Continue Button */}
          <Button 
            className="w-full btn-primary animate-pulse-neon" 
            onClick={handleContinue}
            disabled={isLoading}
            data-testid="button-continue"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending Code...
              </div>
            ) : (
              'Continue'
            )}
          </Button>

          {/* Terms */}
          <p className="text-xs text-gray-400 text-center leading-relaxed" data-testid="terms-text">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      {/* Social Login */}
      <div className="p-6 border-t border-gray-700">
        <p className="text-center text-gray-400 mb-4 font-opensans" data-testid="social-login-text">
          Or connect with
        </p>
        <div className="flex space-x-4">
          <Button 
            variant="outline"
            className="flex-1 bg-medium-gray border-gray-600 hover:border-neon-purple"
            onClick={() => handleSocialLogin('Google')}
            data-testid="button-google"
          >
            <span className="mr-2">G</span>
            Google
          </Button>
          <Button 
            variant="outline"
            className="flex-1 bg-medium-gray border-gray-600 hover:border-neon-purple"
            onClick={() => handleSocialLogin('Apple')}
            data-testid="button-apple"
          >
            <span className="mr-2">🍎</span>
            Apple
          </Button>
        </div>
      </div>
    </div>
  );
}
