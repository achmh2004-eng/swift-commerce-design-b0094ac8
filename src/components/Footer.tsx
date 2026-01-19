import { Instagram, Twitter, Facebook, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <Link to="/" className="text-2xl font-bold tracking-tight">
              <span className="text-gradient">NOVA</span>
            </Link>
            <p className="text-muted-foreground mt-4 text-sm">
              منتجات عصرية وأساسيات نمط الحياة للجيل الحديث.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">التسوق</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/products" className="hover:text-foreground transition-colors">جميع المنتجات</Link></li>
              <li><Link to="/products?filter=new" className="hover:text-foreground transition-colors">الجديد</Link></li>
              <li><Link to="/products?filter=sale" className="hover:text-foreground transition-colors">التخفيضات</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">المساعدة</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span dir="ltr">+213 555 00 00 00</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>الجزائر</span>
              </li>
              <li><Link to="/my-orders" className="hover:text-foreground transition-colors">تتبع طلبي</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2026 NOVA. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">الخصوصية</a>
            <a href="#" className="hover:text-foreground transition-colors">الشروط</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
