export interface ExportOptions {
  format: "png" | "jpg" | "svg" | "pdf";
  quality?: number;
  width?: number;
  height?: number;
  scale?: number;
  backgroundColor?: string;
}

export class ExportService {
  static async downloadFile(dataUrl: string, filename: string, format: string): Promise<void> {
    try {
      let finalDataUrl = dataUrl;
      
      // Convert data URL to blob for better browser support
      if (dataUrl.startsWith("data:")) {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        finalDataUrl = URL.createObjectURL(blob);
      }
      
      // Create download link
      const link = document.createElement("a");
      link.href = finalDataUrl;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up object URL
      if (finalDataUrl.startsWith("blob:")) {
        URL.revokeObjectURL(finalDataUrl);
      }
    } catch (error) {
      console.error("Download failed:", error);
      throw new Error("Failed to download file");
    }
  }

  static async exportToPDF(canvas: HTMLCanvasElement, options: ExportOptions = {}): Promise<string> {
    // For PDF export, we'd use a library like jsPDF
    // For now, we'll export as PNG and let the user handle PDF conversion
    return new Promise((resolve, reject) => {
      try {
        const dataUrl = canvas.toDataURL("image/png", options.quality || 1);
        resolve(dataUrl);
      } catch (error) {
        reject(error);
      }
    });
  }

  static getOptimalDimensions(originalWidth: number, originalHeight: number, targetFormat: string) {
    const aspectRatio = originalWidth / originalHeight;
    
    switch (targetFormat) {
      case "instagram-post":
        return { width: 1080, height: 1080 };
      case "instagram-story":
        return { width: 1080, height: 1920 };
      case "facebook-post":
        return { width: 1200, height: 630 };
      case "twitter-post":
        return { width: 1200, height: 675 };
      case "linkedin-post":
        return { width: 1200, height: 627 };
      case "youtube-thumbnail":
        return { width: 1280, height: 720 };
      case "presentation-slide":
        return { width: 1920, height: 1080 };
      case "print-a4":
        return { width: 2480, height: 3508 }; // 300 DPI A4
      case "print-letter":
        return { width: 2550, height: 3300 }; // 300 DPI Letter
      default:
        return { width: originalWidth, height: originalHeight };
    }
  }

  static async compressImage(dataUrl: string, quality: number = 0.8): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.drawImage(img, 0, 0);
        
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };
      
      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
      
      img.src = dataUrl;
    });
  }

  static async addWatermark(dataUrl: string, watermarkText: string = "Created with Snapy"): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Add watermark
        const fontSize = Math.max(12, Math.min(img.width / 40, img.height / 40));
        ctx.font = `${fontSize}px Inter, sans-serif`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
        ctx.lineWidth = 1;
        
        const padding = fontSize;
        const textWidth = ctx.measureText(watermarkText).width;
        const x = img.width - textWidth - padding;
        const y = img.height - padding;
        
        ctx.strokeText(watermarkText, x, y);
        ctx.fillText(watermarkText, x, y);
        
        const watermarkedDataUrl = canvas.toDataURL("image/png");
        resolve(watermarkedDataUrl);
      };
      
      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
      
      img.src = dataUrl;
    });
  }

  static getExportFormats() {
    return [
      {
        id: "png",
        name: "PNG",
        description: "High quality with transparency",
        extension: ".png",
        mimeType: "image/png",
        supportsTransparency: true,
        bestFor: ["logos", "graphics", "screenshots"]
      },
      {
        id: "jpg",
        name: "JPG",
        description: "Compressed for smaller file size",
        extension: ".jpg",
        mimeType: "image/jpeg",
        supportsTransparency: false,
        bestFor: ["photos", "social media", "web"]
      },
      {
        id: "svg",
        name: "SVG",
        description: "Vector format, scalable",
        extension: ".svg",
        mimeType: "image/svg+xml",
        supportsTransparency: true,
        bestFor: ["logos", "icons", "print"]
      },
      {
        id: "pdf",
        name: "PDF",
        description: "Print-ready document",
        extension: ".pdf",
        mimeType: "application/pdf",
        supportsTransparency: false,
        bestFor: ["documents", "print", "sharing"]
      }
    ];
  }

  static getSocialMediaFormats() {
    return [
      {
        id: "instagram-post",
        name: "Instagram Post",
        dimensions: "1080 × 1080",
        aspectRatio: "1:1"
      },
      {
        id: "instagram-story",
        name: "Instagram Story",
        dimensions: "1080 × 1920",
        aspectRatio: "9:16"
      },
      {
        id: "facebook-post",
        name: "Facebook Post",
        dimensions: "1200 × 630",
        aspectRatio: "1.91:1"
      },
      {
        id: "twitter-post",
        name: "Twitter Post",
        dimensions: "1200 × 675",
        aspectRatio: "16:9"
      },
      {
        id: "linkedin-post",
        name: "LinkedIn Post",
        dimensions: "1200 × 627",
        aspectRatio: "1.91:1"
      },
      {
        id: "youtube-thumbnail",
        name: "YouTube Thumbnail",
        dimensions: "1280 × 720",
        aspectRatio: "16:9"
      }
    ];
  }
}
