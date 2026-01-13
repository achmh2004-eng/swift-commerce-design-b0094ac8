import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { toast } from "sonner";

export interface CartProduct {
  id: number | string;
  name: string;
  price: number;
  image: string;
  category?: string;
  originalPrice?: number;
  size?: string;
}

export interface CartItem extends CartProduct {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: CartProduct, quantity?: number) => void;
  updateQuantity: (id: number | string, delta: number) => void;
  removeItem: (id: number | string) => void;
  clearCart: () => void;
  cartCount: number;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback((product: CartProduct, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.size === product.size);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    toast.success(`${product.name} added to cart`);
  }, []);

  const updateQuantity = useCallback((id: number | string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((id: number | string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Item removed from cart");
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        cartCount,
        total,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
