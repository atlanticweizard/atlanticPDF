import { type Product, type InsertProduct, type Admin, type InsertAdmin, type Order, type InsertOrder, type User, type InsertUser, type Course, type InsertCourse, type CourseModule, type InsertCourseModule, type UserAccess, type InsertUserAccess } from "@shared/schema";
import session from "express-session";

export interface IStorage {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  getProductsByType(type: "pdf" | "course"): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: InsertProduct): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  
  getCourseByProductId(productId: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  deleteCourse(id: string): Promise<boolean>;
  
  getCourseModules(courseId: string): Promise<CourseModule[]>;
  getCourseModuleById(id: string): Promise<CourseModule | undefined>;
  createCourseModule(module: InsertCourseModule): Promise<CourseModule>;
  updateCourseModule(id: string, module: Partial<InsertCourseModule>): Promise<CourseModule | undefined>;
  deleteCourseModule(id: string): Promise<boolean>;
  
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  
  createOrder(order: InsertOrder): Promise<Order>;
  getAllOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | undefined>;
  updateOrderPayment(id: string, paymentData: { paymentStatus: string; transactionId: string; payuResponse: any; paymentMethod?: string }): Promise<Order | undefined>;
  
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUser(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserEmail(userId: number, email: string): Promise<User | undefined>;
  getUserOrders(userId: number): Promise<Order[]>;
  
  getUserAccess(userId: number): Promise<UserAccess[]>;
  getUserAccessForProduct(userId: number, productId: string): Promise<UserAccess | undefined>;
  grantUserAccess(access: InsertUserAccess): Promise<UserAccess>;
  
  sessionStore: session.Store;
}

if (!process.env.DATABASE_URL) {
  console.error("\n❌ ERROR: DATABASE_URL environment variable is required");
  console.error("This application requires PostgreSQL to run.");
  console.error("\nTo set up the database:");
  console.error("1. Install PostgreSQL on your server");
  console.error("2. Create a database for the application");
  console.error("3. Set DATABASE_URL in your environment variables");
  console.error("   Example: DATABASE_URL=postgresql://user:password@localhost:5432/atlantic_weizard");
  console.error("\nFor deployment instructions, see DEPLOYMENT.md\n");
  process.exit(1);
}

console.log("🔍 Connecting to PostgreSQL...");

import { PostgresStorage } from "./storage-pg.js";

export const storage = new PostgresStorage();

console.log("✅ PostgreSQL storage initialized");
