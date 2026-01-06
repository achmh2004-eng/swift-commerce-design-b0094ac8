import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  index: number;
}

const ProductCard = ({ product, onAddToCart, index }: ProductCardProps) => {
  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  return (
    <div 
      className="card-product group opacity-0 animate-fade-up"
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
    >
      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-foreground text-background text-xs font-bold px-2 py-1 rounded-full">
              NEW
            </span>
          )}
          {product.isSale && (
            <span className="badge-sale">
              -{discount}%
            </span>
          )}
        </div>

        {/* Quick Add Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            onAddToCart(product);
          }}
          className="absolute bottom-3 right-3 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Add to cart"
        >
          <Plus className="w-5 h-5" />
        </button>
      </Link>

      {/* Info */}
      <Link to={`/product/${product.id}`} className="block p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          {product.category}
        </p>
        <h3 className="font-semibold text-foreground mb-2 truncate">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">${product.price}</span>
          {product.originalPrice && (
            <span className="text-muted-foreground line-through text-sm">
              ${product.originalPrice}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
