import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductGrid from "@/components/product-grid";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen, LayoutGrid } from "lucide-react";
import type { Product } from "@shared/schema";

export default function Shop() {
  const [filter, setFilter] = useState<"all" | "pdf" | "course">("all");
  
  const { error, isError } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4" data-testid="text-error-title">Error Loading Products</h2>
          <p className="text-muted-foreground" data-testid="text-error-message">{error?.message || "Failed to load products. Please try again later."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-4" data-testid="text-page-title">
            Digital Products
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto" data-testid="text-page-subtitle">
            Premium PDFs and online courses to help you grow
          </p>
        </div>
        
        <div className="flex justify-center gap-2 mb-12">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="gap-2"
          >
            <LayoutGrid className="h-4 w-4" />
            All
          </Button>
          <Button
            variant={filter === "pdf" ? "default" : "outline"}
            onClick={() => setFilter("pdf")}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            PDFs
          </Button>
          <Button
            variant={filter === "course" ? "default" : "outline"}
            onClick={() => setFilter("course")}
            className="gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Courses
          </Button>
        </div>
        
        <ProductGrid type={filter} />
      </div>
    </div>
  );
}
