import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/ui/sidebar";
import Canvas from "@/components/ui/canvas";
import PropertiesPanel from "@/components/ui/properties-panel";
import { useCanvas } from "@/hooks/use-canvas";
import { useProject, useCreateProject, useUpdateProject } from "@/hooks/use-projects";
import { ExportService } from "@/lib/export-service";
import { 
  ArrowLeft, 
  Save, 
  Download, 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Share,
  Settings
} from "lucide-react";

export default function Editor() {
  const { projectId } = useParams<{ projectId?: string }>();
  const [projectTitle, setProjectTitle] = useState("Untitled Project");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Canvas hook
  const {
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
    zoomIn,
    zoomOut,
    fitToScreen,
    updateActiveObject,
    exportToJSON,
    loadFromJSON,
    exportToPNG,
    exportToSVG,
  } = useCanvas("canvas-container", 1920, 1080);

  // Project data
  const { data: project, isLoading: projectLoading } = useProject(projectId || "");
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject(projectId || "");

  // Load project data when available
  useEffect(() => {
    if (project?.project && !projectLoading) {
      setProjectTitle(project.project.title);
      if (project.project.canvasData) {
        loadFromJSON(JSON.stringify(project.project.canvasData));
      }
    }
  }, [project, projectLoading, loadFromJSON]);

  // Auto-save functionality
  useEffect(() => {
    if (!projectId) return;

    const autoSaveInterval = setInterval(() => {
      handleSave(true);
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [projectId]);

  const handleSave = async (isAutoSave = false) => {
    setIsSaving(true);
    
    try {
      const canvasData = JSON.parse(exportToJSON());
      const thumbnail = exportToPNG({ multiplier: 0.2 }); // Low-res thumbnail

      if (projectId) {
        // Update existing project
        await updateProjectMutation.mutateAsync({
          title: projectTitle,
          canvasData,
          thumbnail,
          updatedAt: new Date(),
        });
      } else {
        // Create new project
        const newProject = await createProjectMutation.mutateAsync({
          title: projectTitle,
          canvasData,
          thumbnail,
          width: 1920,
          height: 1080,
          isPublic: false,
          userId: "user-1", // This would come from auth context in real app
        });
        
        // Update URL with new project ID
        window.history.replaceState(null, "", `/editor/${newProject.project.id}`);
      }

      if (!isAutoSave) {
        toast({
          title: "Project saved",
          description: "Your project has been saved successfully.",
        });
      }
    } catch (error) {
      console.error("Save error:", error);
      if (!isAutoSave) {
        toast({
          title: "Save failed",
          description: "Failed to save your project. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async (format: "png" | "jpg" | "svg" | "pdf") => {
    try {
      let exportData: string;
      let filename: string;
      
      switch (format) {
        case "png":
          exportData = exportToPNG({ format: "png", quality: 1, multiplier: 2 });
          filename = `${projectTitle}.png`;
          break;
        case "jpg":
          exportData = exportToPNG({ format: "jpeg", quality: 0.9, multiplier: 2 });
          filename = `${projectTitle}.jpg`;
          break;
        case "svg":
          exportData = exportToSVG();
          filename = `${projectTitle}.svg`;
          break;
        case "pdf":
          // For PDF, we'd use a library like jsPDF
          exportData = exportToPNG({ format: "png", quality: 1, multiplier: 2 });
          filename = `${projectTitle}.pdf`;
          break;
        default:
          throw new Error("Unsupported format");
      }

      await ExportService.downloadFile(exportData, filename, format);
      
      toast({
        title: "Export successful",
        description: `Your design has been exported as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "Failed to export your design. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToolSelect = (tool: string) => {
    setTool(tool as any);
  };

  const handleAddShape = (shape: string) => {
    switch (shape) {
      case "rectangle":
        addRectangle();
        break;
      case "circle":
        addCircle();
        break;
      case "text":
        addText("Double-click to edit");
        break;
    }
  };

  const handleImageGenerated = async (imageUrl: string) => {
    try {
      await addImage(imageUrl);
      toast({
        title: "Image added",
        description: "AI-generated image has been added to your canvas.",
      });
    } catch (error) {
      console.error("Error adding image:", error);
      toast({
        title: "Failed to add image",
        description: "Could not add the generated image to canvas.",
        variant: "destructive",
      });
    }
  };

  const handleBackgroundGenerated = (gradientData: any) => {
    if (gradientData.css) {
      setBackgroundGradient({
        type: "linear",
        coords: { x1: 0, y1: 0, x2: 1920, y2: 1080 },
        colorStops: [
          { offset: 0, color: "#3B82F6" },
          { offset: 1, color: "#8B5CF6" }
        ]
      });
    }
  };

  const handleGradientSelect = (gradient: string) => {
    if (gradient.startsWith("linear-gradient")) {
      // Parse gradient and apply
      setBackgroundGradient({
        type: "linear",
        coords: { x1: 0, y1: 0, x2: 1920, y2: 1080 },
        colorStops: [
          { offset: 0, color: "#3B82F6" },
          { offset: 1, color: "#8B5CF6" }
        ]
      });
    } else {
      // Solid color
      setBackgroundColor(gradient);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            handleSave();
            break;
          case "z":
            e.preventDefault();
            if (e.shiftKey) {
              // Redo
              console.log("Redo");
            } else {
              // Undo
              console.log("Undo");
            }
            break;
          case "d":
            e.preventDefault();
            duplicateSelected();
            break;
        }
      } else {
        switch (e.key) {
          case "Delete":
          case "Backspace":
            deleteSelected();
            break;
          case "Escape":
            setTool("select");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, deleteSelected, duplicateSelected, setTool]);

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <Input
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="text-lg font-semibold border-none bg-transparent p-0 h-auto focus-visible:ring-0"
                onBlur={() => handleSave(true)}
              />
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{isSaving ? "Saving..." : "Auto-saved"}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Redo className="w-4 h-4" />
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <Button variant="ghost" size="icon" onClick={zoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[4rem] text-center">
              {Math.round(canvasState.zoom * 100)}%
            </span>
            <Button variant="ghost" size="icon" onClick={zoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={fitToScreen}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <Button variant="ghost" onClick={() => handleSave()}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="ghost">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <div className="relative group">
              <Button className="btn-gradient">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="p-2 space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleExport("png")}
                  >
                    PNG (High Quality)
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleExport("jpg")}
                  >
                    JPG (Compressed)
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleExport("svg")}
                  >
                    SVG (Vector)
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleExport("pdf")}
                  >
                    PDF (Print)
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <Sidebar
          selectedTool={canvasState.selectedTool}
          onToolSelect={handleToolSelect}
          onAddShape={handleAddShape}
          onImageGenerated={handleImageGenerated}
          onBackgroundGenerated={handleBackgroundGenerated}
          onGradientSelect={handleGradientSelect}
          projectId={projectId}
        />

        {/* Canvas Area */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-900 relative">
          <Canvas
            canvasId="canvas-container"
            zoom={canvasState.zoom}
            onZoomChange={(zoom) => console.log("Zoom changed:", zoom)}
          />
        </div>

        {/* Right Properties Panel */}
        <PropertiesPanel
          activeObject={canvasState.activeObject}
          onObjectUpdate={updateActiveObject}
        />
      </div>
    </div>
  );
}
