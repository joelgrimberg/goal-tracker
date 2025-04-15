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
    title: "Learn Kubernetes Admission Controllers",
    description:
      "Understand how to use and implement admission controllers in Kubernetes",
    status: { connect: { id: 1 } },
    targetDate: new Date("2025-01-15"),
    tasks: {
      create: [
        {
          title: "Read Kubernetes documentation",
          description:
            "Go through the official Kubernetes documentation on admission controllers",
          status: { connect: { id: 1 } },
        },
        {
          title: "Implement a validating webhook",
          description: "Create a validating webhook for a Kubernetes cluster",
          status: { connect: { id: 1 } },
        },
      ],
    },
  },
  {
    title: "Learn Go Testing",
    description:
      "Master testing in Go, including unit tests and integration tests",
    status: { connect: { id: 2 } },
    targetDate: new Date("2025-02-15"),
    tasks: {
      create: [
        {
          title: "Write basic unit tests",
          description: "Learn how to write and run unit tests in Go",
          status: { connect: { id: 1 } },
        },
        {
          title: "Explore table-driven tests",
          description: "Understand and implement table-driven tests in Go",
          status: { connect: { id: 1 } },
        },
      ],
    },
  },
  {
    title: "Learn LUA",
    description: "Understand the basics of LUA and its use cases in scripting",
    status: { connect: { id: 3 } },
    targetDate: new Date("2025-03-15"),
    tasks: {
      create: [
        {
          title: "Install LUA",
          description: "Set up LUA on your local machine",
          status: { connect: { id: 1 } },
        },
        {
          title: "Write basic LUA scripts",
          description: "Create simple scripts to understand LUA syntax",
          status: { connect: { id: 1 } },
        },
      ],
    },
  },
  {
    title: "Learn Docker Compose",
    description:
      "Understand how to use Docker Compose for multi-container applications",
    status: { connect: { id: 4 } },
    targetDate: new Date("2025-04-15"),
    tasks: {
      create: [
        {
          title: "Read Docker Compose documentation",
          description: "Go through the official Docker Compose documentation",
          status: { connect: { id: 4 } },
        },
        {
          title: "Create a multi-container setup",
          description:
            "Build a multi-container application using Docker Compose",
          status: { connect: { id: 4 } },
        },
      ],
    },
  },
  {
    title: "Learn Rust Ownership Model",
    description:
      "Understand Rust's ownership model and how it ensures memory safety",
    status: { connect: { id: 1 } },
    targetDate: new Date("2025-05-15"),
    tasks: {
      create: [
        {
          title: "Read Rust documentation",
          description: "Go through the Rust book's chapter on ownership",
          status: { connect: { id: 1 } },
        },
        {
          title: "Write examples",
          description: "Write code examples to practice ownership concepts",
          status: { connect: { id: 1 } },
        },
      ],
    },
  },
  {
    title: "Learn Terraform Modules",
    description:
      "Understand how to create and use Terraform modules for infrastructure as code",
    status: { connect: { id: 2 } },
    targetDate: new Date("2025-06-15"),
    tasks: {
      create: [
        {
          title: "Read Terraform documentation",
          description:
            "Go through the official Terraform documentation on modules",
          status: { connect: { id: 1 } },
        },
        {
          title: "Create a reusable module",
          description:
            "Build a reusable Terraform module for a common infrastructure component",
          status: { connect: { id: 1 } },
        },
      ],
    },
  },
  {
    title: "Learn GraphQL Subscriptions",
    description:
      "Understand how to implement real-time updates using GraphQL subscriptions",
    status: { connect: { id: 3 } },
    targetDate: new Date("2025-07-15"),
    tasks: {
      create: [
        {
          title: "Set up a GraphQL server",
          description:
            "Install and configure a GraphQL server with subscriptions",
          status: { connect: { id: 1 } },
        },
        {
          title: "Implement a subscription",
          description: "Create a subscription for real-time updates",
          status: { connect: { id: 1 } },
        },
      ],
    },
  },
  {
    title: "Learn CI/CD with GitHub Actions",
    description:
      "Master continuous integration and deployment using GitHub Actions",
    status: { connect: { id: 4 } },
    targetDate: new Date("2025-08-15"),
    tasks: {
      create: [
        {
          title: "Read GitHub Actions documentation",
          description: "Go through the official GitHub Actions documentation",
          status: { connect: { id: 4 } },
        },
        {
          title: "Create a CI/CD pipeline",
          description: "Build a CI/CD pipeline for a sample project",
          status: { connect: { id: 4 } },
        },
      ],
    },
  },
  {
    title: "Learn Python Asyncio",
    description: "Understand asynchronous programming in Python using asyncio",
    status: { connect: { id: 1 } },
    targetDate: new Date("2025-09-15"),
    tasks: {
      create: [
        {
          title: "Read asyncio documentation",
          description: "Go through the official Python asyncio documentation",
          status: { connect: { id: 1 } },
        },
        {
          title: "Write async code",
          description: "Write examples to practice asynchronous programming",
          status: { connect: { id: 1 } },
        },
      ],
    },
  },
  {
    title: "Learn WebAssembly",
    description: "Understand how to use WebAssembly to run code on the web",
    status: { connect: { id: 2 } },
    targetDate: new Date("2025-10-15"),
    tasks: {
      create: [
        {
          title: "Read WebAssembly documentation",
          description: "Go through the official WebAssembly documentation",
          status: { connect: { id: 1 } },
        },
        {
          title: "Build a WebAssembly module",
          description:
            "Create a simple WebAssembly module and run it in a browser",
          status: { connect: { id: 1 } },
        },
      ],
    },
  },
  // Add 20 more goals in the same format, each with unique titles, descriptions, and tasks
];

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Alice",
    email: "alice@prisma.io",
  },
  {
    name: "Nilu",
    email: "nilu@prisma.io",
  },
  {
    name: "Mahmoud",
    email: "mahmoud@prisma.io",
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
