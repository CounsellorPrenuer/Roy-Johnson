import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactInquirySchema, insertUserSchema, insertBookingSchema, insertPaymentSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
