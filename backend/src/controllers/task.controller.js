import { Task } from "../models/task.model.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;
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
      assignedTo,
      createdBy: userId,
    });

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

    if (String(findTask.createdBy) !== userId) {
      console.log(findTask.createdBy, userId);

      return res
        .status(403)
        .json({ success: false, message: "Unauthorized Access" });
    }

    await Task.findByIdAndUpdate(taskId, {
      title,
      description,
      priority,
      status,
      dueDate,
      assignedTo,
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

export const getUserTasks = async (req, res) => {
  try {
    const userId = req.userId;

    const tasks = await Task.find({ createdBy: userId });

    return res.status(200).json({ success: true, data: tasks });
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
