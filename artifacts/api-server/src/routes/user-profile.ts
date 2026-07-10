import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { getAuth, clerkClient } from "@clerk/express";
import { db, userProfilesTable } from "@workspace/db";
import { requireAppUser } from "../middlewares/appUser";

const router: IRouter = Router();

// GET /profile/me — returns current user's profile, creating a default on first access
router.get("/profile/me", requireAppUser, async (req, res): Promise<void> => {
  const auth = getAuth(req);
  const userId = auth!.userId!;

  const [existing] = await db
    .select()
    .from(userProfilesTable)
    .where(eq(userProfilesTable.clerkUserId, userId));

  if (existing) {
    res.json(existing);
    return;
  }

  // Build a fallback nickname from Clerk user data
  let nickname = "User";
  try {
    const user = await clerkClient.users.getUser(userId);
    nickname =
      user.firstName?.trim() ||
      user.username?.trim() ||
      user.emailAddresses[0]?.emailAddress?.split("@")[0] ||
      "User";
  } catch {
    // best-effort
  }

  const [created] = await db
    .insert(userProfilesTable)
    .values({ clerkUserId: userId, nickname })
    .returning();

  res.json(created);
});

// PATCH /profile/me — update nickname and/or avatarUrl
router.patch("/profile/me", requireAppUser, async (req, res): Promise<void> => {
  const auth = getAuth(req);
  const userId = auth!.userId!;

  const { nickname, avatarUrl } = req.body as {
    nickname?: string;
    avatarUrl?: string | null;
  };

  if (nickname !== undefined && typeof nickname !== "string") {
    res.status(400).json({ error: "nickname must be a string" });
    return;
  }
  if (nickname !== undefined && nickname.trim().length === 0) {
    res.status(400).json({ error: "nickname cannot be empty" });
    return;
  }

  // Fetch or create the profile row
  let [profile] = await db
    .select()
    .from(userProfilesTable)
    .where(eq(userProfilesTable.clerkUserId, userId));

  if (!profile) {
    // Auto-create profile first
    let fallbackNickname = "User";
    try {
      const user = await clerkClient.users.getUser(userId);
      fallbackNickname =
        user.firstName?.trim() ||
        user.username?.trim() ||
        user.emailAddresses[0]?.emailAddress?.split("@")[0] ||
        "User";
    } catch {
      // best-effort
    }
    const [created] = await db
      .insert(userProfilesTable)
      .values({ clerkUserId: userId, nickname: fallbackNickname })
      .returning();
    profile = created;
  }

  const updates: Partial<typeof userProfilesTable.$inferInsert> = {};

  if (nickname !== undefined) {
    const trimmed = nickname.trim();

    // Check if the nickname has ever been changed from auto-generated default.
    // nicknameUpdatedAt equals createdAt when it was never manually changed.
    const neverChanged =
      profile.nicknameUpdatedAt === profile.createdAt;

    if (!neverChanged) {
      // Enforce 30-day cooldown on subsequent changes
      const lastChange = new Date(profile.nicknameUpdatedAt).getTime();
      const now = Date.now();
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
      if (now - lastChange < thirtyDaysMs) {
        const nextAllowed = new Date(lastChange + thirtyDaysMs).toISOString();
        res.status(429).json({
          error: `Nickname can only be changed once every 30 days. Next change allowed after ${nextAllowed}.`,
        });
        return;
      }
    }

    updates.nickname = trimmed;
    updates.nicknameUpdatedAt = new Date().toISOString();
  }

  if (avatarUrl !== undefined) {
    updates.avatarUrl = avatarUrl ?? null;
  }

  if (Object.keys(updates).length === 0) {
    res.json(profile);
    return;
  }

  const [updated] = await db
    .update(userProfilesTable)
    .set(updates)
    .where(eq(userProfilesTable.clerkUserId, userId))
    .returning();

  res.json(updated);
});

// GET /profile/:clerkUserId — public read-only lookup
router.get("/profile/:clerkUserId", async (req, res): Promise<void> => {
  const { clerkUserId } = req.params;

  const [profile] = await db
    .select()
    .from(userProfilesTable)
    .where(eq(userProfilesTable.clerkUserId, clerkUserId as string));

  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  res.json(profile);
});

export default router;
