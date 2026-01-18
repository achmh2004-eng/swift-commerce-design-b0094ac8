import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Share2, Star, Minus, Plus, Truck, RotateCcw, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

import product1 from "@/assets/product-1.jpg";
import product1Alt from "@/assets/product-1-alt.jpg";
import product1Detail from "@/assets/product-1-detail.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

interface ProductData {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  sizes: string[];
  description: string;
  features: string[];
}

const productData: Record<string, ProductData> = {
  "1": {
    id: 1,
    name: "Classic White Sneakers",
    price: 159,
    originalPrice: 199,
    image: product1,
    images: [product1, product1Alt, product1Detail],
    category: "Footwear",
    isNew: true,
    isSale: true,
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
    description: "Premium leather sneakers with a minimalist design. Crafted for comfort and style, these sneakers feature a cushioned insole and durable rubber outsole.",
    features: ["Premium leather upper", "Memory foam insole", "Rubber outsole", "Breathable lining"],
  },
  "2": {
    id: 2,
    name: "Leather Crossbody Bag",
    price: 89,
    image: product2,
    images: [product2, product2, product2],
    category: "Accessories",
    isNew: true,
    sizes: ["One Size"],
    description: "Sleek crossbody bag made from genuine leather. Perfect for everyday carry with multiple compartments.",
    features: ["Genuine leather", "Adjustable strap", "Multiple pockets", "YKK zippers"],
  },
  "3": {
    id: 3,
    name: "Wireless Pro Headphones",
    price: 249,
    originalPrice: 299,
    image: product3,
    images: [product3, product3, product3],
    category: "Tech",
    isSale: true,
    sizes: ["One Size"],
    description: "Premium wireless headphones with active noise cancellation and 40-hour battery life.",
    features: ["Active noise cancellation", "40-hour battery", "Hi-Res audio", "Bluetooth 5.2"],
  },
  "4": {
    id: 4,
    name: "Chronograph Watch",
    price: 329,
    image: product4,
    images: [product4, product4, product4],
    category: "Watches",
    isNew: true,
    sizes: ["40mm", "44mm"],
    description: "Elegant chronograph watch with Japanese movement. Water-resistant up to 100m.",
    features: ["Japanese movement", "Sapphire crystal", "100m water resistant", "Stainless steel"],
  },
};

const reviews = [
  { id: 1, name: "Alex M.", rating: 5, date: "2 days ago", comment: "Absolutely love these! Super comfortable and the quality is amazing.", avatar: "A" },
  { id: 2, name: "Sarah K.", rating: 4, date: "1 week ago", comment: "Great fit, stylish design. Shipping was fast too.", avatar: "S" },
  { id: 3, name: "Mike T.", rating: 5, date: "2 weeks ago", comment: "Best purchase I've made this year. Worth every penny.", avatar: "M" },
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = productData[id || "1"];
  
  const { items, addToCart, updateQuantity, removeItem, cartCount, isCartOpen, setIsCartOpen } = useCart();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 1) {
      toast.error("Please select a size");
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      originalPrice: product.originalPrice,
      size: selectedSize || product.sizes[0],
    }, quantity);
  };

  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-card">
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.name}
                  className="w-full h-full object-cover animate-fade-up"
                />
                
                {/* Navigation Arrows */}
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-background transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-background transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="bg-foreground text-background text-xs font-bold px-3 py-1 rounded-full">
                      NEW
                    </span>
                  )}
                  {product.isSale && (
                    <span className="badge-sale">
                      -{discount}%
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto hide-scrollbar">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === i 
                        ? "border-primary" 
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-primary font-medium tracking-wide uppercase mb-2">
                  {product.category}
                </p>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {product.name}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-muted-foreground text-sm">
                    4.9 (128 reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Size Selection */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold">Select Size</span>
                  <a href="#" className="text-sm text-primary hover:underline">Size Guide</a>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedSize === size
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary hover:bg-muted"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <span className="font-semibold block mb-3">Quantity</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-secondary rounded-lg">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-muted rounded-l-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-muted rounded-r-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button 
                  onClick={handleAddToCart}
                  className="btn-primary flex-1 text-lg"
                >
                  Add to Cart
                </button>
                <button 
                  onClick={() => {
                    setIsWishlisted(!isWishlisted);
                    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
                  }}
                  className={`p-4 rounded-lg border transition-all ${
                    isWishlisted 
                      ? "bg-primary/10 border-primary text-primary" 
                      : "bg-secondary border-border hover:border-muted-foreground"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-primary" : ""}`} />
                </button>
                <button className="p-4 rounded-lg bg-secondary border border-border hover:border-muted-foreground transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-border">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Free Shipping</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">30-Day Returns</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">2-Year Warranty</p>
                </div>
              </div>

              {/* Features */}
              <div className="border-t border-border pt-6">
                <h3 className="font-semibold mb-3">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <section className="mt-16 pt-16 border-t border-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Customer <span className="text-gradient">Reviews</span>
                </h2>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-muted-foreground">Based on 128 reviews</span>
                </div>
              </div>
              <button className="btn-secondary mt-4 md:mt-0">
                Write a Review
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review, i) => (
                <div 
                  key={review.id} 
                  className="bg-card p-6 rounded-xl opacity-0 animate-fade-up"
                  style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                      {review.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < review.rating 
                            ? "fill-primary text-primary" 
                            : "text-muted"
                        }`} 
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
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

export default ProductDetail;
