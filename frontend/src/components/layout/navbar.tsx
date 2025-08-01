'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Zap, Sun, Moon } from "lucide-react";
import * as React from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Handle a loading state for the theme to prevent flickering
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) {
    return null;
  }

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">Snapy</span>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/dashboard" 
              className={`transition-colors ${pathname === "/dashboard" ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              Dashboard
            </Link>
            <Link 
              href="/templates" 
              className={`transition-colors ${pathname === "/templates" ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              Templates
            </Link>
            <Link 
              href="/pricing" 
              className={`transition-colors ${pathname === "/pricing" ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              Pricing
            </Link>
          </div>
          
          {/* CTA & Theme Toggle */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-lg"
            >
              {resolvedTheme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            {/* Fix here: use `asChild` on Button, not Link */}
            <Button variant="ghost" className="text-sm" asChild>
              <Link href="/auth/signin">
                Sign In
              </Link>
            </Button>
            {/* Fix here: use `asChild` on Button, not Link */}
            <Button className="btn-gradient font-medium" asChild>
              <Link href="/editor">
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}