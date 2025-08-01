'use client';

import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Settings,
  Layers,
  Palette,
  Type,
  Move,
  RotateCw,
  Eye,
  Lock,
} from "lucide-react";

interface EditorPropertiesPanelProps {
  activeObject: any; // The currently selected object from Fabric.js
  onObjectUpdate: (properties: any) => void;
}

export default function EditorPropertiesPanel({ activeObject, onObjectUpdate }: EditorPropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState("properties");
  const [objectProperties, setObjectProperties] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    rotation: 0,
    fill: "#000000",
    stroke: "#000000",
    strokeWidth: 0,
    opacity: 100,
    fontSize: 16,
    fontFamily: "Inter",
  });

  useEffect(() => {
    if (activeObject) {
      setObjectProperties({
        x: Math.round(activeObject.left),
        y: Math.round(activeObject.top),
        width: Math.round(activeObject.getScaledWidth()),
        height: Math.round(activeObject.getScaledHeight()),
        rotation: Math.round(activeObject.angle),
        fill: activeObject.fill || "#000000",
        stroke: activeObject.stroke || "#000000",
        strokeWidth: activeObject.strokeWidth || 0,
        opacity: Math.round(activeObject.opacity * 100),
        fontSize: activeObject.fontSize || 16,
        fontFamily: activeObject.fontFamily || "Inter",
      });
    }
  }, [activeObject]);

  const handlePropertyChange = (key: string, value: any) => {
    const newProperties = { ...objectProperties, [key]: value };
    setObjectProperties(newProperties);
    onObjectUpdate({ [key]: value });
  };

  const isTextObject = activeObject && activeObject.type === 'i-text';
  const hasSelection = !!activeObject;

  return (
    <div className="w-72 border-l border-border/40 bg-background flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        {/* Tabs for sections */}
        <div className="p-4 border-b border-border/40">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="properties">
              <Settings className="h-4 w-4 mr-2" />
              Properties
            </TabsTrigger>
            <TabsTrigger value="layers">
              <Layers className="h-4 w-4 mr-2" />
              Layers
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Scrollable Content Area */}
        <ScrollArea className="flex-1 custom-scrollbar">
          <div className="p-4 space-y-4">
            <TabsContent value="properties" className="mt-0 space-y-4">
              {!hasSelection && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Settings className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <h4 className="font-medium mb-2">No Selection</h4>
                    <p className="text-sm text-muted-foreground">
                      Select an element to see its properties
                    </p>
                  </CardContent>
                </Card>
              )}

              {hasSelection && (
                <>
                  {/* Transform Properties */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center">
                        <Move className="h-4 w-4 mr-2" />
                        Transform
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="x" className="text-xs">X</Label>
                          <Input 
                            id="x" 
                            type="number"
                            value={objectProperties.x} 
                            onChange={(e) => handlePropertyChange("left", Number(e.target.value))}
                            className="h-8 mt-1" 
                          />
                        </div>
                        <div>
                          <Label htmlFor="y" className="text-xs">Y</Label>
                          <Input 
                            id="y" 
                            type="number"
                            value={objectProperties.y}
                            onChange={(e) => handlePropertyChange("top", Number(e.target.value))}
                            className="h-8 mt-1" 
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="width" className="text-xs">Width</Label>
                          <Input 
                            id="width" 
                            type="number"
                            value={objectProperties.width} 
                            onChange={(e) => handlePropertyChange("width", Number(e.target.value))}
                            className="h-8 mt-1" 
                          />
                        </div>
                        <div>
                          <Label htmlFor="height" className="text-xs">Height</Label>
                          <Input 
                            id="height" 
                            type="number"
                            value={objectProperties.height} 
                            onChange={(e) => handlePropertyChange("height", Number(e.target.value))}
                            className="h-8 mt-1" 
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="rotation" className="text-xs flex items-center">
                          <RotateCw className="h-3 w-3 mr-1" />
                          Rotation
                        </Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Slider 
                            defaultValue={[objectProperties.rotation]} 
                            value={[objectProperties.rotation]}
                            onValueChange={(value) => handlePropertyChange("angle", value[0])}
                            max={360} 
                            step={1} 
                            className="flex-1" 
                          />
                          <Input 
                            type="number"
                            className="w-16 h-8" 
                            value={objectProperties.rotation} 
                            onChange={(e) => handlePropertyChange("angle", Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Appearance */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center">
                        <Palette className="h-4 w-4 mr-2" />
                        Appearance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-xs">Fill</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <div
                            className="w-8 h-8 rounded border border-border"
                            style={{ backgroundColor: objectProperties.fill }}
                          />
                          <Input 
                            value={objectProperties.fill} 
                            onChange={(e) => handlePropertyChange("fill", e.target.value)}
                            className="h-8" 
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Stroke</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <div 
                            className="w-8 h-8 rounded border border-border" 
                            style={{ backgroundColor: objectProperties.stroke }}
                          />
                          <Input 
                            value={objectProperties.stroke}
                            onChange={(e) => handlePropertyChange("stroke", e.target.value)} 
                            className="h-8" 
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="opacity" className="text-xs">Opacity</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Slider 
                            defaultValue={[objectProperties.opacity]} 
                            value={[objectProperties.opacity]}
                            onValueChange={(value) => handlePropertyChange("opacity", value[0] / 100)}
                            max={100} 
                            step={1} 
                            className="flex-1" 
                          />
                          <Input 
                            id="opacity" 
                            type="number"
                            className="w-16 h-8" 
                            value={objectProperties.opacity} 
                            onChange={(e) => handlePropertyChange("opacity", Number(e.target.value) / 100)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Typography (for text elements) */}
                  {isTextObject && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center">
                          <Type className="h-4 w-4 mr-2" />
                          Typography
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-xs">Font Family</Label>
                          <Input defaultValue="Inter" className="h-8 mt-1" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">Size</Label>
                            <Input defaultValue="16px" className="h-8 mt-1" />
                          </div>
                          <div>
                            <Label className="text-xs">Weight</Label>
                            <Input defaultValue="400" className="h-8 mt-1" />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Color</Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="w-8 h-8 rounded border border-border bg-foreground" />
                            <Input defaultValue="#000000" className="h-8" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="layers" className="mt-0 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Layers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-center py-8">
                    <Layers className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No layers yet. Create an element to see it here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
