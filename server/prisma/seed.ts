import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const statusData: Prisma.StatusCreateManyInput[] = [
  { id: 1, name: "Not Started" },
  { id: 2, name: "Pending" },
  { id: 3, name: "In Progress" },
  { id: 4, name: "Finished" },
];

const goalData: Prisma.GoalCreateInput[] = [
  {
    title: "Learn Prisma",
    description: "Learn how to use Prisma to build a fullstack application",
    status: { connect: { id: 1 } }, // Not Started
    targetDate: new Date("2025-12-31"),
    tasks: {
      create: [
        {
          title: "Setup Prisma",
          description: "Install and configure Prisma in the project",
          status: { connect: { id: 1 } }, // Not Started
        },
        {
          title: "Create Models",
          description: "Define data models using Prisma schema",
          status: { connect: { id: 1 } }, // Not Started
        },
      ],
    },
  },
  {
    title: "Master TypeScript",
    description: "Deep dive into TypeScript features and best practices",
    status: { connect: { id: 3 } }, // In Progress
    targetDate: new Date("2024-06-30"),
    tasks: {
      create: [
        {
          title: "Learn Basic Types",
          description: "Understand and use basic types in TypeScript",
          status: { connect: { id: 1 } }, // Not Started
        },
        {
          title: "Explore Advanced Types",
          description: "Learn about advanced types and their usage",
          status: { connect: { id: 1 } }, // Not Started
        },
      ],
    },
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

  // Delete existing records
  await prisma.goal.deleteMany();
  await prisma.user.deleteMany();
  await prisma.status.deleteMany();
  console.log(`Deleted existing goals, users, and statuses`);

  // Seed statuses
  await prisma.status.createMany({
    data: statusData,
  });
  console.log(`Seeded statuses`);

  // Seed goals
  for (const g of goalData) {
    const goal = await prisma.goal.create({
      data: g,
    });
    console.log(`Created goal with id: ${goal.id}`);
  }

  // Seed users
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
