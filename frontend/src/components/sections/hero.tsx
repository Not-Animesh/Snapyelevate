'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5" />
      
      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border border-border/40 bg-background/60 px-3 py-1 text-xs font-medium backdrop-blur-sm mb-8">
            <Sparkles className="mr-2 h-3 w-3 text-primary" />
            Powered by AI • Vector Graphics • Serverless
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl md:text-7xl mb-6">
            Create{' '}
            <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Beautiful
            </span>
            <br />
            Digital Assets
          </h1>

          {/* Subheading */}
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-balance mb-8 md:text-xl">
            Professional vector editor with AI-powered asset generation. Create stunning designs, 
            logos, and graphics with our intuitive browser-based platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" asChild className="w-full sm:w-auto group">
              <Link href="/dashboard">
                Start Creating Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
              <Link href="#features">
                Watch Demo
              </Link>
            </Button>
          </div>

          {/* Hero Image/Demo */}
          <div className="relative mx-auto max-w-5xl">
            <div className="relative rounded-xl border border-border/40 bg-background/60 backdrop-blur-sm p-2 shadow-2xl">
              <div className="rounded-lg bg-gradient-to-br from-primary/10 to-blue-500/10 aspect-video flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-lg font-semibold">Interactive Editor Preview</div>
                    <div className="text-sm text-muted-foreground max-w-md mx-auto">
                      Advanced vector editing capabilities with real-time collaboration 
                      and AI-powered asset generation coming soon.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary/20 animate-pulse" />
            <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full bg-blue-500/20 animate-pulse delay-75" />
            <div className="absolute top-1/2 -right-8 w-6 h-6 rounded-full bg-purple-500/20 animate-pulse delay-150" />
          </div>
        </div>
      </div>
    </section>
  );
}