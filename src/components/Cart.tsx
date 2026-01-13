import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CartItem } from "@/contexts/CartContext";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number | string, delta: number) => void;
  onRemove: (id: number | string) => void;
}

const Cart = ({ isOpen, onClose, items, onUpdateQuantity, onRemove }: CartProps) => {
  const navigate = useNavigate();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-2xl animate-slide-in-right">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-bold">Your Cart ({items.length})</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Your cart is empty</p>
                <button onClick={onClose} className="btn-primary">
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex gap-4 p-4 bg-card rounded-xl"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{item.name}</h3>
                      <p className="text-muted-foreground text-sm">{item.category}</p>
                      <p className="font-bold mt-1">${item.price}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button 
                        onClick={() => onRemove(item.id)}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2 bg-secondary rounded-full">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-2 hover:bg-muted rounded-full transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-2 hover:bg-muted rounded-full transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-border space-y-4">
              <div className="flex justify-between text-lg">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold">${total.toFixed(2)}</span>
              </div>
              <button 
                onClick={handleCheckout}
                className="btn-primary w-full text-lg animate-pulse-glow"
              >
                Checkout
              </button>
              <p className="text-center text-xs text-muted-foreground">
                Free shipping on orders over $100
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
