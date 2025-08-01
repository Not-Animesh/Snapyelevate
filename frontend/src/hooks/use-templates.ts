'use client';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Template, InsertTemplate } from "@shared/schema";

interface TemplatesResponse {
  templates: Template[];
}

export function useTemplates(category?: string, isPremium?: boolean) {
  const queryParams = new URLSearchParams();
  if (category) queryParams.append('category', category);
  if (isPremium !== undefined) queryParams.append('isPremium', isPremium.toString());
  
  const queryString = queryParams.toString();
  const url = `/api/templates${queryString ? `?${queryString}` : ''}`;

  return useQuery<TemplatesResponse>({
    queryKey: ["/api/templates", { category, isPremium }],
    queryFn: async () => {
      const response = await fetch(url, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    },
    // Provide an initial data state to avoid the type error on first render
    initialData: { templates: [] },
  });
}

export function useTemplate(id: string) {
  return useQuery({
    queryKey: ["/api/templates", id],
    enabled: !!id,
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertTemplate): Promise<{ template: Template }> => {
      const response = await apiRequest("POST", "/api/templates", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({
        title: "Template created",
        description: "Your template has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating template",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useTemplateCategories() {
  const { data: templatesData } = useTemplates();
  const templates = templatesData?.templates || [];
  
  // Extract unique categories from templates
  const categories = Array.from(
    new Set(templates.map((template: Template) => template.category))
  ).map(category => ({
    id: category,
    name: formatCategoryName(category),
    count: templates.filter((t: Template) => t.category === category).length
  }));

  return {
    categories: [
      { id: "all", name: "All Templates", count: templates.length },
      ...categories
    ]
  };
}

function formatCategoryName(category: string): string {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
