import React, { useState, useEffect, useRef } from "react";
import { 
  Smartphone, 
  Coffee, 
  Bell, 
  BellRing, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Send, 
  CheckCircle, 
  Clock, 
  User, 
  Phone, 
  FileText, 
  LogOut, 
  Volume2, 
  VolumeX, 
  Terminal, 
  Copy, 
  Check, 
  X, 
  Lock, 
  RefreshCw, 
  TrendingUp, 
  Coins, 
  AlertTriangle 
} from "lucide-react";
import { Order, OrderStatus, OrderItem, ApiLog } from "./types";
import { playAlertChime, playHapticTap } from "./lib/audio";

// Initial staff PIN setup
const STAFF_ACCOUNTS = [
  { name: "Huseyn", role: "Manager", pin: "3302", avatar: "👨‍💼" },
  { name: "Aysel Aliyeva", role: "Barista", pin: "1234", avatar: "👩‍🍳" },
  { name: "Farid Karimov", role: "Cashier", pin: "4321", avatar: "👨‍🍳" }
];

const MENU_ITEMS = [
  // Classic Coffees
  { id: "espresso", name: "Espresso", category: "Classic Coffees", price: 3.50 },
  { id: "americano", name: "Americano", category: "Classic Coffees", price: 4.90 },
  { id: "cortado-m", name: "Cortado M", category: "Classic Coffees", price: 5.30 },
  { id: "flat-white", name: "Flat White", category: "Classic Coffees", price: 5.90 },
  { id: "latte", name: "Latte", category: "Classic Coffees", price: 6.50 },
  { id: "cappuccino", name: "Cappuccino", category: "Classic Coffees", price: 5.70 },
  { id: "raf-vanilla", name: "Raf Coffee with Vanilla", category: "Classic Coffees", price: 8.90 },
  { id: "raf-lavender", name: "Raf Coffee with Lavender", category: "Classic Coffees", price: 8.90 },
  { id: "raf-spices", name: "Raf Coffee with Spices", category: "Classic Coffees", price: 8.90 },

  // Specialty Coffees
  { id: "special-kashalata-latte", name: "Special Kashalata Latte", category: "Specialty Coffees", price: 7.90 },
  { id: "lemon-tart-latte", name: "Lemon Tart Latte", category: "Specialty Coffees", price: 7.90 },
  { id: "spanish-latte", name: "Spanish Latte", category: "Specialty Coffees", price: 7.90 },
  { id: "nuts-cream-latte", name: "Nuts Cream Latte", category: "Specialty Coffees", price: 7.90 },
  { id: "mocha-coffee", name: "Mocha Coffee", category: "Specialty Coffees", price: 6.90 },
  { id: "white-mocha-coffee", name: "White Mocha Coffee", category: "Specialty Coffees", price: 6.90 },

  // Hot Drinks
  { id: "hot-chocolate", name: "Hot Chocolate", category: "Hot Drinks", price: 6.90 },
  { id: "hot-white-chocolate", name: "Hot White Chocolate", category: "Hot Drinks", price: 6.40 },
  { id: "chai-tea-latte", name: "Chai Tea Latte", category: "Hot Drinks", price: 6.50 },

  // Hot Teas
  { id: "classic-green-tea", name: "Classic Green Tea", category: "Hot Teas", price: 5.00 },
  { id: "jasmine-tea", name: "Jasmine Tea", category: "Hot Teas", price: 5.00 },
  { id: "persian-apple-tea", name: "Persian Apple Tea", category: "Hot Teas", price: 5.00 },
  { id: "fragrant-mint-tea", name: "Fragrant Mint Tea", category: "Hot Teas", price: 5.00 },
  { id: "ginger-breeze-tea", name: "Ginger Breeze Tea", category: "Hot Teas", price: 5.00 },
  { id: "rooibos-vanilla-toffee", name: "Rooibos Vanilla Toffee Tea", category: "Hot Teas", price: 5.00 },

  // Matchas
  { id: "classic-matcha", name: "Classic Matcha", category: "Matchas", price: 6.50 },
  { id: "matcha-bergamot", name: "Matcha with Bergamot", category: "Matchas", price: 6.90 },

  // Iced Coffee
  { id: "bumble-bee-coffee", name: "Bumble Bee Coffee", category: "Iced Coffee", price: 7.90 },
  { id: "iced-mocha-coffee", name: "Iced Mocha Coffee", category: "Iced Coffee", price: 7.20 },
  { id: "iced-latte", name: "Iced Latte", category: "Iced Coffee", price: 6.00 },
  { id: "iced-spanish-latte", name: "Iced Spanish Latte", category: "Iced Coffee", price: 6.90 },
  { id: "iced-americano", name: "Iced Americano", category: "Iced Coffee", price: 5.20 },

  // Refreshing Coffee Drinks
  { id: "refreshing-choco-drink", name: "Refreshing Choco Drink", category: "Refreshing Coffee Drinks", price: 7.90 },
  { id: "refreshing-nuts-drink", name: "Refreshing Nuts Drink", category: "Refreshing Coffee Drinks", price: 7.90 },
  { id: "refreshing-kashalata-drink", name: "Refreshing Kashalata Drink", category: "Refreshing Coffee Drinks", price: 7.90 },

  // Iced Matcha
  { id: "iced-matcha-pistachio", name: "Iced Matcha with Pistachio", category: "Iced Matcha", price: 7.90 },
  { id: "iced-matcha-bergamot", name: "Iced Matcha with Bergamot", category: "Iced Matcha", price: 7.90 },
  { id: "classic-iced-matcha", name: "Classic Iced Matcha", category: "Iced Matcha", price: 7.50 },

  // Refreshing Fruit Drinks
  { id: "refreshing-mixed-berries", name: "Refreshing Mixed Berries Drink", category: "Refreshing Fruit Drinks", price: 7.90 },
  { id: "refreshing-passion-fruit", name: "Refreshing Passion Fruit Drink", category: "Refreshing Fruit Drinks", price: 7.90 },
  { id: "refreshing-mango-drink", name: "Refreshing Mango Drink", category: "Refreshing Fruit Drinks", price: 7.90 },

  // Homemade Lemonades
  { id: "spiced-lemonade-mango", name: "Spiced Lemonade with Mango", category: "Homemade Lemonades", price: 6.90 },
  { id: "lemonade-lavender", name: "Lemonade with Lavender", category: "Homemade Lemonades", price: 6.90 },
  { id: "spiced-lemonade-pomegranate", name: "Spiced Lemonade with Pomegranate", category: "Homemade Lemonades", price: 6.90 },
  { id: "lemonade-red-mango", name: "Lemonade with Red Mango", category: "Homemade Lemonades", price: 6.90 },
  { id: "lemonade-bubble-gum-kiwi", name: "Lemonade Bubble Gum with Kiwi", category: "Homemade Lemonades", price: 6.90 },
  { id: "lemonade-mango-passion-fruit", name: "Lemonade with Mango & Passion Fruit", category: "Homemade Lemonades", price: 6.90 },

  // Iced Teas
  { id: "iced-spiced-tea-mango", name: "Iced Spiced Tea with Mango", category: "Iced Teas", price: 6.90 },
  { id: "iced-tea-lavender", name: "Iced Tea with Lavender", category: "Iced Teas", price: 6.90 },
  { id: "iced-spiced-tea-pomegranate", name: "Iced Spiced Tea with Pomegranate", category: "Iced Teas", price: 6.90 },
  { id: "iced-tea-red-mango", name: "Iced Tea with Red Mango", category: "Iced Teas", price: 6.90 },
  { id: "iced-tea-bubble-gum-kiwi", name: "Iced Tea Bubble Gum & Kiwi", category: "Iced Teas", price: 6.90 },
  { id: "iced-tea-mango-passion-fruit", name: "Iced Tea with Mango & Passion Fruit", category: "Iced Teas", price: 6.90 },

  // Fresh Fruit Juices
  { id: "fresh-orange-apple-juice", name: "Fresh Orange & Apple Juice", category: "Fresh Fruit Juices", price: 8.00 },
  { id: "fresh-orange-grapefruit-juice", name: "Fresh Orange & Grapefruit Juice", category: "Fresh Fruit Juices", price: 8.00 },
  { id: "fresh-apple-juice", name: "Fresh Apple Juice", category: "Fresh Fruit Juices", price: 7.00 },
  { id: "fresh-grapefruit-juice", name: "Fresh Grapefruit Juice", category: "Fresh Fruit Juices", price: 8.00 },
  { id: "fresh-orange-juice", name: "Fresh Orange Juice", category: "Fresh Fruit Juices", price: 8.00 },

  // Food
  { id: "turkey-toast", name: "Turkey Toast", category: "Food", price: 8.00 },
  { id: "toast-with-cheese", name: "Toast with Cheese", category: "Food", price: 7.00 },
  { id: "tuna-salad", name: "Tuna Salad", category: "Food", price: 10.00 },
  { id: "caesar-salad-chicken", name: "Caesar Salad with Chicken", category: "Food", price: 11.00 },
  { id: "chicken-salad", name: "Chicken Salad", category: "Food", price: 10.00 },
  { id: "caesar-roll", name: "Caesar Roll", category: "Food", price: 8.00 },
  { id: "chicken-roll", name: "Chicken Roll", category: "Food", price: 8.00 },
  { id: "salmon-bowl", name: "Salmon Bowl", category: "Food", price: 14.00 },

  // Desserts
  { id: "mars-cake", name: "Mars Cake", category: "Desserts", price: 9.00 },
  { id: "honey-cake", name: "Honey Cake", category: "Desserts", price: 8.00 },
  { id: "lotus-cheesecake", name: "Lotus Cheesecake", category: "Desserts", price: 9.00 },
  { id: "san-sebastian", name: "San Sebastian Cheesecake", category: "Desserts", price: 9.00 },
  { id: "hamza-pasha-cake", name: "Hamza Pasha Cake", category: "Desserts", price: 7.00 },
  { id: "crepe-with-raspberry", name: "Crepe with Raspberry", category: "Desserts", price: 9.00 },
  { id: "diet-brownie-chocolate", name: "Diet Brownie with Chocolate", category: "Desserts", price: 9.00 },
  { id: "diet-passion-fruit-cheesecake", name: "Diet Passion Fruit Cheesecake", category: "Desserts", price: 9.00 }
];

