import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Search, Mail, Phone, MapPin, ShoppingBag, User } from "lucide-react";

interface Customer {
  email: string;
  name: string;
  phone: string | null;
  city: string;
  ordersCount: number;
  totalSpent: number;
  lastOrder: string;
}

const CustomersAdmin = () => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchCustomers();
    }
  }, [user, isAdmin]);

  const fetchCustomers = async () => {
    setLoading(true);
    const { data: orders } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (orders) {
      const customerMap = new Map<string, Customer>();
      
      orders.forEach(order => {
        const existing = customerMap.get(order.customer_email);
        if (existing) {
          existing.ordersCount++;
          existing.totalSpent += Number(order.total_amount);
        } else {
          customerMap.set(order.customer_email, {
            email: order.customer_email,
            name: order.customer_name,
            phone: order.customer_phone,
            city: order.city,
            ordersCount: 1,
            totalSpent: Number(order.total_amount),
            lastOrder: order.created_at,
          });
        }
      });

      setCustomers(Array.from(customerMap.values()));
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <AdminSidebar onLogout={handleLogout} />
      
      <main className="lg:mr-64 min-h-screen">
        <AdminHeader 
          email={user?.email} 
          title="العملاء" 
          subtitle="إدارة بيانات العملاء"
        />
        
        <div className="p-4 lg:p-8 pt-20 lg:pt-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">إجمالي العملاء</p>
                    <p className="text-xl font-bold">{customers.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">إجمالي الطلبات</p>
                    <p className="text-xl font-bold">{customers.reduce((sum, c) => sum + c.ordersCount, 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="البحث عن عميل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Customers Table - Desktop */}
          <Card className="hidden lg:block">
            <CardHeader>
              <CardTitle>قائمة العملاء</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">العميل</TableHead>
                      <TableHead className="text-right">البريد الإلكتروني</TableHead>
                      <TableHead className="text-right">الهاتف</TableHead>
                      <TableHead className="text-right">المدينة</TableHead>
                      <TableHead className="text-right">عدد الطلبات</TableHead>
                      <TableHead className="text-right">إجمالي المشتريات</TableHead>
                      <TableHead className="text-right">آخر طلب</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone || "-"}</TableCell>
                        <TableCell>{customer.city}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{customer.ordersCount}</Badge>
                        </TableCell>
                        <TableCell>{customer.totalSpent.toLocaleString()} د.ج</TableCell>
                        <TableCell>
                          {new Date(customer.lastOrder).toLocaleDateString('ar-DZ')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              {!loading && filteredCustomers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  لا يوجد عملاء
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customers Cards - Mobile */}
          <div className="lg:hidden space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  لا يوجد عملاء
                </CardContent>
              </Card>
            ) : (
              filteredCustomers.map((customer, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">{customer.email}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{customer.ordersCount} طلبات</Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{customer.city}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">إجمالي المشتريات</p>
                        <p className="font-semibold text-primary">{customer.totalSpent.toLocaleString()} د.ج</p>
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground">آخر طلب</p>
                        <p className="text-sm">{new Date(customer.lastOrder).toLocaleDateString('ar-DZ')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomersAdmin;
