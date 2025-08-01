import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import Razorpay from "razorpay";
import { z } from "zod";
import { insertProjectSchema, insertAssetSchema, insertExportSchema, insertUserSchema } from "@shared/schema";

// Initialize OpenAI
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "your-openai-api-key-here" 
});

// Initialize Razorpay with demo keys (replace with real keys for production)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_1DP5mmOlF5G5ag",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "thisissecretkey",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware (simplified for demo)
  const requireAuth = (req: any, res: any, next: any) => {
    // In a real app, this would validate JWT tokens
    // For demo purposes, we'll use a simple user simulation
    if (!req.headers.authorization) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    // Mock user based on auth header
    req.user = {
      id: "user-1",
      username: "demo-user",
      email: "demo@example.com",
      plan: "pro"
    };
    next();
  };

  // User routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/user/profile", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Project routes
  app.get("/api/projects", requireAuth, async (req: any, res) => {
    try {
      const projects = await storage.getUserProjects(req.user.id);
      res.json({ projects });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/projects", requireAuth, async (req: any, res) => {
    try {
      const projectData = insertProjectSchema.parse({
        ...req.body,
        userId: req.user.id,
      });
      const project = await storage.createProject(projectData);
      res.json({ project });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/projects/:id", requireAuth, async (req: any, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project || project.userId !== req.user.id) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json({ project });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/projects/:id", requireAuth, async (req: any, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project || project.userId !== req.user.id) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      const updates = req.body;
      delete updates.userId; // Prevent changing ownership
      
      const updatedProject = await storage.updateProject(req.params.id, updates);
      res.json({ project: updatedProject });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/projects/:id", requireAuth, async (req: any, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project || project.userId !== req.user.id) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      await storage.deleteProject(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Template routes
  app.get("/api/templates", async (req, res) => {
    try {
      const { category, isPremium } = req.query;
      const templates = await storage.getTemplates(
        category as string,
        isPremium === "true"
      );
      res.json({ templates });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const template = await storage.getTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.json({ template });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // AI Generation routes
  app.post("/api/ai/generate-image", requireAuth, async (req: any, res) => {
    try {
      const { prompt, style, size = "1024x1024" } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      // Check AI usage limits
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.aiGenerationsUsed >= user.aiGenerationsLimit) {
        return res.status(403).json({ error: "AI generation limit reached" });
      }

      // Generate image using OpenAI DALL-E
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: style ? `${prompt}, in ${style} style` : prompt,
        n: 1,
        size: size as "1024x1024" | "1792x1024" | "1024x1792",
        quality: "standard",
      });

      const imageUrl = response.data[0].url;
      
      // Update user's AI usage
      await storage.updateUserAIUsage(req.user.id, user.aiGenerationsUsed + 1);
      
      // Create asset record
      const asset = await storage.createAsset({
        userId: req.user.id,
        projectId: req.body.projectId || null,
        filename: `ai-generated-${Date.now()}.png`,
        url: imageUrl!,
        type: "ai-generated",
        size: 0, // We don't know the size without downloading
        aiPrompt: prompt,
      });

      res.json({ 
        asset,
        imageUrl,
        remainingGenerations: user.aiGenerationsLimit - user.aiGenerationsUsed - 1
      });
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ error: "Failed to generate image: " + error.message });
    }
  });

  app.post("/api/ai/generate-background", requireAuth, async (req: any, res) => {
    try {
      const { prompt, style } = req.body;
      
      // Generate background pattern or gradient description
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a design expert. Generate CSS gradient or pattern specifications based on user prompts. Respond with JSON containing gradient CSS."
          },
          {
            role: "user",
            content: `Create a beautiful background gradient for: ${prompt}${style ? ` in ${style} style` : ''}`
          }
        ],
        response_format: { type: "json_object" },
      });

      const gradientData = JSON.parse(response.choices[0].message.content || "{}");
      
      res.json({ gradientData });
    } catch (error: any) {
      console.error("Background Generation Error:", error);
      res.status(500).json({ error: "Failed to generate background: " + error.message });
    }
  });

  // Asset routes
  app.get("/api/assets", requireAuth, async (req: any, res) => {
    try {
      const assets = await storage.getUserAssets(req.user.id);
      res.json({ assets });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/assets", requireAuth, async (req: any, res) => {
    try {
      const assetData = insertAssetSchema.parse({
        ...req.body,
        userId: req.user.id,
      });
      const asset = await storage.createAsset(assetData);
      res.json({ asset });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Export routes
  app.post("/api/exports", requireAuth, async (req: any, res) => {
    try {
      const exportData = insertExportSchema.parse({
        ...req.body,
        userId: req.user.id,
      });
      
      // In a real implementation, this would generate the actual file
      const mockUrl = `https://snapy-exports.s3.amazonaws.com/${exportData.projectId}-${Date.now()}.${exportData.format}`;
      
      const exportRecord = await storage.createExport({
        ...exportData,
        url: mockUrl,
        size: 1024 * 1024, // Mock 1MB file size
      });
      
      res.json({ export: exportRecord });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", requireAuth, async (req: any, res) => {
    try {
      const projects = await storage.getUserProjects(req.user.id);
      const assets = await storage.getUserAssets(req.user.id);
      const user = await storage.getUser(req.user.id);
      
      const stats = {
        totalProjects: projects.length,
        aiGenerated: assets.filter(a => a.type === "ai-generated").length,
        templatesUsed: projects.filter(p => p.description?.includes("template")).length,
        exports: 0, // Would count from exports table
        aiGenerationsUsed: user?.aiGenerationsUsed || 0,
        aiGenerationsLimit: user?.aiGenerationsLimit || 10,
      };
      
      res.json({ stats });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Razorpay payment routes
  app.post("/api/payment/create-order", requireAuth, async (req: any, res) => {
    try {
      const { amount, currency = "INR", plan } = req.body;
      
      const options = {
        amount: amount * 100, // amount in smallest currency unit (paise for INR)
        currency,
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1
      };

      const order = await razorpay.orders.create(options);
      
      res.json({ 
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID || "rzp_test_1DP5mmOlF5G5ag"
      });
    } catch (error: any) {
      console.error("Razorpay order creation error:", error);
      res.status(500).json({ error: "Failed to create order: " + error.message });
    }
  });

  app.post("/api/payment/verify", requireAuth, async (req: any, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;
      
      // In a real implementation, you should verify the signature
      // const crypto = require('crypto');
      // const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
      // hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
      // const generated_signature = hmac.digest('hex');
      
      // For demo purposes, we'll assume payment is successful
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update user plan based on payment
      const planLimits = {
        free: { aiGenerationsLimit: 10 },
        pro: { aiGenerationsLimit: 100 },
        enterprise: { aiGenerationsLimit: 1000 }
      };

      await storage.updateUserPlan(req.user.id, plan, planLimits[plan as keyof typeof planLimits]?.aiGenerationsLimit || 10);
      
      res.json({ 
        success: true,
        message: `Payment successful! Upgraded to ${plan} plan.`,
        plan
      });
    } catch (error: any) {
      console.error("Payment verification error:", error);
      res.status(500).json({ error: "Payment verification failed: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
