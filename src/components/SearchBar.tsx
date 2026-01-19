import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SearchResult {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  category: string | null;
}

interface SearchBarProps {
  isMobile?: boolean;
  onResultClick?: () => void;
}

const SearchBar = ({ isMobile = false, onResultClick }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Search products with debounce
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, name, price, image_url, category")
          .ilike("name", `%${query}%`)
          .limit(6);

        if (error) throw error;
        setResults(data || []);
        setShowDropdown(true);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        if (!isMobile) setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  const handleResultClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setQuery("");
    setShowDropdown(false);
    setIsOpen(false);
    onResultClick?.();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setShowDropdown(false);
      setIsOpen(false);
      onResultClick?.();
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  // Mobile version
  if (isMobile) {
    return (
      <div ref={searchRef} className="relative">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="البحث عن منتجات..."
              className="w-full pr-12 pl-10 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              dir="rtl"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
              </button>
            )}
          </div>
        </form>

        {/* Results dropdown */}
        {showDropdown && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {results.map((product) => (
              <button
                key={product.id}
                onClick={() => handleResultClick(product.id)}
                className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-right"
              >
                <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Search className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.price.toLocaleString()} د.ج
                  </p>
                </div>
              </button>
            ))}
            <button
              onClick={handleSearchSubmit}
              className="w-full p-3 text-center text-primary hover:bg-muted transition-colors border-t border-border text-sm font-medium"
            >
              عرض كل النتائج لـ "{query}"
            </button>
          </div>
        )}

        {showDropdown && query.length >= 2 && results.length === 0 && !isLoading && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg p-4 text-center text-muted-foreground z-50">
            لا توجد نتائج لـ "{query}"
          </div>
        )}
      </div>
    );
  }

  // Desktop version
  return (
    <div ref={searchRef} className="relative">
      {!isOpen ? (
        <button
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
          className="p-2 nav-link"
        >
          <Search className="w-5 h-5" />
        </button>
      ) : (
        <div className="relative">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative animate-in fade-in slide-in-from-right-4 duration-200">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="بحث..."
                className="w-48 lg:w-64 pr-10 pl-8 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                dir="rtl"
              />
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setQuery("");
                  setShowDropdown(false);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
              </button>
            </div>
          </form>

          {/* Results dropdown */}
          {showDropdown && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 min-w-[300px]">
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleResultClick(product.id)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-right"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Search className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate text-sm">{product.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {product.price.toLocaleString()} د.ج
                      </span>
                      {product.category && (
                        <span className="text-xs text-muted-foreground/60">• {product.category}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
              <button
                onClick={handleSearchSubmit}
                className="w-full p-2.5 text-center text-primary hover:bg-muted transition-colors border-t border-border text-xs font-medium"
              >
                عرض كل النتائج
              </button>
            </div>
          )}

          {showDropdown && query.length >= 2 && results.length === 0 && !isLoading && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg p-3 text-center text-muted-foreground text-sm z-50 min-w-[300px]">
              لا توجد نتائج لـ "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
