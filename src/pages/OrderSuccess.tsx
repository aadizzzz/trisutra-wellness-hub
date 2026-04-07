import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef, useState } from "react";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // If someone navigates here directly without checking out, send them back
  if (!location.state || !location.state.orderDetails) {
    navigate("/shop");
    return null;
  }

  const { orderDetails } = location.state;

  const downloadInvoice = async () => {
    if (!invoiceRef.current) return;
    setIsDownloading(true);

    try {
      // Temporary show the invoice to capture it
      invoiceRef.current.classList.remove("h-0", "overflow-hidden", "opacity-0");
      
      const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
      
      // Hide it back
      invoiceRef.current.classList.add("h-0", "overflow-hidden", "opacity-0");
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${orderDetails.id}.pdf`);
    } catch (error) {
      console.error("Could not generate PDF", error);
      setIsDownloading(false);
      invoiceRef.current?.classList.add("h-0", "overflow-hidden", "opacity-0");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <Navbar />
      
      <main className="flex-1 container-custom bg-muted/20 py-12 flex flex-col items-center">
        <div className="text-center mb-8 max-w-lg">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="font-heading text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order <span className="font-medium text-foreground">{orderDetails.id}</span> has been successfully placed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-12">
          <Button variant="outline" onClick={() => navigate("/shop")}>
            Continue Shopping
          </Button>
          <Button onClick={downloadInvoice} disabled={isDownloading} className="flex items-center gap-2">
            <Download size={16} />
            {isDownloading ? "Generating PDF..." : "Download Invoice"}
          </Button>
        </div>

        {/* Hidden Invoice Template for PDF Generation */}
        <div className="absolute top-0 left-[-9999px]">
          <div ref={invoiceRef} className="opacity-0 h-0 overflow-hidden w-[800px] bg-white text-black p-10 font-body">
            <div className="flex justify-between items-start mb-12 border-b pb-8">
              <div>
                <h1 className="text-4xl font-bold text-primary mb-2">INVOICE</h1>
                <p className="text-gray-500">Order ID: {orderDetails.id}</p>
                <p className="text-gray-500">Date: {orderDetails.date}</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold text-primary">TriSutra Ayurveda</h2>
                <p className="text-sm text-gray-500">Ancient wisdom, modern wellness</p>
                <p className="text-sm text-gray-500 mt-2">contact@trisutra.online</p>
                <p className="text-sm text-gray-500">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex justify-between mb-12">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</h3>
                <p className="font-medium">{orderDetails.customerName}</p>
                <p className="text-sm text-gray-600">{orderDetails.customerEmail}</p>
              </div>
              <div className="text-right">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Shipped To</h3>
                <p className="text-sm text-gray-600 max-w-[200px] whitespace-pre-wrap mb-4">{orderDetails.shippingAddress}</p>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Payment Method</h3>
                <p className="text-sm font-bold text-primary italic uppercase tracking-wider">{orderDetails.paymentMethod}</p>
              </div>
            </div>

            <table className="w-full text-left mb-12">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 text-sm font-bold text-gray-400 uppercase tracking-wider">Item</th>
                  <th className="py-3 text-center text-sm font-bold text-gray-400 uppercase tracking-wider w-24">Qty</th>
                  <th className="py-3 text-right text-sm font-bold text-gray-400 uppercase tracking-wider w-32">Price</th>
                  <th className="py-3 text-right text-sm font-bold text-gray-400 uppercase tracking-wider w-32">Amount</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.items.map((item: any) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-4 font-medium">{item.name}</td>
                    <td className="py-4 text-center text-gray-600">{item.quantity}</td>
                    <td className="py-4 text-right text-gray-600">₹{item.price.toFixed(2)}</td>
                    <td className="py-4 text-right font-medium">₹{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-64 space-y-3 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{(orderDetails.total - 50).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Flat Rate</span>
                  <span>₹50.00</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-3 border-gray-200">
                  <span>Total</span>
                  <span className="text-primary">₹{orderDetails.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center text-sm text-gray-400 border-t pt-8">
              <p>Thank you for shopping with TriSutra Ayurveda.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
