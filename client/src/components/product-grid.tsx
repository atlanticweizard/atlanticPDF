import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { FileText, BookOpen, ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface ProductGridProps {
  limit?: number;
  type?: "pdf" | "course" | "all";
}

export default function ProductGrid({ limit, type = "all" }: ProductGridProps) {
  const { toast } = useToast();
  const { addToCart, isInCart } = useCart();

  const { data: products, isLoading, isError, error } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInCart(product.id)) {
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
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(limit || 9)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-[3/4] w-full rounded-md" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <h3 className="font-serif text-2xl font-bold text-foreground mb-4" data-testid="text-grid-error">Unable to Load Products</h3>
        <p className="text-muted-foreground" data-testid="text-grid-error-message">{error?.message || "Please try again later"}</p>
      </div>
    );
  }

  let filteredProducts = products || [];
  if (type !== "all") {
    filteredProducts = filteredProducts.filter(p => p.type === type);
  }
  
  const displayProducts = limit ? filteredProducts.slice(0, limit) : filteredProducts;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {displayProducts?.map((product) => (
        <Link 
          key={product.id} 
          href={`/product/${product.id}`}
          data-testid={`link-product-${product.id}`}
        >
          <div className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-md mb-4 aspect-[3/4]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                data-testid={`img-product-${product.id}`}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              
              <div className="absolute top-4 left-4">
                <Badge className={`${product.type === "pdf" ? "bg-blue-600" : "bg-purple-600"} text-white`}>
                  {product.type === "pdf" ? (
                    <><FileText className="h-3 w-3 mr-1" /> PDF</>
                  ) : (
                    <><BookOpen className="h-3 w-3 mr-1" /> Course</>
                  )}
                </Badge>
              </div>
              
              <div className="absolute bottom-4 left-0 right-0 px-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                <Button
                  className={`w-full backdrop-blur-sm text-primary-foreground border-2 uppercase tracking-wider hover-elevate active-elevate-2 ${
                    isInCart(product.id) 
                      ? "bg-green-600/95 border-green-600" 
                      : "bg-primary/95 border-primary"
                  }`}
                  onClick={(e) => handleQuickAdd(product, e)}
                  data-testid={`button-quick-add-${product.id}`}
                >
                  {isInCart(product.id) ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      In Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest text-muted-foreground" data-testid={`text-category-${product.id}`}>
                {product.category}
              </p>
              <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors" data-testid={`text-name-${product.id}`}>
                {product.name}
              </h3>
              <p className="text-lg font-medium text-primary" data-testid={`text-price-${product.id}`}>
                ₹{parseFloat(product.price).toFixed(2)}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
