import ProductCard, { Product } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductGrid = ({ products, onAddToCart }: ProductGridProps) => {
  return (
    <section id="shop" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured <span className="text-gradient">Products</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Curated essentials designed for the modern lifestyle
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 justify-center mb-10 overflow-x-auto hide-scrollbar pb-2">
          {["All", "New", "Footwear", "Accessories", "Tech"].map((tab, i) => (
            <button
              key={tab}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-200 whitespace-nowrap ${
                i === 0 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart}
              index={index}
            />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="btn-secondary">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
