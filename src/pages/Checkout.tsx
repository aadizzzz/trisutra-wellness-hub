import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Lock, Wallet, Truck } from "lucide-react";
import { toast } from "sonner";

type PaymentMethod = "Cash on Delivery" | "Online Paid";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function useRazorpayScript() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      setLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
  }, []);
  return loaded;
}

export default function Checkout() {
  const { items, getCartTotal, clearCart } = useCart();
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Online Paid");
  const razorpayLoaded = useRazorpayScript();

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to continue to checkout");
      navigate("/auth?redirect=/checkout");
    }
  }, [user, authLoading, navigate]);

  const [formData, setFormData] = useState({
    name: profile?.full_name || "",
    email: user?.email || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    city: profile?.city || "",
    state: profile?.state || "",
    pincode: profile?.pincode || "",
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const createOrder = async () => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase().padEnd(5, "X");
    const orderNumber = `ORD-${dateStr}-${randomStr}`;
    const shippingAddress = `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`;
    const isSubscription = items.some(
      (item) => item.category === "Subscription" || item.name.toLowerCase().includes("subscription")
    );

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: user!.id,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: shippingAddress,
        subtotal,
        shipping,
        total,
        status: paymentMethod === "Cash on Delivery" ? "New" : "Pending Payment",
        payment_method: paymentMethod,
        order_type: isSubscription ? "Subscription" : "Single",
        payment_status: paymentMethod === "Cash on Delivery" ? "cod" : "pending",
      })
      .select("id")
      .single();

    if (orderError) throw orderError;

    const orderItems = items.map((i) => ({
      order_id: order.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) throw itemsError;

    return { orderId: order.id, orderNumber, shippingAddress };
  };

  const handleOnlinePayment = async (orderId: string, orderNumber: string, shippingAddress: string) => {
    const res = await supabase.functions.invoke("create-razorpay-order", {
      body: { amount: total, receipt: orderNumber },
    });

    if (res.error || !res.data?.orderId) {
      throw new Error("Failed to create payment order");
    }

    const { orderId: razorpayOrderId, key } = res.data;

    return new Promise<void>((resolve, reject) => {
      const options = {
        key,
        amount: Math.round(total * 100),
        currency: "INR",
        name: "TriSutra Ayurveda",
        description: `Order ${orderNumber}`,
        order_id: razorpayOrderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        handler: async (response: any) => {
          try {
                const { data: { session } } = await supabase.auth.getSession();
                
                const verifyRes = await supabase.functions.invoke("verify-razorpay-payment", {
                  body: {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    order_id: orderId,
                  },
                });

            if (verifyRes.error) {
              console.error("Payment verification invoke error:", verifyRes.error);
              throw new Error(`Payment verification failed: ${verifyRes.error.message || 'Check console'}`);
            }
            if (!verifyRes.data?.verified) {
              console.error("Payment verification failed:", verifyRes.data);
              const errorMsg = verifyRes.data?.message || verifyRes.data?.error || "Payment verification failed";
              const extraDetails = verifyRes.data?.details ? ` (${verifyRes.data.details})` : "";
              throw new Error(`${errorMsg}${extraDetails}`);
            }
            resolve();
          } catch (err) {
            reject(err);
          }
        },
        modal: {
          ondismiss: () => reject(new Error("Payment cancelled")),
        },
        theme: { color: "#8B5E3C" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (paymentMethod === "Online Paid" && !razorpayLoaded) {
      toast.error("Payment system is loading. Please try again.");
      return;
    }

    setIsProcessing(true);

    try {
      const { orderId, orderNumber, shippingAddress } = await createOrder();

      if (paymentMethod === "Online Paid") {
        await handleOnlinePayment(orderId, orderNumber, shippingAddress);
      }

      clearCart();
      navigate("/order-success", {
        state: {
          orderDetails: {
            id: orderNumber,
            customerName: formData.name,
            customerEmail: formData.email,
            shippingAddress,
            items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
            total,
            paymentMethod,
            date: new Date().toLocaleDateString(),
          },
        },
      });
    } catch (err: any) {
      if (err.message === "Payment cancelled") {
        toast.info("Payment was cancelled.");
      } else {
        toast.error(err.message || "Failed to place order. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col pt-20">
        <Navbar />
        <main className="flex-1 container-custom flex flex-col items-center justify-center">
          <h2 className="text-2xl font-heading mb-4">Your cart is empty</h2>
          <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <Navbar />
      <main className="flex-1 container-custom bg-muted/20">
        <div className="max-w-6xl mx-auto py-8">
          <h1 className="font-heading text-3xl font-bold mb-8">Checkout</h1>
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-card p-6 rounded-lg border">
                <h2 className="font-heading text-xl font-semibold mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" name="name" required value={formData.name} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" name="email" required value={formData.email} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} />
                  </div>
                </div>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h2 className="font-heading text-xl font-semibold mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Textarea id="address" name="address" required value={formData.address} onChange={handleInputChange} className="resize-none" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input id="city" name="city" required value={formData.city} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input id="state" name="state" required value={formData.state} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">PIN Code *</Label>
                      <Input id="pincode" name="pincode" required value={formData.pincode} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h2 className="font-heading text-xl font-semibold mb-6">Payment Method</h2>
                <RadioGroup defaultValue="Online Paid" value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <RadioGroupItem value="Online Paid" id="online" className="peer sr-only" />
                    <Label htmlFor="online" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all">
                      <Wallet className="mb-3 h-6 w-6 text-primary" />
                      <span className="font-semibold">Online Payment</span>
                      <span className="text-[10px] text-muted-foreground mt-1 text-center">Card / UPI / NetBanking / Wallet</span>
                    </Label>
                  </div>
                  <div className="relative">
                    <RadioGroupItem value="Cash on Delivery" id="cod" className="peer sr-only" />
                    <Label htmlFor="cod" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all">
                      <Truck className="mb-3 h-6 w-6 text-primary" />
                      <span className="font-semibold">Cash on Delivery</span>
                      <span className="text-[10px] text-muted-foreground mt-1 text-center">Pay when you receive the order</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="bg-card p-6 rounded-lg border sticky top-24">
                <h2 className="font-heading text-xl font-semibold mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {item.image && (
                        <div className="relative">
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md border" />
                          <span className="absolute -top-2 -right-2 bg-muted text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border z-10">{item.quantity}</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                        <p className="text-primary font-semibold text-sm mt-1">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-3 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-medium text-foreground">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="font-medium text-foreground">₹{shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-3">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toFixed(2)}</span>
                  </div>
                </div>
                <Button type="submit" className="w-full mt-6 flex items-center gap-2" size="lg" disabled={isProcessing}>
                  <Lock size={16} />
                  {isProcessing ? "Processing..." : paymentMethod === "Online Paid" ? `Pay ₹${total.toFixed(2)}` : `Place Order (₹${total.toFixed(2)})`}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  {paymentMethod === "Online Paid" ? "Secured by Razorpay. Your payment details are safe." : "Secure Checkout. Your details are safe with us."}
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
