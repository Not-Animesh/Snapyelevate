import { apiRequest } from "./queryClient";

export interface AIGenerationOptions {
  prompt: string;
  style?: string;
  size?: "1024x1024" | "1792x1024" | "1024x1792";
  projectId?: string;
}

export interface AIBackgroundOptions {
  prompt: string;
  style?: string;
}

export interface AIGenerationResult {
  asset: {
    id: string;
    url: string;
    filename: string;
    type: string;
    aiPrompt: string;
  };
  imageUrl: string;
  remainingGenerations: number;
}

export interface AIBackgroundResult {
  gradientData: {
    css?: string;
    colors?: string[];
    type?: string;
  };
}

export class AIService {
  static async generateImage(options: AIGenerationOptions): Promise<AIGenerationResult> {
    try {
      const response = await apiRequest("POST", "/api/ai/generate-image", {
        prompt: options.prompt,
        style: options.style,
        size: options.size || "1024x1024",
        projectId: options.projectId,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate image");
      }

      return await response.json();
    } catch (error: any) {
      console.error("AI Image Generation Error:", error);
      throw new Error(error.message || "Failed to generate image");
    }
  }

  static async generateBackground(options: AIBackgroundOptions): Promise<AIBackgroundResult> {
    try {
      const response = await apiRequest("POST", "/api/ai/generate-background", {
        prompt: options.prompt,
        style: options.style,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate background");
      }

      return await response.json();
    } catch (error: any) {
      console.error("AI Background Generation Error:", error);
      throw new Error(error.message || "Failed to generate background");
    }
  }

  static getStylePresets(): Array<{ name: string; value: string; description: string }> {
    return [
      {
        name: "Professional",
        value: "professional, clean, modern",
        description: "Clean and professional design style"
      },
      {
        name: "Creative",
        value: "creative, artistic, vibrant",
        description: "Artistic and creative visual style"
      },
      {
        name: "Minimalist",
        value: "minimalist, simple, elegant",
        description: "Simple and elegant minimal design"
      },
      {
        name: "Bold",
        value: "bold, striking, dramatic",
        description: "Bold and dramatic visual impact"
      },
      {
        name: "Gradient",
        value: "gradient, colorful, smooth",
        description: "Beautiful gradient backgrounds"
      },
      {
        name: "Abstract",
        value: "abstract, geometric, modern",
        description: "Abstract geometric patterns"
      }
    ];
  }

  static getSizePresets(): Array<{ name: string; value: AIGenerationOptions['size']; dimensions: string }> {
    return [
      {
        name: "Square",
        value: "1024x1024",
        dimensions: "1024 × 1024"
      },
      {
        name: "Landscape",
        value: "1792x1024",
        dimensions: "1792 × 1024"
      },
      {
        name: "Portrait",
        value: "1024x1792",
        dimensions: "1024 × 1792"
      }
    ];
  }

  static formatPrompt(userPrompt: string, style?: string): string {
    let prompt = userPrompt.trim();
    
    // Add style if provided
    if (style) {
      prompt += `, ${style}`;
    }
    
    // Add quality modifiers for better results
    prompt += ", high quality, detailed, professional";
    
    return prompt;
  }

  static validatePrompt(prompt: string): { isValid: boolean; error?: string } {
    if (!prompt || prompt.trim().length === 0) {
      return { isValid: false, error: "Prompt cannot be empty" };
    }
    
    if (prompt.length > 1000) {
      return { isValid: false, error: "Prompt is too long (max 1000 characters)" };
    }
    
    // Check for inappropriate content (basic filter)
    const inappropriateWords = ['nsfw', 'explicit', 'gore', 'violence'];
    const lowerPrompt = prompt.toLowerCase();
    
    for (const word of inappropriateWords) {
      if (lowerPrompt.includes(word)) {
        return { isValid: false, error: "Prompt contains inappropriate content" };
      }
    }
    
    return { isValid: true };
  }
}
