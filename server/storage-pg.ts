import { type Product, type InsertProduct, type Admin, type Order, type InsertOrder, type User, type InsertUser, type Course, type InsertCourse, type CourseModule, type InsertCourseModule, type UserAccess, type InsertUserAccess, products, admins, users, orders, courses, courseModules, userAccess } from "@shared/schema";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import { Pool } from "@neondatabase/serverless";
import { IStorage } from "./storage";

const PgSession = ConnectPgSimple(session);

export class PostgresStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is required for PostgreSQL storage");
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.sessionStore = new PgSession({
      pool: pool as any,
      createTableIfMissing: true,
    });
  }

  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async getProductsByType(type: "pdf" | "course"): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.type, type));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(insertProduct).returning();
    return result[0];
  }

  async updateProduct(id: string, insertProduct: InsertProduct): Promise<Product | undefined> {
    const result = await db
      .update(products)
      .set(insertProduct)
      .where(eq(products.id, id))
      .returning();
    return result[0];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id)).returning();
    return result.length > 0;
  }

  async getCourseByProductId(productId: string): Promise<Course | undefined> {
    const result = await db.select().from(courses).where(eq(courses.productId, productId));
    return result[0];
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const result = await db.insert(courses).values(course).returning();
    return result[0];
  }

  async deleteCourse(id: string): Promise<boolean> {
    await db.delete(courseModules).where(eq(courseModules.courseId, id));
    const result = await db.delete(courses).where(eq(courses.id, id)).returning();
    return result.length > 0;
  }

  async getCourseModules(courseId: string): Promise<CourseModule[]> {
    return await db
      .select()
      .from(courseModules)
      .where(eq(courseModules.courseId, courseId))
      .orderBy(courseModules.orderIndex);
  }

  async getCourseModuleById(id: string): Promise<CourseModule | undefined> {
    const result = await db.select().from(courseModules).where(eq(courseModules.id, id));
    return result[0];
  }

  async createCourseModule(module: InsertCourseModule): Promise<CourseModule> {
    const result = await db.insert(courseModules).values(module).returning();
    return result[0];
  }

  async updateCourseModule(id: string, module: Partial<InsertCourseModule>): Promise<CourseModule | undefined> {
    const result = await db
      .update(courseModules)
      .set(module)
      .where(eq(courseModules.id, id))
      .returning();
    return result[0];
  }

  async deleteCourseModule(id: string): Promise<boolean> {
    const result = await db.delete(courseModules).where(eq(courseModules.id, id)).returning();
    return result.length > 0;
  }

  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    const result = await db.select().from(admins).where(eq(admins.email, email));
    return result[0];
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(insertOrder).returning();
    return result[0];
  }

  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }

  async updateOrderPayment(
    id: string,
    paymentData: { paymentStatus: string; transactionId: string; payuResponse: any; paymentMethod?: string }
  ): Promise<Order | undefined> {
    const result = await db
      .update(orders)
      .set({
        paymentStatus: paymentData.paymentStatus as "pending" | "success" | "failed",
        transactionId: paymentData.transactionId,
        payuResponse: paymentData.payuResponse,
        paymentMethod: paymentData.paymentMethod,
      })
      .where(eq(orders.id, id))
      .returning();
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUserEmail(userId: number, email: string): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({ email })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async getUserAccess(userId: number): Promise<UserAccess[]> {
    return await db
      .select()
      .from(userAccess)
      .where(eq(userAccess.userId, userId));
  }

  async getUserAccessForProduct(userId: number, productId: string): Promise<UserAccess | undefined> {
    const result = await db
      .select()
      .from(userAccess)
      .where(and(eq(userAccess.userId, userId), eq(userAccess.productId, productId)));
    return result[0];
  }

  async grantUserAccess(access: InsertUserAccess): Promise<UserAccess> {
    const existing = await this.getUserAccessForProduct(access.userId, access.productId);
    if (existing) {
      return existing;
    }
    const result = await db.insert(userAccess).values(access).returning();
    return result[0];
  }
}

export const storage = new PostgresStorage();
