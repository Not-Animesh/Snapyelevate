'use client';

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MousePointer2,
  Square,
  Circle,
  Type,
  Image as ImageIcon,
  Sparkles,
  Palette,
  LayoutTemplate,
  FileImage,
  Upload,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Mock data for demonstration
const mockShapes = [
  { name: "Rectangle", icon: Square, tool: "rectangle" },
  { name: "Circle", icon: Circle, tool: "circle" },
  { name: "Text", icon: Type, tool: "text" },
];

const mockTemplates = [
  { id: "1", name: "Business Card" },
  { id: "2", name: "Social Post" },
  { id: "3", name: "Poster" },
];

const mockAssets = [
  { id: "1", type: "image", url: "https://placehold.co/100x100/A699EF/ffffff?text=Image+1" },
  { id: "2", type: "image", url: "https://placehold.co/100x100/5E56B6/ffffff?text=Image+2" },
  { id: "3", type: "image", url: "https://placehold.co/100x100/A699EF/ffffff?text=AI+Gen+1" },
];

interface EditorSidebarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  onAddShape: (shape: string) => void;
  onImageGenerated: (url: string) => void;
  onGradientSelect: (gradient: string) => void;
  projectId: string;
}

export default function EditorSidebar({ 
  selectedTool,
  onToolSelect,
  onAddShape,
  onImageGenerated,
  onGradientSelect,
  projectId
}: EditorSidebarProps) {
  const [activeTab, setActiveTab] = useState("tools");
  const [aiPrompt, setAiPrompt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAiGenerate = () => {
    if (aiPrompt) {
      console.log("Generating with AI:", aiPrompt);
      // In a real app, this would trigger an API call to the backend
      // For now, we'll simulate a generated image
      onImageGenerated(`https://placehold.co/400x300/A699EF/ffffff?text=AI+Generated`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageGenerated(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-72 border-r border-border/40 bg-background flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        {/* Tabs for sections */}
        <div className="p-4 border-b border-border/40">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tools" className="text-xs">
              <Palette className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="assets" className="text-xs">
              <FileImage className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="ai" className="text-xs">
              <Sparkles className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="templates" className="text-xs">
              <LayoutTemplate className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Scrollable Content Area */}
        <ScrollArea className="flex-1 custom-scrollbar">
          <div className="p-4">
            {/* Tools Tab */}
            <TabsContent value="tools" className="mt-0 space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Tools</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={selectedTool === "select" ? "default" : "outline"}
                    className="h-12 flex flex-col space-y-1"
                    size="sm"
                    onClick={() => onToolSelect("select")}
                  >
                    <MousePointer2 className="h-4 w-4" />
                    <span className="text-xs">Select</span>
                  </Button>
                  {mockShapes.map((shape) => (
                    <Button
                      key={shape.name}
                      variant={selectedTool === shape.tool ? "default" : "outline"}
                      className="h-12 flex flex-col space-y-1"
                      size="sm"
                      onClick={() => onAddShape(shape.tool)}
                    >
                      <shape.icon className="h-4 w-4" />
                      <span className="text-xs">{shape.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Backgrounds</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div 
                    className="h-16 rounded-md cursor-pointer hover:scale-[1.02] transition-transform duration-200" 
                    style={{ background: "#ffffff", border: "1px solid hsl(var(--border))" }}
                    onClick={() => onGradientSelect("#ffffff")}
                  ></div>
                  <div 
                    className="h-16 rounded-md cursor-pointer hover:scale-[1.02] transition-transform duration-200" 
                    style={{ background: "linear-gradient(to top right, hsl(var(--primary)), hsl(var(--accent)))" }}
                    onClick={() => onGradientSelect("linear-gradient(to top right, #6A057A, #A60064)")}
                  ></div>
                  {/* More custom gradient backgrounds would be added here */}
                </div>
              </div>
            </TabsContent>

            {/* Assets Tab */}
            <TabsContent value="assets" className="mt-0 space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Upload</h3>
                <Card 
                  className="border-dashed border-2 cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <CardContent className="p-6 text-center">
                    <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drag images here or click to browse
                    </p>
                    <Input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleFileUpload}
                    />
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Your Assets</h3>
                <div className="grid grid-cols-2 gap-2">
                  {mockAssets.map((asset) => (
                    <Card 
                      key={asset.id} 
                      className="cursor-pointer hover:bg-accent transition-colors aspect-square"
                      onClick={() => onImageGenerated(asset.url)}
                    >
                      <CardContent className="p-2 h-full">
                        <div className="w-full h-full rounded overflow-hidden">
                          <img src={asset.url} alt="Asset" className="w-full h-full object-cover" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* AI Generation Tab */}
            <TabsContent value="ai" className="mt-0 space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">AI Generator</h3>
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="text-center">
                      <Sparkles className="h-12 w-12 mx-auto mb-3 text-primary" />
                      <h4 className="font-medium mb-2">Generate with AI</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Describe what you want to create and AI will generate it for you.
                      </p>
                    </div>
                    <Input 
                      placeholder="e.g., A minimalist logo of a star"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                    />
                    <Button 
                      className="w-full"
                      onClick={handleAiGenerate}
                      disabled={!aiPrompt}
                    >
                      Start Generating
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="mt-0 space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Templates</h3>
                <div className="grid grid-cols-1 gap-3">
                  {mockTemplates.map((template) => (
                    <Card 
                      key={template.id} 
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => console.log("Loading template:", template.id)}
                    >
                      <CardContent className="p-3">
                        <div className="aspect-[3/2] bg-gradient-to-br from-primary/10 to-blue-500/10 rounded mb-2 flex items-center justify-center">
                          <LayoutTemplate className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-sm font-medium">{template.name}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
