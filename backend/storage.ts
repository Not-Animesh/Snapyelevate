import { type User, type InsertUser, type Project, type InsertProject, type Template, type InsertTemplate, type Asset, type InsertAsset, type Export, type InsertExport } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(id: string, customerId: string, subscriptionId?: string): Promise<User>;
  updateUserAIUsage(id: string, used: number): Promise<User>;
  updateUserPlan(id: string, plan: string, aiGenerationsLimit: number): Promise<User>;
  
  // Project operations
  getProject(id: string): Promise<Project | undefined>;
  getUserProjects(userId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: string): Promise<void>;
  
  // Template operations
  getTemplates(category?: string, isPremium?: boolean): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  
  // Asset operations
  getUserAssets(userId: string): Promise<Asset[]>;
  getProjectAssets(projectId: string): Promise<Asset[]>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  deleteAsset(id: string): Promise<void>;
  
  // Export operations
  getProjectExports(projectId: string): Promise<Export[]>;
  createExport(exportData: InsertExport): Promise<Export>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<string, Project>;
  private templates: Map<string, Template>;
  private assets: Map<string, Asset>;
  private exports: Map<string, Export>;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.templates = new Map();
    this.assets = new Map();
    this.exports = new Map();
    
    // Initialize with sample templates
    this.initializeSampleTemplates();
  }

  private initializeSampleTemplates() {
    const sampleTemplates: Template[] = [
      {
        id: randomUUID(),
        title: "Social Media Post",
        description: "Perfect for Instagram, Twitter, and Facebook content",
        category: "social-media",
        canvasData: {
          version: "5.3.0",
          objects: [
            {
              type: "rect",
              left: 0,
              top: 0,
              width: 1080,
              height: 1080,
              fill: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }
          ]
        },
        thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMF8xKSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzBfMSIgeDE9IjAiIHkxPSIwIiB4Mj0iMzAwIiB5Mj0iMzAwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiM2NjdFRUEiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNzY0QkEyIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+",
        width: 1080,
        height: 1080,
        isPremium: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Presentation Slide",
        description: "Professional slides for business presentations",
        category: "presentation",
        canvasData: {
          version: "5.3.0",
          objects: [
            {
              type: "rect",
              left: 0,
              top: 0,
              width: 1920,
              height: 1080,
              fill: "linear-gradient(135deg, #0072FF 0%, #00C6FF 100%)",
            }
          ]
        },
        thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE2OSIgdmlld0JveD0iMCAwIDMwMCAxNjkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTY5IiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMF8xKSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzBfMSIgeDE9IjAiIHkxPSIwIiB4Mj0iMzAwIiB5Mj0iMTY5IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiMwMDcyRkYiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDBDNkZGIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+",
        width: 1920,
        height: 1080,
        isPremium: false,
        createdAt: new Date(),
      },
    ];

    sampleTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      plan: "free",
      aiGenerationsUsed: 0,
      aiGenerationsLimit: 10,
      razorpayCustomerId: null,
      razorpaySubscriptionId: null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserStripeInfo(id: string, customerId: string, subscriptionId?: string): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { 
      ...user, 
      razorpayCustomerId: customerId,
      razorpaySubscriptionId: subscriptionId || user.razorpaySubscriptionId,
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserAIUsage(id: string, used: number): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, aiGenerationsUsed: used };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserPlan(id: string, plan: string, aiGenerationsLimit: number): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { 
      ...user, 
      plan,
      aiGenerationsLimit,
      aiGenerationsUsed: 0 // Reset usage on plan upgrade
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(project => project.userId === userId);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      ...insertProject,
      id,
      width: insertProject.width || 1920,
      height: insertProject.height || 1080,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project> {
    const project = this.projects.get(id);
    if (!project) throw new Error("Project not found");
    
    const updatedProject = { 
      ...project, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<void> {
    this.projects.delete(id);
  }

  async getTemplates(category?: string, isPremium?: boolean): Promise<Template[]> {
    let templates = Array.from(this.templates.values());
    
    if (category) {
      templates = templates.filter(t => t.category === category);
    }
    
    if (isPremium !== undefined) {
      templates = templates.filter(t => t.isPremium === isPremium);
    }
    
    return templates;
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = randomUUID();
    const template: Template = {
      ...insertTemplate,
      id,
      createdAt: new Date(),
    };
    this.templates.set(id, template);
    return template;
  }

  async getUserAssets(userId: string): Promise<Asset[]> {
    return Array.from(this.assets.values()).filter(asset => asset.userId === userId);
  }

  async getProjectAssets(projectId: string): Promise<Asset[]> {
    return Array.from(this.assets.values()).filter(asset => asset.projectId === projectId);
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const id = randomUUID();
    const asset: Asset = {
      ...insertAsset,
      projectId: insertAsset.projectId || null,
      id,
      createdAt: new Date(),
    };
    this.assets.set(id, asset);
    return asset;
  }

  async deleteAsset(id: string): Promise<void> {
    this.assets.delete(id);
  }

  async getProjectExports(projectId: string): Promise<Export[]> {
    return Array.from(this.exports.values()).filter(exp => exp.projectId === projectId);
  }

  async createExport(insertExport: InsertExport): Promise<Export> {
    const id = randomUUID();
    const exportData: Export = {
      ...insertExport,
      quality: insertExport.quality || "high",
      id,
      createdAt: new Date(),
    };
    this.exports.set(id, exportData);
    return exportData;
  }
}

export const storage = new MemStorage();
