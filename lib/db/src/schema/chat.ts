import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

// Lightweight JIT-synced mirror of Clerk users, so we can list/search people
// to start a conversation with and show names/avatars without hitting the
// Clerk API on every request.
export const appUsersTable = pgTable("app_users", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  name: text("name").notNull().default(""),
  email: text("email").notNull().default(""),
  avatarUrl: text("avatar_url"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type AppUser = typeof appUsersTable.$inferSelect;
export type NewAppUser = typeof appUsersTable.$inferInsert;

// A conversation is either:
// - "support": userAClerkId (the visitor) <-> the whole admin team. Any admin
//   can see and reply to it; userBClerkId stays null.
// - "direct": userAClerkId <-> userBClerkId, an ordinary user-to-user chat.
export const conversationsTable = pgTable("conversations", {
  id: serial("id").primaryKey(),
  kind: text("kind", { enum: ["support", "direct"] }).notNull(),
  userAClerkId: text("user_a_clerk_id").notNull(),
  userBClerkId: text("user_b_clerk_id"),
  lastMessageAt: timestamp("last_message_at").notNull().defaultNow(),
  lastMessagePreview: text("last_message_preview").notNull().default(""),
  lastReadAtA: timestamp("last_read_at_a"),
  lastReadAtB: timestamp("last_read_at_b"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Conversation = typeof conversationsTable.$inferSelect;
export type NewConversation = typeof conversationsTable.$inferInsert;

// Messages are permanent — there is intentionally no delete endpoint/route
// for chat messages anywhere in the API server.
export const chatMessagesTable = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  senderClerkId: text("sender_clerk_id").notNull(),
  senderName: text("sender_name").notNull().default(""),
  senderAvatarUrl: text("sender_avatar_url"),
  senderIsAdmin: text("sender_is_admin", { enum: ["true", "false"] })
    .notNull()
    .default("false"),
  content: text("content"),
  attachmentUrl: text("attachment_url"),
  attachmentType: text("attachment_type", {
    enum: ["image", "video", "file"],
  }),
  attachmentName: text("attachment_name"),
  attachmentMimeType: text("attachment_mime_type"),
  attachmentSize: integer("attachment_size"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type ChatMessage = typeof chatMessagesTable.$inferSelect;
export type NewChatMessage = typeof chatMessagesTable.$inferInsert;
