import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { CreditCard, Lock, FileText, BookOpen, AlertCircle } from "lucide-react";

const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { items, getTotal, clearCart, validateCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    validateCart();
  }, [validateCart]);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const orderMutation = useMutation({
    mutationFn: async (checkoutData: CheckoutFormData) => {
      const response = await apiRequest("POST", "/api/payment/initiate", {
        customerInfo: checkoutData,
        items: items,
        total: getTotal(),
      });
      return await response.json();
    },
    onSuccess: (data: any) => {
      console.log("🔍 Payment initiation response received:", data);
      
      if (!data || typeof data !== 'object') {
        console.error("❌ Invalid response: data is not an object", data);
        toast({
          title: "Payment Error",
          description: "Invalid response from payment server. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!data.paymentUrl) {
        console.error("❌ Missing paymentUrl in response:", data);
        toast({
          title: "Payment Error",
          description: "Payment URL is missing. Please contact support.",
          variant: "destructive",
        });
        return;
      }

      if (!data.formData || typeof data.formData !== 'object') {
        console.error("❌ Invalid or missing formData in response:", data);
        toast({
          title: "Payment Error",
          description: "Payment form data is invalid. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log("✅ Validation passed. Creating payment form...");

      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.paymentUrl;

      Object.keys(data.formData).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = data.formData[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      console.log("✅ Form created and appended. Submitting to:", data.paymentUrl);
      form.submit();
    },
    onError: (error: any) => {
      console.error("❌ Payment mutation error:", error);
      toast({
        title: "Payment Initiation Failed",
        description: error?.message || "There was an error initiating payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CheckoutFormData) => {
    orderMutation.mutate(data);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Add some products to proceed with checkout.</p>
          <Button onClick={() => setLocation("/shop")} data-testid="button-continue-shopping">
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-12 text-center">
          Checkout
        </h1>

        {!user && (
          <Card className="p-4 mb-8 border-amber-500/50 bg-amber-500/10">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Sign in for instant access</p>
                <p className="text-sm text-muted-foreground">
                  Create an account or sign in to access your purchases anytime from your dashboard.{" "}
                  <Button variant="ghost" className="p-0 h-auto text-primary underline" onClick={() => setLocation("/auth")}>
                    Sign in now
                  </Button>
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
              Contact Information
            </h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-first-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-last-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} data-testid="input-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} data-testid="input-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Card className="p-6 bg-card/50 border-primary/20">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <h3 className="font-semibold text-foreground">Secure Payment</h3>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Your payment will be securely processed through PayU payment gateway. We accept credit/debit cards, UPI, net banking, and wallets.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <Lock className="h-4 w-4" />
                      <span className="font-medium">256-bit SSL Encrypted & PCI-DSS Compliant</span>
                    </div>
                  </div>
                </Card>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary text-primary-foreground uppercase tracking-wider hover-elevate active-elevate-2"
                  disabled={orderMutation.isPending}
                  data-testid="button-place-order"
                >
                  {orderMutation.isPending ? "Redirecting to Payment..." : "Proceed to Payment"}
                </Button>
              </form>
            </Form>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
              Order Summary
            </h2>
            <Card className="p-6 sticky top-24">
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4" data-testid={`order-item-${item.product.id}`}>
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
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{item.product.name}</h3>
                      <p className="text-xs text-muted-foreground uppercase">
                        {item.product.type === "pdf" ? "PDF Download" : "Online Course"}
                      </p>
                    </div>
                    <p className="font-medium text-foreground">
                      ₹{parseFloat(item.product.price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span data-testid="text-subtotal">₹{getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-semibold text-foreground pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary" data-testid="text-total">₹{getTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-500/10 rounded-md">
                <p className="text-xs text-green-600 dark:text-green-400 text-center">
                  ✓ Instant access after payment
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
