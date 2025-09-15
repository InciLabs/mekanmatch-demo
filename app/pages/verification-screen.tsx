import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/hooks/use-app-state";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Smartphone } from "lucide-react";

export default function VerificationScreen() {
  const [, setLocation] = useLocation();
  const { phoneNumber, verificationCode, setVerificationCode, setCurrentUser } = useAppState();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleVerify = async () => {
    if (verificationCode.length !== 4) {
      toast({
        title: "Invalid Code",
        description: "Please enter the 4-digit verification code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/verify-phone", {
        phoneNumber,
        code: verificationCode,
      });
      
      const data = await response.json();
      setCurrentUser(data.user);
      
      if (data.isNewUser) {
        setLocation("/profile-setup");
      } else {
        setLocation("/home");
      }
      
      toast({
        title: "Verification Successful",
        description: "Welcome to MekanMatch!",
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = verificationCode.split('');
      newCode[index] = value;
      setVerificationCode(newCode.join(''));
      
      // Auto-focus next input
      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    toast({
      title: "Code Resent",
      description: "A new verification code has been sent to your phone",
    });
  };

  // Auto-verify when code is complete
  useEffect(() => {
    if (verificationCode.length === 4 && !isLoading) {
      handleVerify();
    }
  }, [verificationCode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight via-dark-gray to-midnight flex flex-col justify-center px-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-neon-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="text-neon-purple text-2xl" />
        </div>
        <h2 className="text-2xl font-montserrat font-bold mb-2" data-testid="verify-title">
          Verify Your Phone
        </h2>
        <p className="text-gray-300" data-testid="verify-message">
          We sent a code to {phoneNumber}
        </p>
      </div>

      {/* OTP Input */}
      <div className="flex justify-center space-x-3 mb-8">
        {[0, 1, 2, 3].map((index) => (
          <Input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            className="w-12 h-12 bg-medium-gray border-gray-600 rounded-xl text-center text-white focus:border-neon-purple"
            maxLength={1}
            value={verificationCode[index] || ''}
            onChange={(e) => handleCodeChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            data-testid={`input-code-${index}`}
          />
        ))}
      </div>

      {/* Verify Button */}
      <Button 
        className="w-full btn-primary mb-4" 
        onClick={handleVerify}
        disabled={isLoading || verificationCode.length !== 4}
        data-testid="button-verify"
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Verifying...
          </div>
        ) : (
          'Verify'
        )}
      </Button>

      {/* Resend */}
      <div className="text-center">
        <p className="text-gray-400 mb-2" data-testid="resend-message">
          Didn't receive the code?
        </p>
        <Button 
          variant="link" 
          className="text-neon-purple font-semibold p-0" 
          onClick={handleResend}
          data-testid="button-resend"
        >
          Resend Code
        </Button>
      </div>

      {/* Demo hint */}
      <div className="mt-8 p-4 bg-neon-purple/10 rounded-lg border border-neon-purple/20">
        <p className="text-center text-sm text-gray-300">
          <strong>Demo:</strong> Use code <span className="text-neon-purple font-bold">1234</span> to continue
        </p>
      </div>
    </div>
  );
}
