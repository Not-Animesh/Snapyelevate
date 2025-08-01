import { Canvas, Rect, Circle, Text, Image, Gradient, Object as FabricObject } from 'fabric';

export interface CanvasConfig {
  width: number;
  height: number;
  backgroundColor?: string;
}

export class FabricCanvasManager {
  private canvas: Canvas | null = null;
  private container: HTMLElement | null = null;

  constructor(containerId: string, config: CanvasConfig) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }

    this.initializeCanvas(config);
  }

  private initializeCanvas(config: CanvasConfig) {
    // Create canvas element
    const canvasElement = document.createElement('canvas');
    canvasElement.id = 'fabric-canvas';
    this.container!.appendChild(canvasElement);

    // Initialize Fabric.js canvas
    this.canvas = new Canvas(canvasElement, {
      width: config.width,
      height: config.height,
      backgroundColor: config.backgroundColor || '#ffffff',
      selection: true,
      preserveObjectStacking: true,
    });

    this.setupCanvasEvents();
  }

  private setupCanvasEvents() {
    if (!this.canvas) return;

    // Object selection events
    this.canvas.on('selection:created', (e: any) => {
      console.log('Object selected:', e.selected);
    });

    this.canvas.on('selection:updated', (e: any) => {
      console.log('Selection updated:', e.selected);
    });

    this.canvas.on('selection:cleared', () => {
      console.log('Selection cleared');
    });

    // Object modification events
    this.canvas.on('object:modified', (e: any) => {
      console.log('Object modified:', e.target);
    });
  }

  // Canvas manipulation methods
  addRectangle(options: {
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  } = {}) {
    if (!this.canvas) return null;

    const rect = new Rect({
      left: options.left || 100,
      top: options.top || 100,
      width: options.width || 100,
      height: options.height || 100,
      fill: options.fill || '#3B82F6',
      stroke: options.stroke,
      strokeWidth: options.strokeWidth || 0,
    });

    this.canvas.add(rect);
    this.canvas.setActiveObject(rect);
    this.canvas.renderAll();
    return rect;
  }

  addCircle(options: {
    left?: number;
    top?: number;
    radius?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  } = {}) {
    if (!this.canvas) return null;

    const circle = new Circle({
      left: options.left || 100,
      top: options.top || 100,
      radius: options.radius || 50,
      fill: options.fill || '#8B5CF6',
      stroke: options.stroke,
      strokeWidth: options.strokeWidth || 0,
    });

    this.canvas.add(circle);
    this.canvas.setActiveObject(circle);
    this.canvas.renderAll();
    return circle;
  }

  addText(text: string, options: {
    left?: number;
    top?: number;
    fontSize?: number;
    fontFamily?: string;
    fill?: string;
    fontWeight?: string;
  } = {}) {
    if (!this.canvas) return null;

    const textObject = new Text(text, {
      left: options.left || 100,
      top: options.top || 100,
      fontSize: options.fontSize || 20,
      fontFamily: options.fontFamily || 'Inter',
      fill: options.fill || '#000000',
      fontWeight: options.fontWeight || 'normal',
    });

    this.canvas.add(textObject);
    this.canvas.setActiveObject(textObject);
    this.canvas.renderAll();
    return textObject;
  }

  addImage(imageUrl: string, options: {
    left?: number;
    top?: number;
    scaleX?: number;
    scaleY?: number;
  } = {}) {
    if (!this.canvas) return Promise.reject('Canvas not initialized');

    return new Promise((resolve, reject) => {
      Image.fromURL(imageUrl, { crossOrigin: 'anonymous' }).then((img: any) => {
        if (!img) {
          reject(new Error('Failed to load image'));
          return;
        }

        img.set({
          left: options.left || 100,
          top: options.top || 100,
          scaleX: options.scaleX || 1,
          scaleY: options.scaleY || 1,
        });

        this.canvas!.add(img);
        this.canvas!.setActiveObject(img);
        this.canvas!.renderAll();
        resolve(img);
      }).catch(reject);
    });
  }

  setBackgroundColor(color: string) {
    if (!this.canvas) return;
    this.canvas.backgroundColor = color;
    this.canvas.renderAll();
  }

  setBackgroundGradient(gradient: {
    type: 'linear' | 'radial';
    coords: { x1: number; y1: number; x2: number; y2: number };
    colorStops: Array<{ offset: number; color: string }>;
  }) {
    if (!this.canvas) return;

    const fabricGradient = new Gradient({
      type: gradient.type,
      coords: gradient.coords,
      colorStops: gradient.colorStops,
    });

    this.canvas.backgroundColor = fabricGradient;
    this.canvas.renderAll();
  }

  deleteSelected() {
    if (!this.canvas) return;
    const activeObjects = this.canvas.getActiveObjects();
    activeObjects.forEach(obj => this.canvas!.remove(obj));
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
  }

  duplicateSelected() {
    if (!this.canvas) return;
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) return;

    activeObject.clone().then((cloned: FabricObject) => {
      cloned.set({
        left: (cloned.left || 0) + 10,
        top: (cloned.top || 0) + 10,
      });
      this.canvas!.add(cloned);
      this.canvas!.setActiveObject(cloned);
      this.canvas!.renderAll();
    });
  }

  undo() {
    // Implement undo functionality
    // This would require maintaining a history stack
  }

  redo() {
    // Implement redo functionality
    // This would require maintaining a history stack
  }

  zoom(scale: number) {
    if (!this.canvas) return;
    this.canvas.setZoom(scale);
    this.canvas.renderAll();
  }

  getZoom(): number {
    return this.canvas?.getZoom() || 1;
  }

  fitToScreen() {
    if (!this.canvas || !this.container) return;
    
    const containerWidth = this.container.clientWidth - 32; // padding
    const containerHeight = this.container.clientHeight - 32;
    const canvasWidth = this.canvas.getWidth();
    const canvasHeight = this.canvas.getHeight();
    
    const scaleX = containerWidth / canvasWidth;
    const scaleY = containerHeight / canvasHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Don't zoom in more than 100%
    
    this.zoom(scale);
  }

  exportToJSON(): string {
    if (!this.canvas) return '{}';
    return JSON.stringify(this.canvas.toObject());
  }

  loadFromJSON(json: string): Promise<void> {
    if (!this.canvas) return Promise.reject('Canvas not initialized');

    return new Promise((resolve, reject) => {
      try {
        this.canvas!.loadFromJSON(JSON.parse(json)).then(() => {
          this.canvas!.renderAll();
          resolve();
        }).catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  exportToPNG(options: {
    format?: string;
    quality?: number;
    multiplier?: number;
  } = {}): string {
    if (!this.canvas) return '';
    
    return this.canvas.toDataURL({
      format: options.format || 'png',
      quality: options.quality || 1,
      multiplier: options.multiplier || 1,
    });
  }

  exportToSVG(): string {
    if (!this.canvas) return '';
    return this.canvas.toSVG();
  }

  getActiveObject(): FabricObject | null {
    return this.canvas?.getActiveObject() || null;
  }

  updateActiveObject(properties: any) {
    const activeObject = this.getActiveObject();
    if (activeObject) {
      activeObject.set(properties);
      this.canvas?.renderAll();
    }
  }

  dispose() {
    if (this.canvas) {
      this.canvas.dispose();
      this.canvas = null;
    }
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  getCanvas(): Canvas | null {
    return this.canvas;
  }
}
