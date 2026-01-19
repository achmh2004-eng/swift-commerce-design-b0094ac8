import { ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface CategoryData {
  name: string;
  count: number;
  gradient: string;
}

const gradients = [
  "from-orange-500/20 to-red-500/20",
  "from-blue-500/20 to-purple-500/20",
  "from-green-500/20 to-teal-500/20",
  "from-yellow-500/20 to-orange-500/20",
  "from-pink-500/20 to-rose-500/20",
  "from-indigo-500/20 to-blue-500/20",
  "from-emerald-500/20 to-green-500/20",
  "from-amber-500/20 to-yellow-500/20",
];

const Categories = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: products, error } = await supabase
          .from("products")
          .select("category");

        if (error) throw error;

        // Group by category and count
        const categoryMap = new Map<string, number>();
        products?.forEach((product) => {
          if (product.category) {
            const current = categoryMap.get(product.category) || 0;
            categoryMap.set(product.category, current + 1);
          }
        });

        // Convert to array and add gradients
        const categoryArray: CategoryData[] = [];
        let index = 0;
        categoryMap.forEach((count, name) => {
          categoryArray.push({
            name,
            count,
            gradient: gradients[index % gradients.length],
          });
          index++;
        });

        setCategories(categoryArray);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section id="collections" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section id="collections" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              تسوق حسب <span className="text-gradient">الفئة</span>
            </h2>
            <p className="text-muted-foreground max-w-md">
              استكشف مجموعاتنا المختارة لكل المناسبات
            </p>
          </div>
          <Link to="/products" className="nav-link flex items-center gap-2 mt-4 md:mt-0">
            عرض الكل <ArrowRight className="w-4 h-4 rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className={`relative p-6 md:p-8 rounded-2xl bg-gradient-to-br ${cat.gradient} border border-border hover:border-primary/50 transition-all duration-300 group opacity-0 animate-fade-up`}
              style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'forwards' }}
            >
              <h3 className="text-lg md:text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                {cat.name}
              </h3>
              <p className="text-muted-foreground text-sm">
                {cat.count} منتج
              </p>
              <ArrowRight className="absolute bottom-6 left-6 w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all rotate-180" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
