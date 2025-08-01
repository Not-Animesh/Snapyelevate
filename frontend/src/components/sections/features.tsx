'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Palette, Layers, Zap, Users, Download, Sparkles, Projector, Smartphone, Shield } from 'lucide-react';

const features = [
  {
    icon: Projector,
    title: 'Vector Graphics Editor',
    description: 'Professional-grade vector editing with precision tools, bezier curves, and advanced path manipulation.',
  },
  {
    icon: Sparkles,
    title: 'AI Asset Generation',
    description: 'Generate stunning graphics, icons, and illustrations from text prompts using cutting-edge AI technology.',
  },
  {
    icon: Smartphone,
    title: 'Screenshot Editor',
    description: 'Transform screenshots with custom padding, backgrounds, rounded corners, and beautiful shadow effects.',
  },
  {
    icon: Zap,
    title: 'Tweet-to-Image Generator',
    description: 'Create stunning social media images from tweets with customizable styling and export options.',
  },
  {
    icon: Layers,
    title: 'Advanced Layering',
    description: 'Organize your designs with unlimited layers, groups, and sophisticated blending modes.',
  },
  {
    icon: Palette,
    title: 'Rich Color System',
    description: 'Professional color picker with gradients, swatches, and advanced color harmony tools.',
  },
  {
    icon: Users,
    title: 'Real-time Collaboration',
    description: 'Work together seamlessly with team members in real-time with comments and version control.',
  },
  {
    icon: Shield,
    title: 'Cloud Security',
    description: 'Enterprise-grade security with automatic backups and version history protection.',
  },
  {
    icon: Download,
    title: 'Multiple Export Formats',
    description: 'Export your creations in SVG, PNG, JPG, PDF and more with customizable quality settings.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Everything you need to create
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-balance">
            Powerful tools and features designed for modern creators, designers, and teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/40"
            >
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}