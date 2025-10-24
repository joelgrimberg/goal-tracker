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
        path: "/goal/{goalId}",
        handler: updateGoalHandler,
      },
    ]);

    server.route([
      {
        method: "DELETE",
        path: "/goal/{goalId}",
        handler: deleteGoalHandler,
      },
    ]);

    server.route([
      {
        method: "GET",
        path: "/status",
        handler: getAllStatusesHandler,
      },
    ]);
  },
};

export default goalsPlugin;

async function feedHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { prisma } = request.server.app;

  const { searchString, skip, take, orderBy } = request.query;

  const where = searchString
    ? {
        OR: [
          { title: { contains: searchString } },
          { description: { contains: searchString } },
        ],
      }
    : {};

  // Parse orderBy parameter
  let orderByClause: any = { targetDate: "asc" }; // default
  if (orderBy) {
    const [field, direction] = orderBy.split(':');
    const validFields = ['title', 'description', 'targetDate', 'createdAt', 'status'];
    const validDirections = ['asc', 'desc'];
    
    if (validFields.includes(field) && validDirections.includes(direction)) {
      if (field === 'status') {
        orderByClause = { status: { name: direction } };
      } else {
        orderByClause = { [field]: direction };
      }
    }
    // If invalid format, keep default
  }

  try {
    const goals = await prisma.goal.findMany({
      where,
      take: Number(take) || undefined,
      skip: Number(skip) || undefined,
      orderBy: [orderByClause],
      include: {
        status: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Transform goals to include status name instead of statusId
    const transformedGoals = goals.map(goal => ({
      ...goal,
      status: goal.status.name,
      statusId: goal.status.id, // Keep statusId for backward compatibility
    }));

    return h.response(transformedGoals).code(200);
  } catch (err) {
    console.log(err);
    return h.response({ error: "Failed to fetch goals" }).code(500);
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

async function updateGoalHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app;
  const goalId = Number(request.params.goalId);
  const { title, description, status, targetDate } = request.payload as any;

  try {
    // Convert status name to statusId if needed
    let statusId = undefined;
    if (status) {
      const statusMap: { [key: string]: number } = {
        "Not Started": 1,
        "Not_started": 1,
        "Pending": 2,
        "In Progress": 3,
        "In_progress": 3,
        "Finished": 4,
      };
      statusId = statusMap[status];
    }

    // Prepare update data
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (statusId !== undefined) updateData.statusId = statusId;
    if (targetDate !== undefined) updateData.targetDate = new Date(targetDate);

    const goal = await prisma.goal.update({
      where: { id: goalId },
      data: updateData,
      include: {
        status: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Transform the response to include status name
    const transformedGoal = {
      ...goal,
      status: goal.status.name,
      statusId: goal.status.id,
    };

    return h.response(transformedGoal).code(200);
  } catch (err) {
    console.log(err);
    return h.response({
      error: `Failed to update goal with ID ${goalId}`,
    }).code(500);
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

async function getAllStatusesHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app;

  try {
    const statuses = await prisma.status.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return h.response(statuses).code(200);
  } catch (err) {
    console.log(err);
    return h.response({ error: "Failed to fetch statuses" }).code(500);
  }
}

async function createGoalHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { prisma } = request.server.app;
  const { title, description, targetDate, status } = request.payload as any;

  try {
    // Convert status name to statusId
    let statusId = 1; // Default to "Not Started"
    
    if (status) {
      const statusMap: { [key: string]: number } = {
        "Not Started": 1,
        "Not_started": 1,
        "Pending": 2,
        "In Progress": 3,
        "In_progress": 3,
        "Finished": 4,
      };
      
      statusId = statusMap[status] || 1;
    }

    // Handle targetDate with validation
    let parsedTargetDate = new Date();
    if (targetDate) {
      const date = new Date(targetDate);
      if (!isNaN(date.getTime())) {
        parsedTargetDate = date;
      }
      // If invalid date, keep the default (current date)
    }

    const goal = await prisma.goal.create({
      data: {
        title,
        description,
        targetDate: parsedTargetDate,
        statusId,
      },
      include: {
        status: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Transform the response to include status name
    const transformedGoal = {
      ...goal,
      status: goal.status.name,
      statusId: goal.status.id,
    };

    return h.response(transformedGoal).code(201);
  } catch (err) {
    console.log(err);
    return h.response({ error: "Failed to create goal" }).code(500);
  }
}
