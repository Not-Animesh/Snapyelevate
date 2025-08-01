'use client';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Asset, InsertAsset } from "@shared/schema";

interface AssetsResponse {
  assets: Asset[];
}

export function useAssets() {
  return useQuery<AssetsResponse>({
    queryKey: ["/api/assets"],
    // Provide an initial data state to avoid the type error on first render
    initialData: { assets: [] },
  });
}

export function useProjectAssets(projectId: string) {
  return useQuery<AssetsResponse>({
    queryKey: ["/api/assets", "project", projectId],
    enabled: !!projectId,
    queryFn: async () => {
      const response = await fetch(`/api/assets?projectId=${projectId}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    },
    initialData: { assets: [] },
  });
}

export function useCreateAsset() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertAsset): Promise<{ asset: Asset }> => {
      const response = await apiRequest("POST", "/api/assets", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assets"] });
      toast({
        title: "Asset created",
        description: "Your asset has been uploaded successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error uploading asset",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteAsset() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiRequest("DELETE", `/api/assets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assets"] });
      toast({
        title: "Asset deleted",
        description: "Your asset has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting asset",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUploadAsset() {
  const createAssetMutation = useCreateAsset();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ file, projectId }: { file: File; projectId?: string }): Promise<{ asset: Asset }> => {
      try {
        // Convert file to base64 for storage (in a real app, you'd upload to S3/similar)
        const dataUrl = await fileToDataUrl(file);
        
        const assetData: InsertAsset = {
          filename: file.name,
          url: dataUrl,
          type: getAssetType(file.type),
          size: file.size,
          userId: "user-1", // Would come from auth context
          projectId: projectId || null,
        };

        return await createAssetMutation.mutateAsync(assetData);
      } catch (error) {
        console.error("Upload error:", error);
        throw new Error("Failed to upload asset");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getAssetType(mimeType: string): string {
  if (mimeType.startsWith("image/")) {
    return "image";
  } else if (mimeType.startsWith("video/")) {
    return "video";
  } else if (mimeType.startsWith("audio/")) {
    return "audio";
  } else {
    return "file";
  }
}

export function useAssetCategories() {
  const { data: assetsData } = useAssets();
  const assets = assetsData?.assets || [];
  
  const categories = [
    {
      id: "all",
      name: "All Assets",
      count: assets.length,
      icon: "folder"
    },
    {
      id: "image",
      name: "Images",
      count: assets.filter((asset: Asset) => asset.type === "image").length,
      icon: "image"
    },
    {
      id: "ai-generated",
      name: "AI Generated",
      count: assets.filter((asset: Asset) => asset.type === "ai-generated").length,
      icon: "sparkles"
    },
    {
      id: "background",
      name: "Backgrounds",
      count: assets.filter((asset: Asset) => asset.type === "background").length,
      icon: "palette"
    },
    {
      id: "icon",
      name: "Icons",
      count: assets.filter((asset: Asset) => asset.type === "icon").length,
      icon: "star"
    }
  ];

  return { categories };
}
