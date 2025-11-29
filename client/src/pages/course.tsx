import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, FileText, FileVideo, Lock, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Product, CourseModule } from "@shared/schema";

export default function Course() {
  const [, params] = useRoute("/course/:productId");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState<CourseModule | null>(null);

  const productId = params?.productId;

  const { data: product, isLoading: productLoading } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/products/${productId}`);
      return response.json();
    },
    enabled: !!productId,
  });

  const { data: modules, isLoading: modulesLoading } = useQuery<CourseModule[]>({
    queryKey: ["/api/courses", productId, "modules"],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/courses/${productId}/modules`);
      return response.json();
    },
    enabled: !!productId,
  });

  const { data: accessData, isLoading: accessLoading } = useQuery<{ hasAccess: boolean }>({
    queryKey: ["/api/user/access", productId],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/user/access/${productId}`);
      if (response.status === 403) {
        return { hasAccess: false };
      }
      return response.json();
    },
    enabled: !!productId && !!user,
  });

  const hasAccess = accessData?.hasAccess || false;
  const isLoading = productLoading || modulesLoading || accessLoading;

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <Card className="max-w-md w-full p-8 text-center">
          <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Sign in required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to access this course.
          </p>
          <Button onClick={() => setLocation("/auth")} className="w-full">
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="aspect-video w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-[400px] rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <Card className="max-w-md w-full p-8 text-center">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Course not found</h2>
          <Button onClick={() => setLocation("/shop")}>Browse Products</Button>
        </Card>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <Card className="max-w-md w-full p-8 text-center">
          <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Purchase Required</h2>
          <p className="text-muted-foreground mb-6">
            You need to purchase this course to access the content.
          </p>
          <Button onClick={() => setLocation(`/product/${productId}`)} className="w-full">
            View Product
          </Button>
        </Card>
      </div>
    );
  }

  const currentModule = activeModule || (modules && modules[0]) || null;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation("/dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            {product.category}
          </p>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            {product.name}
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentModule ? (
              <ModuleContent module={currentModule} />
            ) : (
              <Card className="aspect-video flex items-center justify-center bg-muted">
                <p className="text-muted-foreground">No modules available</p>
              </Card>
            )}
          </div>

          <div>
            <Card className="sticky top-24">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Course Content</h2>
                <p className="text-sm text-muted-foreground">
                  {modules?.length || 0} modules
                </p>
              </div>
              <ScrollArea className="h-[400px]">
                <div className="p-2">
                  {modules?.map((module, index) => (
                    <button
                      key={module.id}
                      onClick={() => setActiveModule(module)}
                      className={`w-full text-left p-3 rounded-md transition-colors ${
                        currentModule?.id === module.id
                          ? "bg-primary/10 border border-primary/50"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {module.type === "video" ? (
                            <FileVideo className="h-4 w-4 text-muted-foreground" />
                          ) : module.type === "pdf" ? (
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {index + 1}. {module.title}
                          </p>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {module.type.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleContent({ module }: { module: CourseModule }) {
  if (module.type === "video" && module.contentUrl) {
    return (
      <div className="space-y-4">
        <Card className="aspect-video overflow-hidden">
          <video
            src={module.contentUrl}
            controls
            className="w-full h-full"
          >
            Your browser does not support the video tag.
          </video>
        </Card>
        <div>
          <h2 className="font-semibold text-xl text-foreground mb-2">{module.title}</h2>
          {module.description && (
            <p className="text-muted-foreground">{module.description}</p>
          )}
        </div>
      </div>
    );
  }

  if (module.type === "pdf" && module.contentUrl) {
    return (
      <div className="space-y-4">
        <Card className="p-8 text-center">
          <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="font-semibold text-xl text-foreground mb-2">{module.title}</h2>
          {module.description && (
            <p className="text-muted-foreground mb-6">{module.description}</p>
          )}
          <Button onClick={() => window.open(module.contentUrl!, "_blank")}>
            Download PDF
          </Button>
        </Card>
      </div>
    );
  }

  if (module.type === "text") {
    return (
      <div className="space-y-4">
        <h2 className="font-semibold text-xl text-foreground">{module.title}</h2>
        {module.description && (
          <p className="text-muted-foreground">{module.description}</p>
        )}
        <Card className="p-6">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {module.textContent || "No content available."}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card className="p-8 text-center">
      <p className="text-muted-foreground">Content not available</p>
    </Card>
  );
}
