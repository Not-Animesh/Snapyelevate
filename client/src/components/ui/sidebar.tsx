import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import AIGenerator from "./ai-generator";
import GradientSelector from "./gradient-selector";
import { 
  MousePointer, 
  Square, 
  Circle, 
  Type, 
  Upload, 
  Image,
  Sparkles,
  Palette,
  Layers
} from "lucide-react";

interface SidebarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  onAddShape?: (shape: string) => void;
  onImageGenerated?: (imageUrl: string) => void;
  onBackgroundGenerated?: (gradient: any) => void;
  onGradientSelect?: (gradient: string) => void;
  projectId?: string;
}

export default function Sidebar({ 
  selectedTool, 
  onToolSelect, 
  onAddShape,
  onImageGenerated,
  onBackgroundGenerated,
  onGradientSelect,
  projectId 
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState("tools");

  const tools = [
    { id: "select", label: "Select", icon: MousePointer },
    { id: "rectangle", label: "Rectangle", icon: Square },
    { id: "circle", label: "Circle", icon: Circle },
    { id: "text", label: "Text", icon: Type },
  ];

  const handleToolClick = (toolId: string) => {
    onToolSelect(toolId);
    if (toolId !== "select") {
      onAddShape?.(toolId);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageGenerated?.(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-80 h-full bg-muted/50 border-r border-border">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="flex border-b border-border">
          <TabsList className="grid w-full grid-cols-3 bg-transparent">
            <TabsTrigger value="tools" className="text-xs">Tools</TabsTrigger>
            <TabsTrigger value="assets" className="text-xs">Assets</TabsTrigger>
            <TabsTrigger value="ai" className="text-xs">AI</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <TabsContent value="tools" className="mt-0 space-y-4">
            {/* Basic Tools */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Basic Tools</h4>
              <div className="grid grid-cols-4 gap-2">
                {tools.map((tool) => (
                  <Button
                    key={tool.id}
                    variant={selectedTool === tool.id ? "default" : "outline"}
                    size="sm"
                    className="aspect-square p-0 flex flex-col items-center justify-center"
                    onClick={() => handleToolClick(tool.id)}
                    title={tool.label}
                  >
                    <tool.icon className="w-4 h-4" />
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Background Selector */}
            <GradientSelector onGradientSelect={onGradientSelect} />

            <Separator />

            {/* Upload Section */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Upload</h4>
              <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      Drop files here or click to upload
                    </p>
                  </label>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assets" className="mt-0 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Recent Assets</h4>
              <div className="grid grid-cols-2 gap-2">
                {/* Placeholder for user assets */}
                <Card className="aspect-square bg-muted flex items-center justify-center">
                  <Image className="w-6 h-6 text-muted-foreground" />
                </Card>
                <Card className="aspect-square bg-muted flex items-center justify-center">
                  <Image className="w-6 h-6 text-muted-foreground" />
                </Card>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Stock Images</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Browse thousands of high-quality stock images
              </p>
              <Button variant="outline" className="w-full" size="sm">
                <Image className="w-4 h-4 mr-2" />
                Browse Images
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="mt-0">
            <AIGenerator
              onImageGenerated={onImageGenerated}
              onBackgroundGenerated={onBackgroundGenerated}
              projectId={projectId}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
