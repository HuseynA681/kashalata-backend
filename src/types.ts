export type OrderStatus = "new" | "accepted" | "preparing" | "ready" | "completed" | "cancelled";

export interface Customer {
  name: string;
  phone: string;
}

export interface OrderItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  source: string;
  orderId: string;
  createdAt: string;
  updatedAt?: string;
  customer: Customer;
  orderType: "pickup" | "dine-in" | "delivery";
  notes: string;
  currency: string;
  total: number;
  items: OrderItem[];
  status: OrderStatus;
}

export interface StaffAccount {
  id: string;
  name: string;
  role: "Cashier" | "Barista" | "Manager";
  avatar: string;
  pin: string;
}

export interface ApiLog {
  id: string;
  timestamp: string;
  method: "POST" | "GET" | "PATCH" | "CORS_PREFLIGHT";
  endpoint: string;
  status: number;
  payload: string;
  type: "incoming" | "outgoing" | "system";
}
