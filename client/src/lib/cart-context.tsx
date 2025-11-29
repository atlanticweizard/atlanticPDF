import { createContext, useContext, useState, useEffect } from "react";
import type { Product, CartItem } from "@shared/schema";
import { apiRequest } from "./queryClient";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  isInCart: (productId: string) => boolean;
  validateCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("atlantic-cart");
    if (saved) {
      try {
        const parsedItems = JSON.parse(saved);
        setItems(parsedItems);
        if (parsedItems.length > 0) {
          validateCartItems(parsedItems);
        }
      } catch (e) {
        console.error("Failed to parse cart from localStorage");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("atlantic-cart", JSON.stringify(items));
  }, [items]);

  const validateCartItems = async (itemsToValidate: CartItem[]) => {
    try {
      const response = await apiRequest("GET", "/api/products");
      const products: Product[] = await response.json();
      const validProductIds = new Set(products.map(p => p.id));
      
      const invalidItems = itemsToValidate.filter(item => !validProductIds.has(item.product.id));
      
      if (invalidItems.length > 0) {
        console.warn(`🧹 Removing ${invalidItems.length} stale items from cart`);
        setItems(current => current.filter(item => validProductIds.has(item.product.id)));
      }
    } catch (error) {
      console.error("Failed to validate cart items:", error);
    }
  };

  const validateCart = async () => {
    await validateCartItems(items);
  };

  const addToCart = (product: Product) => {
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        return current;
      }
      return [...current, { product }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((current) => current.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce(
      (sum, item) => sum + parseFloat(item.product.price),
      0
    );
  };

  const isInCart = (productId: string) => {
    return items.some((item) => item.product.id === productId);
  };

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, clearCart, getTotal, isInCart, validateCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
