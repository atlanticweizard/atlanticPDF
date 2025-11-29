import { Link } from "wouter";
import { ChevronRight, FileText, BookOpen, Download, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ProductGrid from "@/components/product-grid";

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full mb-6">
            <Download className="h-4 w-4" />
            <span className="text-sm font-medium">Digital Products & Online Courses</span>
          </div>
          <h1 className="font-serif text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
            ATLANTIC WEIZARD
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 font-light tracking-wide max-w-2xl mx-auto">
            Premium digital resources to accelerate your growth
          </p>
          <Link href="/shop" data-testid="link-shop-hero">
            <Button 
              size="lg"
              className="bg-primary text-primary-foreground border-2 border-primary tracking-widest uppercase hover-elevate active-elevate-2"
              data-testid="button-explore-collection"
            >
              Explore Products
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-16 px-6 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground">PDF Downloads</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Instant access to premium guides, templates, and resources. Download immediately after purchase.
              </p>
              <Link href="/shop">
                <Button variant="outline" className="border-blue-500/50 hover:bg-blue-500/10">
                  Browse PDFs
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
            
            <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-500/40 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <BookOpen className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground">Online Courses</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Comprehensive video courses with modules, PDFs, and interactive content. Learn at your own pace.
              </p>
              <Link href="/shop">
                <Button variant="outline" className="border-purple-500/50 hover:bg-purple-500/10">
                  Browse Courses
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our most popular digital resources
            </p>
          </div>
          <ProductGrid limit={6} />
          <div className="text-center mt-16">
            <Link href="/shop" data-testid="link-view-all">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-primary text-foreground uppercase tracking-wider hover-elevate active-elevate-2"
                data-testid="button-view-all"
              >
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-card">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-card-foreground mb-8">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Instant Access</h3>
              <p className="text-muted-foreground text-sm">
                Download immediately after payment. No waiting.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Lifetime Access</h3>
              <p className="text-muted-foreground text-sm">
                Access your purchases anytime from your dashboard.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Premium Quality</h3>
              <p className="text-muted-foreground text-sm">
                Curated content from industry experts.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
