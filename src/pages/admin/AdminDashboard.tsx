import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboard, LogOut, Package, RefreshCw, Send,
  CheckCircle, Clock, ShoppingCart, Archive, Repeat, Printer, CreditCard, Wallet
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type OrderStatus = "New" | "Processing" | "Shipped" | "Completed";
type ActiveView = "single-new" | "single-processing" | "single-completed" | "sub-new" | "sub-active";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  payment_method: string;
  order_type: string;
  est_delivery: string | null;
  created_at: string;
  order_items: OrderItem[];
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveryDates, setDeliveryDates] = useState<{ [key: string]: string }>({});
  const [activeView, setActiveView] = useState<ActiveView>("single-new");
  const [isPrinting, setIsPrinting] = useState<string | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const loadOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load orders");
      return;
    }
    setOrders((data || []).map(o => ({
      ...o,
      subtotal: Number(o.subtotal),
      shipping: Number(o.shipping),
      total: Number(o.total),
      order_items: (o.order_items || []).map((i: any) => ({ ...i, price: Number(i.price) })),
    })));
  };

  useEffect(() => {
    loadOrders();

    const channel = supabase
      .channel("orders-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        loadOrders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    const updates: any = { status: newStatus };
    if (newStatus === "Shipped") {
      const deliveryDate = deliveryDates[orderId];
      if (!deliveryDate) {
        toast.error("Please provide an estimated delivery date.");
        return;
      }
      updates.est_delivery = deliveryDate;
    }

    const { error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", orderId);

    if (error) {
      toast.error("Failed to update order");
      return;
    }
    toast.success(`Order updated to ${newStatus}`);
    loadOrders();
  };

  const printInvoice = async (order: Order) => {
    setIsPrinting(order.id);
    toast.info("Generating invoice PDF...");

    setTimeout(async () => {
      if (!invoiceRef.current) return;
      try {
        const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`TriSutra_Invoice_${order.order_number}.pdf`);
        toast.success("Invoice downloaded!");
      } catch (err) {
        toast.error("Failed to generate invoice.");
        console.error(err);
      } finally {
        setIsPrinting(null);
      }
    }, 500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "New": return <Badge className="bg-blue-500">New</Badge>;
      case "Processing": return <Badge variant="secondary" className="bg-amber-100 text-amber-800">Processing</Badge>;
      case "Shipped": return <Badge className="bg-purple-500">Shipped</Badge>;
      case "Completed": return <Badge className="bg-emerald-500">Completed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderOrderTable = (orderList: Order[]) => (
    <div className="rounded-md border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[120px]">Order & Date</TableHead>
            <TableHead className="w-[200px]">Customer & Address</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status / Est.</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-muted-foreground italic">
                No orders found in this category.
              </TableCell>
            </TableRow>
          ) : (
            orderList.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="font-bold">{order.order_number}</div>
                  <div className="text-[10px] text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</div>
                  {order.order_type === "Subscription" && (
                    <Badge variant="outline" className="text-[9px] uppercase border-amber-200 text-amber-600 w-fit mt-1">Subscription</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-sm">{order.customer_name}</div>
                  <div className="text-[11px] text-muted-foreground mb-1">{order.customer_email}</div>
                  <div className="text-[10px] bg-muted p-1 rounded border leading-tight text-muted-foreground">
                    {order.shipping_address}
                  </div>
                </TableCell>
                <TableCell>
                  {order.payment_method === "Cash on Delivery" ? (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1 font-body text-[10px] h-6">
                      <Wallet size={10} /> COD
                    </Badge>
                  ) : (
                    <Badge variant="default" className="bg-green-600 text-white hover:bg-green-600 gap-1 font-body text-[10px] h-6 shadow-sm border-none">
                      <CreditCard size={10} /> Online Paid
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-bold text-primary">₹{order.total.toFixed(2)}</div>
                  <div className="text-[10px] text-muted-foreground font-bold">Items: {order.order_items.reduce((acc, i) => acc + i.quantity, 0)}</div>
                  <div className="mt-2 flex flex-col gap-1">
                    {order.order_items.map((item, idx) => (
                      <div key={idx} className="text-[10px] bg-primary/5 text-primary border border-primary/10 px-2 py-0.5 rounded-sm font-semibold max-w-[200px] whitespace-normal leading-tight">
                        {item.quantity}x {item.name}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(order.status)}
                  {order.est_delivery && (
                    <div className="text-[10px] mt-1.5 text-muted-foreground flex items-center gap-1">
                      <Clock size={10} /> {order.est_delivery}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end gap-2">
                    {order.status === "New" && (
                      <Button size="sm" onClick={() => updateStatus(order.id, "Processing")} className="h-9 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white w-full max-w-[170px] shadow-sm">
                        <CheckCircle size={14} /> Process
                      </Button>
                    )}
                    {order.status === "Processing" && (
                      <div className="flex flex-col gap-2 w-full max-w-[170px]">
                        <div className="px-1 text-[9px] font-bold text-muted-foreground uppercase tracking-widest text-left w-full">Est. Delivery Date</div>
                        <Input
                          type="date"
                          className="h-10 text-xs w-full"
                          onChange={(e) => setDeliveryDates(prev => ({ ...prev, [order.id]: e.target.value }))}
                        />
                        <Button size="sm" onClick={() => updateStatus(order.id, "Shipped")} className="h-9 gap-1.5 bg-purple-600 hover:bg-purple-700 text-white w-full shadow-sm">
                          <Send size={14} /> Ship Order
                        </Button>
                      </div>
                    )}
                    {order.status === "Shipped" && (
                      <Button size="sm" onClick={() => updateStatus(order.id, "Completed")} className="h-9 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white w-full max-w-[170px] shadow-sm">
                        <CheckCircle size={14} /> Mark Delivered
                      </Button>
                    )}
                    <Button
                      variant="outline" size="sm"
                      onClick={() => printInvoice(order)}
                      disabled={isPrinting === order.id}
                      className="h-9 gap-1.5 w-full max-w-[170px] border-primary/20 hover:bg-primary/5 shadow-sm"
                    >
                      <Printer size={14} /> {isPrinting === order.id ? "..." : "Print Invoice"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  const getFilteredOrders = (type: string, statusMatch: string[]) => {
    return orders.filter(o => o.order_type === type && statusMatch.includes(o.status));
  };

  const navItemClass = (view: ActiveView) =>
    `w-full justify-start gap-3 pl-8 py-6 rounded-none border-l-4 transition-all ${
      activeView === view
        ? "bg-primary/5 text-primary border-primary font-bold"
        : "text-muted-foreground border-transparent hover:bg-secondary/50"
    }`;

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col md:flex-row">
      <aside className="w-full md:w-72 bg-card border-r flex flex-col sticky top-0 h-screen shadow-sm">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary text-primary-foreground p-2.5 rounded-xl shadow-lg">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">TriSutra</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold italic">Admin Hub</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-6 pt-2">
          <div>
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-8 mb-4 opacity-50">E-Commerce</h3>
            <div className="flex flex-col">
              <Button variant="ghost" className={navItemClass("single-new")} onClick={() => setActiveView("single-new")}>
                <ShoppingCart size={18} /> New Orders
                <Badge className="ml-auto bg-primary text-primary-foreground">{getFilteredOrders("Single", ["New"]).length}</Badge>
              </Button>
              <Button variant="ghost" className={navItemClass("single-processing")} onClick={() => setActiveView("single-processing")}>
                <RefreshCw size={18} /> Processing
                <Badge variant="outline" className="ml-auto border-amber-500 text-amber-600">{getFilteredOrders("Single", ["Processing"]).length}</Badge>
              </Button>
              <Button variant="ghost" className={navItemClass("single-completed")} onClick={() => setActiveView("single-completed")}>
                <Archive size={18} /> History
              </Button>
            </div>
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-8 mb-4 opacity-50">Subscriptions</h3>
            <div className="flex flex-col">
              <Button variant="ghost" className={navItemClass("sub-new")} onClick={() => setActiveView("sub-new")}>
                <Repeat size={18} /> Pending Action
                <Badge variant="outline" className="ml-auto border-primary text-primary">{getFilteredOrders("Subscription", ["New", "Processing"]).length}</Badge>
              </Button>
              <Button variant="ghost" className={navItemClass("sub-active")} onClick={() => setActiveView("sub-active")}>
                <CheckCircle size={18} /> Active Plans
              </Button>
            </div>
          </div>
        </nav>

        <div className="p-6 border-t mt-auto">
          <Button variant="ghost" className="w-full justify-start gap-4 text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut size={18} /> Sign Out
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-foreground">
              {activeView === "single-new" && "Incoming Requests"}
              {activeView === "single-processing" && "Order Pipeline"}
              {activeView === "single-completed" && "Sales Archive"}
              {activeView === "sub-new" && "Pending Renewals"}
              {activeView === "sub-active" && "Active Subscribers"}
            </h2>
            <p className="text-muted-foreground mt-2 text-lg">
              Manage fulfillment and generate delivery documentation.
            </p>
          </div>
          <Button variant="outline" onClick={loadOrders} className="gap-2">
            <RefreshCw size={16} /> Refresh
          </Button>
        </header>

        <div className="max-w-7xl">
          {activeView === "single-new" && renderOrderTable(getFilteredOrders("Single", ["New"]))}
          {activeView === "single-processing" && renderOrderTable(getFilteredOrders("Single", ["Processing"]))}
          {activeView === "single-completed" && renderOrderTable(getFilteredOrders("Single", ["Shipped", "Completed"]))}
          {activeView === "sub-new" && renderOrderTable(getFilteredOrders("Subscription", ["New", "Processing"]))}
          {activeView === "sub-active" && renderOrderTable(getFilteredOrders("Subscription", ["Shipped", "Completed"]))}
        </div>

        {/* HIDDEN INVOICE TEMPLATE FOR PRINTING */}
        <div style={{ position: "absolute", left: "-9999px", top: 0, pointerEvents: "none" }}>
          {isPrinting && (() => {
            const orderToPrint = orders.find(o => o.id === isPrinting);
            if (!orderToPrint) return null;
            return (
              <div ref={invoiceRef} className="w-[800px] bg-white p-12 text-black font-sans leading-relaxed border">
                <div className="flex justify-between border-b-2 border-primary pb-10 mb-10">
                  <div>
                    <h1 className="text-5xl font-black text-primary mb-2 italic">TriSutra</h1>
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-slate-400">Ayurveda Wellness</p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-slate-400 mb-4">Invoice</h2>
                    <p className="text-sm font-bold">#{orderToPrint.order_number}</p>
                    <p className="text-sm text-slate-500">{new Date(orderToPrint.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-12 mb-12">
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Customer Details</h3>
                    <p className="text-lg font-bold">{orderToPrint.customer_name}</p>
                    <p className="text-sm text-slate-600">{orderToPrint.customer_email}</p>
                    <p className="text-sm text-slate-600">{orderToPrint.customer_phone}</p>
                  </div>
                  <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                    <h3 className="text-xs font-black uppercase text-primary tracking-widest mb-4">Shipping</h3>
                    <p className="text-sm font-bold leading-relaxed whitespace-pre-wrap">{orderToPrint.shipping_address}</p>
                    <div className="mt-4 pt-4 border-t border-primary/10 flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-primary tracking-widest">Payment</span>
                      <span className="text-[11px] font-black text-primary px-3 py-1.5 bg-white rounded-full border border-primary/20 shadow-sm">
                        {orderToPrint.payment_method}
                      </span>
                    </div>
                  </div>
                </div>
                <table className="w-full mb-12 text-left">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Description</th>
                      <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Qty</th>
                      <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Unit Price</th>
                      <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderToPrint.order_items.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-100">
                        <td className="py-6 font-bold">{item.name}</td>
                        <td className="py-6 text-center font-bold">{item.quantity}</td>
                        <td className="py-6 text-right text-slate-500">₹{item.price.toFixed(2)}</td>
                        <td className="py-6 text-right font-black text-primary">₹{(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end pt-6">
                  <div className="w-72 space-y-4">
                    <div className="flex justify-between text-slate-500 font-bold">
                      <span className="text-sm italic">Subtotal</span>
                      <span className="text-sm italic">₹{orderToPrint.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 font-bold">
                      <span className="text-sm italic">Shipping</span>
                      <span className="text-sm italic">₹{orderToPrint.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t-4 border-primary pt-6">
                      <span className="text-xl font-black uppercase tracking-tighter">Grand Total</span>
                      <span className="text-3xl font-black text-primary">₹{orderToPrint.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-24 pt-12 border-t border-slate-100 flex justify-between items-center">
                  <p className="text-[10px] leading-tight text-slate-400 font-bold uppercase tracking-widest">
                    Estimated Delivery: <span className="text-slate-900 text-xs">{orderToPrint.est_delivery || "Preparing..."}</span>
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">TriSutra Admin Signature: _________________</p>
                </div>
              </div>
            );
          })()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
