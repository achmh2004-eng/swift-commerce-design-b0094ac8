import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Loader2, CheckCircle, CreditCard, Wallet } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { wilayas } from "@/data/algeriaLocations";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart, cartCount, setIsCartOpen } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "baridimob">("cod");
  const [selectedWilaya, setSelectedWilaya] = useState<string>("");
  const [selectedCommune, setSelectedCommune] = useState<string>("");
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    notes: "",
  });

  const communes = useMemo(() => {
    if (!selectedWilaya) return [];
    const wilaya = wilayas.find((w) => w.code === selectedWilaya);
    return wilaya?.communes || [];
  }, [selectedWilaya]);

  const selectedWilayaName = useMemo(() => {
    const wilaya = wilayas.find((w) => w.code === selectedWilaya);
    return wilaya?.nameAr || "";
  }, [selectedWilaya]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWilayaChange = (value: string) => {
    setSelectedWilaya(value);
    setSelectedCommune("");
  };

  const BARIDIMOB_ACCOUNT = "00799999004127558756";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error("سلة التسوق فارغة");
      return;
    }

    if (!selectedWilaya || !selectedCommune) {
      toast.error("يرجى اختيار الولاية والبلدية");
      return;
    }


    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id || null,
          customer_name: formData.fullName,
          customer_email: user?.email || `guest_${Date.now()}@store.com`,
          customer_phone: formData.phone,
          shipping_address: `${formData.address}، ${selectedCommune}`,
          city: selectedWilayaName,
          postal_code: selectedWilaya,
          total_amount: total >= 5000 ? total : total + 500,
          notes: formData.notes || null,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: typeof item.id === "string" ? item.id : null,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
        size: item.size || null,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setOrderId(order.id);
      setOrderSuccess(true);
      clearCart();
      toast.success("تم تأكيد الطلب بنجاح!");
    } catch (error: any) {
      console.error("Order error:", error);
      toast.error("حدث خطأ أثناء تقديم الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-lg">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-4">تم تأكيد الطلب!</h1>
              <p className="text-muted-foreground mb-2">
                شكراً لطلبك. رقم الطلب:
              </p>
              <p className="font-mono text-lg font-semibold mb-8 text-primary">
                {orderId?.slice(0, 8).toUpperCase()}
              </p>
              <p className="text-muted-foreground mb-8">
                سنتواصل معك قريباً لتأكيد التوصيل.
              </p>
              <div className="space-y-3">
                <Button onClick={() => navigate("/")} className="w-full max-w-xs">
                  متابعة التسوق
                </Button>
                <Button 
                  onClick={() => navigate("/my-orders")} 
                  variant="outline" 
                  className="w-full max-w-xs"
                >
                  تتبع طلباتي
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-lg">
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h1 className="text-2xl font-bold mb-4">سلة التسوق فارغة</h1>
              <p className="text-muted-foreground mb-8">
                أضف بعض المنتجات إلى سلتك قبل إتمام الطلب.
              </p>
              <Button onClick={() => navigate("/")}>
                تصفح المنتجات
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 rotate-180" />
            رجوع
          </button>

          <h1 className="text-3xl font-bold mb-8">إتمام الطلب</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Form */}
            <div>
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="text-xl font-semibold mb-6">معلومات التوصيل</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">الاسم الكامل *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="الاسم واللقب"
                      className="text-right"
                      dir="rtl"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="0555 00 00 00"
                      dir="ltr"
                      className="text-left"
                    />
                  </div>

                  {/* Wilaya */}
                  <div className="space-y-2">
                    <Label>الولاية *</Label>
                    <Select value={selectedWilaya} onValueChange={handleWilayaChange}>
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="اختر الولاية" />
                      </SelectTrigger>
                      <SelectContent>
                        {wilayas.map((wilaya) => (
                          <SelectItem key={wilaya.code} value={wilaya.code}>
                            {wilaya.code} - {wilaya.nameAr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Commune */}
                  <div className="space-y-2">
                    <Label>البلدية *</Label>
                    <Select 
                      value={selectedCommune} 
                      onValueChange={setSelectedCommune}
                      disabled={!selectedWilaya}
                    >
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder={selectedWilaya ? "اختر البلدية" : "اختر الولاية أولاً"} />
                      </SelectTrigger>
                      <SelectContent>
                        {communes.map((commune) => (
                          <SelectItem key={commune.name} value={commune.nameAr}>
                            {commune.nameAr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address">العنوان التفصيلي *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="الحي، الشارع، رقم العمارة..."
                      className="text-right"
                      dir="rtl"
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">ملاحظات إضافية (اختياري)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="تعليمات خاصة للتوصيل..."
                      rows={3}
                      className="text-right"
                      dir="rtl"
                    />
                  </div>

                  {/* Payment Method Selection */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <Label className="text-base font-semibold">طريقة الدفع</Label>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value) => setPaymentMethod(value as "cod" | "baridimob")}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3 space-x-reverse p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1 mr-3">
                          <Wallet className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">الدفع عند الاستلام</p>
                            <p className="text-sm text-muted-foreground">ادفع نقداً عند استلام طلبك</p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 space-x-reverse p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <RadioGroupItem value="baridimob" id="baridimob" />
                        <Label htmlFor="baridimob" className="flex items-center gap-3 cursor-pointer flex-1 mr-3">
                          <CreditCard className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">بريدي موب</p>
                            <p className="text-sm text-muted-foreground">الدفع عبر تطبيق بريدي موب</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    {paymentMethod === "baridimob" && (
                      <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-sm font-medium mb-2">قم بالتحويل إلى الحساب التالي:</p>
                        <div className="flex items-center gap-2 bg-background p-3 rounded-lg">
                          <code className="flex-1 text-sm font-mono" dir="ltr">{BARIDIMOB_ACCOUNT}</code>
                          <button 
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(BARIDIMOB_ACCOUNT);
                              toast.success("تم نسخ رقم الحساب");
                            }}
                            className="text-primary hover:text-primary/80 text-sm font-medium"
                          >
                            نسخ
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          بعد التحويل، أرسل لنا إثبات الدفع وسنقوم بمعالجة طلبك
                        </p>
                      </div>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full text-lg py-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                        جاري المعالجة...
                      </>
                    ) : (
                      <>تأكيد الطلب - {(total >= 5000 ? total : total + 500).toFixed(0)} د.ج</>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-card rounded-xl p-6 border border-border sticky top-24">
                <h2 className="text-xl font-semibold mb-6">ملخص الطلب</h2>
                
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex gap-4">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{item.name}</h3>
                        {item.size && (
                          <p className="text-sm text-muted-foreground">المقاس: {item.size}</p>
                        )}
                        <p className="text-sm text-muted-foreground">الكمية: {item.quantity}</p>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">{(item.price * item.quantity).toFixed(0)} د.ج</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>المجموع الفرعي</span>
                    <span>{total.toFixed(0)} د.ج</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>التوصيل</span>
                    <span>{total >= 5000 ? "مجاني" : "500 د.ج"}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                    <span>المجموع</span>
                    <span>{(total >= 5000 ? total : total + 500).toFixed(0)} د.ج</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-4 text-center">
                  التوصيل مجاني للطلبات فوق 5000 د.ج
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
