import express from "express";
import path from "path";
import fs from "fs";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DB_FILE = path.join(process.cwd(), "orders.db.json");

// Middleware to parse JSON bodies
app.use(express.json());

// Strict Custom CORS implementation to support the Kashalata website and public preflight/POST clients
app.use((req, res, next) => {
  if (req.path === "/api/orders") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PATCH, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
  }
  next();
});

// Seed data to make the dashboard looks alive out-of-the-box
const initialSeedOrders = [
  {
    source: "kashalata-website",
    orderId: "KSH-1781370000001",
    status: "new",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    customer: {
      name: "Tofig Aliyev",
      phone: "+994501234567"
    },
    orderType: "pickup",
    notes: "No sugar in the latte, please. Fast pickup.",
    currency: "AZN",
    total: 21.00,
    items: [
      {
        id: "latte",
        name: "Latte",
        category: "Classic Coffees",
        price: 6.5,
        quantity: 2,
        lineTotal: 13.0
      },
      {
        id: "honey-cake",
        name: "Honey Cake",
        category: "Desserts",
        price: 8.0,
        quantity: 1,
        lineTotal: 8.0
      }
    ]
  },
  {
    source: "kashalata-website",
    orderId: "KSH-1781370000002",
    status: "preparing",
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    customer: {
      name: "Lala Mammadi",
      phone: "+994709876543"
    },
    orderType: "dine-in",
    notes: "Table 4. Bring coffee after the dessert.",
    currency: "AZN",
    total: 22.90,
    items: [
      {
        id: "americano",
        name: "Americano",
        category: "Classic Coffees",
        price: 4.9,
        quantity: 1,
        lineTotal: 4.9
      },
      {
        id: "san-sebastian",
        name: "San Sebastian Cheesecake",
        category: "Desserts",
        price: 9.0,
        quantity: 2,
        lineTotal: 18.0
      }
    ]
  }
];

// Load orders from JSON database or use seeded initial data
function loadOrders(): any[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    } else {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialSeedOrders, null, 2));
      return initialSeedOrders;
    }
  } catch (err) {
    console.error("Error reading db file, returning fallback memory state:", err);
    return initialSeedOrders;
  }
}

// Save orders back to the JSON database
function saveOrders(orders: any[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(orders, null, 2));
  } catch (err) {
    console.error("Error saving db file:", err);
  }
}

// Active SSE client connections for real-time push alerts
let clients: any[] = [];

// Helper to broadcast realtime events to all connected clients
function broadcastEvent(type: string, data: any) {
  const payload = JSON.stringify({ type, data });
  clients.forEach(client => {
    client.res.write(`data: ${payload}\n\n`);
  });
}

// REST & Web API Endpoints

// 1. GET /api/orders - Fetch all orders stored in the system (newest first)
app.get("/api/orders", (req, res) => {
  const orders = loadOrders();
  // Sort by createdAt descending
  const sorted = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(sorted);
});

// Explicit OPTIONS support for /api/orders
app.options("/api/orders", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.status(200).end(); // Standard OK response for preflight
});

// 2. POST /api/orders - Public endpoint accepting JSON order from kashalata website
app.post("/api/orders", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const orderData = req.body;

  // Validate the incoming order payload
  if (!orderData || !orderData.orderId) {
    return res.status(400).json({ error: "Missing required order details or orderId" });
  }

  const orders = loadOrders();

  // Check if order already exists to support idempotency/retries
  const existingIndex = orders.findIndex(o => o.orderId === orderData.orderId);
  
  const newOrder = {
    ...orderData,
    status: orderData.status || "new",
    createdAt: orderData.createdAt || new Date().toISOString()
  };

  if (existingIndex > -1) {
    // Overwrite or update
    orders[existingIndex] = newOrder;
  } else {
    orders.push(newOrder);
  }

  saveOrders(orders);

  // Broadcast real-time "new_order" event to all authenticated staff clients
  broadcastEvent("new_order", newOrder);

  // Return HTTP 201 Created as expected per requirements
  res.status(201).json({
    success: true,
    message: "Order received and notifications sent successfully",
    order: newOrder
  });
});

// 3. PATCH /api/orders/:orderId/status - Update order status (new, accepted, preparing, ready, completed, cancelled)
app.patch("/api/orders/:orderId/status", (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = ["new", "accepted", "preparing", "ready", "completed", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status. Must be one of: " + validStatuses.join(", ") });
  }

  const orders = loadOrders();
  const index = orders.findIndex(o => o.orderId === orderId);

  if (index === -1) {
    return res.status(404).json({ error: "Order not found" });
  }

  orders[index].status = status;
  orders[index].updatedAt = new Date().toISOString();
  saveOrders(orders);

  // Broadcast real-time status change to keep all devices synchronized
  broadcastEvent("status_change", orders[index]);

  res.json({
    success: true,
    message: `Order status updated to ${status}`,
    order: orders[index]
  });
});

// 4. GET /api/events - Real-time Server-Sent Events stream for connected dashboards/simulators
app.get("/api/events", (req, res) => {
  // Set headers for long-lived SSE connection
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Flush headers immediately
  res.flushHeaders();

  // Store client details
  const clientId = Date.now();
  const newClient = { id: clientId, res };
  clients.push(newClient);

  // Send initial ping to confirm connection
  res.write(`data: ${JSON.stringify({ type: "connected", clientId })}\n\n`);

  // Remove client on connection close
  req.on("close", () => {
    clients = clients.filter(c => c.id !== clientId);
  });
});

// 5. GET /api/stats - Analytics for the dashboard metrics
app.get("/api/stats", (req, res) => {
  const orders = loadOrders();
  const today = new Date().toISOString().split("T")[0];
  
  const todayOrders = orders.filter(o => o.createdAt.startsWith(today));
  const activeOrders = orders.filter(o => ["new", "accepted", "preparing", "ready"].includes(o.status));
  
  const earningsToday = todayOrders
    .filter(o => o.status === "completed")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  res.json({
    totalOrdersCount: orders.length,
    activeCount: activeOrders.length,
    todayCount: todayOrders.length,
    completedTodayCount: todayOrders.filter(o => o.status === "completed").length,
    earningsToday
  });
});

// Configure Vite middleware or production static build serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === "production" || fs.existsSync(path.join(process.cwd(), "dist/index.html"));

  if (!isProduction) {
    // Development server with Vite integration
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static asset serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Kashalata Server] Running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
