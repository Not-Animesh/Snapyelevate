'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, 
  PenTool, 
  Palette, 
  LayoutTemplate, 
  Download, 
  Users,
  Check,
  ArrowRight,
  Zap
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Generation",
      description: "Generate stunning backgrounds, icons, and design elements with advanced AI technology.",
      features: ["Text-to-image generation", "Custom style prompts", "Vector asset creation"]
    },
    {
      icon: PenTool,
      title: "Professional Vector Editor",
      description: "Full-featured vector editing with layers, shapes, text, and precise control tools.",
      features: ["Fabric.js powered canvas", "Real-time collaboration", "Infinite canvas"]
    },
    {
      icon: Palette,
      title: "Beautiful Backgrounds",
      description: "Curated collection of gradient backgrounds and customizable design elements.",
      features: ["Premium gradients", "Custom patterns", "Brand colors"]
    },
    {
      icon: LayoutTemplate,
      title: "Premium Templates",
      description: "Professional templates for social media, presentations, and marketing materials.",
      features: ["Social media formats", "Brand guidelines", "Custom layouts"]
    },
    {
      icon: Download,
      title: "Multiple Export Formats",
      description: "Export your designs in multiple formats optimized for different platforms.",
      features: ["PNG, JPG, SVG, PDF", "High-resolution output", "Batch export"]
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share projects, collaborate in real-time, and manage team permissions.",
      features: ["Real-time editing", "Comment system", "Version control"]
    }
  ];

  const templates = [
    {
      title: "Social Media Posts",
      description: "Perfect for Instagram, Twitter, and Facebook content",
      count: "12 templates",
      gradient: "bg-gradient-sunrise"
    },
    {
      title: "Presentation Slides",
      description: "Professional slides for business presentations",
      count: "8 templates",
      gradient: "bg-gradient-deep-sea"
    },
    {
      title: "App Mockups",
      description: "Showcase your mobile and web applications",
      count: "15 templates",
      gradient: "bg-gradient-royal-velvet"
    },
    {
      title: "Website Screenshots",
      description: "Beautiful browser frames and website mockups",
      count: "10 templates",
      gradient: "bg-gradient-emerald-forest"
    },
    {
      title: "Marketing Materials",
      description: "Infographics, banners, and promotional content",
      count: "20 templates",
      gradient: "bg-gradient-twilight"
    },
    {
      title: "Brand Assets",
      description: "Logos, business cards, and brand guidelines",
      count: "6 templates",
      gradient: "bg-gradient-purple-blue"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Create Stunning
                <span className="gradient-text block">Screenshots & Mockups</span>
                in Seconds
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Transform your screenshots into professional visuals with AI-powered design tools, 
                beautiful backgrounds, and premium templates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="btn-gradient font-semibold" asChild>
                  <Link href="/editor">
                    Start Creating Free
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="font-semibold">
                    Watch Demo
                </Button>
              </div>
              <div className="flex items-center space-x-6 mt-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>AI powered</span>
                </div>
              </div>
            </div>
            
            {/* Hero Visual */}
            <div className="relative animate-slide-in">
              <Card className="overflow-hidden shadow-2xl">
                {/* Browser mockup header */}
                <div className="bg-muted px-4 py-3 flex items-center space-x-2">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-background rounded mx-4 px-3 py-1 text-xs text-muted-foreground">
                    app.snapy.design
                  </div>
                </div>
                <div className="aspect-video bg-gradient-twilight"></div>
              </Card>
              
              {/* Floating gradient orbs */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-purple-blue rounded-full blur-3xl opacity-20 animate-float"></div>
              <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-royal-velvet rounded-full blur-3xl opacity-20 animate-float" style={{animationDelay: "1s"}}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Powerful Design Tools</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to create professional screenshots, mockups, and visual content
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Professional Templates</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Start with beautiful, pre-designed templates for every use case
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template, index) => (
              <Card key={index} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`aspect-video relative overflow-hidden ${template.gradient}`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{template.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{template.count}</span>
                    <Button size="sm" variant="secondary" asChild>
                      <Link href="/templates">
                        Use Template
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/templates">
                View All Templates
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Create Something Amazing?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of designers and creators who trust Snapy for their visual content needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="font-semibold" asChild>
              <Link href="/editor">
                Start Creating Free
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/pricing">
                View Pricing
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
    </div>
  );
}
