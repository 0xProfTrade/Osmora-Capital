import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/** Core user table backing the OAuth access flow. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const proposals = mysqlTable("proposals", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  company: varchar("company", { length: 180 }).notNull(),
  sector: varchar("sector", { length: 80 }).notNull(),
  stage: varchar("stage", { length: 80 }),
  pitch: text("pitch").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  deckKey: varchar("deckKey", { length: 1024 }),
  status: mysqlEnum("status", ["new", "under review", "responded"]).default("new").notNull(),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
});

export const contactInquiries = mysqlTable("contactInquiries", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  companyProject: varchar("companyProject", { length: 180 }),
  sector: varchar("sector", { length: 80 }),
  email: varchar("email", { length: 320 }).notNull(),
  message: text("message").notNull(),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Proposal = typeof proposals.$inferSelect;
export type InsertProposal = typeof proposals.$inferInsert;
export type ContactInquiry = typeof contactInquiries.$inferSelect;
export type InsertContactInquiry = typeof contactInquiries.$inferInsert;
