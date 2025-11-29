import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  type: text("type").$type<"pdf" | "course">().notNull().default("pdf"),
  fileUrl: text("file_url"),
});

export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export const courseModules = pgTable("course_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").$type<"video" | "pdf" | "text">().notNull(),
  contentUrl: text("content_url"),
  textContent: text("text_content"),
  orderIndex: integer("order_index").notNull().default(0),
});

export const admins = pgTable("admins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerInfo: jsonb("customer_info").notNull().$type<CheckoutData>(),
  items: jsonb("items").notNull().$type<CartItem[]>(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull().$type<string>(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  userId: integer("user_id"),
  paymentStatus: text("payment_status").$type<"pending" | "success" | "failed">().default("pending"),
  transactionId: text("transaction_id"),
  payuResponse: jsonb("payu_response"),
  paymentMethod: text("payment_method"),
});

export const userAccess = pgTable("user_access", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: integer("user_id").notNull().references(() => users.id),
  productId: varchar("product_id").notNull().references(() => products.id),
  orderId: varchar("order_id").references(() => orders.id),
  grantedAt: timestamp("granted_at", { mode: "string" }).notNull().defaultNow(),
});

export interface CartItem {
  product: Product;
}

export interface CheckoutData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const insertProductSchema = createInsertSchema(products, {
  type: z.enum(["pdf", "course"]).default("pdf"),
}).omit({
  id: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
});

export const insertCourseModuleSchema = createInsertSchema(courseModules, {
  type: z.enum(["video", "pdf", "text"]),
}).omit({
  id: true,
});

export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
});

export const insertUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email().optional(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertUserAccessSchema = createInsertSchema(userAccess).omit({
  id: true,
  grantedAt: true,
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type CourseModule = typeof courseModules.$inferSelect;
export type InsertCourseModule = z.infer<typeof insertCourseModuleSchema>;
export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type PublicUser = Omit<User, "password">;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type UserAccess = typeof userAccess.$inferSelect;
export type InsertUserAccess = z.infer<typeof insertUserAccessSchema>;
