import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Share2, Star, Minus, Plus, Truck, RotateCcw, Shield, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  category: string | null;
  description: string | null;
  is_new: boolean | null;
  is_on_sale: boolean | null;
  stock: number | null;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setIsLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } else {
        setProduct(data);
      }
      setIsLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">المنتج غير موجود</h1>
            <button onClick={() => navigate("/products")} className="btn-primary">
              العودة للمنتجات
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || "/placeholder.svg",
      category: product.category || "",
      originalPrice: product.original_price || undefined,
    }, quantity);
    
    toast.success("تمت الإضافة للسلة");
  };

  const discount = product.original_price 
    ? Math.round((1 - product.price / product.original_price) * 100) 
    : 0;

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.description || "",
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success("تم نسخ الرابط");
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 rotate-180" />
            رجوع
          </button>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-card">
                <img 
                  src={product.image_url || "/placeholder.svg"} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {product.is_new && (
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      جديد
                    </span>
                  )}
                  {product.is_on_sale && discount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      -{discount}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                {product.category && (
                  <p className="text-primary font-medium tracking-wide uppercase mb-2">
                    {product.category}
                  </p>
                )}
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
                    4.9 (128 تقييم)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold">{product.price.toLocaleString()} د.ج</span>
                  {product.original_price && (
                    <span className="text-xl text-muted-foreground line-through">
                      {product.original_price.toLocaleString()} د.ج
                    </span>
                  )}
                </div>
              </div>

              {product.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Stock */}
              {product.stock !== null && (
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
                  <span className="text-sm text-muted-foreground">
                    {product.stock > 0 ? `متوفر (${product.stock} قطعة)` : "غير متوفر"}
                  </span>
                </div>
              )}

              {/* Quantity */}
              <div>
                <span className="font-semibold block mb-3">الكمية</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-secondary rounded-lg">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-muted rounded-r-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-muted rounded-l-lg transition-colors"
                      disabled={product.stock !== null && quantity >= product.stock}
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
                  disabled={product.stock !== null && product.stock <= 0}
                >
                  أضف للسلة
                </button>
                <button 
                  onClick={() => {
                    setIsWishlisted(!isWishlisted);
                    toast.success(isWishlisted ? "تمت الإزالة من المفضلة" : "تمت الإضافة للمفضلة");
                  }}
                  className={`p-4 rounded-lg border transition-all ${
                    isWishlisted 
                      ? "bg-primary/10 border-primary text-primary" 
                      : "bg-secondary border-border hover:border-muted-foreground"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-primary" : ""}`} />
                </button>
                <button 
                  onClick={handleShare}
                  className="p-4 rounded-lg bg-secondary border border-border hover:border-muted-foreground transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-border">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">توصيل سريع</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">إرجاع مجاني</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">ضمان الجودة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
