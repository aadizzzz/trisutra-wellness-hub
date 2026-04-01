import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Lock } from "lucide-react";

export default function Checkout() {
  const { items, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 50 : 0; // Flat shipping rate
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsProcessing(true);
    
    // Simulate API call for placing order
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      
      // Navigate to success page with minimal state
      navigate("/order-success", { 
        state: { 
          orderDetails: {
            id: `ORD-${Math.floor(Math.random() * 10000)}`,
            date: new Date().toLocaleDateString(),
            items: [...items],
            total,
            shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
            customerName: formData.name,
            customerEmail: formData.email
          }
        } 
      });
    }, 1500);
  };

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
            {/* Left Column - Form fields */}
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
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-card p-6 rounded-lg border sticky top-24">
                <h2 className="font-heading text-xl font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {item.image && (
                        <div className="relative">
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md border" />
                          <span className="absolute -top-2 -right-2 bg-muted text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border z-10">
                            {item.quantity}
                          </span>
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

                <Button 
                  type="submit" 
                  className="w-full mt-6 flex items-center gap-2" 
                  size="lg" 
                  disabled={isProcessing}
                >
                  <Lock size={16} />
                  {isProcessing ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Secure Checkout. Your details are safe with us.
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
