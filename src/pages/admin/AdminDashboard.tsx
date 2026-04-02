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
import { orderStorage, Order, OrderStatus } from "@/utils/orderStorage";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type ActiveView = "single-new" | "single-processing" | "single-completed" | "sub-new" | "sub-active";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveryDates, setDeliveryDates] = useState<{ [key: string]: string }>({});
  const [activeView, setActiveView] = useState<ActiveView>("single-new");
  const [isPrinting, setIsPrinting] = useState<string | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Load orders on mount and listen for storage updates
  useEffect(() => {
    const loadOrders = () => {
      setOrders(orderStorage.getOrders());
    };
    
    loadOrders();
    window.addEventListener("storage_updated", loadOrders);
    return () => window.removeEventListener("storage_updated", loadOrders);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    const updates: Partial<Order> = { status: newStatus };
    if (newStatus === "Shipped") {
      const deliveryDate = deliveryDates[orderId];
      if (!deliveryDate) {
        toast.error("Please provide an estimated delivery date.");
        return;
      }
      updates.estDelivery = deliveryDate;
    }
    
    orderStorage.updateOrder(orderId, updates);
    toast.success(`Order ${orderId} updated to ${newStatus}`);
  };

  const printInvoice = async (order: Order) => {
    setIsPrinting(order.id);
    toast.info("Generating invoice PDF...");

    // Small delay to ensure the hidden template is rendered with correct data
    setTimeout(async () => {
      if (!invoiceRef.current) return;
      
      try {
        const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`TriSutra_Invoice_${order.id}.pdf`);
        toast.success("Invoice downloaded!");
      } catch (err) {
        toast.error("Failed to generate invoice.");
        console.error(err);
      } finally {
        setIsPrinting(null);
      }
    }, 500);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "New": return <Badge className="bg-blue-500">New</Badge>;
      case "Processing": return <Badge variant="secondary" className="bg-amber-100 text-amber-800">Processing</Badge>;
      case "Shipped": return <Badge className="bg-purple-500">Shipped</Badge>;
      case "Completed": return <Badge className="bg-emerald-500">Completed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderOrderTable = (orderList: Order[]) => (
    <div className="rounded-md border bg-white dark:bg-slate-950 overflow-hidden">
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
              <TableRow key={order.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell>
                  <div className="font-bold">{order.id}</div>
                  <div className="text-[10px] text-muted-foreground">{order.date}</div>
                  {order.type === "Subscription" && (
                    <div className="flex flex-col gap-1 mt-1">
                      <Badge variant="outline" className="text-[9px] uppercase border-amber-200 text-amber-600 w-fit">Subscription</Badge>
                      {(order.status === "New" || order.status === "Processing") && (
                        <Badge className="text-[9px] uppercase bg-red-500 text-white animate-pulse w-fit border-none shadow-sm">Priority</Badge>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-sm">{order.customerName}</div>
                  <div className="text-[11px] text-muted-foreground mb-1">{order.customerEmail}</div>
                  <div className="text-[10px] bg-slate-100 dark:bg-slate-800 p-1 rounded border leading-tight text-slate-600 dark:text-slate-400">
                    {order.shippingAddress}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                  {order.paymentMethod === "Cash on Delivery" ? (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1 font-body text-[10px] h-6">
                      <Wallet size={10} /> COD
                    </Badge>
                  ) : (
                    <Badge variant="default" className="bg-green-600 text-white hover:bg-green-600 gap-1 font-body text-[10px] h-6 shadow-sm border-none">
                      <CreditCard size={10} /> Online Paid
                    </Badge>
                  )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-bold text-primary">₹{order.total.toFixed(2)}</div>
                  <div className="text-[10px] text-muted-foreground font-bold">Total Items: {order.items.reduce((acc, i) => acc + i.quantity, 0)}</div>
                  <div className="mt-2 flex flex-col gap-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-[10px] bg-primary/5 text-primary border border-primary/10 px-2 py-0.5 rounded-sm font-semibold max-w-[200px] whitespace-normal leading-tight">
                        {item.quantity}x {item.name}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(order.status)}
                  {order.estDelivery && (
                    <div className="text-[10px] mt-1.5 text-muted-foreground flex items-center gap-1">
                      <Clock size={10} /> {order.estDelivery}
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
                        <div className="px-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-left w-full">Est. Delivery Date</div>
                        <Input 
                          type="date" 
                          className="h-10 text-xs bg-slate-50/50 border-slate-200 w-full" 
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
                      className="h-9 gap-1.5 w-full max-w-[170px] border-primary/20 hover:bg-primary/5 bg-white shadow-sm"
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

  const getFilteredOrders = (type: "Single" | "Subscription", statusMatch: OrderStatus[]) => {
    return orders.filter(o => o.type === type && statusMatch.includes(o.status));
  };

  const navItemClass = (view: ActiveView) => 
    `w-full justify-start gap-3 pl-8 py-6 rounded-none border-l-4 transition-all ${
      activeView === view 
        ? "bg-primary/5 text-primary border-primary font-bold" 
        : "text-muted-foreground border-transparent hover:bg-secondary/50"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row">
      <aside className="w-full md:w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col sticky top-0 h-screen shadow-sm">
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
                <Badge className="ml-auto bg-primary text-primary-foreground">
                  {getFilteredOrders("Single", ["New"]).length}
                </Badge>
              </Button>
              <Button variant="ghost" className={navItemClass("single-processing")} onClick={() => setActiveView("single-processing")}>
                <RefreshCw size={18} /> Processing
                <Badge variant="outline" className="ml-auto border-amber-500 text-amber-600">
                  {getFilteredOrders("Single", ["Processing"]).length}
                </Badge>
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
                <Badge variant="outline" className="ml-auto border-primary text-primary">
                  {getFilteredOrders("Subscription", ["New", "Processing"]).length}
                </Badge>
              </Button>
              <Button variant="ghost" className={navItemClass("sub-active")} onClick={() => setActiveView("sub-active")}>
                <CheckCircle size={18} /> Active Plans
              </Button>
            </div>
          </div>
        </nav>

        <div className="p-6 border-t mt-auto">
          <Button variant="ghost" className="w-full justify-start gap-4 text-red-500 hover:bg-red-50" onClick={handleLogout}>
            <LogOut size={18} /> Sign Out
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
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
          {isPrinting && (
            (() => {
              const orderToPrint = orders.find(o => o.id === isPrinting);
              if (!orderToPrint) return null;
              
              return (
                <div ref={invoiceRef} className="w-[800px] bg-white p-12 text-black font-sans leading-relaxed border border-slate-200">
                  <div className="flex justify-between border-b-2 border-primary pb-10 mb-10">
                    <div>
                      <h1 className="text-5xl font-black text-primary mb-2 italic">TriSutra</h1>
                      <p className="text-sm font-bold tracking-[0.3em] uppercase text-slate-400">Ayurveda Wellness</p>
                    </div>
                    <div className="text-right">
                      <h2 className="text-2xl font-bold uppercase tracking-widest text-slate-400 mb-4">Invoice</h2>
                      <p className="text-sm font-bold">#{orderToPrint.id}</p>
                      <p className="text-sm text-slate-500">{orderToPrint.date}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-12 mb-12">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                      <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Customer Details</h3>
                      <p className="text-lg font-bold">{orderToPrint.customerName}</p>
                      <p className="text-sm text-slate-600">{orderToPrint.customerEmail}</p>
                      <p className="text-sm text-slate-600">{orderToPrint.customerPhone}</p>
                    </div>
                    <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                      <h3 className="text-xs font-black uppercase text-primary tracking-widest mb-4">Shipping Destination</h3>
                      <p className="text-sm font-bold leading-relaxed whitespace-pre-wrap">{orderToPrint.shippingAddress}</p>
                      <div className="mt-4 pt-4 border-t border-primary/10 flex justify-between items-center bg-transparent">
                        <span className="text-[10px] font-black uppercase text-primary tracking-widest leading-none">Payment Method</span>
                        <span className="text-[11px] font-black text-primary px-3 py-1.5 bg-white rounded-full border border-primary/20 shadow-sm leading-none flex items-center justify-center">
                          {orderToPrint.paymentMethod}
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
                      {orderToPrint.items.map((item, idx) => (
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
                      {orderToPrint.paymentMethod === "Cash on Delivery" && (
                        <div className="bg-amber-500 text-white p-4 rounded-xl text-center font-black uppercase tracking-[0.2em] text-sm shadow-lg rotate-[-1deg]">
                          Cash on Delivery Required
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-24 pt-12 border-t border-slate-100 flex justify-between items-center">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <Clock size={20} className="text-slate-400" />
                      </div>
                      <p className="text-[10px] leading-tight text-slate-400 font-bold uppercase tracking-widest">
                        Estimated Delivery<br/><span className="text-slate-900 text-xs">{orderToPrint.estDelivery || "Preparing..." }</span>
                      </p>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">TriSutra Admin Signature: _________________</p>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
