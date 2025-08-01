import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { AIService, type AIGenerationOptions } from "@/lib/ai-service";
import { Sparkles, Loader2, Download, Wand2 } from "lucide-react";

interface AIGeneratorProps {
  onImageGenerated?: (imageUrl: string) => void;
  onBackgroundGenerated?: (gradient: any) => void;
  projectId?: string;
}

export default function AIGenerator({ onImageGenerated, onBackgroundGenerated, projectId }: AIGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedSize, setSelectedSize] = useState<AIGenerationOptions['size']>("1024x1024");
  const [generationType, setGenerationType] = useState<"image" | "background">("image");
  const { toast } = useToast();

  // Get user profile to check AI usage
  const { data: userProfile } = useQuery({
    queryKey: ["/api/user/profile"],
  });

  const generateImageMutation = useMutation({
    mutationFn: (options: AIGenerationOptions) => AIService.generateImage(options),
    onSuccess: (result) => {
      toast({
        title: "Image generated successfully!",
        description: `${result.remainingGenerations} generations remaining`,
      });
      onImageGenerated?.(result.imageUrl);
      setPrompt(""); // Clear prompt after successful generation
    },
    onError: (error: Error) => {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateBackgroundMutation = useMutation({
    mutationFn: (options: { prompt: string; style?: string }) => AIService.generateBackground(options),
    onSuccess: (result) => {
      toast({
        title: "Background generated successfully!",
        description: "Apply the new background to your canvas",
      });
      onBackgroundGenerated?.(result.gradientData);
      setPrompt(""); // Clear prompt after successful generation
    },
    onError: (error: Error) => {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    const validation = AIService.validatePrompt(prompt);
    if (!validation.isValid) {
      toast({
        title: "Invalid prompt",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    const formattedPrompt = AIService.formatPrompt(prompt, selectedStyle);

    if (generationType === "image") {
      generateImageMutation.mutate({
        prompt: formattedPrompt,
        style: selectedStyle,
        size: selectedSize,
        projectId,
      });
    } else {
      generateBackgroundMutation.mutate({
        prompt: formattedPrompt,
        style: selectedStyle,
      });
    }
  };

  const stylePresets = AIService.getStylePresets();
  const sizePresets = AIService.getSizePresets();
  const isLoading = generateImageMutation.isPending || generateBackgroundMutation.isPending;

  const aiUsage = userProfile?.user?.aiGenerationsUsed || 0;
  const aiLimit = userProfile?.user?.aiGenerationsLimit || 10;
  const usagePercentage = (aiUsage / aiLimit) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span>AI Generator</span>
        </CardTitle>
        
        {/* Usage indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">AI Generations</span>
            <span className="font-medium">{aiUsage} / {aiLimit}</span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
          {usagePercentage >= 80 && (
            <p className="text-xs text-orange-600 dark:text-orange-400">
              {usagePercentage >= 100 ? "Limit reached. Upgrade to continue." : "Running low on generations."}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Generation Type */}
        <div className="space-y-2">
          <Label>Generation Type</Label>
          <div className="flex space-x-2">
            <Button
              variant={generationType === "image" ? "default" : "outline"}
              size="sm"
              onClick={() => setGenerationType("image")}
              className="flex-1"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Image
            </Button>
            <Button
              variant={generationType === "background" ? "default" : "outline"}
              size="sm"
              onClick={() => setGenerationType("background")}
              className="flex-1"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Background
            </Button>
          </div>
        </div>

        {/* Prompt Input */}
        <div className="space-y-2">
          <Label htmlFor="ai-prompt">
            Describe what you want to {generationType === "image" ? "create" : "generate"}
          </Label>
          <Textarea
            id="ai-prompt"
            placeholder={generationType === "image" 
              ? "A beautiful landscape with mountains and a lake..." 
              : "A vibrant sunset gradient with warm colors..."
            }
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
          />
        </div>

        {/* Style Selection */}
        <div className="space-y-2">
          <Label>Style</Label>
          <Select value={selectedStyle} onValueChange={setSelectedStyle}>
            <SelectTrigger>
              <SelectValue placeholder="Select a style" />
            </SelectTrigger>
            <SelectContent>
              {stylePresets.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  <div>
                    <div className="font-medium">{style.name}</div>
                    <div className="text-xs text-muted-foreground">{style.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Size Selection (only for images) */}
        {generationType === "image" && (
          <div className="space-y-2">
            <Label>Size</Label>
            <div className="grid grid-cols-3 gap-2">
              {sizePresets.map((size) => (
                <Button
                  key={size.value}
                  variant={selectedSize === size.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSize(size.value)}
                  className="flex flex-col h-auto py-2"
                >
                  <span className="font-medium">{size.name}</span>
                  <span className="text-xs text-muted-foreground">{size.dimensions}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isLoading || aiUsage >= aiLimit}
          className="w-full btn-gradient"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate {generationType === "image" ? "Image" : "Background"}
            </>
          )}
        </Button>

        {/* Quick Prompts */}
        <div className="space-y-2">
          <Label className="text-xs">Quick Prompts</Label>
          <div className="flex flex-wrap gap-1">
            {[
              "Modern gradient",
              "Tech background",
              "Nature scene",
              "Abstract pattern",
              "Geometric design"
            ].map((quickPrompt) => (
              <Badge
                key={quickPrompt}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs"
                onClick={() => setPrompt(quickPrompt)}
              >
                {quickPrompt}
              </Badge>
            ))}
          </div>
        </div>

        {aiUsage >= aiLimit && (
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
            <p className="text-sm text-orange-700 dark:text-orange-300">
              You've reached your AI generation limit. 
              <Button variant="link" className="p-0 h-auto font-medium text-orange-700 dark:text-orange-300">
                Upgrade your plan
              </Button> to continue generating.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
