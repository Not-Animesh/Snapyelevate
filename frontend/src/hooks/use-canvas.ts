'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { FabricCanvasManager } from '@/lib/fabric-canvas';

export interface CanvasState {
  selectedTool: 'select' | 'rectangle' | 'circle' | 'text' | 'image';
  zoom: number;
  activeObject: any;
}

export function useCanvas(containerId: string, width: number = 1920, height: number = 1080) {
  const canvasManagerRef = useRef<FabricCanvasManager | null>(null);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    selectedTool: 'select',
    zoom: 1,
    activeObject: null,
  });

  const initializeCanvas = useCallback(() => {
    if (canvasManagerRef.current) {
      canvasManagerRef.current.dispose();
    }

    try {
      canvasManagerRef.current = new FabricCanvasManager(containerId, {
        width,
        height,
        backgroundColor: '#ffffff',
      });

      // Setup event listeners
      const canvas = canvasManagerRef.current.getCanvas();
      if (canvas) {
        canvas.on('selection:created', (e) => {
          setCanvasState(prev => ({ ...prev, activeObject: e.selected?.[0] || null }));
        });

        canvas.on('selection:updated', (e) => {
          setCanvasState(prev => ({ ...prev, activeObject: e.selected?.[0] || null }));
        });

        canvas.on('selection:cleared', () => {
          setCanvasState(prev => ({ ...prev, activeObject: null }));
        });
      }

      // Fit canvas to container
      setTimeout(() => {
        canvasManagerRef.current?.fitToScreen();
        setCanvasState(prev => ({ 
          ...prev, 
          zoom: canvasManagerRef.current?.getZoom() || 1 
        }));
      }, 100);

    } catch (error) {
      console.error('Failed to initialize canvas:', error);
    }
  }, [containerId, width, height]);

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (container) {
      initializeCanvas();
    }

    return () => {
      if (canvasManagerRef.current) {
        canvasManagerRef.current.dispose();
      }
    };
  }, [initializeCanvas]);

  const addRectangle = useCallback(() => {
    canvasManagerRef.current?.addRectangle();
    setCanvasState(prev => ({ ...prev, selectedTool: 'select' }));
  }, []);

  const addCircle = useCallback(() => {
    canvasManagerRef.current?.addCircle();
    setCanvasState(prev => ({ ...prev, selectedTool: 'select' }));
  }, []);

  const addText = useCallback((text: string = 'Text') => {
    canvasManagerRef.current?.addText(text);
    setCanvasState(prev => ({ ...prev, selectedTool: 'select' }));
  }, []);

  const addImage = useCallback(async (imageUrl: string) => {
    try {
      await canvasManagerRef.current?.addImage(imageUrl);
      setCanvasState(prev => ({ ...prev, selectedTool: 'select' }));
    } catch (error) {
      console.error('Failed to add image:', error);
    }
  }, []);

  const setBackgroundColor = useCallback((color: string) => {
    canvasManagerRef.current?.setBackgroundColor(color);
  }, []);

  const setBackgroundGradient = useCallback((gradient: any) => {
    canvasManagerRef.current?.setBackgroundGradient(gradient);
  }, []);

  const deleteSelected = useCallback(() => {
    canvasManagerRef.current?.deleteSelected();
  }, []);

  const duplicateSelected = useCallback(() => {
    canvasManagerRef.current?.duplicateSelected();
  }, []);

  const zoom = useCallback((scale: number) => {
    canvasManagerRef.current?.zoom(scale);
    setCanvasState(prev => ({ ...prev, zoom: scale }));
  }, []);

  const zoomIn = useCallback(() => {
    const currentZoom = canvasManagerRef.current?.getZoom() || 1;
    const newZoom = Math.min(currentZoom * 1.2, 5);
    zoom(newZoom);
  }, [zoom]);

  const zoomOut = useCallback(() => {
    const currentZoom = canvasManagerRef.current?.getZoom() || 1;
    const newZoom = Math.max(currentZoom / 1.2, 0.1);
    zoom(newZoom);
  }, [zoom]);

  const fitToScreen = useCallback(() => {
    canvasManagerRef.current?.fitToScreen();
    setCanvasState(prev => ({ 
      ...prev, 
      zoom: canvasManagerRef.current?.getZoom() || 1 
    }));
  }, []);

  const updateActiveObject = useCallback((properties: any) => {
    canvasManagerRef.current?.updateActiveObject(properties);
  }, []);

  const exportToJSON = useCallback((): string => {
    return canvasManagerRef.current?.exportToJSON() || '{}';
  }, []);

  const loadFromJSON = useCallback(async (json: string) => {
    try {
      await canvasManagerRef.current?.loadFromJSON(json);
    } catch (error) {
      console.error('Failed to load canvas from JSON:', error);
    }
  }, []);

  const exportToPNG = useCallback((options?: any): string => {
    return canvasManagerRef.current?.exportToPNG(options) || '';
  }, []);

  const exportToSVG = useCallback((): string => {
    return canvasManagerRef.current?.exportToSVG() || '';
  }, []);

  const setTool = useCallback((tool: CanvasState['selectedTool']) => {
    setCanvasState(prev => ({ ...prev, selectedTool: tool }));
  }, []);

  return {
    canvasState,
    setTool,
    addRectangle,
    addCircle,
    addText,
    addImage,
    setBackgroundColor,
    setBackgroundGradient,
    deleteSelected,
    duplicateSelected,
    zoom,
    zoomIn,
    zoomOut,
    fitToScreen,
    updateActiveObject,
    exportToJSON,
    loadFromJSON,
    exportToPNG,
    exportToSVG,
    canvasManager: canvasManagerRef.current,
  };
}
