
/**
 * Order Storage Utility (Mock Database Layer)
 * Synchronizes orders between Checkout and Admin Dashboard in Real-Time.
 */

export type OrderStatus = "New" | "Processing" | "Shipped" | "Completed";
export type PaymentMethod = "Cash on Delivery" | "Online Paid";

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  date: string;
  estDelivery?: string;
  type: "Single" | "Subscription";
  nextRenewal?: string;
}

const STORAGE_KEY = "trisutra_orders";

// Initial Mock Data (If no orders exist)
const initialOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "9876543210",
    shippingAddress: "123 Wellness Way, New York, NY - 10001",
    items: [{ id: "p1", name: "Ashwagandha Extract", price: 22.50, quantity: 2 }],
    subtotal: 45.00,
    shipping: 0,
    total: 45.00,
    status: "Shipped",
    paymentMethod: "Online Paid",
    date: "2026-04-01",
    estDelivery: "2026-04-05",
    type: "Single"
  },
  {
    id: "ORD-002",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    customerPhone: "8887776665",
    shippingAddress: "456 Herbal St, Los Angeles, CA - 90001",
    items: [{ id: "p2", name: "Triphala Powder", price: 15.50, quantity: 1 }],
    subtotal: 15.50,
    shipping: 50,
    total: 65.50,
    status: "Processing",
    paymentMethod: "Cash on Delivery",
    date: "2026-04-02",
    type: "Single"
  }
];

export const orderStorage = {
  getOrders: (): Order[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialOrders));
        return initialOrders;
      }
      return JSON.parse(stored);
    } catch (err) {
      console.error("Critical: Failed to parse storage data.", err);
      // Fallback to initial data if corruption occurs to prevent crash
      return initialOrders;
    }
  },

  addOrder: (order: Order) => {
    const orders = orderStorage.getOrders();
    const updated = [order, ...orders];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Trigger storage event for cross-tab sync if needed
    window.dispatchEvent(new Event("storage_updated"));
  },

  updateOrder: (orderId: string, updates: Partial<Order>) => {
    const orders = orderStorage.getOrders();
    const updated = orders.map(o => o.id === orderId ? { ...o, ...updates } : o);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Internal event for current tab immediate updates
    window.dispatchEvent(new Event("storage_updated"));
  }
};

/**
 * Universal Sync Hook: Listens for changes from other tabs as well.
 */
window.addEventListener("storage", (event) => {
  if (event.key === STORAGE_KEY) {
    window.dispatchEvent(new Event("storage_updated"));
  }
});
