import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Move, RotateCw, Square } from "lucide-react";

interface CanvasProps {
  canvasId: string;
  zoom: number;
  onZoomChange?: (zoom: number) => void;
  className?: string;
}

export default function Canvas({ canvasId, zoom, onZoomChange, className }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Canvas container is managed by the useCanvas hook
    // This component just provides the container and UI elements
  }, []);

  const formatZoom = (zoom: number): string => {
    return `${Math.round(zoom * 100)}%`;
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Canvas Container */}
      <div className="absolute inset-4 bg-card rounded-lg shadow-inner overflow-hidden">
        <div
          id={canvasId}
          ref={containerRef}
          className="w-full h-full canvas-container"
        />
        
        {/* Canvas Overlay UI */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Rulers (optional) */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-muted border-b border-border flex items-center justify-center text-xs text-muted-foreground">
            <div className="flex space-x-8">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="text-center">
                  <div className="w-px h-2 bg-border"></div>
                  <span className="text-[10px]">{i * 100}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="absolute top-6 left-0 bottom-0 w-6 bg-muted border-r border-border">
            {/* Vertical ruler would go here */}
          </div>
        </div>
        
        {/* Canvas Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
          <div className="flex items-center space-x-2 bg-background/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-border">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Move className="w-4 h-4" />
            </Button>
            <div className="h-4 w-px bg-border"></div>
            <Badge variant="secondary" className="text-xs font-medium">
              {formatZoom(zoom)}
            </Badge>
            <div className="h-4 w-px bg-border"></div>
            <Badge variant="outline" className="text-xs">
              1920 × 1080
            </Badge>
          </div>
        </div>
        
        {/* Selection Info */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <div className="bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-border">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Square className="w-3 h-3" />
              <span>No selection</span>
            </div>
          </div>
        </div>
        
        {/* Grid Toggle */}
        <div className="absolute top-4 right-4 pointer-events-auto">
          <Button variant="ghost" size="sm" className="text-xs">
            Grid
          </Button>
        </div>
      </div>
      
      {/* Loading State */}
      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 pointer-events-none transition-opacity">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading canvas...</p>
        </div>
      </div>
    </div>
  );
}
