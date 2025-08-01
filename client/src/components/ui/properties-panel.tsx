import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Move, 
  RotateCw, 
  Palette, 
  Type, 
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Copy,
  Trash2
} from "lucide-react";

interface PropertiesPanelProps {
  activeObject: any;
  onObjectUpdate?: (properties: any) => void;
}

export default function PropertiesPanel({ activeObject, onObjectUpdate }: PropertiesPanelProps) {
  const [properties, setProperties] = useState({
    left: 0,
    top: 0,
    width: 100,
    height: 100,
    scaleX: 1,
    scaleY: 1,
    angle: 0,
    opacity: 1,
    fill: "#3B82F6",
    stroke: "#000000",
    strokeWidth: 0,
    visible: true,
    selectable: true,
  });

  // Update properties when active object changes
  useEffect(() => {
    if (activeObject) {
      setProperties({
        left: Math.round(activeObject.left || 0),
        top: Math.round(activeObject.top || 0),
        width: Math.round((activeObject.width || 100) * (activeObject.scaleX || 1)),
        height: Math.round((activeObject.height || 100) * (activeObject.scaleY || 1)),
        scaleX: activeObject.scaleX || 1,
        scaleY: activeObject.scaleY || 1,
        angle: Math.round(activeObject.angle || 0),
        opacity: activeObject.opacity || 1,
        fill: activeObject.fill || "#3B82F6",
        stroke: activeObject.stroke || "#000000",
        strokeWidth: activeObject.strokeWidth || 0,
        visible: activeObject.visible !== false,
        selectable: activeObject.selectable !== false,
      });
    }
  }, [activeObject]);

  const handlePropertyChange = (key: string, value: any) => {
    const newProperties = { ...properties, [key]: value };
    setProperties(newProperties);
    
    // Apply changes to the canvas object
    if (onObjectUpdate) {
      onObjectUpdate({ [key]: value });
    }
  };

  const handleTransformChange = (key: string, value: number) => {
    let updateObject: any = {};
    
    if (key === "width" || key === "height") {
      // Calculate scale based on original dimensions
      if (activeObject) {
        const originalWidth = activeObject.width || 100;
        const originalHeight = activeObject.height || 100;
        
        if (key === "width") {
          updateObject.scaleX = value / originalWidth;
        } else {
          updateObject.scaleY = value / originalHeight;
        }
      }
    } else {
      updateObject[key] = value;
    }
    
    handlePropertyChange(key, value);
    if (onObjectUpdate) {
      onObjectUpdate(updateObject);
    }
  };

  const ColorPicker = ({ value, onChange, label }: { value: string; onChange: (color: string) => void; label: string }) => (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded border border-border cursor-pointer"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 text-xs font-mono"
        />
      </div>
    </div>
  );

  if (!activeObject) {
    return (
      <div className="w-80 h-full bg-muted/50 border-l border-border">
        <div className="p-6">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto">
              <Settings className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">No Selection</h3>
              <p className="text-sm text-muted-foreground">
                Select an object to edit its properties
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-muted/50 border-l border-border overflow-y-auto">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold flex items-center">
          <Settings className="w-4 h-4 mr-2" />
          Properties
        </h3>
      </div>
      
      <div className="p-4">
        <Tabs defaultValue="transform" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transform" className="text-xs">Transform</TabsTrigger>
            <TabsTrigger value="appearance" className="text-xs">Style</TabsTrigger>
            <TabsTrigger value="layers" className="text-xs">Layers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transform" className="space-y-6 mt-4">
            {/* Position */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Position</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">X</Label>
                  <Input
                    type="number"
                    value={properties.left}
                    onChange={(e) => handleTransformChange("left", parseFloat(e.target.value) || 0)}
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Y</Label>
                  <Input
                    type="number"
                    value={properties.top}
                    onChange={(e) => handleTransformChange("top", parseFloat(e.target.value) || 0)}
                    className="text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Size */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Size</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Width</Label>
                  <Input
                    type="number"
                    value={properties.width}
                    onChange={(e) => handleTransformChange("width", parseFloat(e.target.value) || 0)}
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Height</Label>
                  <Input
                    type="number"
                    value={properties.height}
                    onChange={(e) => handleTransformChange("height", parseFloat(e.target.value) || 0)}
                    className="text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Rotation */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Rotation</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RotateCw className="w-4 h-4 text-muted-foreground" />
                  <Slider
                    value={[properties.angle]}
                    onValueChange={([value]) => handleTransformChange("angle", value)}
                    min={-180}
                    max={180}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-8">{properties.angle}°</span>
                </div>
              </div>
            </div>

            {/* Opacity */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Opacity</Label>
              <div className="space-y-2">
                <Slider
                  value={[properties.opacity * 100]}
                  onValueChange={([value]) => handlePropertyChange("opacity", value / 100)}
                  min={0}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <div className="text-xs text-muted-foreground text-center">
                  {Math.round(properties.opacity * 100)}%
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6 mt-4">
            {/* Fill Color */}
            {activeObject.type !== "image" && (
              <ColorPicker
                value={properties.fill}
                onChange={(color) => handlePropertyChange("fill", color)}
                label="Fill Color"
              />
            )}

            {/* Stroke */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Stroke</Label>
              <ColorPicker
                value={properties.stroke}
                onChange={(color) => handlePropertyChange("stroke", color)}
                label="Color"
              />
              <div>
                <Label className="text-xs text-muted-foreground">Width</Label>
                <Slider
                  value={[properties.strokeWidth]}
                  onValueChange={([value]) => handlePropertyChange("strokeWidth", value)}
                  min={0}
                  max={20}
                  step={1}
                  className="mt-2"
                />
                <div className="text-xs text-muted-foreground text-center mt-1">
                  {properties.strokeWidth}px
                </div>
              </div>
            </div>

            {/* Text Properties (if text object) */}
            {activeObject.type === "text" && (
              <>
                <Separator />
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Typography</Label>
                  <div>
                    <Label className="text-xs text-muted-foreground">Font Family</Label>
                    <Select
                      value={activeObject.fontFamily || "Inter"}
                      onValueChange={(value) => handlePropertyChange("fontFamily", value)}
                    >
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Helvetica">Helvetica</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Font Size</Label>
                    <Input
                      type="number"
                      value={activeObject.fontSize || 20}
                      onChange={(e) => handlePropertyChange("fontSize", parseFloat(e.target.value) || 20)}
                      className="text-xs"
                    />
                  </div>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="layers" className="space-y-6 mt-4">
            {/* Layer Controls */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Layer Order</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  Bring Forward
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Send Backward
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Bring to Front
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Send to Back
                </Button>
              </div>
            </div>

            <Separator />

            {/* Visibility and Lock */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Layer Properties</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Visible</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handlePropertyChange("visible", !properties.visible)}
                  >
                    {properties.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Locked</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handlePropertyChange("selectable", !properties.selectable)}
                  >
                    {properties.selectable ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Actions</Label>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <Copy className="w-3 h-3 mr-2" />
                  Duplicate
                </Button>
                <Button variant="destructive" size="sm" className="w-full text-xs">
                  <Trash2 className="w-3 h-3 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
