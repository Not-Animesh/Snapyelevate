import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  aiGenerations: number;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    currency: "INR",
    features: [
      "10 AI generations per month",
      "Basic templates",
      "PNG/JPG export",
      "Community support"
    ],
    aiGenerations: 10
  },
  {
    id: "pro",
    name: "Pro",
    price: 999,
    currency: "INR",
    features: [
      "100 AI generations per month",
      "Premium templates",
      "All export formats (PNG, JPG, SVG, PDF)",
      "Priority support",
      "Advanced editing tools"
    ],
    aiGenerations: 100,
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 2999,
    currency: "INR",
    features: [
      "1000 AI generations per month",
      "All premium features",
      "Custom templates",
      "API access",
      "Dedicated support",
      "Team collaboration"
    ],
    aiGenerations: 1000
  }
];

interface RazorpayPaymentProps {
  onSuccess?: (plan: string) => void;
  currentPlan?: string;
}

export function RazorpayPayment({ onSuccess, currentPlan = "free" }: RazorpayPaymentProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  // Load Razorpay script
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (plan: Plan) => {
    if (plan.price === 0) {
      toast({
        title: "Already on Free Plan",
        description: "You're currently on the free plan.",
      });
      return;
    }

    if (plan.id === currentPlan) {
      toast({
        title: "Current Plan",
        description: `You're already subscribed to the ${plan.name} plan.`,
      });
      return;
    }

    setLoading(plan.id);

    try {
      // Load Razorpay script
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) {
        throw new Error("Failed to load Razorpay SDK");
      }

      // Create order
      const orderResponse = await apiRequest("POST", "/api/payment/create-order", {
        amount: plan.price,
        currency: plan.currency,
        plan: plan.id
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create payment order");
      }

      const orderData = await orderResponse.json();

      // Initialize Razorpay payment
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "Snapy",
        description: `${plan.name} Plan Subscription`,
        image: "/logo.png", // Add your logo here
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await apiRequest("POST", "/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: plan.id
            });

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed");
            }

            const verifyData = await verifyResponse.json();

            toast({
              title: "Payment Successful!",
              description: verifyData.message,
            });

            onSuccess?.(plan.id);
          } catch (error: any) {
            console.error("Payment verification error:", error);
            toast({
              title: "Payment Verification Failed",
              description: error.message || "Please contact support.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: "User",
          email: "user@example.com",
          contact: "+919999999999"
        },
        notes: {
          plan: plan.id
        },
        theme: {
          color: "#3B82F6"
        },
        modal: {
          ondismiss: function() {
            setLoading(null);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {plans.map((plan) => (
        <Card 
          key={plan.id} 
          className={`relative ${plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''} ${
            plan.id === currentPlan ? 'bg-blue-50 dark:bg-blue-950' : ''
          }`}
        >
          {plan.popular && (
            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
              Most Popular
            </Badge>
          )}
          <CardHeader>
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <CardDescription>
              <span className="text-3xl font-bold">₹{plan.price}</span>
              {plan.price > 0 && <span className="text-sm">/month</span>}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button
              onClick={() => handlePayment(plan)}
              disabled={loading === plan.id || plan.id === currentPlan}
              className="w-full"
              variant={plan.id === currentPlan ? "outline" : "default"}
            >
              {loading === plan.id ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : plan.id === currentPlan ? (
                "Current Plan"
              ) : plan.price === 0 ? (
                "Free Plan"
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Upgrade to {plan.name}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}