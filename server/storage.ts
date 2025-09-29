import { 
  type User, 
  type InsertUser, 
  type ContactInquiry, 
  type InsertContactInquiry,
  type CoachingPackage,
  type Booking,
  type InsertBooking,
  type Payment,
  type InsertPayment,
  users,
  contactInquiries,
  coachingPackages,
  bookings,
  payments
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Updated interface with all CRUD methods needed
export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact Inquiries
  createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
  getAllContactInquiries(): Promise<ContactInquiry[]>;
  markContactInquiryAsRead(id: string): Promise<void>;
  
  // Coaching Packages
  getAllPackages(): Promise<CoachingPackage[]>;
  getPackageById(id: string): Promise<CoachingPackage | undefined>;
  getPackagesByCategory(category: string): Promise<CoachingPackage[]>;
  createPackage(pkg: Omit<CoachingPackage, 'id' | 'createdAt'>): Promise<CoachingPackage>;
  
  // Bookings
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingById(id: string): Promise<Booking | undefined>;
  getUserBookings(userId: string): Promise<Booking[]>;
  getAllBookings(): Promise<Booking[]>;
  updateBookingStatus(id: string, status: string): Promise<void>;
  updateBookingPayment(bookingId: string, paymentId: string): Promise<void>;
  
  // Payments
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentById(id: string): Promise<Payment | undefined>;
  updatePaymentStatus(id: string, status: string, paymentId?: string): Promise<void>;
  getUserPayments(userId: string): Promise<Payment[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Contact Inquiries
  async createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry> {
    const [result] = await db
      .insert(contactInquiries)
      .values(inquiry)
      .returning();
    return result;
  }

  async getAllContactInquiries(): Promise<ContactInquiry[]> {
    return await db
      .select()
      .from(contactInquiries)
      .orderBy(desc(contactInquiries.createdAt));
  }

  async markContactInquiryAsRead(id: string): Promise<void> {
    await db
      .update(contactInquiries)
      .set({ isRead: true })
      .where(eq(contactInquiries.id, id));
  }

  // Coaching Packages
  async getAllPackages(): Promise<CoachingPackage[]> {
    return await db
      .select()
      .from(coachingPackages)
      .where(eq(coachingPackages.isActive, true));
  }

  async getPackageById(id: string): Promise<CoachingPackage | undefined> {
    const [pkg] = await db
      .select()
      .from(coachingPackages)
      .where(eq(coachingPackages.id, id));
    return pkg || undefined;
  }

  async getPackagesByCategory(category: string): Promise<CoachingPackage[]> {
    return await db
      .select()
      .from(coachingPackages)
      .where(eq(coachingPackages.category, category as any));
  }

  async createPackage(pkg: Omit<CoachingPackage, 'id' | 'createdAt'>): Promise<CoachingPackage> {
    const [result] = await db
      .insert(coachingPackages)
      .values(pkg)
      .returning();
    return result;
  }

  // Bookings
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [result] = await db
      .insert(bookings)
      .values(booking)
      .returning();
    return result;
  }

  async getBookingById(id: string): Promise<Booking | undefined> {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id));
    return booking || undefined;
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.createdAt));
  }

  async getAllBookings(): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.createdAt));
  }

  async updateBookingStatus(id: string, status: string): Promise<void> {
    await db
      .update(bookings)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(bookings.id, id));
  }

  async updateBookingPayment(bookingId: string, paymentId: string): Promise<void> {
    await db
      .update(bookings)
      .set({ paymentId: paymentId, updatedAt: new Date() })
      .where(eq(bookings.id, bookingId));
  }

  // Payments
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [result] = await db
      .insert(payments)
      .values(payment)
      .returning();
    return result;
  }

  async getPaymentById(id: string): Promise<Payment | undefined> {
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.id, id));
    return payment || undefined;
  }

  async updatePaymentStatus(id: string, status: string, paymentId?: string): Promise<void> {
    const updateData: any = { status: status as any, updatedAt: new Date() };
    if (paymentId) {
      updateData.razorpayPaymentId = paymentId;
    }
    
    await db
      .update(payments)
      .set(updateData)
      .where(eq(payments.id, id));
  }

  async getUserPayments(userId: string): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .where(eq(payments.userId, userId))
      .orderBy(desc(payments.createdAt));
  }
}

export const storage = new DatabaseStorage();
