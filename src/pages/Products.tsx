import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, ShoppingCart, Loader2, Package, Grid, List } from "lucide-react";
import { cn } from "@/lib/utils";

const Products = () => {
  const { products, isLoading } = useProducts();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get unique categories
  const categories = ["all", ...new Set(products.map(p => p.category).filter(Boolean))];

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || "/placeholder.svg",
      category: product.category,
      originalPrice: product.original_price,
    });
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl lg:text-5xl font-bold mb-4">منتجاتنا</h1>
              <p className="text-muted-foreground text-lg">
                اكتشف مجموعتنا المتميزة من المنتجات عالية الجودة
              </p>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن منتج..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="w-4 h-4 ml-2" />
                    <SelectValue placeholder="الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category || "all"}>
                        {category === "all" ? "جميع الفئات" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="ترتيب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">الأحدث</SelectItem>
                    <SelectItem value="price-low">السعر: الأقل</SelectItem>
                    <SelectItem value="price-high">السعر: الأعلى</SelectItem>
                    <SelectItem value="name">الاسم</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border border-border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    className="rounded-none"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    className="rounded-none"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-muted-foreground">
              عرض {filteredProducts.length} من {products.length} منتج
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">لا توجد منتجات</h3>
                <p className="text-muted-foreground">جرب البحث بكلمات أخرى أو تغيير الفلتر</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                    <Link to={`/product/${product.id}`}>
                      <div className="aspect-square relative overflow-hidden bg-muted">
                        <img
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.is_new && (
                          <Badge className="absolute top-2 right-2 bg-green-500">جديد</Badge>
                        )}
                        {product.is_on_sale && (
                          <Badge className="absolute top-2 left-2 bg-red-500">تخفيض</Badge>
                        )}
                      </div>
                    </Link>
                    <CardContent className="p-4">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-semibold truncate hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      {product.category && (
                        <p className="text-xs text-muted-foreground mt-1">{product.category}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-bold text-primary">{product.price.toLocaleString()} د.ج</span>
                        {product.original_price && (
                          <span className="text-sm text-muted-foreground line-through">
                            {product.original_price.toLocaleString()} د.ج
                          </span>
                        )}
                      </div>
                      <Button 
                        className="w-full mt-3 gap-2" 
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        أضف للسلة
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col sm:flex-row">
                      <Link to={`/product/${product.id}`} className="sm:w-48 shrink-0">
                        <div className="aspect-square sm:aspect-auto sm:h-48 relative overflow-hidden bg-muted">
                          <img
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                          {product.is_new && (
                            <Badge className="absolute top-2 right-2 bg-green-500">جديد</Badge>
                          )}
                          {product.is_on_sale && (
                            <Badge className="absolute top-2 left-2 bg-red-500">تخفيض</Badge>
                          )}
                        </div>
                      </Link>
                      <CardContent className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <Link to={`/product/${product.id}`}>
                            <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                          </Link>
                          {product.category && (
                            <Badge variant="secondary" className="mt-2">{product.category}</Badge>
                          )}
                          {product.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {product.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xl text-primary">
                              {product.price.toLocaleString()} د.ج
                            </span>
                            {product.original_price && (
                              <span className="text-sm text-muted-foreground line-through">
                                {product.original_price.toLocaleString()} د.ج
                              </span>
                            )}
                          </div>
                          <Button 
                            className="gap-2"
                            onClick={() => handleAddToCart(product)}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            أضف للسلة
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
