import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactInquirySchema, insertUserSchema, insertBookingSchema, insertPaymentSchema, createOrderSchema, verifyPaymentSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import Razorpay from "razorpay";
import crypto from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Razorpay
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
  // Contact Form API
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactInquirySchema.parse(req.body);
      const inquiry = await storage.createContactInquiry(contactData);
      res.json({ success: true, id: inquiry.id });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          success: false, 
          error: "Validation failed", 
          details: validationError.message 
        });
      }
      console.error("Contact form error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Get all contact inquiries (admin)
  app.get("/api/admin/contacts", async (req, res) => {
    try {
      const inquiries = await storage.getAllContactInquiries();
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching contact inquiries:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Mark contact inquiry as read (admin)
  app.patch("/api/admin/contacts/:id/read", async (req, res) => {
    try {
      await storage.markContactInquiryAsRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking contact as read:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Coaching Packages API
  app.get("/api/packages", async (req, res) => {
    try {
      const packages = await storage.getAllPackages();
      res.json(packages);
    } catch (error) {
      console.error("Error fetching packages:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  app.get("/api/packages/category/:category", async (req, res) => {
    try {
      const packages = await storage.getPackagesByCategory(req.params.category);
      res.json(packages);
    } catch (error) {
      console.error("Error fetching packages by category:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  app.get("/api/packages/:id", async (req, res) => {
    try {
      const pkg = await storage.getPackageById(req.params.id);
      if (!pkg) {
        return res.status(404).json({ success: false, error: "Package not found" });
      }
      res.json(pkg);
    } catch (error) {
      console.error("Error fetching package:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Admin route to create packages
  app.post("/api/admin/packages", async (req, res) => {
    try {
      const packageData = req.body;
      const pkg = await storage.createPackage(packageData);
      res.json({ success: true, package: pkg });
    } catch (error) {
      console.error("Error creating package:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // User Management API
  app.post("/api/users/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ success: false, error: "User already exists with this email" });
      }

      const user = await storage.createUser(userData);
      // Remove password from response
      const { password, ...safeUser } = user;
      res.json({ success: true, user: safeUser });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          success: false, 
          error: "Validation failed", 
          details: validationError.message 
        });
      }
      console.error("User registration error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Booking System API
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.json({ success: true, booking });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          success: false, 
          error: "Validation failed", 
          details: validationError.message 
        });
      }
      console.error("Booking creation error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  app.get("/api/bookings/user/:userId", async (req, res) => {
    try {
      const bookings = await storage.getUserBookings(req.params.userId);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  app.get("/api/admin/bookings", async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching all bookings:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      await storage.updateBookingStatus(req.params.id, status);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Payment System API
  app.post("/api/payments", async (req, res) => {
    try {
      const paymentData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(paymentData);
      res.json({ success: true, payment });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          success: false, 
          error: "Validation failed", 
          details: validationError.message 
        });
      }
      console.error("Payment creation error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  app.patch("/api/payments/:id/status", async (req, res) => {
    try {
      const { status, paymentId } = req.body;
      await storage.updatePaymentStatus(req.params.id, status, paymentId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  app.get("/api/payments/user/:userId", async (req, res) => {
    try {
      const payments = await storage.getUserPayments(req.params.userId);
      res.json(payments);
    } catch (error) {
      console.error("Error fetching user payments:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Razorpay Payment Routes
  
  // Create Razorpay order for package purchase
  app.post("/api/payments/create-order", async (req, res) => {
    try {
      // Validate request body
      const validationResult = createOrderSchema.parse(req.body);
      const { packageId, userId } = validationResult;

      // Get package details from database (server-side truth)
      const pkg = await storage.getPackageById(packageId);
      if (!pkg) {
        return res.status(404).json({ success: false, error: "Package not found" });
      }

      // Server-derived amount from database
      const amountInPaise = Math.round(parseFloat(pkg.price) * 100);

      // Create Razorpay order
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          packageId: pkg.id,
          packageName: pkg.name,
          userId: userId,
          category: pkg.category
        }
      });

      // Create payment record in database with package verification data
      const payment = await storage.createPayment({
        userId: userId,
        amount: pkg.price,
        packageId: pkg.id, // Store for verification
        razorpayOrderId: order.id
      });

      // Log order creation (redact sensitive info)
      console.log(`Payment order created - Order: ${order.id}, Package: ${pkg.name}, Amount: ${pkg.price}, User: ${userId.substring(0, 8)}***`);

      res.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        paymentId: payment.id,
        packageDetails: {
          id: pkg.id,
          name: pkg.name,
          price: pkg.price,
          category: pkg.category
        }
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          success: false, 
          error: "Validation failed", 
          details: validationError.message 
        });
      }
      console.error("Error creating Razorpay order:", error);
      res.status(500).json({ success: false, error: "Failed to create payment order" });
    }
  });

  // Verify Razorpay payment
  app.post("/api/payments/verify", async (req, res) => {
    try {
      // Validate request body
      const validationResult = verifyPaymentSchema.parse(req.body);
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId, packageId, userId } = validationResult;

      // Get stored payment record by our payment ID
      const storedPayment = await storage.getPaymentById(paymentId);
      if (!storedPayment) {
        return res.status(404).json({ success: false, error: "Payment record not found" });
      }

      // Idempotency check - if already completed, return existing result
      if (storedPayment.status === "completed") {
        const existingBooking = await storage.getBookingById(storedPayment.bookingId!);
        return res.json({
          success: true,
          message: "Payment already verified",
          bookingId: existingBooking?.id,
          paymentDetails: {
            razorpayPaymentId: storedPayment.razorpayPaymentId,
            razorpayOrderId: storedPayment.razorpayOrderId,
            amount: storedPayment.amount,
            status: "completed"
          }
        });
      }

      // Verify order ID matches stored record
      if (storedPayment.razorpayOrderId !== razorpay_order_id) {
        console.error(`Order ID mismatch: stored=${storedPayment.razorpayOrderId}, received=${razorpay_order_id}`);
        return res.status(400).json({ success: false, error: "Order ID mismatch" });
      }

      // Verify package ID matches stored record
      if (storedPayment.packageId !== packageId) {
        console.error(`Package ID mismatch: stored=${storedPayment.packageId}, received=${packageId}`);
        return res.status(400).json({ success: false, error: "Package ID mismatch" });
      }

      // Verify user ID matches stored record
      if (storedPayment.userId !== userId) {
        console.error(`User ID mismatch: stored=${storedPayment.userId}, received=${userId}`);
        return res.status(400).json({ success: false, error: "User ID mismatch" });
      }

      // HMAC SHA256 signature verification with stored order ID
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(`${storedPayment.razorpayOrderId}|${razorpay_payment_id}`)
        .digest('hex');
      
      if (expectedSignature !== razorpay_signature) {
        console.error(`Signature verification failed for order ${razorpay_order_id}`);
        return res.status(400).json({ success: false, error: "Invalid payment signature" });
      }

      // Get package details from stored record
      const pkg = await storage.getPackageById(storedPayment.packageId);
      if (!pkg) {
        console.error(`Package not found: ${storedPayment.packageId}`);
        return res.status(404).json({ success: false, error: "Package not found" });
      }

      // Verify amount matches stored package price
      if (parseFloat(storedPayment.amount) !== parseFloat(pkg.price)) {
        console.error(`Amount mismatch: stored=${storedPayment.amount}, package=${pkg.price}`);
        return res.status(400).json({ success: false, error: "Amount verification failed" });
      }

      // Create booking record
      const booking = await storage.createBooking({
        userId: userId,
        packageId: packageId,
        totalAmount: pkg.price
      });

      // Update payment record with success status and payment ID
      await storage.updatePaymentStatus(paymentId, "completed", razorpay_payment_id);

      // Link booking to payment
      await storage.updateBookingPayment(booking.id, paymentId);

      // Log successful verification (redact sensitive info)
      console.log(`Payment verified successfully - Order: ${razorpay_order_id}, Booking: ${booking.id}, User: ${userId.substring(0, 8)}***`);

      res.json({
        success: true,
        message: "Payment verified successfully",
        bookingId: booking.id,
        paymentDetails: {
          razorpayPaymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          amount: pkg.price,
          status: "completed"
        }
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          success: false, 
          error: "Validation failed", 
          details: validationError.message 
        });
      }
      console.error("Error verifying payment:", error);
      res.status(500).json({ success: false, error: "Payment verification failed" });
    }
  });

  // Get Razorpay key for frontend
  app.get("/api/payments/razorpay-key", (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID });
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
