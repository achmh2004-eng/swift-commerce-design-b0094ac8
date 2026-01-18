import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Store, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  CreditCard,
  Save,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

const SettingsAdmin = () => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [storeSettings, setStoreSettings] = useState({
    storeName: "متجري",
    storeDescription: "متجر إلكتروني للملابس والأزياء",
    storeEmail: "contact@mystore.com",
    storePhone: "+213 555 123 456",
    storeAddress: "الجزائر العاصمة",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderNotifications: true,
    stockAlerts: true,
  });

  const [shipping, setShipping] = useState({
    freeShippingThreshold: 5000,
    defaultShippingCost: 500,
  });

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, isLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const handleSaveSettings = () => {
    toast.success("تم حفظ الإعدادات بنجاح");
  };

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
          title="الإعدادات" 
          subtitle="إعدادات المتجر والنظام"
        />
        
        <div className="p-4 lg:p-8 pt-20 lg:pt-8 max-w-4xl">
          {/* Store Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5" />
                إعدادات المتجر
              </CardTitle>
              <CardDescription>المعلومات الأساسية للمتجر</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">اسم المتجر</Label>
                  <Input
                    id="storeName"
                    value={storeSettings.storeName}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="storeEmail"
                      type="email"
                      value={storeSettings.storeEmail}
                      onChange={(e) => setStoreSettings({ ...storeSettings, storeEmail: e.target.value })}
                      className="pr-10"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storeDescription">وصف المتجر</Label>
                <Textarea
                  id="storeDescription"
                  value={storeSettings.storeDescription}
                  onChange={(e) => setStoreSettings({ ...storeSettings, storeDescription: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storePhone">رقم الهاتف</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="storePhone"
                      value={storeSettings.storePhone}
                      onChange={(e) => setStoreSettings({ ...storeSettings, storePhone: e.target.value })}
                      className="pr-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeAddress">العنوان</Label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="storeAddress"
                      value={storeSettings.storeAddress}
                      onChange={(e) => setStoreSettings({ ...storeSettings, storeAddress: e.target.value })}
                      className="pr-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                الإشعارات
              </CardTitle>
              <CardDescription>إدارة إعدادات الإشعارات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">إشعارات البريد الإلكتروني</p>
                  <p className="text-sm text-muted-foreground">استلام إشعارات عبر البريد</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, emailNotifications: checked })
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">إشعارات الطلبات</p>
                  <p className="text-sm text-muted-foreground">إشعار عند وصول طلب جديد</p>
                </div>
                <Switch
                  checked={notifications.orderNotifications}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, orderNotifications: checked })
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">تنبيهات المخزون</p>
                  <p className="text-sm text-muted-foreground">إشعار عند انخفاض المخزون</p>
                </div>
                <Switch
                  checked={notifications.stockAlerts}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, stockAlerts: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Shipping */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                الشحن والتوصيل
              </CardTitle>
              <CardDescription>إعدادات الشحن والتوصيل</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="freeShipping">حد الشحن المجاني (د.ج)</Label>
                  <Input
                    id="freeShipping"
                    type="number"
                    value={shipping.freeShippingThreshold}
                    onChange={(e) => setShipping({ ...shipping, freeShippingThreshold: Number(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">الحد الأدنى للطلب للحصول على شحن مجاني</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingCost">تكلفة الشحن الافتراضية (د.ج)</Label>
                  <Input
                    id="shippingCost"
                    type="number"
                    value={shipping.defaultShippingCost}
                    onChange={(e) => setShipping({ ...shipping, defaultShippingCost: Number(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">تكلفة الشحن للطلبات تحت الحد</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                الأمان
              </CardTitle>
              <CardDescription>إعدادات الأمان والحساب</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium mb-2">البريد الإلكتروني للمسؤول</p>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
              
              <Button variant="outline" className="w-full md:w-auto">
                تغيير كلمة المرور
              </Button>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} className="gap-2">
              <Save className="w-4 h-4" />
              حفظ الإعدادات
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsAdmin;
