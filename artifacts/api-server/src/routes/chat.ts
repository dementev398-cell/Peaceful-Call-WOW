import { Router, type IRouter } from "express";
import { and, or, eq, asc, desc } from "drizzle-orm";
import {
  db,
  appUsersTable,
  adminsTable,
  conversationsTable,
  chatMessagesTable,
  type Conversation,
} from "@workspace/db";
import { requireAppUser } from "../middlewares/appUser";
import {
  ListConversationsResponse,
  StartSupportConversationResponse,
  StartDirectConversationBody,
  StartDirectConversationResponse,
  ListChatMessagesResponse,
  SendChatMessageBody,
  SendChatMessageResponse,
  ListChatUsersResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function isAdmin(clerkUserId: string): Promise<boolean> {
  const [row] = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.clerkUserId, clerkUserId));
  return Boolean(row);
}

async function canAccessConversation(
  convo: Conversation,
  clerkUserId: string,
  admin: boolean,
): Promise<boolean> {
  if (convo.userAClerkId === clerkUserId) return true;
  if (convo.userBClerkId === clerkUserId) return true;
  if (convo.kind === "support" && admin) return true;
  return false;
}

router.get("/chat/users", requireAppUser, async (req, res): Promise<void> => {
  const me = req.appUser!;
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const rows = await db
    .select()
    .from(appUsersTable)
    .orderBy(desc(appUsersTable.updatedAt));
  const filtered = rows.filter((u) => {
    if (u.clerkUserId === me.clerkUserId) return false;
    if (!q) return true;
    const haystack = `${u.name} ${u.email}`.toLowerCase();
    return haystack.includes(q.toLowerCase());
  });
  res.json(ListChatUsersResponse.parse(filtered));
});

router.get(
  "/chat/conversations",
  requireAppUser,
  async (req, res): Promise<void> => {
    const me = req.appUser!;
    const admin = await isAdmin(me.clerkUserId);

    const rows = await db
      .select()
      .from(conversationsTable)
      .where(
        admin
          ? or(
              eq(conversationsTable.userAClerkId, me.clerkUserId),
              eq(conversationsTable.userBClerkId, me.clerkUserId),
              eq(conversationsTable.kind, "support"),
            )
          : or(
              eq(conversationsTable.userAClerkId, me.clerkUserId),
              eq(conversationsTable.userBClerkId, me.clerkUserId),
            ),
      )
      .orderBy(desc(conversationsTable.lastMessageAt));

    const clerkIds = new Set<string>();
    for (const c of rows) {
      if (c.userAClerkId !== me.clerkUserId) clerkIds.add(c.userAClerkId);
      if (c.userBClerkId && c.userBClerkId !== me.clerkUserId)
        clerkIds.add(c.userBClerkId);
    }
    const others = clerkIds.size
      ? await db.select().from(appUsersTable)
      : [];
    const othersById = new Map(others.map((u) => [u.clerkUserId, u]));

    const result = rows.map((c) => {
      const isA = c.userAClerkId === me.clerkUserId;
      const otherId = c.kind === "support" && !isA ? c.userAClerkId : isA ? c.userBClerkId : c.userAClerkId;
      const other = otherId ? othersById.get(otherId) ?? null : null;
      const lastReadAt = isA ? c.lastReadAtA : c.lastReadAtB;
      const unread = !lastReadAt || c.lastMessageAt > lastReadAt;
      return {
        id: c.id,
        kind: c.kind,
        title:
          c.kind === "support" && isA
            ? "Администрация"
            : other?.name || other?.email || "Администрация",
        otherAvatarUrl: other?.avatarUrl ?? null,
        lastMessageAt: c.lastMessageAt,
        lastMessagePreview: c.lastMessagePreview,
        unread,
      };
    });

    res.json(ListConversationsResponse.parse(result));
  },
);

router.post(
  "/chat/conversations/support",
  requireAppUser,
  async (req, res): Promise<void> => {
    const me = req.appUser!;

    const [existing] = await db
      .select()
      .from(conversationsTable)
      .where(
        and(
          eq(conversationsTable.kind, "support"),
          eq(conversationsTable.userAClerkId, me.clerkUserId),
        ),
      );
    if (existing) {
      res
        .status(200)
        .json(StartSupportConversationResponse.parse({ id: existing.id }));
      return;
    }

    const [created] = await db
      .insert(conversationsTable)
      .values({
        kind: "support",
        userAClerkId: me.clerkUserId,
        lastMessagePreview: "",
      })
      .returning();

    res
      .status(201)
      .json(StartSupportConversationResponse.parse({ id: created.id }));
  },
);

