import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag, FileText, BookOpen } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useLocation } from "wouter";
import { useState } from "react";

interface CartDrawerProps {
  children: React.ReactNode;
}

export default function CartDrawer({ children }: CartDrawerProps) {
  const { items, removeFromCart, getTotal } = useCart();
  const [, setLocation] = useLocation();
  const [open, setOpen] = useState(false);

  const handleCheckout = () => {
    setOpen(false);
    setLocation("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl">Your Cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">Browse our digital products to get started</p>
            <Button 
              onClick={() => {
                setOpen(false);
                setLocation("/shop");
              }}
              data-testid="button-shop-now"
            >
              Browse Products
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-6 space-y-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4" data-testid={`cart-item-${item.product.id}`}>
                  <div className="relative w-20 h-20 rounded-md overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1">
                      {item.product.type === "pdf" ? (
                        <FileText className="h-4 w-4 text-white drop-shadow-md" />
                      ) : (
                        <BookOpen className="h-4 w-4 text-white drop-shadow-md" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-medium text-foreground" data-testid={`text-cart-item-name-${item.product.id}`}>
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground uppercase">
                      {item.product.type === "pdf" ? "PDF Download" : "Online Course"}
                    </p>
                    <p className="text-sm text-primary font-medium" data-testid={`text-cart-item-price-${item.product.id}`}>
                      ₹{parseFloat(item.product.price).toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeFromCart(item.product.id)}
                    data-testid={`button-remove-${item.product.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-6 space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-primary" data-testid="text-cart-total">
                  ₹{getTotal().toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Instant access after payment
              </p>
              <Button
                size="lg"
                className="w-full bg-primary text-primary-foreground uppercase tracking-wider hover-elevate active-elevate-2"
                onClick={handleCheckout}
                data-testid="button-checkout"
              >
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
