import React from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { FiTrash2, FiExternalLink, FiCheck } from "react-icons/fi";

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
  const { t } = useTranslation();
  return (
    <div
      className={`p-4 bg-white rounded-xl border transition-all ${isUrgent ? "border-red-500 ring-1 ring-red-100 bg-red-50/30" : "border-gray-200"} shadow-sm flex flex-col gap-3`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 text-sm">
              {notification.title}
            </span>
            {isSubscriptionAlert && (
              <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">
                {t("notifications.card.match", { defaultValue: "Match" })}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
          <span className="text-[9px] text-gray-400 font-bold uppercase mt-2 block">
            {formatTime(notification.createdAt)}
          </span>
        </div>
        <button
          onClick={() => onDelete(notification.id)}
          className="text-gray-300 hover:text-red-500"
          title={t("notifications.card.delete", { defaultValue: "Delete" })}
        >
          <FiTrash2 size={14} />
        </button>
      </div>
      <div className="flex items-center gap-4 pt-3 border-t border-gray-50">
        <Link
          href={getItemLink(notification)}
          className="text-blue-600 text-[10px] font-black uppercase flex items-center gap-1 hover:opacity-70"
        >
          <FiExternalLink size={10} />{" "}
          {t("notifications.card.viewDetail", { defaultValue: "View Detail" })}
        </Link>
        {!notification.isRead && (
          <button
            onClick={() => onMarkRead(notification.id)}
            className="text-gray-400 hover:text-green-600 text-[10px] font-black uppercase flex items-center gap-1"
          >
            <FiCheck size={10} />{" "}
            {t("notifications.card.markRead", { defaultValue: "Mark Read" })}
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