router.post(
  "/chat/conversations/direct",
  requireAppUser,
  async (req, res): Promise<void> => {
    const me = req.appUser!;
    const parsed = StartDirectConversationBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const targetId = parsed.data.targetClerkId;
    if (targetId === me.clerkUserId) {
      res.status(400).json({ error: "Cannot message yourself" });
      return;
    }

    const [existing] = await db
      .select()
      .from(conversationsTable)
      .where(
        and(
          eq(conversationsTable.kind, "direct"),
          or(
            and(
              eq(conversationsTable.userAClerkId, me.clerkUserId),
              eq(conversationsTable.userBClerkId, targetId),
            ),
            and(
              eq(conversationsTable.userAClerkId, targetId),
              eq(conversationsTable.userBClerkId, me.clerkUserId),
            ),
          ),
        ),
      );
    if (existing) {
      res
        .status(200)
        .json(StartDirectConversationResponse.parse({ id: existing.id }));
      return;
    }

    const [created] = await db
      .insert(conversationsTable)
      .values({
        kind: "direct",
        userAClerkId: me.clerkUserId,
        userBClerkId: targetId,
        lastMessagePreview: "",
      })
      .returning();

    res
      .status(201)
      .json(StartDirectConversationResponse.parse({ id: created.id }));
  },
);

router.get(
  "/chat/conversations/:id/messages",
  requireAppUser,
  async (req, res): Promise<void> => {
    const me = req.appUser!;
    const id = parseInt(req.params.id as string, 10);
    const [convo] = await db
      .select()
      .from(conversationsTable)
      .where(eq(conversationsTable.id, id));
    if (!convo) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const admin = await isAdmin(me.clerkUserId);
    if (!(await canAccessConversation(convo, me.clerkUserId, admin))) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const messages = await db
      .select()
      .from(chatMessagesTable)
      .where(eq(chatMessagesTable.conversationId, id))
      .orderBy(asc(chatMessagesTable.createdAt));

    res.json(ListChatMessagesResponse.parse(messages));
  },
);

router.post(
  "/chat/conversations/:id/messages",
  requireAppUser,
  async (req, res): Promise<void> => {
    const me = req.appUser!;
    const id = parseInt(req.params.id as string, 10);
    const parsed = SendChatMessageBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    if (!parsed.data.content && !parsed.data.attachmentUrl) {
      res.status(400).json({ error: "Message must have content or an attachment" });
      return;
    }

    const [convo] = await db
      .select()
      .from(conversationsTable)
      .where(eq(conversationsTable.id, id));
    if (!convo) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const admin = await isAdmin(me.clerkUserId);
    if (!(await canAccessConversation(convo, me.clerkUserId, admin))) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const [message] = await db
      .insert(chatMessagesTable)
      .values({
        conversationId: id,
        senderClerkId: me.clerkUserId,
        senderName: me.name || me.email,
        senderAvatarUrl: me.avatarUrl,
        senderIsAdmin: admin ? "true" : "false",
        content: parsed.data.content ?? null,
        attachmentUrl: parsed.data.attachmentUrl ?? null,
        attachmentType: parsed.data.attachmentType ?? null,
        attachmentName: parsed.data.attachmentName ?? null,
        attachmentMimeType: parsed.data.attachmentMimeType ?? null,
        attachmentSize: parsed.data.attachmentSize ?? null,
      })
      .returning();

    const isA = convo.userAClerkId === me.clerkUserId;
    const preview = parsed.data.content
      ? parsed.data.content.slice(0, 120)
      : parsed.data.attachmentType === "image"
        ? "Фото"
        : parsed.data.attachmentType === "video"
          ? "Видео"
          : "Файл";

    await db
      .update(conversationsTable)
      .set({
        lastMessageAt: message.createdAt,
        lastMessagePreview: preview,
        ...(isA
          ? { lastReadAtA: message.createdAt }
          : convo.kind === "support"
            ? { lastReadAtB: message.createdAt }
            : { lastReadAtB: message.createdAt }),
      })
      .where(eq(conversationsTable.id, id));

    res.status(201).json(SendChatMessageResponse.parse(message));
  },
);

router.patch(
  "/chat/conversations/:id/read",
  requireAppUser,
  async (req, res): Promise<void> => {
    const me = req.appUser!;
    const id = parseInt(req.params.id as string, 10);
    const [convo] = await db
      .select()
      .from(conversationsTable)
      .where(eq(conversationsTable.id, id));
    if (!convo) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const admin = await isAdmin(me.clerkUserId);
    if (!(await canAccessConversation(convo, me.clerkUserId, admin))) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const isA = convo.userAClerkId === me.clerkUserId;
    await db
      .update(conversationsTable)
      .set(isA ? { lastReadAtA: new Date().toISOString() } : { lastReadAtB: new Date().toISOString() })
      .where(eq(conversationsTable.id, id));
    res.sendStatus(204);
  },
);

export default router;
