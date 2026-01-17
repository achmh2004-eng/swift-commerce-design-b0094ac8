import { useMemo } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Categories from "@/components/Categories";
import Cart from "@/components/Cart";
import Footer from "@/components/Footer";
import { Product } from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/hooks/useProducts";
import { Loader2 } from "lucide-react";

// Fallback images
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

const fallbackImages = [product1, product2, product3, product4];

const Index = () => {
  const { items, addToCart, updateQuantity, removeItem, cartCount, isCartOpen, setIsCartOpen } = useCart();
  const { products: dbProducts, isLoading } = useProducts();

  const products: Product[] = useMemo(() => {
    if (dbProducts.length === 0) return [];
    
    return dbProducts.map((product, index) => ({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      originalPrice: product.original_price ? Number(product.original_price) : undefined,
      image: product.image_url || fallbackImages[index % fallbackImages.length],
      category: product.category || "منتجات",
      isNew: product.is_new || false,
      isSale: product.is_on_sale || false,
    }));
  }, [dbProducts]);

  return (
    <div className="min-h-screen bg-background">
      <Header cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
      <main>
        <Hero />
        <Categories />
        {isLoading ? (
          <div className="py-20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground text-lg">لا توجد منتجات حالياً</p>
          </div>
        ) : (
          <ProductGrid products={products} onAddToCart={(product) => addToCart(product)} />
        )}
      </main>
      <Footer />
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemove={removeItem}
      />
    </div>
  );
};

export default Index;
