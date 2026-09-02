import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { SEEDED_RESOURCE_POSTS } from "../src/data/resources";

const TARGET_ID = "seed-notice-2025-11-01-kb-life-recruitment";

if (process.env.VERCEL_ENV === "preview") {
  console.log(`[one-off] skipped in preview: ${TARGET_ID}`);
  process.exit(0);
}

if (process.env.VERCEL_ENV !== "production") {
  throw new Error("This one-off script only runs in Vercel Production.");
}

const directUrl = process.env.DIRECT_URL;

if (!directUrl) {
  throw new Error("DIRECT_URL is not configured.");
}

const adapter = new PrismaPg({ connectionString: directUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  const matches = SEEDED_RESOURCE_POSTS.filter((post) => post.id === TARGET_ID);
  if (matches.length !== 1) {
    throw new Error("The target resource post is missing or duplicated.");
  }

  const post = matches[0];
  const expectedDate = new Date(`${post.date}T00:00:00.000Z`);
  const data = {
    categoryId: post.categoryId,
    title: post.title,
    date: expectedDate,
    body: post.body,
    attachments: post.attachments ?? [],
    idx: null,
    sourceHref: null,
  };

  await prisma.$transaction(async (transaction) => {
    const category = await transaction.resourceCategory.findUnique({
      where: { id: "notice" },
      select: { id: true },
    });
    if (!category) {
      throw new Error("The notice category does not exist.");
    }

    const saved = await transaction.resourcePost.upsert({
      where: { id: TARGET_ID },
      update: data,
      create: { id: TARGET_ID, ...data },
      select: { id: true, categoryId: true, title: true, date: true },
    });

    if (
      saved.id !== TARGET_ID ||
      saved.categoryId !== "notice" ||
      saved.title !== post.title ||
      saved.date.toISOString().slice(0, 10) !== post.date
    ) {
      throw new Error("The saved resource post did not pass verification.");
    }
  });

  console.log(`[one-off] completed: ${TARGET_ID}`);
}

main()
  .catch(() => {
    console.error(`[one-off] failed: ${TARGET_ID}`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
