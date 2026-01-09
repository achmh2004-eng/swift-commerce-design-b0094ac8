import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, Search } from "lucide-react";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

const Header = ({ cartCount, onCartClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoDoubleClick = () => {
    navigate('/admin/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Double click to access admin */}
          <a 
            href="/" 
            className="text-xl font-bold tracking-tight cursor-pointer"
            onDoubleClick={handleLogoDoubleClick}
          >
            <span className="text-gradient">NOVA</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#new" className="nav-link">New</a>
            <a href="#shop" className="nav-link">Shop</a>
            <a href="#collections" className="nav-link">Collections</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 nav-link hidden md:flex">
              <Search className="w-5 h-5" />
            </button>
            
            <button 
              onClick={onCartClick}
              className="relative p-2 nav-link"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                  {cartCount}
                </span>
              )}
            </button>

            <button 
              className="p-2 md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border animate-slide-up">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
            <a href="#new" className="nav-link text-lg py-2" onClick={() => setIsMenuOpen(false)}>New Arrivals</a>
            <a href="#shop" className="nav-link text-lg py-2" onClick={() => setIsMenuOpen(false)}>Shop All</a>
            <a href="#collections" className="nav-link text-lg py-2" onClick={() => setIsMenuOpen(false)}>Collections</a>
            <div className="pt-4 border-t border-border">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="input-search w-full pl-12"
                />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
