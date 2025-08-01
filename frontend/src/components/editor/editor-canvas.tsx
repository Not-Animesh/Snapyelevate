'use client';

import { useRef, useEffect } from "react";

interface EditorCanvasProps {
  canvasId: string;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export default function EditorCanvas({ canvasId, zoom, onZoomChange }: EditorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Draw initial grid
    const drawGrid = () => {
      const gridSize = 20;
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      ctx.strokeStyle = 'rgba(156, 163, 175, 0.2)';
      ctx.lineWidth = 1;

      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    drawGrid();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-muted/20">
      <div className="flex-1 overflow-hidden p-4">
        <div className="w-full h-full canvas-container flex items-center justify-center">
          <canvas
            id={canvasId}
            ref={canvasRef}
            className="bg-background rounded-lg shadow-sm cursor-crosshair"
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
        </div>
      </div>
    </div>
  );
}
