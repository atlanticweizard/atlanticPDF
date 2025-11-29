import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertCourseModuleSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth } from "./auth";
import { createPayUService } from "./payu";
import { emailService } from "./email";
import crypto from "crypto";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const checkoutSchema = z.object({
  customerInfo: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
  }),
  items: z.array(z.object({
    product: z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      price: z.string(),
      category: z.string(),
      image: z.string(),
      type: z.enum(["pdf", "course"]),
      fileUrl: z.string().nullable().optional(),
    }),
  })),
  total: z.number(),
});

function generateSecureDownloadToken(productId: string, expiresIn: number = 3600): string {
  const expiry = Date.now() + expiresIn * 1000;
  const data = `${productId}:${expiry}`;
  const secret = process.env.SESSION_SECRET || "default-secret";
  const signature = crypto.createHmac("sha256", secret).update(data).digest("hex");
  return Buffer.from(`${data}:${signature}`).toString("base64url");
}

function verifyDownloadToken(token: string): { productId: string; valid: boolean } {
  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const [productId, expiry, signature] = decoded.split(":");
    
    const secret = process.env.SESSION_SECRET || "default-secret";
    const expectedSignature = crypto.createHmac("sha256", secret).update(`${productId}:${expiry}`).digest("hex");
    
    if (signature !== expectedSignature) {
      return { productId: "", valid: false };
    }
    
    if (Date.now() > parseInt(expiry)) {
      return { productId, valid: false };
    }
    
    return { productId, valid: true };
  } catch {
    return { productId: "", valid: false };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      
      if (validatedData.type === "course") {
        await storage.createCourse({ productId: product.id });
      }
      
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid product data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.updateProduct(req.params.id, validatedData);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid product data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      if (product.type === "course") {
        const course = await storage.getCourseByProductId(product.id);
        if (course) {
          await storage.deleteCourse(course.id);
        }
      }
      
      const success = await storage.deleteProduct(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  app.get("/api/courses/:productId", async (req, res) => {
    try {
      const course = await storage.getCourseByProductId(req.params.productId);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch course" });
    }
  });

  app.get("/api/courses/:productId/modules", async (req, res) => {
    try {
      const course = await storage.getCourseByProductId(req.params.productId);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      const modules = await storage.getCourseModules(course.id);
      res.json(modules);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch course modules" });
    }
  });

  app.post("/api/courses/:productId/modules", async (req, res) => {
    try {
      const course = await storage.getCourseByProductId(req.params.productId);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      
      const moduleData = insertCourseModuleSchema.parse({
        ...req.body,
        courseId: course.id,
      });
      
      const module = await storage.createCourseModule(moduleData);
      res.status(201).json(module);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid module data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create module" });
    }
  });

  app.put("/api/modules/:id", async (req, res) => {
    try {
      const module = await storage.updateCourseModule(req.params.id, req.body);
      if (!module) {
        return res.status(404).json({ error: "Module not found" });
      }
      res.json(module);
    } catch (error) {
      res.status(500).json({ error: "Failed to update module" });
    }
  });

  app.delete("/api/modules/:id", async (req, res) => {
    try {
      const success = await storage.deleteCourseModule(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Module not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete module" });
    }
  });

  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const admin = await storage.getAdminByEmail(email);
      
      if (!admin || admin.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      res.json({ success: true, admin: { id: admin.id, email: admin.email } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid login data" });
      }
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = checkoutSchema.parse(req.body);
      const orderData = {
        ...validatedData,
        total: validatedData.total.toString(),
        paymentStatus: "pending" as const,
      };
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid order data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/orders", async (_req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/my", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const userId = req.user!.id;
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/user/purchases", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const userId = req.user!.id;
      const accessList = await storage.getUserAccess(userId);
      
      const purchases = await Promise.all(
        accessList.map(async (access) => {
          const product = await storage.getProductById(access.productId);
          if (!product) return null;
          
          let downloadToken: string | undefined;
          if (product.type === "pdf" && product.fileUrl) {
            downloadToken = generateSecureDownloadToken(product.id);
          }
          
          return {
            ...access,
            product,
            downloadToken,
          };
        })
      );
      
      res.json(purchases.filter(Boolean));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch purchases" });
    }
  });

  app.get("/api/user/access/:productId", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const userId = req.user!.id;
      const access = await storage.getUserAccessForProduct(userId, req.params.productId);
      
      if (!access) {
        return res.status(403).json({ error: "No access to this product" });
      }
      
      res.json({ hasAccess: true, access });
    } catch (error) {
      res.status(500).json({ error: "Failed to check access" });
    }
  });

  app.get("/api/download/:token", async (req, res) => {
    try {
      const { productId, valid } = verifyDownloadToken(req.params.token);
      
      if (!valid) {
        return res.status(403).json({ error: "Invalid or expired download link" });
      }
      
      const product = await storage.getProductById(productId);
      if (!product || !product.fileUrl) {
        return res.status(404).json({ error: "File not found" });
      }
      
      res.redirect(product.fileUrl);
    } catch (error) {
      res.status(500).json({ error: "Download failed" });
    }
  });

  app.post("/api/payment/initiate", async (req, res) => {
    try {
      const { customerInfo, items } = req.body;
      
      console.log("🔍 Payment initiation request received");
      console.log("  - Customer:", customerInfo?.firstName, customerInfo?.lastName);
      console.log("  - Items count:", items?.length);
      
      if (!customerInfo || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Invalid order data" });
      }

      let total = 0;
      const validatedItems = [];

      for (const item of items) {
        const product = await storage.getProductById(item.product.id);
        if (!product) {
          return res.status(400).json({ error: `Product ${item.product.id} not found` });
        }

        const itemTotal = parseFloat(product.price);
        total += itemTotal;
        
        validatedItems.push({
          product,
        });
      }
      
      const userId = req.isAuthenticated() ? req.user!.id : null;
      
      const order = await storage.createOrder({
        customerInfo,
        items: validatedItems,
        total: total.toString(),
        paymentStatus: "pending",
        userId,
      });

      console.log("✅ Order created:", order.id);

      let payuService;
      try {
        payuService = createPayUService();
      } catch (error) {
        console.error("❌ PayU service initialization failed:", error);
        return res.status(500).json({ 
          error: "Payment gateway not configured. Please contact support.",
          details: error instanceof Error ? error.message : "Unknown error"
        });
      }

      const txnid = payuService.generateTransactionId();

      const replitDomain = process.env.REPLIT_DEV_DOMAIN;
      const baseUrl = process.env.NODE_ENV === "production" 
        ? "https://atlanticweizard.dpdns.org"
        : replitDomain 
          ? `https://${replitDomain}`
          : "http://localhost:5000";
      
      console.log("🌐 Base URL for callbacks:", baseUrl);
      
      if (!replitDomain && process.env.NODE_ENV !== "production") {
        console.warn("⚠️  REPLIT_DEV_DOMAIN not set! Using fallback:", baseUrl);
      }

      const paymentData = {
        txnid,
        amount: total.toFixed(2),
        productinfo: `Order #${order.id.substring(0, 8)}`,
        firstname: customerInfo.firstName,
        lastname: customerInfo.lastName,
        email: customerInfo.email,
        phone: customerInfo.phone,
        surl: `${baseUrl}/api/payment/success`,
        furl: `${baseUrl}/api/payment/failure`,
        udf1: order.id,
      };

      const payuFormData = payuService.preparePaymentForm(paymentData);

      await storage.updateOrderPayment(order.id, {
        paymentStatus: "pending",
        transactionId: txnid,
        payuResponse: null,
      });

      const paymentUrl = payuService.getPaymentUrl();
      
      console.log("🔍 Payment initiation debug:");
      console.log("  - Payment URL:", paymentUrl);
      console.log("  - Order ID:", order.id);
      console.log("  - Transaction ID:", txnid);
      console.log("  - Total amount:", total.toFixed(2));

      const response = {
        paymentUrl: paymentUrl,
        formData: payuFormData,
        orderId: order.id,
      };

      console.log("✅ Payment response being sent:", JSON.stringify(response, null, 2));
      
      res.json(response);
    } catch (error) {
      console.error("❌ Payment initiation error:", error);
      res.status(500).json({ error: "Failed to initiate payment" });
    }
  });

  app.post("/api/payment/success", async (req, res) => {
    try {
      const {
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        status,
        hash,
        mihpayid,
        mode,
        udf1: orderId,
      } = req.body;

      if (!orderId || !txnid || !hash) {
        console.error("Missing required fields in payment callback");
        return res.redirect("/payment-failure?error=invalid_callback");
      }

      const order = await storage.getOrderById(orderId);
      if (!order) {
        console.error("Order not found:", orderId);
        return res.redirect("/payment-failure?error=order_not_found");
      }

      const payuService = createPayUService();
      
      const isValidHash = payuService.verifyHash(
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        status,
        hash,
        orderId
      );

      if (!isValidHash) {
        console.error("Hash verification failed for transaction:", txnid);
        await storage.updateOrderPayment(orderId, {
          paymentStatus: "failed",
          transactionId: txnid,
          payuResponse: { ...req.body, error: "hash_verification_failed" },
          paymentMethod: mode,
        });
        return res.redirect(`/payment-failure?orderId=${orderId}&error=invalid_hash`);
      }

      const expectedAmount = parseFloat(String(order.total)).toFixed(2);
      if (amount !== expectedAmount) {
        console.error(`Amount mismatch: expected ${expectedAmount}, received ${amount}`);
        await storage.updateOrderPayment(orderId, {
          paymentStatus: "failed",
          transactionId: txnid,
          payuResponse: { ...req.body, error: "amount_mismatch" },
          paymentMethod: mode,
        });
        return res.redirect(`/payment-failure?orderId=${orderId}&error=amount_mismatch`);
      }

      if (status === "success") {
        await storage.updateOrderPayment(orderId, {
          paymentStatus: "success",
          transactionId: txnid,
          payuResponse: req.body,
          paymentMethod: mode,
        });

        if (order.userId) {
          for (const item of order.items) {
            await storage.grantUserAccess({
              userId: order.userId,
              productId: item.product.id,
              orderId: order.id,
            });
          }
          console.log(`✅ Granted access to ${order.items.length} products for user ${order.userId}`);
        }

        const updatedOrder = await storage.getOrderById(orderId);
        if (updatedOrder) {
          emailService.sendPaymentSuccessEmail(updatedOrder).catch((err) => 
            console.error("Failed to send payment success email:", err)
          );
        }

        res.redirect(`/payment-success?orderId=${orderId}&txnid=${txnid}`);
      } else {
        await storage.updateOrderPayment(orderId, {
          paymentStatus: "failed",
          transactionId: txnid,
          payuResponse: req.body,
          paymentMethod: mode,
        });

        res.redirect(`/payment-failure?orderId=${orderId}&txnid=${txnid}`);
      }
    } catch (error) {
      console.error("Payment success callback error:", error);
      res.redirect("/payment-failure?error=processing_error");
    }
  });

  app.post("/api/payment/failure", async (req, res) => {
    try {
      const {
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        status,
        hash,
        mode,
        udf1: orderId,
      } = req.body;

      if (!orderId || !txnid) {
        console.error("Missing required fields in failure callback");
        return res.redirect("/payment-failure?error=invalid_callback");
      }

      const order = await storage.getOrderById(orderId);
      if (!order) {
        console.error("Order not found:", orderId);
        return res.redirect("/payment-failure?error=order_not_found");
      }

      const payuService = createPayUService();
      
      const isValidHash = payuService.verifyHash(
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        status,
        hash,
        orderId
      );

      if (!isValidHash) {
        console.error("Hash verification failed for transaction:", txnid);
      }

      await storage.updateOrderPayment(orderId, {
        paymentStatus: "failed",
        transactionId: txnid,
        payuResponse: req.body,
        paymentMethod: mode,
      });

      res.redirect(`/payment-failure?orderId=${orderId}&txnid=${txnid}`);
    } catch (error) {
      console.error("Payment failure callback error:", error);
      res.redirect("/payment-failure?error=processing_error");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
