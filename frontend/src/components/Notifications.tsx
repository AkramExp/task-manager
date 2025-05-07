"use client";
import { timeAgo } from "@/lib/utils";
import { useNotifications } from "@/react-query/notification";
import { NotificationType } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Bell, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BACKEND_URL } from "../../config";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const Notifications = () => {
  const { notifications } = useNotifications();
  const [allNotifications, setAllNotifications] = useState(notifications);
  const queryClient = useQueryClient();

  useEffect(() => {
    setAllNotifications(notifications);
  }, [notifications]);

  const unreadCount = notifications?.filter(
    (notification: NotificationType) => !notification.read
  ).length;

  async function markNotificationRead(notificationId: string) {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/notification/update/${notificationId}`,
        { read: true }
      );

      if (response.data.success) {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      }
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          "Something went wrong, Please try again later"
      );
    }
  }

  async function deleteNotification(notificationId: string) {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/notification/delete/${notificationId}`
      );

      if (response.data.success) {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      }
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          "Something went wrong, Please try again later"
      );
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative cursor-pointer">
          <Bell width={25} className="mr-2" />
          {unreadCount > 0 && (
            <span className="flex items-center justify-center bg-red-500 rounded-full text-white font-semibold absolute -top-2 -left-2 text-sm h-5 w-5">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="bg-gray-800 border-gray-700 text-white w-[20rem] sm:min-w-md"
        align="end"
      >
        {notifications?.length > 0 ? (
          <>
            {" "}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="font-semibold text-white">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {allNotifications?.map(
                (notification: NotificationType, index: number) => (
                  <div
                    key={index}
                    className={`flex flex-col gap-3 p-4 border-b border-gray-700 transition-colors ${
                      !notification.read ? "bg-blue-900/20" : ""
                    }`}
                  >
                    <p className="text-sm sm:text-[15px] text-gray-200">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400 mt-2">
                        {timeAgo(notification.createdAt)}
                      </p>
                      <div className="flex items-center gap-3">
                        {!notification.read && (
                          <button
                            className="text-sm hover:underline"
                            onClick={() =>
                              markNotificationRead(notification._id)
                            }
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          className="cursor-pointer hover:text-red-700"
                          onClick={() => deleteNotification(notification._id)}
                        >
                          <Trash className="w-[18px]" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </>
        ) : (
          <p className="text-lg font-semibold">No Notifications</p>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
