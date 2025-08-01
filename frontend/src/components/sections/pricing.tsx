'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: [
      '3 projects',
      'Basic vector tools',
      '5 AI generations/month',
      '1GB storage',
      'Community support',
      'Export to PNG, JPG'
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Starter',
    price: '$12',
    description: 'Ideal for individual creators',
    features: [
      '25 projects',
      'Advanced vector tools',
      '100 AI generations/month',
      '10GB storage',
      'Email support',
      'All export formats',
      'Custom templates',
      'Version history'
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'Built for teams and professionals',
    features: [
      'Unlimited projects',
      'All pro tools',
      '500 AI generations/month',
      '100GB storage',
      'Priority support',
      'Team collaboration',
      'Advanced templates',
      'Brand kit',
      'API access'
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-balance">
            Choose the perfect plan for your creative needs. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative hover:shadow-lg transition-all duration-300 ${
                plan.popular 
                  ? 'border-primary shadow-lg scale-105' 
                  : 'border-border/40 hover:-translate-y-1'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center space-x-1 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                    <Star className="h-3 w-3" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full" 
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}