import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Palette, Plus } from "lucide-react";

interface GradientSelectorProps {
  onGradientSelect?: (gradient: string) => void;
}

export default function GradientSelector({ onGradientSelect }: GradientSelectorProps) {
  const predefinedGradients = [
    {
      name: "Sunrise",
      class: "bg-gradient-sunrise",
      css: "linear-gradient(135deg, #FF7052 0%, #FFB928 100%)"
    },
    {
      name: "Deep Sea",
      class: "bg-gradient-deep-sea",
      css: "linear-gradient(135deg, #0072FF 0%, #00C6FF 100%)"
    },
    {
      name: "Royal Velvet",
      class: "bg-gradient-royal-velvet",
      css: "linear-gradient(135deg, #6A057A 0%, #A60064 100%)"
    },
    {
      name: "Emerald Forest",
      class: "bg-gradient-emerald-forest",
      css: "linear-gradient(135deg, #1D976C 0%, #93F9B9 100%)"
    },
    {
      name: "Twilight",
      class: "bg-gradient-twilight",
      css: "linear-gradient(135deg, #2C3E50 0%, #4CA1AF 100%)"
    },
    {
      name: "Purple Blue",
      class: "bg-gradient-purple-blue",
      css: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
    }
  ];

  const solidColors = [
    { name: "White", color: "#FFFFFF" },
    { name: "Black", color: "#000000" },
    { name: "Blue", color: "#3B82F6" },
    { name: "Purple", color: "#8B5CF6" },
    { name: "Green", color: "#10B981" },
    { name: "Red", color: "#EF4444" },
    { name: "Yellow", color: "#F59E0B" },
    { name: "Pink", color: "#EC4899" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="w-5 h-5" />
          <span>Backgrounds</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Gradient Backgrounds */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Gradient Backgrounds</Label>
          <div className="grid grid-cols-3 gap-2">
            {predefinedGradients.map((gradient) => (
              <button
                key={gradient.name}
                className={`aspect-square ${gradient.class} rounded-lg cursor-pointer hover:scale-105 transition-transform border-2 border-transparent hover:border-primary`}
                onClick={() => onGradientSelect?.(gradient.css)}
                title={gradient.name}
              />
            ))}
          </div>
        </div>

        {/* Solid Colors */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Solid Colors</Label>
          <div className="grid grid-cols-4 gap-2">
            {solidColors.map((color) => (
              <button
                key={color.name}
                className="aspect-square rounded-lg cursor-pointer hover:scale-105 transition-transform border-2 border-border hover:border-primary"
                style={{ backgroundColor: color.color }}
                onClick={() => onGradientSelect?.(color.color)}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Custom Color Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            // This would open a color picker in a real implementation
            const color = prompt("Enter a hex color (e.g., #FF0000):");
            if (color) {
              onGradientSelect?.(color);
            }
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Custom Color
        </Button>
      </CardContent>
    </Card>
  );
}
