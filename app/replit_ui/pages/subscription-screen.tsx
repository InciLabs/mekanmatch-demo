import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/hooks/use-app-state";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Check, X, Star, Crown } from "lucide-react";

interface PlanFeature {
  feature: string;
  free: boolean;
  premium: boolean;
  elite: boolean;
}

const PLAN_FEATURES: PlanFeature[] = [
  {
    feature: "Venue discovery",
    free: true,
    premium: true,
    elite: true,
  },
  {
    feature: "Basic crowd insights",
    free: true,
    premium: true,
    elite: true,
  },
  {
    feature: "Check-ins & social discovery",
    free: false,
    premium: true,
    elite: true,
  },
  {
    feature: "Advanced filters",
    free: false,
    premium: true,
    elite: true,
  },
  {
    feature: "See people after check-in",
    free: false,
    premium: true,
    elite: true,
  },
  {
    feature: "Pre-check-in visibility",
    free: false,
    premium: false,
    elite: true,
  },
  {
    feature: "VIP support",
    free: false,
    premium: false,
    elite: true,
  },
  {
    feature: "Top placement in discovery",
    free: false,
    premium: false,
    elite: true,
  },
];

const PRICING_OPTIONS = [
  { duration: "daily", label: "Daily", premium: "₺50", elite: "₺80" },
  { duration: "weekly", label: "Weekly", premium: "₺150", elite: "₺250" },
  { duration: "monthly", label: "Monthly", premium: "₺500", elite: "₺800" },
  { duration: "yearly", label: "Yearly", premium: "₺5,000", elite: "₺8,000" },
];

