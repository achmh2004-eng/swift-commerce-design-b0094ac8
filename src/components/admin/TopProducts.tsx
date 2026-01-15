import { Package } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  stock: number;
  category: string | null;
}

interface TopProductsProps {
  products: Product[];
}

const TopProducts = ({ products }: TopProductsProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold">أفضل المنتجات</h3>
        <p className="text-sm text-muted-foreground">المنتجات الأكثر مبيعاً</p>
      </div>

      <div className="divide-y divide-border">
        {products.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            لا توجد منتجات حتى الآن
          </div>
        ) : (
          products.slice(0, 5).map((product, index) => (
            <div key={product.id} className="p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {index + 1}
                </div>
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.category || 'بدون فئة'}</p>
                </div>
                <div className="text-left">
                  <p className="font-bold">${product.price.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{product.stock} قطعة</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopProducts;
