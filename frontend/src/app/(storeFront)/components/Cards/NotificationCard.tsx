import React from "react";

type NotificationCardProps = {
  notification: any;
  formatTime: (dateStr: string) => string;
  getItemLink: (n: any) => string;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  isUrgent?: boolean;
  isSubscriptionAlert?: boolean;
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  formatTime,
  getItemLink,
  onMarkRead,
  onDelete,
  isUrgent,
  isSubscriptionAlert,
}) => {
  return (
    <div
      className={`p-4 bg-white rounded-xl border ${isUrgent ? "border-red-500" : "border-gray-200"} shadow-sm flex flex-col gap-2`}
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="font-bold text-gray-800">
            {notification.title || notification.message || "Notification"}
          </div>
          <div className="text-xs text-gray-400">
            {formatTime(notification.createdAt)}
          </div>
        </div>
        <button
          onClick={() => onDelete(notification.id)}
          className="text-xs text-red-500 hover:underline"
        >
          Delete
        </button>
      </div>
      <div className="flex gap-2 mt-2">
        <a
          href={getItemLink(notification)}
          className="text-blue-600 text-xs hover:underline"
        >
          View Item
        </a>
        {!notification.isRead && (
          <button
            onClick={() => onMarkRead(notification.id)}
            className="text-xs text-green-600 hover:underline"
          >
            Mark as read
          </button>
        )}
        {isSubscriptionAlert && (
          <span className="text-xs text-red-500 font-bold ml-2">
            Subscription Alert
          </span>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
