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
  {
    title: "Learn Helm Charts",
    description: "Master Kubernetes package management with Helm Charts. Learn to create, manage, and deploy applications using Helm.",
    status: { connect: { id: 1 } },
    targetDate: new Date("2024-12-31"),
    tasks: {
      create: [
        {
          title: "Install Helm",
          description: "Set up Helm on your local machine and cluster",
          status: { connect: { id: 1 } },
        },
        {
          title: "Create your first chart",
          description: "Build a basic Helm chart for a simple application",
          status: { connect: { id: 1 } },
        },
      ],
    },
  },
  {
    title: "Master C++ Programming",
    description: "Deep dive into C++ programming. Focus on modern C++ features, memory management, and performance optimization.",
    status: { connect: { id: 1 } },
    targetDate: new Date("2024-12-31"),
    tasks: {
      create: [
        {
          title: "Study modern C++ features",
          description: "Learn about C++11, C++14, C++17, and C++20 features",
          status: { connect: { id: 1 } },
        },
        {
          title: "Practice memory management",
          description: "Implement smart pointers and RAII patterns",
          status: { connect: { id: 1 } },
        },
      ],
    },
  },
  {
    title: "Learn Rust Programming",
    description: "Learn Rust programming language. Focus on memory safety, concurrency, and building high-performance applications.",
    status: { connect: { id: 1 } },
    targetDate: new Date("2024-12-31"),
    tasks: {
      create: [
        {
          title: "Complete Rust book",
          description: "Go through the official Rust programming book",
          status: { connect: { id: 1 } },
        },
        {
          title: "Build a CLI tool",
          description: "Create a command-line tool using Rust",
          status: { connect: { id: 1 } },
        },
      ],
    },
  },
  {
    title: "Master Docker and Containerization",
    description: "Become proficient in Docker and containerization. Learn best practices for building, deploying, and managing containers.",
    status: { connect: { id: 1 } },
    targetDate: new Date("2024-12-31"),
    tasks: {
      create: [
        {
          title: "Learn Docker basics",
          description: "Understand Docker images, containers, and volumes",
          status: { connect: { id: 1 } },
        },
        {
          title: "Create multi-stage builds",
          description: "Implement efficient multi-stage Docker builds",
          status: { connect: { id: 1 } },
        },
      ],
    },
  },
  {
    title: "Learn GraphQL",
    description: "Master GraphQL API development. Learn to design and implement efficient GraphQL schemas and resolvers.",
    status: { connect: { id: 1 } },
    targetDate: new Date("2024-12-31"),
    tasks: {
      create: [
        {
          title: "Study GraphQL schema design",
          description: "Learn about types, queries, mutations, and subscriptions",
          status: { connect: { id: 1 } },
        },
        {
          title: "Build a GraphQL API",
          description: "Create a GraphQL API with proper resolvers",
          status: { connect: { id: 1 } },
        },
      ],
    },
  },
  {
    title: "Master TypeScript",
    description: "Deep dive into TypeScript. Learn advanced types, decorators, and best practices for large-scale applications.",
    status: { connect: { id: 1 } },
    targetDate: new Date("2024-12-31"),
    tasks: {
      create: [
        {
          title: "Study advanced types",
          description: "Learn about generics, utility types, and type inference",
          status: { connect: { id: 1 } },
        },
        {
          title: "Implement decorators",
          description: "Create and use TypeScript decorators",
          status: { connect: { id: 1 } },
        },
      ],
    },
  },
  {
    title: "Learn AWS Cloud Services",
    description: "Master AWS cloud services. Focus on EC2, S3, Lambda, and other core AWS services.",
    status: { connect: { id: 1 } },
    targetDate: new Date("2024-12-31"),
    tasks: {
      create: [
        {
          title: "Set up AWS account",
          description: "Create and configure an AWS account with proper IAM roles",
          status: { connect: { id: 1 } },
        },
        {
          title: "Deploy a serverless application",
          description: "Build and deploy an application using AWS Lambda and API Gateway",
          status: { connect: { id: 1 } },
        },
      ],
    },
  },
  {
    title: "Master React Native",
    description: "Learn to build cross-platform mobile applications with React Native. Focus on performance and native features.",
    status: { connect: { id: 1 } },
    targetDate: new Date("2024-12-31"),
    tasks: {
      create: [
        {
          title: "Set up development environment",
          description: "Install and configure React Native development tools",
          status: { connect: { id: 1 } },
        },
        {
          title: "Build a mobile app",
          description: "Create a cross-platform mobile application",
          status: { connect: { id: 1 } },
        },
      ],
    },
  },
  {
    title: "Learn Machine Learning Basics",
    description: "Introduction to machine learning concepts. Focus on supervised and unsupervised learning algorithms.",
    status: { connect: { id: 1 } },
    targetDate: new Date("2024-12-31"),
    tasks: {
      create: [
        {
          title: "Study ML fundamentals",
          description: "Learn about different types of machine learning algorithms",
          status: { connect: { id: 1 } },
        },
        {
          title: "Implement a simple model",
          description: "Build and train a basic machine learning model",
          status: { connect: { id: 1 } },
        },
      ],
    },
  },
  {
    title: "Master Git Advanced Features",
    description: "Deep dive into Git. Learn advanced branching strategies, rebasing, and Git workflows.",
    status: { connect: { id: 1 } },
    targetDate: new Date("2024-12-31"),
    tasks: {
      create: [
        {
          title: "Learn Git internals",
          description: "Understand how Git works under the hood",
          status: { connect: { id: 1 } },
        },
        {
          title: "Practice advanced workflows",
          description: "Implement GitFlow and other branching strategies",
          status: { connect: { id: 1 } },
        },
      ],
    },
  },
];

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Alice",
    email: "alice@prisma.io",
    password: "",
  },
  {
    name: "Nilu",
    email: "nilu@prisma.io",
    password: "",
  },
  {
    name: "Mahmoud",
    email: "mahmoud@prisma.io",
    password: "",
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
