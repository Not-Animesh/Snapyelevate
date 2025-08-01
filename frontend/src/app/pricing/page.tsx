import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { RazorpayPayment } from "@/components/ui/razorpay-payment";
import Navbar from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { 
  Check, 
  Star, 
  Zap, 
  Crown, 
  Users, 
  Shield,
  Headphones,
  Rocket,
  Sparkles
} from "lucide-react";

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      id: "free",
      name: "Free",
      description: "Perfect for getting started",
      icon: Zap,
      price: { monthly: 0, yearly: 0 },
      popular: false,
      features: [
        "5 projects",
        "10 AI generations",
        "Basic templates",
        "PNG, JPG export",
        "Community support",
        "720p export quality"
      ],
      limitations: [
        "Watermark on exports",
        "Limited cloud storage",
        "No premium templates"
      ],
      cta: "Get Started Free",
      ctaVariant: "outline" as const
    },
    {
      id: "pro",
      name: "Pro",
      description: "For individual creators and freelancers",
      icon: Star,
      price: { monthly: 19, yearly: 190 },
      popular: true,
      features: [
        "Unlimited projects",
        "500 AI generations/month",
        "Premium templates",
        "All export formats",
        "4K export quality",
        "Priority support",
        "Team collaboration (3 members)",
        "Advanced canvas tools",
        "Custom backgrounds",
        "Brand kit management"
      ],
      limitations: [],
      cta: "Start Free Trial",
      ctaVariant: "default" as const
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For teams and organizations",
      icon: Crown,
      price: { monthly: 49, yearly: 490 },
      popular: false,
      features: [
        "Everything in Pro",
        "Unlimited AI generations",
        "Advanced admin controls",
        "SSO integration",
        "Unlimited team members",
        "Custom integrations",
        "API access",
        "Dedicated support",
        "Custom templates",
        "Advanced analytics",
        "White-label options",
        "SLA guarantee"
      ],
      limitations: [],
      cta: "Contact Sales",
      ctaVariant: "outline" as const
    }
  ];

  const features = [
    {
      title: "AI-Powered Generation",
      description: "Generate stunning visuals with advanced AI",
      icon: Sparkles,
      plans: ["free", "pro", "enterprise"]
    },
    {
      title: "Vector Editor",
      description: "Professional-grade design tools",
      icon: Zap,
      plans: ["free", "pro", "enterprise"]
    },
    {
      title: "Premium Templates",
      description: "Access to exclusive template library",
      icon: Crown,
      plans: ["pro", "enterprise"]
    },
    {
      title: "Team Collaboration",
      description: "Real-time collaboration and sharing",
      icon: Users,
      plans: ["pro", "enterprise"]
    },
    {
      title: "Advanced Security",
      description: "Enterprise-grade security features",
      icon: Shield,
      plans: ["enterprise"]
    },
    {
      title: "Priority Support",
      description: "Get help when you need it most",
      icon: Headphones,
      plans: ["pro", "enterprise"]
    }
  ];

  const faqs = [
    {
      question: "What happens when I reach my AI generation limit?",
      answer: "You can upgrade your plan to get more generations, or wait until your limit resets next month. Free users get 10 generations per month, Pro users get 500."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. You'll continue to have access to paid features until the end of your billing period."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team for a full refund."
    },
    {
      question: "What export formats are supported?",
      answer: "Free users can export PNG and JPG. Pro and Enterprise users get access to SVG, PDF, and high-resolution formats up to 4K quality."
    },
    {
      question: "Is there a limit on team members?",
      answer: "Free plans are individual only. Pro plans include up to 3 team members. Enterprise plans support unlimited team members."
    },
    {
      question: "Can I use Snapy for commercial projects?",
      answer: "Yes, all plans allow commercial use. Pro and Enterprise plans remove watermarks and provide additional licensing rights."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-purple-blue text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Choose the perfect plan for your design needs. Upgrade or downgrade at any time.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`text-sm ${!isYearly ? 'text-white' : 'text-blue-200'}`}>
                Monthly
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-white"
              />
              <span className={`text-sm ${isYearly ? 'text-white' : 'text-blue-200'}`}>
                Yearly
              </span>
              {isYearly && (
                <Badge className="bg-green-500 text-green-900 ml-2">
                  Save 20%
                </Badge>
              )}
            </div>
          </div>
        </section>

        {/* Pricing Cards with Razorpay Integration */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RazorpayPayment 
              onSuccess={(plan) => {
                console.log(`Upgraded to ${plan} plan`);
                // Handle successful payment
              }}
              currentPlan="free"
            />
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-20 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Feature Comparison</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                See what's included in each plan
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4">Features</th>
                    <th className="text-center py-4 px-4">Free</th>
                    <th className="text-center py-4 px-4">Pro</th>
                    <th className="text-center py-4 px-4">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <feature.icon className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-medium">{feature.title}</div>
                            <div className="text-sm text-muted-foreground">{feature.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        {feature.plans.includes("free") ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <div className="w-5 h-5 mx-auto" />
                        )}
                      </td>
                      <td className="text-center py-4 px-4">
                        {feature.plans.includes("pro") ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <div className="w-5 h-5 mx-auto" />
                        )}
                      </td>
                      <td className="text-center py-4 px-4">
                        {feature.plans.includes("enterprise") ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <div className="w-5 h-5 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to know about our pricing
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-purple-blue text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of creators and start designing beautiful visuals today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/editor">
                <Button size="lg" variant="secondary" className="font-semibold">
                  <Rocket className="w-4 h-4 mr-2" />
                  Start Creating Free
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
