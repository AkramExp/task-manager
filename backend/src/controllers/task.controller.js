import mongoose from "mongoose";
import { Notification } from "../models/notification.model.js";
import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, assignedTo } =
      req.body;

    const userId = req.userId;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Task title is required" });
    }

    await Task.create({
      title,
      description,
      dueDate,
      priority,
      status,
      assignedTo,
      createdBy: userId,
    });

    const user = await User.findById(userId);

    if (assignedTo && assignedTo !== userId) {
      await Notification.create({
        userId: assignedTo,
        message: `${user.name} (${user.email}) has assigned you a task`,
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Task created successfully" });
  } catch (error) {
    console.log(error);
    return res
      .json(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.userId;

    const findTask = await Task.findById(taskId);

    if (!findTask) {
      return res.json(404).json({ success: false, message: "Task not found" });
    }

    if (String(findTask.createdBy) !== userId) {
      console.log(findTask.createdBy, userId);

      return res
        .status(403)
        .json({ success: false, message: "Unauthorized Access" });
    }

    await Task.findByIdAndDelete(findTask._id);

    const taskUser = await User.findById(userId);

    await Notification.create({
      userId: findTask.assignedTo,
      message: `${taskUser.name} (${taskUser.email}) has deleted the task "${findTask.title}"`,
    });

    return res
      .status(200)
      .json({ success: true, message: "Task Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .json(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const userId = req.userId;
    const { taskId } = req.params;
    const { title, description, dueDate, priority, status, assignedTo } =
      req.body;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Task title is required" });
    }

    const findTask = await Task.findById(taskId);

    if (!findTask) {
      return res.json(404).json({ success: false, message: "Task not found" });
    }

    if (
      String(findTask.createdBy) !== userId &&
      String(findTask.assignedTo) !== userId
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized Access" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        title,
        description,
        priority,
        status,
        dueDate,
        assignedTo,
      },
      { new: true }
    );

    const taskUser = await User.findById(userId);

    await Notification.create({
      userId: assignedTo,
      message: `${taskUser.name} (${taskUser.email}) has updated the task "${updatedTask.title}"`,
    });

    return res
      .status(200)
      .json({ success: true, message: "Task updated successfully" });
  } catch (error) {
    console.log(error);
    return res
      .json(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const findTask = await Task.findById(taskId);

    if (!findTask) {
      return res.json(404).json({ success: false, message: "Task not found" });
    }

    await Task.findByIdAndUpdate(taskId, {
      status,
    });

    const assignedUser = await User.findById(findTask.assignedTo);

    await Notification.create({
      userId: findTask.createdBy,
      message: `${assignedUser.name}-${assignedUser.email} has updated the status of the task "${findTask.title}"`,
    });

    return res
      .status(200)
      .json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    console.log(error);
    return res
      .json(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getUserTasks = async (req, res) => {
  try {
    const { taskType, status, priority, overdue, sort, query, page } =
      req.query;
    const userId = req.userId;
    const limit = 8;
    const skip = (Number(page) - 1) * limit;

    const queryCondition = query
      ? {
          $or: [
            {
              title: { $regex: query, $options: "i" },
            },
            {
              description: { $regex: query, $options: "i" },
            },
          ],
        }
      : {};

    const taskTypeCondition =
      taskType && taskType !== "all"
        ? taskType === "created"
          ? { createdBy: new mongoose.Types.ObjectId(userId) }
          : { assignedTo: new mongoose.Types.ObjectId(userId) }
        : {
            $or: [
              { createdBy: new mongoose.Types.ObjectId(userId) },
              { assignedTo: new mongoose.Types.ObjectId(userId) },
            ],
          };

    const statusCondition =
      status && status !== "all" ? { status: status } : {};
    const priorityCondition =
      priority && priority !== "all" ? { priority: priority } : {};

    const overdueCondition =
      overdue && overdue !== "all"
        ? overdue === "overdue"
          ? {
              dueDate: {
                $lt: new Date(),
              },
            }
          : {
              dueDate: {
                $gt: new Date(),
              },
            }
        : {};

    let sortCondition = {};

    if (sort === "dueDate") {
      sortCondition = { dueDate: -1 };
    } else if (sort === "priority") {
      sortCondition = { priority: -1 };
    } else if (sort === "status") {
      sortCondition = { status: -1 };
    } else {
      sortCondition = { createdAt: -1 };
    }

    const totalTasks = await Task.countDocuments({
      $and: [
        taskTypeCondition,
        priorityCondition,
        statusCondition,
        overdueCondition,
        queryCondition,
      ],
    });

    const totalPages = Math.ceil(totalTasks / limit);

    const tasks = await Task.aggregate([
      {
        $match: {
          $and: [
            taskTypeCondition,
            priorityCondition,
            statusCondition,
            overdueCondition,
            queryCondition,
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      {
        $addFields: {
          createdBy: {
            $first: "$createdBy",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "assignedTo",
          foreignField: "_id",
          as: "assignedTo",
        },
      },
      {
        $addFields: {
          assignedTo: {
            $first: "$assignedTo",
          },
        },
      },
      {
        $sort: sortCondition,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    return res.status(200).json({ success: true, data: tasks, totalPages });
  } catch (error) {
    console.log(error);
    return res
      .json(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getAssignedTask = async (req, res) => {
  try {
    const userId = req.userId;

    const tasks = await Task.find({ assignedTo: userId });

    return res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    console.log(error);
    return res
      .json(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