export default function SubscriptionScreen() {
  const [, setLocation] = useLocation();
  const { currentUser, setCurrentUser } = useAppState();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<"premium" | "elite">("premium");

  const subscriptionMutation = useMutation({
    mutationFn: async ({ subscriptionType, duration }: { subscriptionType: string; duration: string }) => {
      const response = await apiRequest("PATCH", `/api/users/${currentUser?.id}/subscription`, {
        subscriptionType,
        duration,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentUser(data.user);
      toast({
        title: "Subscription Updated!",
        description: `Welcome to ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}!`,
      });
      setLocation("/profile");
    },
    onError: () => {
      toast({
        title: "Subscription Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = (duration: string) => {
    // Mock payment process
    toast({
      title: "Processing Payment",
      description: "This is a demo - no real payment is processed",
    });

    setTimeout(() => {
      subscriptionMutation.mutate({ subscriptionType: selectedPlan, duration });
    }, 1500);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Please log in to view subscription options</p>
          <Button onClick={() => setLocation("/login")} className="mt-4">
            Log In
          </Button>
        </div>
      </div>
    );
  }

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
          <h2 className="text-xl font-montserrat font-bold text-white" data-testid="subscription-title">
            Choose Your Plan
          </h2>
        </div>
      </div>

      {/* Plan Comparison */}
      <div className="px-6 space-y-6 mb-8">
        {/* Free Plan */}
        <div className="glass-effect rounded-xl p-6 border-2 border-gray-600">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center mb-2">
              <Star className="text-gray-300 mr-2" />
              <h3 className="text-xl font-montserrat font-bold text-white">Free</h3>
            </div>
            <div className="text-3xl font-montserrat font-bold text-gray-300 mb-1">₺0</div>
            <div className="text-sm text-gray-400">Forever</div>
          </div>
          <ul className="space-y-3 text-sm">
            {PLAN_FEATURES.filter(f => f.free).map((feature) => (
              <li key={feature.feature} className="flex items-center text-gray-300">
                <Check className="text-green-400 mr-3 w-4 h-4" />
                <span>{feature.feature}</span>
              </li>
            ))}
            {PLAN_FEATURES.filter(f => !f.free).slice(0, 2).map((feature) => (
              <li key={feature.feature} className="flex items-center text-gray-500">
                <X className="text-red-400 mr-3 w-4 h-4" />
                <span>{feature.feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Premium Plan */}
        <div 
          className={`glass-effect rounded-xl p-6 border-2 cursor-pointer transition-all ${
            selectedPlan === 'premium' 
              ? 'border-neon-purple bg-gradient-to-br from-neon-purple/10 to-transparent' 
              : 'border-neon-purple/50'
          }`}
          onClick={() => setSelectedPlan('premium')}
          data-testid="plan-premium"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="text-center flex-1">
              <div className="flex items-center justify-center mb-2">
                <Crown className="text-neon-purple mr-2" />
                <h3 className="text-xl font-montserrat font-bold text-white">Premium</h3>
              </div>
              <div className="text-3xl font-montserrat font-bold text-neon-purple mb-1">₺150</div>
              <div className="text-sm text-gray-400">per week</div>
            </div>
            <div className="bg-neon-purple px-3 py-1 rounded-full text-xs font-semibold text-white">
              POPULAR
            </div>
          </div>
          <ul className="space-y-3 text-sm mb-6">
            <li className="flex items-center text-gray-300">
              <Check className="text-green-400 mr-3 w-4 h-4" />
              <span>Everything in Free</span>
            </li>
            {PLAN_FEATURES.filter(f => f.premium && !f.free).slice(0, 3).map((feature) => (
              <li key={feature.feature} className="flex items-center text-gray-300">
                <Check className="text-green-400 mr-3 w-4 h-4" />
                <span>{feature.feature}</span>
              </li>
            ))}
          </ul>
          <Button 
            className={`w-full ${
              selectedPlan === 'premium' ? 'btn-primary' : 'bg-neon-purple hover:bg-neon-purple/80'
            }`}
            onClick={() => handleSubscribe('weekly')}
            disabled={subscriptionMutation.isPending}
            data-testid="button-choose-premium"
          >
            {selectedPlan === 'premium' ? 'Choose Premium' : 'Select Premium'}
          </Button>
        </div>

        {/* Elite Plan */}
        <div 
          className={`glass-effect rounded-xl p-6 border-2 cursor-pointer transition-all ${
            selectedPlan === 'elite' 
              ? 'border-electric-pink bg-gradient-to-br from-electric-pink/10 to-transparent' 
              : 'border-electric-pink/50'
          }`}
          onClick={() => setSelectedPlan('elite')}
          data-testid="plan-elite"
        >
          <div className="text-center mb-4">
            <div className="flex items-center justify-center mb-2">
              <Crown className="text-electric-pink mr-2" />
              <h3 className="text-xl font-montserrat font-bold text-white">Elite</h3>
            </div>
            <div className="text-3xl font-montserrat font-bold text-electric-pink mb-1">₺250</div>
            <div className="text-sm text-gray-400">per week</div>
          </div>
          <ul className="space-y-3 text-sm mb-6">
            <li className="flex items-center text-gray-300">
              <Check className="text-green-400 mr-3 w-4 h-4" />
              <span>Everything in Premium</span>
            </li>
            {PLAN_FEATURES.filter(f => f.elite && !f.premium).map((feature) => (
              <li key={feature.feature} className="flex items-center text-gray-300">
                <Check className="text-green-400 mr-3 w-4 h-4" />
                <span>{feature.feature}</span>
              </li>
            ))}
          </ul>
          <Button 
            className={`w-full ${
              selectedPlan === 'elite' 
                ? 'bg-gradient-to-r from-electric-pink to-neon-purple hover:opacity-90' 
                : 'bg-electric-pink hover:bg-electric-pink/80'
            }`}
            onClick={() => handleSubscribe('weekly')}
            disabled={subscriptionMutation.isPending}
            data-testid="button-choose-elite"
          >
            {selectedPlan === 'elite' ? 'Choose Elite' : 'Select Elite'}
          </Button>
        </div>
      </div>

      {/* Pricing Options */}
      <div className="px-6 mb-8">
        <h3 className="font-poppins font-semibold text-white mb-4 text-center">
          Other Payment Options
        </h3>
        <div className="grid grid-cols-2 gap-3 text-center">
          {PRICING_OPTIONS.map((option) => (
            <Button
              key={option.duration}
              variant="outline"
              className="glass-effect border-gray-600 text-white hover:bg-white/10 p-4 flex flex-col"
              onClick={() => handleSubscribe(option.duration)}
              disabled={subscriptionMutation.isPending}
              data-testid={`button-${option.duration}`}
            >
              <div className="font-semibold">{option.label}</div>
              <div className="text-sm text-gray-400">
                {selectedPlan === 'premium' ? option.premium : option.elite}
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Demo Notice */}
      <div className="px-6 mb-8">
        <div className="bg-neon-purple/10 rounded-lg border border-neon-purple/20 p-4">
          <p className="text-center text-sm text-gray-300">
            <strong>Demo Mode:</strong> No real payments will be processed. This is for demonstration purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}
