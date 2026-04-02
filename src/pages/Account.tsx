import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Package, Settings, LogOut } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OrderRow {
  id: string;
  order_number: string;
  created_at: string;
  total: number;
  status: string;
}

export default function Account() {
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ full_name: "", phone: "", address: "", city: "", state: "", pincode: "" });
  const navigate = useNavigate();
  const { user, profile, loading, signOut, updateProfile } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        pincode: profile.pincode || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      supabase
        .from("orders")
        .select("id, order_number, created_at, total, status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          if (data) setOrders(data);
        });
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    toast.success("Successfully logged out");
    navigate("/login");
  };

  const handleSaveProfile = async () => {
    const { error } = await updateProfile(formData);
    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated!");
      setEditing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  const initials = (profile?.full_name || user.email || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{profile?.full_name || "User"}</h3>
                    <p className="text-sm text-muted-foreground truncate" title={user.email}>{user.email}</p>
                  </div>
                </div>
                <div className="pt-4 border-t space-y-2">
                  <button onClick={() => setActiveTab("profile")} className={`flex items-center gap-2 text-sm w-full text-left py-2 transition-colors ${activeTab === 'profile' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'}`}>
                    <User size={16} /> Profile Details
                  </button>
                  <button onClick={() => setActiveTab("orders")} className={`flex items-center gap-2 text-sm w-full text-left py-2 transition-colors ${activeTab === 'orders' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'}`}>
                    <Package size={16} /> Orders
                  </button>
                  <button onClick={() => setActiveTab("settings")} className={`flex items-center gap-2 text-sm w-full text-left py-2 transition-colors ${activeTab === 'settings' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'}`}>
                    <Settings size={16} /> Settings
                  </button>
                  <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-destructive w-full text-left py-2 transition-colors mt-auto pt-8 hover:text-destructive/80">
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
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-heading font-semibold">Personal Information</h3>
                      {!editing && (
                        <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Edit</Button>
                      )}
                    </div>
                    {editing ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Full Name</Label>
                          <Input value={formData.full_name} onChange={(e) => setFormData(p => ({ ...p, full_name: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input value={formData.phone} onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Address</Label>
                          <Input value={formData.address} onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <Label>City</Label>
                          <Input value={formData.city} onChange={(e) => setFormData(p => ({ ...p, city: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <Label>State</Label>
                          <Input value={formData.state} onChange={(e) => setFormData(p => ({ ...p, state: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <Label>PIN Code</Label>
                          <Input value={formData.pincode} onChange={(e) => setFormData(p => ({ ...p, pincode: e.target.value }))} />
                        </div>
                        <div className="md:col-span-2 flex gap-3 pt-2">
                          <Button onClick={handleSaveProfile}>Save Changes</Button>
                          <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                          <p className="font-medium">{profile?.full_name || "—"}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                          <p className="font-medium">{user.email}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                          <p className="font-medium">{profile?.phone || "—"}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-muted-foreground">Address</label>
                          <p className="font-medium">
                            {profile?.address ? `${profile.address}, ${profile.city || ""}, ${profile.state || ""} ${profile.pincode || ""}` : "—"}
                          </p>
                        </div>
                      </div>
                    )}
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
                    {orders.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">No orders yet.</div>
                    ) : (
                      orders.map((order) => (
                        <div key={order.id} className="grid grid-cols-4 gap-4 p-4 border-t items-center text-sm">
                          <div className="font-medium text-primary">{order.order_number}</div>
                          <div className="text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</div>
                          <div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === "Completed" ? "bg-green-100 text-green-800" :
                              order.status === "Shipped" ? "bg-purple-100 text-purple-800" :
                              order.status === "Processing" ? "bg-amber-100 text-amber-800" :
                              "bg-blue-100 text-blue-800"
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="text-right font-semibold">₹{Number(order.total).toFixed(2)}</div>
                        </div>
                      ))
                    )}
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
