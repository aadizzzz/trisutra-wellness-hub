import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Package, Settings, LogOut } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const mockOrders = [
  { id: "ORD-1029", date: "May 12, 2024", total: 1299, status: "Delivered" },
  { id: "ORD-1028", date: "April 28, 2024", total: 599, status: "Delivered" },
];

export default function Account() {
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Successfully logged out");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <Navbar />
      
      <main className="flex-1 container-custom section-padding">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-8">My Account</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="bg-secondary/20 p-6 rounded-lg space-y-4">
                <div className="flex items-center gap-3">
                  <div className="shrink-0 h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                    JD
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">John Doe</h3>
                    <p className="text-sm text-muted-foreground truncate" title="john.doe@example.com">john.doe@example.com</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t space-y-2">
                  <button 
                    onClick={() => setActiveTab("profile")}
                    className={`flex items-center gap-2 text-sm w-full text-left py-2 transition-colors ${activeTab === 'profile' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'}`}
                  >
                    <User size={16} /> Profile Details
                  </button>
                  <button 
                    onClick={() => setActiveTab("orders")}
                    className={`flex items-center gap-2 text-sm w-full text-left py-2 transition-colors ${activeTab === 'orders' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'}`}
                  >
                    <Package size={16} /> Orders
                  </button>
                  <button 
                    onClick={() => setActiveTab("settings")}
                    className={`flex items-center gap-2 text-sm w-full text-left py-2 transition-colors ${activeTab === 'settings' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'}`}
                  >
                    <Settings size={16} /> Settings
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm text-destructive w-full text-left py-2 transition-colors mt-auto pt-8 hover:text-destructive/80"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full max-w-md grid-cols-2 md:grid-cols-3">
                  <TabsTrigger value="profile">Profile Details</TabsTrigger>
                  <TabsTrigger value="orders">Order History</TabsTrigger>
                  <TabsTrigger value="settings" className="hidden md:flex">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="pt-6">
                  <div className="bg-card border rounded-lg p-6">
                    <h3 className="text-xl font-heading font-semibold mb-6">Personal Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                        <p className="font-medium">John Doe</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                        <p className="font-medium">john.doe@example.com</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                        <p className="font-medium">+91 98765 43210</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Default Shipping Address</label>
                        <p className="font-medium">123 Wellness Ave, Mumbai, Maharashtra 400001</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="orders" className="pt-6">
                  <div className="bg-card border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 font-medium text-sm">
                      <div>Order ID</div>
                      <div>Date</div>
                      <div>Status</div>
                      <div className="text-right">Total</div>
                    </div>
                    {mockOrders.map((order) => (
                      <div key={order.id} className="grid grid-cols-4 gap-4 p-4 border-t items-center text-sm">
                        <div className="font-medium text-primary">{order.id}</div>
                        <div className="text-muted-foreground">{order.date}</div>
                        <div>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {order.status}
                          </span>
                        </div>
                        <div className="text-right font-semibold">₹{order.total.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="pt-6">
                  <div className="bg-card border rounded-lg p-6">
                    <h3 className="text-xl font-heading font-semibold mb-6">Account Settings</h3>
                    <p className="text-muted-foreground font-body">Notification and privacy settings will be available soon.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
