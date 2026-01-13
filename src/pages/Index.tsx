import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Categories from "@/components/Categories";
import Cart from "@/components/Cart";
import Footer from "@/components/Footer";
import { Product } from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";

import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Classic White Sneakers",
    price: 159,
    originalPrice: 199,
    image: product1,
    category: "Footwear",
    isNew: true,
    isSale: true,
  },
  {
    id: 2,
    name: "Leather Crossbody Bag",
    price: 89,
    image: product2,
    category: "Accessories",
    isNew: true,
  },
  {
    id: 3,
    name: "Wireless Pro Headphones",
    price: 249,
    originalPrice: 299,
    image: product3,
    category: "Tech",
    isSale: true,
  },
  {
    id: 4,
    name: "Chronograph Watch",
    price: 329,
    image: product4,
    category: "Watches",
    isNew: true,
  },
  {
    id: 5,
    name: "Premium White Kicks",
    price: 189,
    image: product1,
    category: "Footwear",
  },
  {
    id: 6,
    name: "Mini Leather Pouch",
    price: 59,
    originalPrice: 79,
    image: product2,
    category: "Accessories",
    isSale: true,
  },
  {
    id: 7,
    name: "Studio Headphones",
    price: 199,
    image: product3,
    category: "Tech",
  },
  {
    id: 8,
    name: "Sports Watch Pro",
    price: 279,
    originalPrice: 349,
    image: product4,
    category: "Watches",
    isSale: true,
  },
];

const Index = () => {
  const { items, addToCart, updateQuantity, removeItem, cartCount, isCartOpen, setIsCartOpen } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Header cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
      <main>
        <Hero />
        <Categories />
        <ProductGrid products={sampleProducts} onAddToCart={(product) => addToCart(product)} />
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
