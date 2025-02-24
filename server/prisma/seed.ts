import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const goalData: Prisma.GoalCreateInput[] = [
  {
    title: "Learn Prisma",
    description: "Learn how to use Prisma to build a fullstack application",
    status: "Not Started",
    targetDate: new Date("2025-12-31"),
  },
];

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Alice",
    email: "alice@prisma.io",
    posts: {
      create: [
        {
          title: "Join the Prisma Discord",
          content: "https://pris.ly/discord",
          published: true,
        },
      ],
    },
  },
  {
    name: "Nilu",
    email: "nilu@prisma.io",
    posts: {
      create: [
        {
          title: "Follow Prisma on Twitter",
          content: "https://www.twitter.com/prisma",
          published: true,
        },
      ],
    },
  },
  {
    name: "Mahmoud",
    email: "mahmoud@prisma.io",
    posts: {
      create: [
        {
          title: "Ask a question about Prisma on GitHub",
          content: "https://www.github.com/prisma/prisma/discussions",
          published: true,
        },
        {
          title: "Prisma on YouTube",
          content: "https://pris.ly/youtube",
        },
      ],
    },
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const g of goalData) {
    const goal = await prisma.goal.create({
      data: g,
    });
    console.log(`Created goal with id: ${goal.id}`);
  }

  // for (const u of userData) {
  //   const user = await prisma.user.create({
  //     data: u,
  //   });
  //   console.log(`Created user with id: ${user.id}`);
  // }
  console.log(`Seei7daz8f7rwqbCNhC3mKAding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
