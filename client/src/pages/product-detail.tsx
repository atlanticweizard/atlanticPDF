import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, FileText, BookOpen, Download, Play, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import type { Product, CourseModule } from "@shared/schema";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", params?.id],
    enabled: !!params?.id,
  });

  const { data: modules } = useQuery<CourseModule[]>({
    queryKey: ["/api/courses", params?.id, "modules"],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/courses/${params?.id}/modules`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!params?.id && product?.type === "course",
  });

  const { data: accessData } = useQuery<{ hasAccess: boolean }>({
    queryKey: ["/api/user/access", params?.id],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/user/access/${params?.id}`);
      if (response.status === 403) {
        return { hasAccess: false };
      }
      return response.json();
    },
    enabled: !!params?.id && !!user,
  });

  const hasAccess = accessData?.hasAccess || false;
  const inCart = product ? isInCart(product.id) : false;

  const handleAddToCart = () => {
    if (product) {
      if (inCart) {
        toast({
          title: "Already in cart",
          description: `${product.name} is already in your cart.`,
        });
        return;
      }
      addToCart(product);
      toast({
        title: "Added to cart",
        description: `${product.name} added to your cart.`,
      });
    }
  };

  const handleAccess = () => {
    if (product?.type === "course") {
      setLocation(`/course/${product.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <Skeleton className="aspect-[3/4] w-full rounded-md" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4" data-testid="text-error-not-found">Product Not Found</h2>
          <p className="text-muted-foreground mb-6" data-testid="text-error-message">The product you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation("/shop")} data-testid="button-back-to-shop">Back to Shop</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="sticky top-24">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full aspect-[3/4] object-cover rounded-md"
                data-testid={`img-product-${product.id}`}
              />
              <div className="absolute top-4 left-4">
                <Badge className={`${product.type === "pdf" ? "bg-blue-600" : "bg-purple-600"} text-white text-sm px-3 py-1`}>
                  {product.type === "pdf" ? (
                    <><FileText className="h-4 w-4 mr-2" /> PDF Download</>
                  ) : (
                    <><BookOpen className="h-4 w-4 mr-2" /> Online Course</>
                  )}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2" data-testid={`text-category-${product.id}`}>
                {product.category}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid={`text-name-${product.id}`}>
                {product.name}
              </h1>
              <p className="text-3xl font-medium text-primary" data-testid={`text-price-${product.id}`}>
                ₹{parseFloat(product.price).toFixed(2)}
              </p>
            </div>

            <div className="border-t border-b border-border py-6">
              <p className="text-foreground leading-relaxed" data-testid={`text-description-${product.id}`}>
                {product.description}
              </p>
            </div>

            {product.type === "course" && modules && modules.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Course Content</h3>
                <div className="space-y-2">
                  {modules.map((module, index) => (
                    <div key={module.id} className="flex items-center gap-3 text-sm text-muted-foreground">
                      {module.type === "video" ? (
                        <Play className="h-4 w-4" />
                      ) : module.type === "pdf" ? (
                        <FileText className="h-4 w-4" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      <span>{index + 1}. {module.title}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {module.type.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Card className="p-6 space-y-6">
              {hasAccess ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="h-5 w-5" />
                    <span className="font-medium">You own this product</span>
                  </div>
                  <Button
                    size="lg"
                    className="w-full bg-primary text-primary-foreground uppercase tracking-wider hover-elevate active-elevate-2"
                    onClick={handleAccess}
                    data-testid="button-access-product"
                  >
                    {product.type === "pdf" ? (
                      <>
                        <Download className="mr-2 h-5 w-5" />
                        Download PDF
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-5 w-5" />
                        Start Course
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <Button
                  size="lg"
                  className={`w-full uppercase tracking-wider hover-elevate active-elevate-2 ${
                    inCart 
                      ? "bg-green-600 text-white" 
                      : "bg-primary text-primary-foreground"
                  }`}
                  onClick={handleAddToCart}
                  data-testid="button-add-to-cart"
                >
                  {inCart ? (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      In Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Add to Cart
                    </>
                  )}
                </Button>
              )}
            </Card>

            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex justify-between border-b border-border pb-2">
                <span>Delivery</span>
                <span className="text-foreground">Instant digital access</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span>Access</span>
                <span className="text-foreground">Lifetime access</span>
              </div>
              <div className="flex justify-between">
                <span>Format</span>
                <span className="text-foreground">
                  {product.type === "pdf" ? "Downloadable PDF" : "Online streaming"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
