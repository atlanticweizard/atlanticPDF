import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BookOpen, Download, Play, ShoppingBag } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Product, UserAccess } from "@shared/schema";

interface PurchaseWithProduct extends UserAccess {
  product: Product;
  downloadToken?: string;
}

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: purchases, isLoading } = useQuery<PurchaseWithProduct[]>({
    queryKey: ["/api/user/purchases"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/user/purchases");
      return response.json();
    },
    enabled: !!user,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <Card className="max-w-md w-full p-8 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Sign in to view your purchases</h2>
          <p className="text-muted-foreground mb-6">
            Create an account or sign in to access your purchased products.
          </p>
          <Button onClick={() => setLocation("/auth")} className="w-full">
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  const pdfs = purchases?.filter(p => p.product.type === "pdf") || [];
  const courses = purchases?.filter(p => p.product.type === "course") || [];

  return (
    <div className="min-h-screen bg-background py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            My Purchases
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back, {user.username}! Access your purchased content below.
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="all">All ({purchases?.length || 0})</TabsTrigger>
            <TabsTrigger value="pdfs">PDFs ({pdfs.length})</TabsTrigger>
            <TabsTrigger value="courses">Courses ({courses.length})</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="flex gap-4">
                    <Skeleton className="h-24 w-24 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-10 w-32 mt-4" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : purchases?.length === 0 ? (
            <Card className="p-12 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                No purchases yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Browse our products and make your first purchase!
              </p>
              <Button onClick={() => setLocation("/shop")}>
                Browse Products
              </Button>
            </Card>
          ) : (
            <>
              <TabsContent value="all">
                <div className="grid md:grid-cols-2 gap-6">
                  {purchases?.map((purchase) => (
                    <PurchaseCard key={purchase.id} purchase={purchase} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="pdfs">
                {pdfs.length === 0 ? (
                  <EmptyState type="pdf" />
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {pdfs.map((purchase) => (
                      <PurchaseCard key={purchase.id} purchase={purchase} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="courses">
                {courses.length === 0 ? (
                  <EmptyState type="course" />
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {courses.map((purchase) => (
                      <PurchaseCard key={purchase.id} purchase={purchase} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}

function PurchaseCard({ purchase }: { purchase: PurchaseWithProduct }) {
  const [, setLocation] = useLocation();
  const { product, downloadToken } = purchase;

  const handleAccess = () => {
    if (product.type === "pdf" && downloadToken) {
      window.open(`/api/download/${downloadToken}`, "_blank");
    } else if (product.type === "course") {
      setLocation(`/course/${product.id}`);
    }
  };

  return (
    <Card className="p-6 hover:border-primary/50 transition-colors">
      <div className="flex gap-4">
        <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-1 right-1">
            {product.type === "pdf" ? (
              <FileText className="h-4 w-4 text-white drop-shadow-md" />
            ) : (
              <BookOpen className="h-4 w-4 text-white drop-shadow-md" />
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
            {product.category}
          </p>
          <h3 className="font-semibold text-foreground truncate mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Purchased on {new Date(purchase.grantedAt).toLocaleDateString()}
          </p>
          <Button 
            size="sm" 
            onClick={handleAccess}
            className="gap-2"
          >
            {product.type === "pdf" ? (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                View Course
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

function EmptyState({ type }: { type: "pdf" | "course" }) {
  const [, setLocation] = useLocation();
  
  return (
    <Card className="p-12 text-center">
      {type === "pdf" ? (
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      ) : (
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      )}
      <h3 className="font-semibold text-foreground mb-2">
        No {type === "pdf" ? "PDFs" : "courses"} purchased yet
      </h3>
      <p className="text-muted-foreground text-sm mb-4">
        Browse our {type === "pdf" ? "PDF" : "course"} collection to get started.
      </p>
      <Button variant="outline" onClick={() => setLocation("/shop")}>
        Browse {type === "pdf" ? "PDFs" : "Courses"}
      </Button>
    </Card>
  );
}
