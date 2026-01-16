import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Plus, Pencil, Trash2, Package, Search } from 'lucide-react';

import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  description: string | null;
  image_url: string | null;
  category: string | null;
  is_new: boolean;
  is_on_sale: boolean;
  stock: number;
}

const ProductsAdmin = () => {
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    original_price: '',
    description: '',
    image_url: '',
    category: '',
    is_new: false,
    is_on_sale: false,
    stock: '0'
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/admin/login');
      } else if (!isAdmin) {
        toast.error('ليس لديك صلاحية الوصول');
        navigate('/');
      } else {
        fetchProducts();
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('خطأ في جلب المنتجات');
      console.error(error);
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      description: formData.description || null,
      image_url: formData.image_url || null,
      category: formData.category || null,
      is_new: formData.is_new,
      is_on_sale: formData.is_on_sale,
      stock: parseInt(formData.stock) || 0
    };

    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);

      if (error) {
        toast.error('خطأ في تحديث المنتج');
        console.error(error);
      } else {
        toast.success('تم تحديث المنتج بنجاح');
        fetchProducts();
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert([productData]);

      if (error) {
        toast.error('خطأ في إضافة المنتج');
        console.error(error);
      } else {
        toast.success('تم إضافة المنتج بنجاح');
        fetchProducts();
      }
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('خطأ في حذف المنتج');
      console.error(error);
    } else {
      toast.success('تم حذف المنتج');
      fetchProducts();
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      original_price: product.original_price?.toString() || '',
      description: product.description || '',
      image_url: product.image_url || '',
      category: product.category || '',
      is_new: product.is_new,
      is_on_sale: product.is_on_sale,
      stock: product.stock.toString()
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      original_price: '',
      description: '',
      image_url: '',
      category: '',
      is_new: false,
      is_on_sale: false,
      stock: '0'
    });
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <AdminSidebar onLogout={handleLogout} />

      <div className="lg:mr-64 min-h-screen">
        <AdminHeader 
          email={user?.email} 
          title="إدارة المنتجات" 
          subtitle={`${products.length} منتج في المتجر`}
        />

        <main className="p-4 lg:p-8">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 lg:p-6 border-b border-border space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="بحث عن منتج..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-10 bg-background"
                  />
                </div>
                
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) resetForm();
                }}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 w-full sm:w-auto">
                      <Plus className="w-4 h-4" />
                      إضافة منتج
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
                    <DialogHeader>
                      <DialogTitle>{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</DialogTitle>
                      <DialogDescription>أدخل بيانات المنتج</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">اسم المنتج *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          placeholder="أدخل اسم المنتج"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="price">السعر *</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                            placeholder="0.00"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="original_price">السعر الأصلي</Label>
                          <Input
                            id="original_price"
                            type="number"
                            step="0.01"
                            value={formData.original_price}
                            onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">الفئة</Label>
                        <Input
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          placeholder="مثال: ملابس، إلكترونيات"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">الوصف</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="وصف مختصر للمنتج..."
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="image_url">رابط الصورة</Label>
                        <Input
                          id="image_url"
                          value={formData.image_url}
                          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock">الكمية المتوفرة</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
                        <div className="flex items-center gap-3">
                          <Switch
                            id="is_new"
                            checked={formData.is_new}
                            onCheckedChange={(checked) => setFormData({ ...formData, is_new: checked })}
                          />
                          <Label htmlFor="is_new">منتج جديد</Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <Switch
                            id="is_on_sale"
                            checked={formData.is_on_sale}
                            onCheckedChange={(checked) => setFormData({ ...formData, is_on_sale: checked })}
                          />
                          <Label htmlFor="is_on_sale">عرض تخفيض</Label>
                        </div>
                      </div>
                      <Button type="submit" className="w-full">
                        {editingProduct ? 'تحديث المنتج' : 'إضافة المنتج'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Mobile Cards View */}
            <div className="lg:hidden">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">لا توجد منتجات</h3>
                  <p className="text-muted-foreground mb-6">ابدأ بإضافة منتجك الأول</p>
                  <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة منتج
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex items-center justify-center shrink-0">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{product.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {product.description || 'بدون وصف'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-bold text-primary">${product.price.toFixed(2)}</span>
                            {product.original_price && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${product.original_price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary" className="text-xs">{product.category || 'بدون فئة'}</Badge>
                          {product.is_new && (
                            <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">جديد</Badge>
                          )}
                          {product.is_on_sale && (
                            <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-xs">تخفيض</Badge>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">لا توجد منتجات</h3>
                  <p className="text-muted-foreground mb-6">ابدأ بإضافة منتجك الأول</p>
                  <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة منتج
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[300px]">المنتج</TableHead>
                        <TableHead>السعر</TableHead>
                        <TableHead>الفئة</TableHead>
                        <TableHead>الكمية</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead className="text-left">إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id} className="group">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                                {product.image_url ? (
                                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                  <Package className="w-5 h-5 text-muted-foreground" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                  {product.description || 'بدون وصف'}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-bold text-primary">${product.price.toFixed(2)}</p>
                              {product.original_price && (
                                <p className="text-sm text-muted-foreground line-through">
                                  ${product.original_price.toFixed(2)}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{product.category || 'بدون فئة'}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className={product.stock <= 5 ? 'text-red-500 font-medium' : ''}>
                              {product.stock}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {product.is_new && (
                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">جديد</Badge>
                              )}
                              {product.is_on_sale && (
                                <Badge className="bg-red-500/10 text-red-500 border-red-500/20">تخفيض</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="text-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductsAdmin;
