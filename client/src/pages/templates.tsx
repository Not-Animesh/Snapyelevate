import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useTemplates } from "@/hooks/use-templates";
import { useCreateProject } from "@/hooks/use-projects";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Filter, 
  LayoutTemplate, 
  Crown,
  Grid3X3,
  List,
  Eye,
  Copy
} from "lucide-react";

export default function Templates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { toast } = useToast();

  const { data: templatesData, isLoading } = useTemplates(
    selectedCategory === "all" ? undefined : selectedCategory
  );

  const createProjectMutation = useCreateProject();

  const templates = templatesData?.templates || [];

  const categories = [
    { id: "all", name: "All Templates", count: templates.length },
    { id: "social-media", name: "Social Media", count: templates.filter(t => t.category === "social-media").length },
    { id: "presentation", name: "Presentations", count: templates.filter(t => t.category === "presentation").length },
    { id: "app-mockup", name: "App Mockups", count: templates.filter(t => t.category === "app-mockup").length },
    { id: "website", name: "Website Screenshots", count: templates.filter(t => t.category === "website").length },
    { id: "marketing", name: "Marketing", count: templates.filter(t => t.category === "marketing").length },
    { id: "branding", name: "Brand Assets", count: templates.filter(t => t.category === "branding").length },
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = async (template: any) => {
    try {
      const newProject = await createProjectMutation.mutateAsync({
        title: `${template.title} Copy`,
        description: `Created from ${template.title} template`,
        canvasData: template.canvasData,
        width: template.width,
        height: template.height,
        isPublic: false,
        userId: "user-1", // This would come from auth context
      });

      toast({
        title: "Template applied",
        description: "New project created from template",
      });

      // Navigate to editor with new project
      window.location.href = `/editor/${newProject.project.id}`;
    } catch (error) {
      console.error("Error using template:", error);
      toast({
        title: "Failed to use template",
        description: "Could not create project from template",
        variant: "destructive",
      });
    }
  };

  const handlePreviewTemplate = (template: any) => {
    // This would open a modal or preview pane
    console.log("Preview template:", template);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20">
        {/* Header */}
        <div className="border-b border-border bg-muted/50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Professional Templates</h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Start with beautiful, pre-designed templates for every use case. 
                Customize and make them your own in seconds.
              </p>
              
              {/* Search */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 text-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Filter className="w-4 h-4 mr-2" />
                    Categories
                  </h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                          selectedCategory === category.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        <span className="text-sm">{category.name}</span>
                        <span className="text-xs opacity-60">{category.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Premium Badge */}
                <Card className="border-yellow-200 dark:border-yellow-700">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Crown className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold text-yellow-700 dark:text-yellow-400">Premium</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Unlock exclusive premium templates with Pro subscription
                    </p>
                    <Link href="/pricing">
                      <Button size="sm" className="w-full">
                        Upgrade to Pro
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-semibold">
                    {selectedCategory === "all" ? "All Templates" : categories.find(c => c.id === selectedCategory)?.name}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {filteredTemplates.length} templates
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="aspect-video bg-muted rounded-t-lg"></div>
                      <CardContent className="p-4">
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-3 bg-muted rounded w-2/3 mb-3"></div>
                        <div className="h-8 bg-muted rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Templates Grid */}
              {!isLoading && (
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                  {filteredTemplates.map((template) => (
                    <Card key={template.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="relative">
                        <div className="aspect-video relative overflow-hidden rounded-t-lg">
                          {template.thumbnail ? (
                            <img
                              src={template.thumbnail}
                              alt={template.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-twilight flex items-center justify-center">
                              <LayoutTemplate className="w-12 h-12 text-white/60" />
                            </div>
                          )}
                          
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handlePreviewTemplate(template)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleUseTemplate(template)}
                              disabled={createProjectMutation.isPending}
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Use Template
                            </Button>
                          </div>
                        </div>
                        
                        {template.isPremium && (
                          <Badge className="absolute top-2 right-2 bg-yellow-500 text-yellow-900">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                          {template.title}
                        </h3>
                        {template.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {template.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {template.category?.replace('-', ' ')}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {template.width} × {template.height}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && filteredTemplates.length === 0 && (
                <Card className="p-12">
                  <CardContent className="text-center">
                    <LayoutTemplate className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No templates found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search or browse a different category
                    </p>
                    <Button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}>
                      Clear filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