const DEMO_CUSTOMERS = [
  { name: "Tofig Aliyev", phone: "+994501234567", notes: "Please write 'Happy Birthday!' on the cheesecake box if possible." },
  { name: "Lala Mammadi", phone: "+994709876543", notes: "Dine-in Table 4. Extra foam on cappuccino." },
  { name: "Eldar Gasimov", phone: "+994555432109", notes: "Pickup in 10 minutes. Please make it fast!" },
  { name: "Gunel Hasanova", phone: "+994513334455", notes: "Oat milk substitution if possible please." }
];

export default function App() {
  // Application endpoints
  const [appUrl, setAppUrl] = useState<string>("");
  const [currentView, setCurrentView] = useState<"dashboard" | "client" | "staff">("dashboard");
  
  // Real-time states
  const [orders, setOrders] = useState<Order[]>([]);
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [stats, setStats] = useState({
    totalOrdersCount: 0,
    activeCount: 0,
    todayCount: 0,
    completedTodayCount: 0,
    earningsToday: 0
  });

  // Client settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("connecting");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulated Website Customer form
  const [webCart, setWebCart] = useState<{ [itemId: string]: number }>({
    "latte": 1,
    "san-sebastian": 1
  });
  const [webCustomer, setWebCustomer] = useState({
    name: "Tofig Aliyev",
    phone: "+994 50 123 45 67",
    orderType: "pickup" as "pickup" | "dine-in" | "delivery",
    notes: "No sugar in the latte, please. Fast pickup."
  });
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Simulated Android App Status
  const [isStaffLoggedIn, setIsStaffLoggedIn] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(STAFF_ACCOUNTS[0]);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  
  const [selectedOrderIdInPhone, setSelectedOrderIdInPhone] = useState<string | null>(null);
  const [activePhoneTab, setActivePhoneTab] = useState<"active" | "history">("active");
  const [unreadNotifications, setUnreadNotifications] = useState<Order[]>([]);
  const [phoneVibrating, setPhoneVibrating] = useState(false);

  // Fetch full orders list
  const fetchOrders = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
      addTelemetryLog("GET", "/api/orders", 200, JSON.stringify(data).substring(0, 150) + "...", "outgoing");
      
      // Update local quick stats calculations
      const todayString = new Date().toISOString().split("T")[0];
      const todayTotal = data.filter((o: any) => o.createdAt.startsWith(todayString));
      const active = data.filter((o: any) => ["new", "accepted", "preparing", "ready"].includes(o.status));
      const earnings = todayTotal
        .filter((o: any) => o.status === "completed")
        .reduce((acc: number, o: any) => acc + (o.total || 0), 0);

      setStats({
        totalOrdersCount: data.length,
        activeCount: active.length,
        todayCount: todayTotal.length,
        completedTodayCount: todayTotal.filter((o: any) => o.status === "completed").length,
        earningsToday: earnings
      });
    } catch (err: any) {
      console.error(err);
      addTelemetryLog("GET", "/api/orders", 500, err.message, "system");
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  };

  // Live SSE connection for incoming orders
  useEffect(() => {
    setAppUrl(window.location.origin);
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get("view");
    if (viewParam === "client" || viewParam === "staff" || viewParam === "dashboard") {
      setCurrentView(viewParam);
    }

    const eventSource = new EventSource("/api/events");

    eventSource.onopen = () => {
      setConnectionStatus("connected");
      addTelemetryLog("GET", "/api/events", 200, "Server-Sent Events (SSE) stream established", "system");
    };

    eventSource.onerror = () => {
      setConnectionStatus("disconnected");
      addTelemetryLog("GET", "/api/events", 500, "Connection dropped, attempting to reconnect...", "system");
    };

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === "new_order") {
          const newOrder = payload.data as Order;
          addTelemetryLog("POST", "/api/orders", 201, `[SSE Alert] New Order placed: ${newOrder.orderId}`, "incoming");
          
          // Trigger notifications and play synthetic Web Audio
          if (soundEnabled) {
            playAlertChime();
          }
          
          // Trigger mock physical haptics sound & screen vibration
          setPhoneVibrating(true);
          setTimeout(() => setPhoneVibrating(false), 900);

          setUnreadNotifications((prev) => [newOrder, ...prev]);
          
          // Automatically fetch updated list
          fetchOrders(true);
        } else if (payload.type === "status_change") {
          const updatedOrder = payload.data as Order;
          addTelemetryLog("PATCH", `/api/orders/${updatedOrder.orderId}/status`, 200, `[SSE Event] Status changed to ${updatedOrder.status}`, "incoming");
          fetchOrders(true);
        }
      } catch (err) {
        console.error("Error parsing event payload:", err);
      }
    };

    fetchOrders();

    return () => {
      eventSource.close();
    };
  }, [soundEnabled]);

  // Telemetry logs system helper
  const addTelemetryLog = (
    method: "POST" | "GET" | "PATCH" | "CORS_PREFLIGHT", 
    endpoint: string, 
    status: number, 
    payload: string,
    type: "incoming" | "outgoing" | "system"
  ) => {
    const newLog: ApiLog = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      method,
      endpoint,
      status,
      payload,
      type
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 30));
  };

  // Submit Simulated Website Order
  const submitDemoOrder = async () => {
    setIsSubmittingOrder(true);
    playHapticTap();

    // Calculate details
    const orderId = `KSH-${Date.now()}`;
    const itemsList: OrderItem[] = [];
    let totalValue = 0;

    Object.keys(webCart).forEach((itemId) => {
      const qty = webCart[itemId];
      if (qty > 0) {
        const itemObj = MENU_ITEMS.find((m) => m.id === itemId);
        if (itemObj) {
          const lineTotal = itemObj.price * qty;
          totalValue += lineTotal;
          itemsList.push({
            id: itemObj.id,
            name: itemObj.name,
            category: itemObj.category,
            price: itemObj.price,
            quantity: qty,
            lineTotal: parseFloat(lineTotal.toFixed(2))
          });
        }
      }
    });

    if (itemsList.length === 0) {
      alert("Please add at least one item to the cart first!");
      setIsSubmittingOrder(false);
      return;
    }

    const orderPayload = {
      source: "kashalata-website",
      orderId,
      createdAt: new Date().toISOString(),
      customer: {
        name: webCustomer.name,
        phone: webCustomer.phone
      },
      orderType: webCustomer.orderType,
      notes: webCustomer.notes,
      currency: "AZN",
      total: parseFloat(totalValue.toFixed(2)),
      items: itemsList
    };

    try {
      // Simulate CORS preflight telemetry
      addTelemetryLog("CORS_PREFLIGHT", "/api/orders", 200, "Origin Allowed: kashalata.az", "incoming");

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderPayload)
      });

      if (response.ok) {
        const result = await response.json();
        addTelemetryLog("POST", "/api/orders", 201, JSON.stringify(orderPayload), "incoming");
      } else {
        addTelemetryLog("POST", "/api/orders", response.status, "Failed to submit order to API", "incoming");
      }
    } catch (err: any) {
      addTelemetryLog("POST", "/api/orders", 500, err.message, "system");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Change status of order from Android Staff simulator
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    playHapticTap();
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        const data = await response.json();
        // Optimistically update or fetch
        fetchOrders(true);
      } else {
        addTelemetryLog("PATCH", `/api/orders/${orderId}/status`, response.status, "Failed to update status", "outgoing");
      }
    } catch (err: any) {
      addTelemetryLog("PATCH", `/api/orders/${orderId}/status`, 500, err.message, "system");
    }
  };

  // Staff unlock PIN handler
  const handlePinDigit = (digit: string) => {
    playHapticTap();
    if (pinInput.length < 4) {
      const nextPin = pinInput + digit;
      setPinInput(nextPin);
      if (nextPin.length === 4) {
        if (nextPin === selectedStaff.pin) {
          setIsStaffLoggedIn(true);
          setPinError(false);
          setPinInput("");
        } else {
          setPinError(true);
          setPinInput("");
          setTimeout(() => setPinError(false), 800);
        }
      }
    }
  };

  const handleClearPin = () => {
    playHapticTap();
    setPinInput("");
  };

  // Quick preset loader helper
  const loadRandomCustomerPreset = () => {
    playHapticTap();
    const preset = DEMO_CUSTOMERS[Math.floor(Math.random() * DEMO_CUSTOMERS.length)];
    setWebCustomer((prev) => ({
      ...prev,
      name: preset.name,
      phone: preset.phone,
      notes: preset.notes
    }));
  };

  // Generate a totally random order composition
  const randomizeCartSelection = () => {
    playHapticTap();
    const randomized: { [itemId: string]: number } = {};
    const selectCount = Math.floor(Math.random() * 2) + 1; // 1 to 2 unique items
    
    // Pick unique items
    const shuffled = [...MENU_ITEMS].sort(() => 0.5 - Math.random());
    for (let i = 0; i < selectCount; i++) {
      randomized[shuffled[i].id] = Math.floor(Math.random() * 2) + 1; // 1 to 2 quantity
    }
    setWebCart(randomized);
  };

  // UI status background styles
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "new":
        return "bg-rose-50 text-rose-700 border border-rose-250 animate-pulse";
      case "accepted":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "preparing":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "ready":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold animate-pulse";
      case "completed":
        return "bg-gray-100 text-gray-700 border border-gray-200";
      case "cancelled":
        return "bg-rose-100 text-rose-800 border-dashed border border-rose-300";
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Filter lists inside phone simulated app
  const activeOrdersInPhone = orders.filter((o) => ["new", "accepted", "preparing", "ready"].includes(o.status));
  const historyOrdersInPhone = orders.filter((o) => ["completed", "cancelled"].includes(o.status));

  // Auto-copied callback
  const copyEndpointUrl = () => {
    const fullUrl = `${appUrl}/api/orders`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(true);
    playHapticTap();
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  if (currentView === "client") {
    return (
      <div id="client-standalone-viewport" className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased p-4 md:p-6 selection:bg-amber-500 selection:text-slate-900 flex flex-col justify-start">
        <div className="max-w-md w-full mx-auto bg-slate-910/60 rounded-3xl border border-slate-800 p-6 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-gradient-to-tr from-amber-600 to-amber-500 rounded-xl shadow-md">
                <Coffee className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight">Kashalata Order App</h1>
                <p className="text-[10px] text-emerald-400 font-mono font-medium animate-pulse">● Live Customer Web Mode</p>
              </div>
            </div>
            <button 
              onClick={() => { playHapticTap(); window.location.search = ""; }}
              className="text-[10px] px-2.5 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-450 hover:text-white transition-all border border-slate-805 font-bold cursor-pointer"
            >
              Control Panel
            </button>
          </div>

          <p className="text-xs text-slate-455 font-body mb-5 leading-relaxed">
            Welcome to the mobile checkout panel! Add coffees or desserts to your basket, fill in your info, and press <strong>Pay & Place Order</strong>. This fires a real-time HTTP post notification instantly to your kitchen staff app.
          </p>

          <div className="space-y-5">
            {/* Quick Customer Selection presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-slate-400">Customer Details</label>
                <button 
                  onClick={loadRandomCustomerPreset}
                  className="text-xs text-amber-500 hover:text-amber-450 transition-colors font-semibold cursor-pointer"
                >
                  🎲 Shuffle Details
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input 
                  type="text" 
                  value={webCustomer.name}
                  placeholder="Customer Name"
                  onChange={(e) => setWebCustomer({ ...webCustomer, name: e.target.value })}
                  className="w-full text-xs bg-slate-950 border border-slate-805 rounded-lg p-2.5 outline-none text-white focus:border-amber-500 transition-all font-sans"
                />
                <input 
                  type="text" 
                  value={webCustomer.phone}
                  placeholder="Phone"
                  onChange={(e) => setWebCustomer({ ...webCustomer, phone: e.target.value })}
                  className="w-full text-xs bg-slate-950 border border-slate-850 rounded-lg p-2.5 outline-none text-white focus:border-amber-500 transition-all font-mono"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-1 mb-2 text-xs">
                {(["pickup", "dine-in", "delivery"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setWebCustomer({ ...webCustomer, orderType: type })}
                    className={`py-1.5 rounded-md border text-center font-medium capitalize transition-all cursor-pointer ${
                      webCustomer.orderType === type 
                        ? "bg-amber-500 border-amber-600 text-slate-955 font-bold" 
                        : "bg-slate-955 border-slate-850 text-slate-400 hover:bg-slate-850"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <textarea
                value={webCustomer.notes}
                placeholder="Special notes or destination info..."
                onChange={(e) => setWebCustomer({ ...webCustomer, notes: e.target.value })}
                className="w-full text-xs bg-slate-955 border border-slate-800 rounded-lg p-2.5 outline-none h-16 text-slate-300 focus:border-amber-505 resize-none transition-all font-body"
              />
            </div>

            {/* Menu customizer */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-slate-400">Basket Selection</label>
                <div className="flex gap-2">
                  <button 
                    onClick={randomizeCartSelection}
                    className="text-xs text-amber-505 hover:text-amber-450 transition-colors font-semibold cursor-pointer"
                  >
                    🛒 Random Mix
                  </button>
                  <button 
                    onClick={() => setWebCart({})}
                    className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-1.5 border border-slate-850 rounded-xl bg-slate-950 p-2">
                {MENU_ITEMS.map((item) => {
                  const qty = webCart[item.id] || 0;
                  return (
                    <div key={item.id} className="flex items-center justify-between rounded bg-slate-900/60 p-2 text-xs hover:bg-slate-850/50 transition-all">
                      <div>
                        <div className="font-semibold text-white font-sans">{item.name}</div>
                        <div className="text-slate-500 text-[10px] font-mono">{item.category} • {item.price.toFixed(2)} AZN</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            if (qty > 0) {
                              setWebCart({ ...webCart, [item.id]: qty - 1 });
                            }
                          }}
                          className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded flex items-center justify-center transition-all cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-bold text-slate-100 font-mono text-xs">{qty}</span>
                        <button
                          onClick={() => {
                            setWebCart({ ...webCart, [item.id]: qty + 1 });
                          }}
                          className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded flex items-center justify-center transition-all cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price Calculations Checkout Summary */}
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-850">
              <div className="text-xs text-slate-400 border-b border-slate-850 pb-2 mb-2 flex justify-between font-mono">
                <span>Total Items:</span>
                <span className="text-white font-semibold flex items-center">
                  {(Object.values(webCart) as number[]).reduce((a: number, b: number) => a + b, 0)} items
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400 font-medium">Cart Total:</span>
                <span className="text-xl font-black text-amber-500 font-mono">
                  {(Object.keys(webCart) as string[]).reduce((sum: number, itemId: string) => {
                    const qty = webCart[itemId] || 0;
                    const item = MENU_ITEMS.find((m) => m.id === itemId);
                    return sum + (item ? item.price * qty : 0);
                  }, 0).toFixed(2)} <span className="text-xs font-normal text-slate-400 font-sans">AZN</span>
                </span>
              </div>
            </div>

            {/* Place Order CTA Webhook Trigger */}
            <button
              onClick={submitDemoOrder}
              disabled={isSubmittingOrder}
              className="w-full p-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-505 hover:to-amber-400 text-slate-950 font-bold tracking-wide transition-all duration-200 outline-none flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm font-sans"
            >
              <Send className="w-4.5 h-4.5 text-slate-950" />
              {isSubmittingOrder ? "Posting Webhook..." : "Pay & Place Order"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === "staff") {
    return (
      <div id="staff-standalone-viewport" className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased flex flex-col justify-between">
        <div className="p-0 max-w-md w-full mx-auto bg-slate-900 min-h-screen border-x border-slate-800 shadow-2xl flex flex-col justify-between relative">
          
          <div className="px-5 py-2.5 whitespace-nowrap bg-slate-955 border-b border-slate-900 flex justify-between items-center text-xs select-none">
            <span className="text-amber-500 font-mono tracking-tight font-extrabold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
              KASHALATA CAFE • KITCHEN MONITOR
            </span>
            <button 
              onClick={() => { playHapticTap(); window.location.search = ""; }}
              className="text-[9px] px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-400 hover:text-white cursor-pointer font-bold transition-all"
            >
              Dashboard
            </button>
          </div>

          {!isStaffLoggedIn ? (
            <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-slate-900 to-slate-950 animate-fade-in">
              <div className="text-center mt-6">
                <span className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-400 mb-2 ring-1 ring-amber-500/30 animate-pulse">
                  <Lock className="w-6 h-6" />
                </span>
                <h3 className="font-bold text-white tracking-wide">Kashalata Staff Login</h3>
                <p className="text-xs text-slate-400 font-body">Select Account & Enter Pin Number</p>
              </div>

              <div className="my-1.5 grid grid-cols-3 gap-2">
                {STAFF_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.name}
                    onClick={() => { setSelectedStaff(acc); playHapticTap(); }}
                    className={`p-2 rounded-xl text-center border text-xs transition-all cursor-pointer ${
                      selectedStaff.name === acc.name 
                        ? "bg-slate-800 border-amber-500/50 text-white" 
                        : "bg-slate-900 border-slate-850 text-slate-400 hover:bg-slate-900"
                    }`}
                  >
                    <div className="text-lg mb-1">{acc.avatar}</div>
                    <div className="font-semibold truncate">{acc.name.split(" ")[0]}</div>
                    <div className="text-[10px] opacity-70">{acc.role}</div>
                  </button>
                ))}
              </div>

              <div className="text-center ring-1 ring-slate-800 bg-slate-950 p-2.5 rounded-xl">
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">
                  Access PIN Required: (Try: <span className="font-mono text-amber-500 font-bold">{selectedStaff.pin}</span>)
                </div>
                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3].map((val) => (
                    <div 
                      key={val}
                      className={`w-3.5 h-3.5 rounded-full border transition-all ${
                        pinInput.length > val 
                          ? pinError ? "bg-rose-500 border-rose-500 animate-bounce" : "bg-amber-500 border-amber-500 scale-110"
                          : "border-slate-700 bg-transparent"
                      }`}
                    />
                  ))}
                </div>
                {pinError && (
                  <div className="text-[10px] text-rose-500 mt-1.5 font-bold">Incorrect PIN. Try again.</div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-y-2 gap-x-4 max-w-xs mx-auto mb-4">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => handlePinDigit(digit)}
                    className="w-12 h-12 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-lg font-bold rounded-full flex items-center justify-center transition-all active:scale-90"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  onClick={handleClearPin}
                  className="text-slate-500 font-semibold hover:text-rose-450 text-xs flex items-center justify-center cursor-pointer"
                >
                  Clear
                </button>
                <button
                  onClick={() => handlePinDigit("0")}
                  className="w-12 h-12 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-lg font-bold rounded-full flex items-center justify-center transition-all active:scale-90"
                >
                  0
                </button>
                <div className="w-12 h-12" />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-900 text-slate-100">
              
              <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-850 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-850 flex items-center justify-center border border-amber-500/20 text-sm">
                    {selectedStaff.avatar}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-50">{selectedStaff.name}</div>
                    <div className="text-[9px] text-amber-500 font-medium tracking-tight -mt-0.5">{selectedStaff.role} • Kashalata Mobile App</div>
                  </div>
                </div>

                <button
                  onClick={() => { playHapticTap(); setIsStaffLoggedIn(false); setSelectedOrderIdInPhone(null); }}
                  className="p-1 px-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors text-[10px] cursor-pointer font-semibold"
                >
                  Sign Out
                </button>
              </div>

              {unreadNotifications.length > 0 && (
                <div className="bg-amber-500 text-slate-950 px-4 py-3 font-semibold flex items-center justify-between text-xs transition-all duration-300 animate-slide-down shadow-xl z-20">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-full bg-slate-950 text-amber-500 animate-bounce">
                      <BellRing className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <div className="font-bold">New Kashalata Web Order!</div>
                      <div className="text-[10px] opacity-90">ID: {unreadNotifications[0].orderId} • {unreadNotifications[0].items.length} items</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      playHapticTap();
                      setSelectedOrderIdInPhone(unreadNotifications[0].orderId);
                      setUnreadNotifications((prev) => prev.slice(1));
                    }}
                    className="bg-slate-950 text-amber-400 hover:bg-slate-900 px-2.5 py-1.5 rounded-md font-extrabold uppercase tracking-wide text-[9px] cursor-pointer"
                  >
                    Open
                  </button>
                </div>
              )}

              {selectedOrderIdInPhone ? (
                (() => {
                  const activeOrder = orders.find(o => o.orderId === selectedOrderIdInPhone);
                  if (!activeOrder) {
                    return (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                        <X className="w-8 h-8 text-rose-500 mb-2" />
                        <div className="font-bold text-slate-200">Order not found</div>
                        <button 
                          onClick={() => setSelectedOrderIdInPhone(null)}
                          className="text-xs text-amber-400 hover:underline mt-2 cursor-pointer"
                        >
                          Go back
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-950/25">
                      
                      <div className="p-3 bg-slate-950 border-b border-slate-900 flex items-center justify-between">
                        <button 
                          onClick={() => { playHapticTap(); setSelectedOrderIdInPhone(null); }}
                          className="text-xs font-bold text-amber-400 flex items-center gap-1 hover:text-amber-300 cursor-pointer"
                        >
                          ← Active Queue
                        </button>
                        <span className="text-[10px] font-mono text-slate-400">{activeOrder.orderId}</span>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${getStatusColor(activeOrder.status)}`}>
                            {getStatusLabel(activeOrder.status)}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {new Date(activeOrder.createdAt).toLocaleTimeString()}
                          </span>
                        </div>

                        <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl space-y-2">
                          <div className="flex items-start gap-2 text-xs">
                            <User className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                            <div>
                              <div className="font-bold text-slate-100">{activeOrder.customer.name}</div>
                              <div className="text-slate-450 font-mono select-all text-[11px]">{activeOrder.customer.phone}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="p-1 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold uppercase text-[9px] tracking-wide">
                              {activeOrder.orderType}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Ordered Items</h4>
                          <div className="space-y-1 bg-slate-900 rounded-xl border border-slate-850 divide-y divide-slate-850 p-2">
                            {activeOrder.items.map((item) => (
                              <div key={item.id} className="p-1 px-2 flex items-center justify-between text-xs">
                                <div>
                                  <div className="font-semibold text-white">{item.name}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">{item.price.toFixed(2)} AZN × {item.quantity}</div>
                                </div>
                                <div className="font-bold text-amber-400 font-mono">
                                  {item.lineTotal.toFixed(2)} AZN
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {activeOrder.notes && (
                          <div className="p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-xl font-sans">
                            <span className="text-[9px] uppercase font-bold text-indigo-400 block mb-1">Kitchen & Staff Notes:</span>
                            <p className="text-xs text-slate-300 italic font-body">{activeOrder.notes}</p>
                          </div>
                        )}

                        <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-850 flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-400">Total Charged:</span>
                          <span className="text-lg font-black text-rose-400 font-mono">{activeOrder.total.toFixed(2)} AZN</span>
                        </div>

                      </div>

                      <div className="p-3 bg-slate-950 border-t border-slate-900 space-y-2 font-sans">
                        <span className="text-[9px] uppercase font-bold text-slate-500 block text-center tracking-wider">
                          Update Staff workflow status below:
                        </span>

                        <div className="grid grid-cols-3 gap-1.5">
                          {(["new", "accepted", "preparing"] as OrderStatus[]).map((st) => (
                            <button
                              key={st}
                              onClick={() => updateOrderStatus(activeOrder.orderId, st)}
                              className={`p-2 py-2.5 rounded-lg border text-center font-bold text-[10px] capitalize transition-all cursor-pointer ${
                                activeOrder.status === st 
                                  ? "bg-amber-500 border-amber-600 text-slate-950 shadow-md scale-102" 
                                  : "bg-slate-900 border-slate-850 text-slate-300 hover:bg-slate-800"
                              }`}
                            >
                              {st}
                            </button>
                          ))}

                          {(["ready", "completed", "cancelled"] as OrderStatus[]).map((st) => (
                            <button
                              key={st}
                              onClick={() => updateOrderStatus(activeOrder.orderId, st)}
                              className={`p-2 py-2.5 rounded-lg border text-center font-bold text-[10px] capitalize transition-all cursor-pointer ${
                                activeOrder.status === st 
                                  ? st === "ready" 
                                    ? "bg-emerald-500 border-emerald-600 text-slate-950"
                                    : st === "cancelled"
                                      ? "bg-rose-500 border-rose-600 text-slate-950"
                                      : "bg-blue-500 border-blue-600 text-slate-950"
                                  : "bg-slate-900 border-slate-850 text-slate-300 hover:bg-slate-800"
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  );
                })()
              ) : (
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  
                  <div className="grid grid-cols-2 text-center bg-slate-950 border-b border-slate-900 text-xs">
                    <button
                      onClick={() => { playHapticTap(); setActivePhoneTab("active"); }}
                      className={`py-2.5 font-bold transition-all relative cursor-pointer ${
                        activePhoneTab === "active" 
                          ? "text-amber-500 bg-slate-900 border-r border-slate-900" 
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Active ({activeOrdersInPhone.length})
                      {activePhoneTab === "active" && (
                        <span className="absolute bottom-0 left-0 right-0 h-1 bg-amber-50" />
                      )}
                    </button>
                    <button
                      onClick={() => { playHapticTap(); setActivePhoneTab("history"); }}
                      className={`py-2.5 font-bold transition-all relative cursor-pointer ${
                        activePhoneTab === "history" 
                          ? "text-amber-500 bg-slate-900 border-l border-slate-900" 
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Completed ({historyOrdersInPhone.length})
                      {activePhoneTab === "history" && (
                        <span className="absolute bottom-0 left-0 right-0 h-1 bg-amber-50" />
                      )}
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {activePhoneTab === "active" ? (
                      activeOrdersInPhone.length === 0 ? (
                        <div className="text-center py-24 px-4 font-sans">
                          <Bell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                          <div className="font-bold text-slate-300 text-sm">No active orders</div>
                          <p className="text-[10px] text-slate-500 mt-1">Accepts online checkout webhooks dynamically.</p>
                        </div>
                      ) : (
                        activeOrdersInPhone.map((ord) => (
                          <div
                            key={ord.orderId}
                            onClick={() => { playHapticTap(); setSelectedOrderIdInPhone(ord.orderId); }}
                            className="bg-slate-955 p-3 rounded-xl border border-slate-850 hover:border-amber-500/30 transition-all cursor-pointer space-y-2 relative"
                          >
                            {ord.status === "new" && (
                              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
                            )}

                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-400 font-mono">{ord.orderId}</span>
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${getStatusColor(ord.status)}`}>
                                {ord.status}
                              </span>
                            </div>

                            <div className="flex items-baseline justify-between">
                              <div>
                                <div className="text-xs font-bold text-white">{ord.customer.name}</div>
                                <div className="text-[10px] text-slate-450">{ord.items.length} items • <span className="text-amber-450 font-bold capitalize">{ord.orderType}</span></div>
                              </div>
                              <span className="text-xs font-bold text-amber-500 font-mono">
                                {ord.total.toFixed(2)} AZN
                              </span>
                            </div>
                          </div>
                        ))
                      )
                    ) : (
                      historyOrdersInPhone.length === 0 ? (
                        <div className="text-center py-20 px-4">
                          <CheckCircle className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                          <div className="font-bold text-slate-405 text-sm">No history archived</div>
                        </div>
                      ) : (
                        historyOrdersInPhone.map((ord) => (
                          <div
                            key={ord.orderId}
                            onClick={() => { playHapticTap(); setSelectedOrderIdInPhone(ord.orderId); }}
                            className="bg-slate-955 p-3 rounded-xl border border-slate-900 opacity-75 hover:opacity-100 transition-all cursor-pointer space-y-2"
                          >
                            <div className="flex items-end justify-between text-xs">
                              <span className="font-bold text-slate-500 font-mono">{ord.orderId}</span>
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${getStatusColor(ord.status)}`}>
                                {ord.status}
                              </span>
                            </div>

                            <div className="flex justify-between items-baseline text-xs">
                              <div>
                                <div className="font-bold text-slate-300">{ord.customer.name}</div>
                              </div>
                              <span className="font-bold text-slate-450 font-mono">
                                {ord.total.toFixed(2)} AZN
                              </span>
                            </div>
                          </div>
                        ))
                      )
                    )}
                  </div>

                  <div className="bg-slate-950 p-3 border-t border-slate-900 text-[10px] text-slate-500 font-mono flex justify-between items-center px-4 select-none">
                    <span>Live Refresh active</span>
                    <span>Polling stream active</span>
                  </div>

                </div>
              )}

            </div>
          )}

          <div className="h-10 bg-slate-955 flex items-center justify-around text-slate-500 border-t border-slate-900 select-none">
            <button 
              onClick={() => { playHapticTap(); setSelectedOrderIdInPhone(null); }}
              className="text-xs hover:text-white px-6 py-2 transition-colors cursor-pointer"
            >
              ◀ Back Key
            </button>
            <div className="w-4 h-4 border border-slate-650 rounded pointer-events-none" />
            <div className="w-4 h-2 bg-slate-650 rounded-full pointer-events-none" />
          </div>

        </div>
      </div>
    );
  }

  return (
    <div id="root-viewport" className="min-h-screen bg-slate-900 font-sans text-slate-100 antialiased p-4 md:p-8 selection:bg-amber-500 selection:text-slate-900 animate-fade-in">
      
      {/* 
        ===================================================================
        TOP NAVIGATION HEADER
        ===================================================================
      */}
      <header id="dashboard-header" className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between border-b border-slate-800 pb-5 mb-8">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="p-3 bg-gradient-to-tr from-amber-600 to-amber-505 rounded-xl shadow-lg ring-2 ring-amber-500/20">
            <Coffee className="w-8 h-8 text-slate-955 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white font-sans">Kashalata Cafe</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                Staff Notifier Flow
              </span>
            </div>
            <p className="text-sm text-slate-400 font-body">
              Real-time checkout webhook receiver and staff Android App pipeline
            </p>
          </div>
        </div>

        {/* Real-time backend status indicators */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs flex items-center gap-2">
            <span className="text-slate-500 font-mono">SSE Stream:</span>
            {connectionStatus === "connected" ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1.5 animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                Live Receiving
              </span>
            ) : connectionStatus === "connecting" ? (
              <span className="text-amber-400 font-medium animate-pulse">Connecting...</span>
            ) : (
              <span className="text-rose-505 font-medium flex items-center gap-1">
                Offline/Error
              </span>
            )}
          </div>

          <button 
            onClick={() => { setSoundEnabled(!soundEnabled); playHapticTap(); }}
            className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all outline-none cursor-pointer ${
              soundEnabled 
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400" 
                : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>Sound Alerts: Audio ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Sound Alerts: Muted</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* 
        ===================================================================
        PORTABLE MOBILE APK & PWA DEPLOYMENT BOARD
        ===================================================================
      */}
      <section id="mobile-deployment-board" className="max-w-7xl mx-auto mb-8 bg-slate-950 rounded-2xl border border-slate-800 p-5 md:p-6 shadow-xl relative overflow-hidden">
        
        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-slate-800/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 px-2 text-[10px] font-bold bg-amber-500/20 text-amber-400 rounded-md uppercase tracking-wider font-mono">Android Setup</span>
              <h2 className="text-lg font-bold text-white tracking-tight">Kashalata Standalone APK & PWA Deployment</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-body">
              Easily generate and install two dedicated Android applications for your <strong>Customers</strong> and your <strong>Kitchen Staff</strong>.
            </p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => { playHapticTap(); window.open(`${appUrl}/?view=client`, '_blank'); }}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-850 rounded-xl border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-500" />
              <span>Launch Custom Client App</span>
            </button>
            <button 
              onClick={() => { playHapticTap(); window.open(`${appUrl}/?view=staff`, '_blank'); }}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-850 rounded-xl border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Launch Live Staff App</span>
            </button>
          </div>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Client Application (Website checkout wrapper) */}
          <div className="p-5 bg-slate-900/40 rounded-xl border border-slate-850 flex flex-col md:flex-row gap-4 items-start shadow-inner">
            <div className="flex-shrink-0 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(appUrl + "/?view=client")}`} 
                alt="Client QR Code"
                referrerPolicy="no-referrer"
                className="w-24 h-24 rounded border border-slate-900 bg-white"
              />
              <div className="text-center text-[9px] text-slate-550 mt-1.5 font-mono select-none">Client Web QR</div>
            </div>
            <div className="space-y-2 flex-grow">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-505" />
                <h3 className="font-bold text-white text-sm">1s. Client Ordering App</h3>
              </div>
              <p className="text-[11px] text-slate-400 font-body leading-relaxed">
                A gorgeous full-screen mobile menu ordering interface for guests to browse products, select items, add custom notes, and trigger webhook push alerts.
              </p>
              <div className="text-[10px] space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                <div className="font-semibold text-slate-350">Create Android APK instantly:</div>
                <div className="text-slate-450 leading-relaxed font-sans">
                  1. Copy client URL: <span className="text-amber-500 font-mono select-all text-[9.5px] font-bold">{appUrl}/?view=client</span><br />
                  2. Open <a href="https://www.webintoapp.com" target="_blank" rel="noreferrer" className="text-amber-500 hover:underline">WebIntoApp.com</a> or <a href="https://median.co" target="_blank" rel="noreferrer" className="text-amber-500 hover:underline font-semibold">Median.co</a> in your web browser.<br />
                  3. Paste this link, set app name as &quot;Kashalata Order&quot;, and download the custom APK in 60 seconds!
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Kitchen Staff Dashboard (Order notifications wrapper) */}
          <div className="p-5 bg-slate-900/40 rounded-xl border border-slate-850 flex flex-col md:flex-row gap-4 items-start shadow-inner">
            <div className="flex-shrink-0 bg-slate-950 p-2.5 rounded-xl border border-slate-850">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(appUrl + "/?view=staff")}`} 
                alt="Staff QR Code"
                referrerPolicy="no-referrer"
                className="w-24 h-24 rounded border border-slate-900 bg-white"
              />
              <div className="text-center text-[9px] text-slate-550 mt-1.5 font-mono select-none">Staff Web QR</div>
            </div>
            <div className="space-y-2 flex-grow">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-505" />
                <h3 className="font-bold text-white text-sm">2s. Kitchen Staff App</h3>
              </div>
              <p className="text-[11px] text-slate-400 font-body leading-relaxed">
                Dedicated active mobile workflow with 4-digit PIN security, custom sound notify chimes, live lists, and order progression mechanics.
              </p>
              <div className="text-[10px] space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                <div className="font-semibold text-slate-350">Create Android APK instantly:</div>
                <div className="text-slate-450 leading-relaxed font-sans">
                  1. Copy staff URL: <span className="text-emerald-400 font-mono select-all text-[9.5px] font-bold">{appUrl}/?view=staff</span><br />
                  2. Open <a href="https://www.webintoapp.com" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">WebIntoApp.com</a> or <a href="https://median.co" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline font-semibold">Median.co</a> in your web browser.<br />
                  3. Paste this link, set app name as &quot;Kashalata Staff&quot;, and download the custom APK in 60 seconds!
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* 
        ===================================================================
        PRIMARY WEB APPS GRID (Left: Customer Site Sim, Center: Android Sim, Right: Logs)
        ===================================================================
      */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 
          -----------------------------------------------------------------
          COLUMN 1: THE KASHALATA CAFE CUSTOMER ORDER DEPARTURE DESK
          -----------------------------------------------------------------
        */}
        <section id="website-simulator-panel" className="lg:col-span-4 bg-slate-950/80 rounded-2xl border border-slate-800 p-6 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase tracking-wider">
                Simulated
              </span>
              <h2 className="text-base font-bold text-white font-sans">Kashalata Az Website</h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">POST client</span>
          </div>

          <p className="text-xs text-slate-400 font-body mb-5 leading-relaxed">
            Quickly simulation: Create, customize, and checkout. Clicking 
            &quot;Pay & Place Order&quot; sends a real JSON payload directly over CORS to the 
            API server path.
          </p>

          <div className="space-y-5">
            {/* Quick Customer Selection presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-slate-400 font-medium">Customer Details</label>
                <button 
                  onClick={loadRandomCustomerPreset}
                  className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-semibold"
                >
                  🎲 Shuffle Details
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input 
                  type="text" 
                  value={webCustomer.name}
                  placeholder="Customer Name"
                  onChange={(e) => setWebCustomer({ ...webCustomer, name: e.target.value })}
                  className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2.5 outline-none text-white focus:border-amber-500 transition-all font-sans"
                />
                <input 
                  type="text" 
                  value={webCustomer.phone}
                  placeholder="Phone"
                  onChange={(e) => setWebCustomer({ ...webCustomer, phone: e.target.value })}
                  className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2.5 outline-none text-white focus:border-amber-500 transition-all font-mono"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-1 mb-2 text-xs">
                {(["pickup", "dine-in", "delivery"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setWebCustomer({ ...webCustomer, orderType: type })}
                    className={`py-1.5 rounded-md border text-center font-medium capitalize transition-all ${
                      webCustomer.orderType === type 
                        ? "bg-amber-500 border-amber-600 text-slate-950 font-bold" 
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <textarea
                value={webCustomer.notes}
                placeholder="Special notes or destination info..."
                onChange={(e) => setWebCustomer({ ...webCustomer, notes: e.target.value })}
                className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2.5 outline-none h-16 text-slate-350 focus:border-amber-500 resize-none transition-all font-body"
              />
            </div>

            {/* Menu customizer */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-slate-400 font-medium">Basket Selection</label>
                <div className="flex gap-2">
                  <button 
                    onClick={randomizeCartSelection}
                    className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-semibold"
                  >
                    🛒 Random Mix
                  </button>
                  <button 
                    onClick={() => setWebCart({})}
                    className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-1.5 border border-slate-900 rounded-lg bg-slate-950 p-2">
                {MENU_ITEMS.map((item) => {
                  const qty = webCart[item.id] || 0;
                  return (
                    <div key={item.id} className="flex items-center justify-between rounded bg-slate-900 p-2 text-xs hover:bg-slate-850/80 transition-all">
                      <div>
                        <div className="font-semibold text-white font-sans">{item.name}</div>
                        <div className="text-slate-500 text-[10px] font-mono">{item.category} • {item.price.toFixed(2)} AZN</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            if (qty > 0) {
                              setWebCart({ ...webCart, [item.id]: qty - 1 });
                            }
                          }}
                          className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded flex items-center justify-center transition-all"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-bold text-slate-100 font-mono text-xs">{qty}</span>
                        <button
                          onClick={() => {
                            setWebCart({ ...webCart, [item.id]: qty + 1 });
                          }}
                          className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded flex items-center justify-center transition-all"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price Calculations Checkout Summary */}
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-850">
              <div className="text-xs text-slate-400 border-b border-slate-850 pb-2 mb-2 flex justify-between font-mono">
                <span>Total Items:</span>
                <span className="text-white font-semibold flex items-center">
                  {(Object.values(webCart) as number[]).reduce((a: number, b: number) => a + b, 0)} items
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400 font-medium">Cart Total:</span>
                <span className="text-xl font-black text-amber-400 font-mono">
                  {(Object.keys(webCart) as string[]).reduce((sum: number, itemId: string) => {
                    const qty = webCart[itemId] || 0;
                    const item = MENU_ITEMS.find((m) => m.id === itemId);
                    return sum + (item ? item.price * qty : 0);
                  }, 0).toFixed(2)} <span className="text-xs font-normal text-slate-400 font-sans">AZN</span>
                </span>
              </div>
            </div>

            {/* Place Order CTA Webhook Trigger */}
            <button
              onClick={submitDemoOrder}
              disabled={isSubmittingOrder}
              className="w-full p-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold tracking-wide transition-all duration-200 outline-none flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <Send className="w-4.5 h-4.5 text-slate-950" />
              {isSubmittingOrder ? "Posting Webhook..." : "Pay & Place Order"}
            </button>
          </div>

          {/* Core Notification Endpoint Clipboard */}
          <div className="mt-6 border-t border-slate-800 pt-5">
            <h4 className="text-xs text-slate-300 font-semibold mb-2">Checkout Webhook URL</h4>
            <div className="flex gap-1.5 p-2 bg-slate-900 rounded-lg border border-slate-850">
              <input 
                type="text" 
                readOnly
                value={`${appUrl}/api/orders`}
                className="w-full text-[10px] font-mono bg-transparent outline-none text-slate-300 overflow-x-auto" 
              />
              <button 
                onClick={copyEndpointUrl}
                className="p-1 px-2.5 bg-slate-800 hover:bg-slate-700 rounded text-amber-500 transition-all flex items-center gap-1 text-[10px] whitespace-nowrap font-semibold border border-slate-750"
              >
                {copiedUrl ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* 
          -----------------------------------------------------------------
          COLUMN 2: ANDROID SMARTPHONE STAFF CLIENT WORK ENVIRONMENT
          -----------------------------------------------------------------
        */}
        <section id="android-device-column" className="lg:col-span-5 flex justify-center">
          
          {/* Main phone body */}
          <div className={`relative w-[360px] h-[720px] bg-slate-950 border-[10px] border-slate-800 rounded-[38px] overflow-hidden shadow-2xl transition-all duration-300 ring-4 ring-slate-850 ${
            phoneVibrating ? "animate-glowing translate-x-1" : ""
          }`}>
            
            {/* Phone Top Notch Speaker & Lens Mockup */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-slate-800 rounded-b-xl z-50 flex items-center justify-center gap-2 px-3">
              <span className="w-2 h-2 rounded-full bg-slate-900" />
              <span className="w-12 h-1 bg-slate-900 rounded-full" />
            </div>

            {/* Screen Inner Atmosphere */}
            <div className="w-full h-full text-slate-100 flex flex-col justify-between pt-6 bg-slate-900 select-none">
              
              {/* STATUS BAR IN SMARTPHONE */}
              <div className="px-5 py-1.5 flex justify-between items-center text-[10px] font-mono text-slate-400 border-b border-slate-950/25">
                <span>12:59 PM (UTC)</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-500">AZEL LTE</span>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                </div>
              </div>

              {/* 
                1. APP SCENARIO: STAFF HAS COMPLETED NO PASSCODE/STAFF CHOOSE
              */}
              {!isStaffLoggedIn ? (
                // PHONE LOCK / PASSCODE SCREEN
                <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-slate-900 to-slate-950">
                  <div className="text-center mt-6">
                    <span className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-400 mb-2 ring-1 ring-amber-500/30">
                      <Lock className="w-6 h-6" />
                    </span>
                    <h3 className="font-bold text-white tracking-wide">Kashalata Staff Login</h3>
                    <p className="text-xs text-slate-400 font-body">Select Account & Enter Pin Number</p>
                  </div>

                  {/* Account choice strip */}
                  <div className="my-1.5 grid grid-cols-3 gap-2">
                    {STAFF_ACCOUNTS.map((acc) => (
                      <button
                        key={acc.name}
                        onClick={() => { setSelectedStaff(acc); playHapticTap(); }}
                        className={`p-2 rounded-xl text-center border text-xs transition-all ${
                          selectedStaff.name === acc.name 
                            ? "bg-slate-800 border-amber-500/50 text-white" 
                            : "bg-slate-905 border-slate-850 text-slate-400 hover:bg-slate-900"
                        }`}
                      >
                        <div className="text-lg mb-1">{acc.avatar}</div>
                        <div className="font-semibold truncate">{acc.name.split(" ")[0]}</div>
                        <div className="text-[10px] opacity-70">{acc.role}</div>
                      </button>
                    ))}
                  </div>

                  {/* PIN dots display */}
                  <div className="text-center ring-1 ring-slate-800 bg-slate-950 p-2.5 rounded-xl">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">
                      Access PIN Required: (Try: <span className="font-mono text-amber-500 font-bold">{selectedStaff.pin}</span>)
                    </div>
                    <div className="flex justify-center gap-3">
                      {[0, 1, 2, 3].map((val) => (
                        <div 
                          key={val}
                          className={`w-3.5 h-3.5 rounded-full border transition-all ${
                            pinInput.length > val 
                              ? pinError ? "bg-rose-500 border-rose-500 animate-bounce" : "bg-amber-500 border-amber-500 scale-110"
                              : "border-slate-700 bg-transparent"
                          }`}
                        />
                      ))}
                    </div>
                    {pinError && (
                      <div className="text-[10px] text-rose-500 mt-1.5 font-bold">Incorrect PIN. Try again.</div>
                    )}
                  </div>

                  {/* Keypad numbers */}
                  <div className="grid grid-cols-3 gap-y-2 gap-x-4 max-w-xs mx-auto mb-4">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
                      <button
                        key={digit}
                        onClick={() => handlePinDigit(digit)}
                        className="w-12 h-12 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-lg font-bold rounded-full flex items-center justify-center transition-all active:scale-90"
                      >
                        {digit}
                      </button>
                    ))}
                    <button
                      onClick={handleClearPin}
                      className="text-slate-500 font-semibold hover:text-rose-400 font-sans text-xs flex items-center justify-center"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => handlePinDigit("0")}
                      className="w-12 h-12 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-lg font-bold rounded-full flex items-center justify-center transition-all active:scale-90"
                    >
                      0
                    </button>
                    <div className="w-12 h-12" />
                  </div>
                </div>
              ) : (
                
                // 2. PRIMARY STAFF ANDROID WORKFLOW
                <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-900 text-slate-100">
                  
                  {/* APP TITLE BAR */}
                  <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-850 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-amber-500/20 text-sm">
                        {selectedStaff.avatar}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-50 line-clamp-1">{selectedStaff.name}</div>
                        <div className="text-[9px] text-amber-500 font-medium tracking-tight -mt-0.5">{selectedStaff.role} • Kashalata App</div>
                      </div>
                    </div>

                    <button
                      onClick={() => { playHapticTap(); setIsStaffLoggedIn(false); setSelectedOrderIdInPhone(null); }}
                      className="p-1 px-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Log out staff member"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* REAL-TIME LOCK SCREEN NOTIFICATION OVERLAY (IF ALERTS ARRIVED & NOT DISMISSED) */}
                  {unreadNotifications.length > 0 && (
                    <div className="bg-amber-500 text-slate-950 px-4 py-3 font-semibold flex items-center justify-between text-xs transition-all duration-300 animate-slide-down shadow-xl z-20">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded-full bg-slate-950 text-amber-500 animate-bounce">
                          <BellRing className="w-3.5 h-3.5" />
                        </span>
                        <div>
                          <div className="font-bold">New Kashalata Web Order!</div>
                          <div className="text-[10px] opacity-90">ID: {unreadNotifications[0].orderId} • {unreadNotifications[0].items.length} items</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          playHapticTap();
                          setSelectedOrderIdInPhone(unreadNotifications[0].orderId);
                          setUnreadNotifications((prev) => prev.slice(1));
                        }}
                        className="bg-slate-950 text-amber-400 hover:bg-slate-900 px-2.5 py-1.5 rounded-md font-extrabold uppercase tracking-wide text-[9px] cursor-pointer"
                      >
                        Open
                      </button>
                    </div>
                  )}

                  {/* PREVIEWS & SCREEN LAYOUTS DESCRIPTION */}
                  {selectedOrderIdInPhone ? (
                    
                    // ============================================
                    // SINGLE PHONE ORDER DETAIL VIEW
                    // ============================================
                    (() => {
                      const activeOrder = orders.find(o => o.orderId === selectedOrderIdInPhone);
                      if (!activeOrder) {
                        return (
                          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                            <X className="w-8 h-8 text-rose-500 mb-2" />
                            <div className="font-bold text-slate-200">Order not found</div>
                            <button 
                              onClick={() => setSelectedOrderIdInPhone(null)}
                              className="text-xs text-amber-400 hover:underline mt-2"
                            >
                              Go back
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-950/20">
                          
                          {/* Top Detail Navigation Header */}
                          <div className="p-3 bg-slate-950 border-b border-slate-900 flex items-center justify-between">
                            <button 
                              onClick={() => { playHapticTap(); setSelectedOrderIdInPhone(null); }}
                              className="text-xs font-bold text-amber-400 flex items-center gap-1 hover:text-amber-300"
                            >
                              ← Orders List
                            </button>
                            <span className="text-[10px] font-mono text-slate-400">{activeOrder.orderId}</span>
                          </div>

                          {/* Order contents body */}
                          <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            
                            {/* Head metadata */}
                            <div className="flex items-center justify-between">
                              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${getStatusColor(activeOrder.status)}`}>
                                {getStatusLabel(activeOrder.status)}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {new Date(activeOrder.createdAt).toLocaleTimeString()}
                              </span>
                            </div>

                            {/* Customer profile cards */}
                            <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl space-y-2">
                              {/* Customer row */}
                              <div className="flex items-start gap-2 text-xs">
                                <User className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                                <div>
                                  <div className="font-bold text-slate-100">{activeOrder.customer.name}</div>
                                  <div className="text-slate-400 font-mono select-all text-[11px]">{activeOrder.customer.phone}</div>
                                </div>
                              </div>
                              {/* Order Type Info */}
                              <div className="flex items-center gap-2 text-xs">
                                <div className="p-1 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold uppercase text-[9px] tracking-wide">
                                  {activeOrder.orderType}
                                </div>
                                <span className="text-[11px] text-slate-400">Currency: {activeOrder.currency}</span>
                              </div>
                            </div>

                            {/* Ordered Items loop */}
                            <div className="space-y-2">
                              <h4 className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Ordered Items</h4>
                              <div className="space-y-1 bg-slate-900 rounded-xl border border-slate-850 divide-y divide-slate-850 p-2">
                                {activeOrder.items.map((item) => (
                                  <div key={item.id} className="p-2 flex items-center justify-between text-xs">
                                    <div className="space-y-0.5">
                                      <div className="font-semibold text-white">{item.name}</div>
                                      <div className="text-[10px] text-slate-400 font-mono">{item.price.toFixed(2)} AZN × {item.quantity}</div>
                                    </div>
                                    <div className="font-bold text-amber-400 font-mono">
                                      {item.lineTotal.toFixed(2)} AZN
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Notes Box */}
                            {activeOrder.notes && (
                              <div className="p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-xl">
                                <span className="text-[9px] uppercase font-bold text-indigo-400 block mb-1">Kitchen & Staff Notes:</span>
                                <p className="text-xs text-slate-300 italic font-body">{activeOrder.notes}</p>
                              </div>
                            )}

                            {/* Total bill desk */}
                            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-850 flex items-center justify-between">
                              <span className="font-bold text-slate-350 text-xs text-slate-400">Total Charged:</span>
                              <span className="text-xl font-black text-rose-400 font-mono">{activeOrder.total.toFixed(2)} AZN</span>
                            </div>

                          </div>

                          {/* 
                            ACTION BUTTONS PANEL - CHOOSE AND STREAM NEW STATUS
                          */}
                          <div className="p-3 bg-slate-950 border-t border-slate-900 space-y-2.5">
                            <span className="text-[9px] uppercase font-bold text-slate-500 block text-center tracking-wider">
                              Update Staff workflow status below:
                            </span>

                            {/* Grid of statuses */}
                            <div className="grid grid-cols-3 gap-1.5">
                              {(["new", "accepted", "preparing"] as OrderStatus[]).map((st) => (
                                <button
                                  key={st}
                                  onClick={() => updateOrderStatus(activeOrder.orderId, st)}
                                  className={`p-2 py-2.5 rounded-lg border text-center font-bold text-[10px] capitalize transition-all outline-none ${
                                    activeOrder.status === st 
                                      ? "bg-amber-500 border-amber-600 text-slate-950 shadow-md scale-102" 
                                      : "bg-slate-900 border-slate-850 text-slate-300 hover:bg-slate-800"
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}

                              {(["ready", "completed", "cancelled"] as OrderStatus[]).map((st) => (
                                <button
                                  key={st}
                                  onClick={() => updateOrderStatus(activeOrder.orderId, st)}
                                  className={`p-2 py-2.5 rounded-lg border text-center font-bold text-[10px] capitalize transition-all outline-none ${
                                    activeOrder.status === st 
                                      ? st === "ready" 
                                        ? "bg-emerald-500 border-emerald-600 text-slate-950 uppercase"
                                        : st === "cancelled"
                                          ? "bg-rose-500 border-rose-600 text-slate-950"
                                          : "bg-blue-500 border-blue-600 text-slate-950"
                                      : "bg-slate-900 border-slate-850 text-slate-300 hover:bg-slate-800"
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          </div>

                        </div>
                      );
                    })()

                  ) : (

                    // ============================================
                    // SCROLLABLE LIST OF ALL ORDERS IN PHONE
                    // ============================================
                    <div className="flex-1 flex flex-col justify-between overflow-hidden">
                      
                      {/* Active / History switch tab */}
                      <div className="grid grid-cols-2 text-center bg-slate-950 border-b border-slate-900 text-xs">
                        <button
                          onClick={() => { playHapticTap(); setActivePhoneTab("active"); }}
                          className={`py-2.5 font-bold transition-all relative ${
                            activePhoneTab === "active" 
                              ? "text-amber-500 bg-slate-900 border-r border-slate-900" 
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          Active ({activeOrdersInPhone.length})
                          {activePhoneTab === "active" && (
                            <span className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
                          )}
                        </button>
                        <button
                          onClick={() => { playHapticTap(); setActivePhoneTab("history"); }}
                          className={`py-2.5 font-bold transition-all relative ${
                            activePhoneTab === "history" 
                              ? "text-amber-500 bg-slate-900 border-l border-slate-900" 
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          Completed/Logs ({historyOrdersInPhone.length})
                          {activePhoneTab === "history" && (
                            <span className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
                          )}
                        </button>
                      </div>

                      {/* Actual Scrollable List of entries */}
                      <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {isRefreshing && (
                          <div className="text-center py-2 text-xs text-amber-500 animate-pulse font-bold">
                            Refreshing server...
                          </div>
                        )}

                        {activePhoneTab === "active" ? (
                          activeOrdersInPhone.length === 0 ? (
                            <div className="text-center py-16 px-4">
                              <Bell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                              <div className="font-bold text-slate-450 text-sm gray-200">No active orders</div>
                              <p className="text-[10px] text-slate-500 mt-1 font-body">Submit an order on the left customer simulator to trigger immediate notification sound and local popups.</p>
                            </div>
                          ) : (
                            activeOrdersInPhone.map((ord) => (
                              <div
                                key={ord.orderId}
                                onClick={() => { playHapticTap(); setSelectedOrderIdInPhone(ord.orderId); }}
                                className="bg-slate-950 p-3 rounded-xl border border-slate-850 hover:border-amber-500/30 transition-all cursor-pointer space-y-2 relative"
                              >
                                {ord.status === "new" && (
                                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                                )}

                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-bold text-slate-300 font-mono">{ord.orderId}</span>
                                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${getStatusColor(ord.status)}`}>
                                    {getStatusLabel(ord.status)}
                                  </span>
                                </div>

                                <div className="flex items-baseline justify-between">
                                  <div>
                                    <div className="text-xs font-bold text-white tracking-wide">{ord.customer.name}</div>
                                    <div className="text-[10px] text-slate-400">
                                      {ord.items.length} items • <span className="font-bold text-amber-500 capitalize">{ord.orderType}</span>
                                    </div>
                                  </div>
                                  <span className="text-xs font-bold text-amber-400 font-mono">
                                    {ord.total.toFixed(2)} AZN
                                  </span>
                                </div>

                                {ord.notes && (
                                  <p className="text-[10px] text-slate-400 truncate bg-slate-900 px-2 py-1 rounded">
                                    📝 {ord.notes}
                                  </p>
                                )}
                              </div>
                            ))
                          )
                        ) : (
                          historyOrdersInPhone.length === 0 ? (
                            <div className="text-center py-16 px-4 text-slate-400">
                              <CheckCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                              <div className="font-bold text-sm text-slate-350">No historical orders</div>
                              <p className="text-[10px] text-slate-500 mt-1 font-body">Once staff processes and marks an order as &quot;Completed&quot; or &quot;Cancelled&quot;, it archives here.</p>
                            </div>
                          ) : (
                            historyOrdersInPhone.map((ord) => (
                              <div
                                key={ord.orderId}
                                onClick={() => { playHapticTap(); setSelectedOrderIdInPhone(ord.orderId); }}
                                className="bg-slate-950 p-3 rounded-xl border border-slate-900 opacity-75 hover:opacity-100 transition-all cursor-pointer space-y-2"
                              >
                                <div className="flex items-end justify-between text-xs">
                                  <span className="font-bold text-slate-400 font-mono">{ord.orderId}</span>
                                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${getStatusColor(ord.status)}`}>
                                    {getStatusLabel(ord.status)}
                                  </span>
                                </div>

                                <div className="flex justify-between items-baseline text-xs">
                                  <div>
                                    <div className="font-bold text-slate-350">{ord.customer.name}</div>
                                    <div className="text-[10px] text-slate-500">
                                      {ord.items.length} items • Completed checkout
                                    </div>
                                  </div>
                                  <span className="font-bold text-slate-400 font-mono">
                                    {ord.total.toFixed(2)} AZN
                                  </span>
                                </div>
                              </div>
                            ))
                          )
                        )}
                      </div>

                      {/* Device quick statistics footer */}
                      <div className="bg-slate-950 p-3 border-t border-slate-900 text-[10px] text-slate-400 font-mono flex justify-between items-center px-4">
                        <span>Staff App Active</span>
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                          <span>Polling Web Service</span>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* Bottom Simulated Soft Android back keys */}
              <div className="h-10 bg-slate-950 flex items-center justify-around text-slate-400 border-t border-slate-900 px-8">
                <button 
                  onClick={() => { playHapticTap(); setSelectedOrderIdInPhone(null); }}
                  className="px-4 py-1.5 focus:text-white hover:text-slate-300 transition-colors"
                  title="Phone back key"
                >
                  ◀
                </button>
                <div className="w-5 h-5 border-2 border-slate-400 rounded-lg hover:border-slate-300 pointer-events-none" />
                <div className="w-5 h-2.5 bg-slate-400 rounded-full hover:bg-slate-300 pointer-events-none" />
              </div>

            </div>
          </div>
        </section>

        {/* 
          -----------------------------------------------------------------
          COLUMN 3: API TELEMETRY LOGS & TELEMETRY TERMINAL console
          -----------------------------------------------------------------
        */}
        <section id="telemetry-logs-column" className="lg:col-span-3 space-y-6">
          
          {/* Dashboard Metrics display */}
          <div className="bg-slate-950 rounded-2xl border border-slate-850 p-5 shadow-2xl">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 font-sans">
              System Dashboard Stats
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-850">
                <div className="text-[10px] text-slate-400 font-semibold mb-1">Active Statuses</div>
                <div className="text-lg font-bold text-white font-mono flex items-baseline gap-1.5">
                  {stats.activeCount}
                  <span className="text-[10px] text-amber-500 font-sans">waiting</span>
                </div>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-850">
                <div className="text-[10px] text-slate-400 font-semibold mb-1">Today Count</div>
                <div className="text-lg font-bold text-white font-mono">
                  {stats.todayCount}
                </div>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-850 col-span-2">
                <div className="text-[10px] text-slate-400 font-semibold mb-1 flex justify-between">
                  <span>Earnings (AZN Completed)</span>
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-xl font-black text-emerald-400 font-mono">
                  {stats.earningsToday.toFixed(2)} AZN
                </div>
              </div>
            </div>

            <div className="mt-4">
              <button 
                onClick={() => fetchOrders()}
                disabled={isRefreshing}
                className="w-full text-xs font-bold py-2 px-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white rounded-lg flex items-center justify-center gap-1.5 transition-all outline-none"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-amber-500 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>Fetch Latest DB Updates</span>
              </button>
            </div>
          </div>

          {/* Real-time backend server terminal emulator logs stream */}
          <div className="bg-slate-950 rounded-2xl border border-slate-850 p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3 border-b border-slate-900 pb-2">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-slate-250 uppercase tracking-wider">
                  API Request Terminal
                </h3>
              </div>
              <button 
                onClick={() => setLogs([])}
                className="text-[10px] text-slate-500 hover:text-slate-400 selection:bg-none"
              >
                Clear
              </button>
            </div>

            <p className="text-[10px] text-slate-400 font-body mb-4 leading-relaxed">
              Accepts JSON payload at public <span className="text-indigo-400 font-mono">POST /api/orders</span> with support for local state persistence.
            </p>

            {/* Simulated scrollable shell panel */}
            <div className="h-[290px] overflow-y-auto font-mono text-[10px] space-y-2.5 bg-black/40 p-3 rounded-xl border border-slate-900">
              {logs.length === 0 ? (
                <div className="text-slate-600 italic py-12 text-center text-[9px]">
                  Listening for website POST commands & updates...
                </div>
              ) : (
                logs.map((log) => {
                  let badgeColor = "bg-slate-800 text-slate-300";
                  if (log.method === "POST") badgeColor = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                  if (log.method === "PATCH") badgeColor = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
                  if (log.method === "CORS_PREFLIGHT") badgeColor = "bg-indigo-500/15 text-indigo-400";
                  
                  return (
                    <div key={log.id} className="border-b border-slate-900 pb-2 last:border-none space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[8.5px] px-1 rounded-sm uppercase font-black ${badgeColor}`}>
                          {log.method}
                        </span>
                        <span className="text-[9px] text-slate-500">{log.timestamp}</span>
                      </div>
                      
                      <div className="text-slate-450 truncate text-[9.5px]">
                        URL: <span className="text-slate-200">{log.endpoint}</span>
                      </div>

                      <div className="text-slate-450 text-[9px]">
                        Response Status: <span className={log.status >= 400 ? "text-rose-500 font-bold" : "text-emerald-500"}>{log.status}</span>
                      </div>

                      <div className="text-slate-450 bg-slate-950/60 p-1.5 rounded text-[9px] font-mono break-all line-clamp-2 select-all overflow-x-auto">
                        {log.payload}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </section>

      </main>

      {/* 
        ===================================================================
        CRAFTED BRAND SLATE FOOTER
        ===================================================================
      */}
      <footer id="app-footer" className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
        <p className="font-body">
          Designed with elegant, high-contrast visual Slate interfaces paired with synthetic Web Audio notifications.
        </p>
        <p className="font-mono text-[10px] mt-1 text-slate-650">
          Kashalata Cafe Staff Push App Engine • 2026. All rights and systems operational.
        </p>
      </footer>

    </div>
  );
}
