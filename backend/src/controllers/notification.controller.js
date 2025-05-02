import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";

export const createNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res
        .status(400)
        .json({ success: false, message: "User Id or Message is missing" });
    }

    const findUser = await User.findById(userId);

    if (!findUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await Notification.create({ userId, message });

    return res
      .status(200)
      .json({ success: true, message: "Notification created" });
  } catch (error) {
    console.log(error);
    return res
      .json(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateNotification = async (req, res) => {
  try {
    const { userId, message, read } = req.body;
    const { notificationId } = req.params;

    const findNotification = await Notification.findById(notificationId);

    if (!findNotification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }

    await Notification.findByIdAndUpdate(notificationId, {
      message,
      userId,
      read,
    });

    return res
      .status(200)
      .json({ success: true, message: "Notification updated" });
  } catch (error) {
    console.log(error);
    return res
      .json(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const userId = req.userId;

    const notifications = await Notification.find({ userId });

    return res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.log(error);
    return res
      .json(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
