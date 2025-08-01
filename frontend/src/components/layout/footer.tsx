import Link from "next/link";
import { Zap, Twitter, Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    // The footer component is a client component as it contains interactive elements.
    // However, it's a good practice to keep it as a standard component and use
    // the parent layout as a client component if necessary. For this footer,
    // since there's no state or browser APIs, we can just use the standard Link.
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              {/* This gradient is a custom class. In Next.js, it's best to define this in globals.css */}
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Snapy</span>
            </div>
            <p className="text-gray-400 mb-4">
              Create stunning screenshots and mockups with AI-powered design tools.
            </p>
            <div className="flex space-x-4">
              <Link href="#" passHref className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" passHref className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="#" passHref className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/features" passHref className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/templates" passHref className="text-gray-400 hover:text-white transition-colors">Templates</Link></li>
              <li><Link href="/pricing" passHref className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/api" passHref className="text-gray-400 hover:text-white transition-colors">API</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" passHref className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/blog" passHref className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/careers" passHref className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/contact" passHref className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/help-center" passHref className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/documentation" passHref className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/status" passHref className="text-gray-400 hover:text-white transition-colors">Status</Link></li>
              <li><Link href="/community" passHref className="text-gray-400 hover:text-white transition-colors">Community</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Snapy. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" passHref className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" passHref className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
              <Link href="/cookie-policy" passHref className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}