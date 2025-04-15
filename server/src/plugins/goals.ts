import Hapi from "@hapi/hapi";
/*
 * TODO: We can't use this type because it is available only in 2.11.0 and previous versions
 * In 2.12.0, this will be namespaced under Prisma and can be used as Prisma.PostGetPayload
 * Once 2.12.0 is release, we can adjust this example.
 */
// import { PostGetPayload } from '@prisma/client'

// plugin to instantiate Prisma Client
const goalsPlugin = {
  name: "app/goals",
  dependencies: ["prisma"],
  register: async function (server: Hapi.Server) {
    server.route([
      {
        method: "POST",
        path: "/goal",
        handler: createGoalHandler,
      },
    ]);

    server.route([
      {
        method: "GET",
        path: "/feed/goals",
        handler: feedHandler,
      },
    ]);

    server.route([
      {
        method: "GET",
        path: "/goal/{goalId}",
        handler: getGoalHandler,
      },
    ]);

    server.route([
      {
        method: "PUT",
        path: "/publish/goals/{goalId}",
        handler: togglePublishHandler,
      },
    ]);

    server.route([
      {
        method: "DELETE",
        path: "/goal/{goalId}",
        handler: deleteGoalHandler,
      },
    ]);
  },
};

export default goalsPlugin;

async function feedHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { prisma } = request.server.app;

  const { searchString, skip, take, orderBy } = request.query;

  const or = searchString
    ? {
        OR: [
          { title: { contains: searchString } },
          { content: { contains: searchString } },
        ],
      }
    : {};

  try {
    const goals = await prisma.goal.findMany({
      take: Number(take) || undefined,
      skip: Number(skip) || undefined,
      orderBy: [
        {
          targetDate: "asc",
        },
      ],
    });

    return h.response(goals).code(200);
  } catch (err) {
    console.log(err);
  }
}

async function getGoalHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { prisma } = request.server.app;

  const goalId = Number(request.params.goalId);

  try {
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
      include: {
        tasks: {
          select: {
            id: true,
            title: true,
            description: true,
            status: {
              select: {
                name: true,
              },
            },
          },
        },
        status: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!goal) {
      return h
        .response({
          error: `Goal with ID ${goalId} does not exist in the database`,
        })
        .code(404);
    }

    // Transform the goal object to replace statusId with status name
    const transformedGoal = {
      ...goal,
      status: goal.status.name,
      tasks: goal.tasks.map((task) => ({
        ...task,
        status: task.status.name,
      })),
    };

    return h.response(transformedGoal).code(200);
  } catch (err) {
    console.log(err);
    return h
      .response({
        error: `Goal with ID ${goalId} does not exist in the database`,
      })
      .code(404);
  }
}

async function togglePublishHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app;

  const goalId = Number(request.params.goalId);

  try {
    const goalData = await prisma.goal.findUnique({
      where: { id: goalId },
    });

    const updatedGoal = await prisma.goal.update({
      where: { id: goalId || undefined },
      data: { description: goalData?.description || "" },
    });

    return h.response(updatedGoal || undefined).code(201);
  } catch (err) {
    console.log(err);
    return h.response({
      error: `Goal with ID ${goalId} does not exist in the database`,
    });
  }
}

async function deleteGoalHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app;
  const goalId = Number(request.params.goalId);

  try {
    // Delete related tasks first
    await prisma.task.deleteMany({
      where: { goalId: goalId },
    });

    // Then delete the goal
    const goal = await prisma.goal.delete({
      where: { id: goalId },
    });

    return h.response(goal || undefined).code(201);
  } catch (err) {
    console.log(err);
    return h.response({
      error: `Goal with ID ${goalId} does not exist in the database or cannot be deleted`,
    });
  }
}

async function createGoalHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app;

  const payload = request.payload as any;
  console.log(payload);
  try {
    const createdGoal = await prisma.goal.create({
      data: {
        title: payload.title,
        description: payload.description,
        status: payload.status,
        targetDate: payload.targetDate,
        tasks: payload.tasks
          ? {
              create: payload.tasks.map((task: any) => ({
                title: task.title,
                description: task.description,
                status: task.status,
              })),
            }
          : undefined,
      },
    });
    return h.response(createdGoal).code(201);
  } catch (err) {
    console.log(err);
    return h.response({ error: "Failed to create goal" }).code(500);
  }
}
