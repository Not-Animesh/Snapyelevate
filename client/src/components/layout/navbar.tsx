import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import { Zap, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-purple-blue rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Snapy</span>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className={`transition-colors ${location === "/dashboard" ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}>
              Dashboard
            </Link>
            <Link href="/templates" className={`transition-colors ${location === "/templates" ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}>
              Templates
            </Link>
            <Link href="/pricing" className={`transition-colors ${location === "/pricing" ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}>
              Pricing
            </Link>
          </div>
          
          {/* CTA & Theme Toggle */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-lg"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" className="text-sm">
              Sign In
            </Button>
            <Link href="/editor">
              <Button className="btn-gradient font-medium">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
