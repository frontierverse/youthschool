import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { RESOURCE_CATEGORIES, SEEDED_RESOURCE_POSTS } from "../src/data/resources";

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const [order, category] of RESOURCE_CATEGORIES.entries()) {
    await prisma.resourceCategory.upsert({
      where: { id: category.id },
      update: { label: category.label, order },
      create: { id: category.id, label: category.label, order },
    });

    for (const post of category.posts) {
      await prisma.resourcePost.upsert({
        where: { idx: post.idx },
        update: {
          title: post.title,
          date: new Date(post.date),
          body: post.body,
          attachments: post.attachments ?? [],
          sourceHref: post.sourceHref,
          categoryId: category.id,
        },
        create: {
          idx: post.idx,
          title: post.title,
          date: new Date(post.date),
          body: post.body,
          attachments: post.attachments ?? [],
          sourceHref: post.sourceHref,
          categoryId: category.id,
        },
      });
    }
  }

  for (const post of SEEDED_RESOURCE_POSTS) {
    const data = {
      categoryId: post.categoryId,
      title: post.title,
      date: new Date(post.date),
      body: post.body,
      attachments: post.attachments ?? [],
      idx: null,
      sourceHref: null,
    };

    await prisma.resourcePost.upsert({
      where: { id: post.id },
      update: data,
      create: { id: post.id, ...data },
    });
  }

  const categoryCount = await prisma.resourceCategory.count();
  const postCount = await prisma.resourcePost.count();
  console.log(`Seeded ${categoryCount} categories and ${postCount} posts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
