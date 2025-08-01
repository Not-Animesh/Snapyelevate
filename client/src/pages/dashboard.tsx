import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/navbar";
import { useProjects } from "@/hooks/use-projects";
import { 
  Folder, 
  Sparkles, 
  LayoutTemplate, 
  Download, 
  Plus, 
  Search, 
  Grid3X3, 
  List,
  MoreHorizontal
} from "lucide-react";

export default function Dashboard() {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  
  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const statsData = [
    {
      title: "Total Projects",
      value: stats?.stats?.totalProjects || 0,
      icon: Folder,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "AI Generated",
      value: stats?.stats?.aiGenerated || 0,
      icon: Sparkles,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: "Templates Used",
      value: stats?.stats?.templatesUsed || 0,
      icon: LayoutTemplate,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Exports",
      value: stats?.stats?.exports || 0,
      icon: Download,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    }
  ];

  const recentProjects = projects?.projects?.slice(0, 8) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20">
        <Card className="border-0 rounded-none shadow-lg">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-purple-blue rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-semibold">Snapy Dashboard</span>
                </div>
                <div className="hidden md:flex items-center space-x-6 text-sm">
                  <span className="text-primary font-medium">Projects</span>
                  <Link href="/templates" className="text-muted-foreground hover:text-foreground transition-colors">Templates</Link>
                  <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Assets</span>
                  <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Team</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Input
                    placeholder="Search projects..."
                    className="pl-10 w-64"
                  />
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                </div>
                <Link href="/editor">
                  <Button className="btn-gradient">
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {statsData.map((stat, index) => (
                <div key={index} className={`${stat.bgColor} p-6 rounded-xl`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${stat.color} text-sm font-medium`}>{stat.title}</p>
                      <p className={`text-2xl font-bold ${stat.color.replace('text-', 'text-').replace('-400', '-900').replace('-600', '-900')} dark:${stat.color}`}>
                        {stat.value}
                      </p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color.replace('-400', '-500').replace('-600', '-500')}`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Projects */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Projects</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {projectsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="aspect-video bg-muted rounded-t-lg"></div>
                      <CardContent className="p-4">
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : recentProjects.length === 0 ? (
                <Card className="p-12">
                  <CardContent className="text-center">
                    <Folder className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first project to get started</p>
                    <Link href="/editor">
                      <Button className="btn-gradient">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Project
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {recentProjects.map((project) => (
                    <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <div className="aspect-video bg-gradient-twilight rounded-t-lg relative overflow-hidden">
                        {project.thumbnail && (
                          <img 
                            src={project.thumbnail} 
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm truncate flex-1">{project.title}</h4>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 h-6 w-6 transition-opacity"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
