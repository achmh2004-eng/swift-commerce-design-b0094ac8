import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X, ShoppingBag, Search, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

const Header = ({ cartCount, onCartClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    clickCountRef.current += 1;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    clickTimerRef.current = setTimeout(() => {
      if (clickCountRef.current >= 2) {
        navigate('/admin/login');
      } else {
        navigate('/');
      }
      clickCountRef.current = 0;
    }, 300);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Double click to access admin */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-foreground flex items-center justify-center">
              <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gradient hidden sm:inline">NOVA</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#new" className="nav-link">New</a>
            <a href="#shop" className="nav-link">Shop</a>
            <a href="#collections" className="nav-link">Collections</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link to={user ? "/my-orders" : "/auth"} className="p-2 nav-link hidden md:flex" title={user ? "طلباتي" : "تسجيل الدخول"}>
              <User className="w-5 h-5" />
            </Link>
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
