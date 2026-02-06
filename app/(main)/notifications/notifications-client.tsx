"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, UserPlus, Sparkles } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

// Описание типов
interface Notification {
  id: string;
  type: "LIKE" | "COMMENT" | "FOLLOW";
  read: boolean;
  createdAt: string;
  sender: {
    username: string;
    name?: string | null;
    image?: string | null;
  };
  // Добавляем | null к post и comment
  post?: {
    id: string;
    content: string;
  } | null; 
  comment?: {
    id: string;
    content: string;
  } | null;
}

interface NotificationsClientProps {
  initialData: {
    notifications: Notification[];
    nextCursor: string | null;
  };
}

export default function NotificationsClient({ initialData }: NotificationsClientProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialData.notifications);
  const [isMarkingRead, setIsMarkingRead] = useState(false);

  const markAllAsRead = async () => {
    if (isMarkingRead) return;
    setIsMarkingRead(true);
    try {
      const response = await fetch("/api/notifications/mark-all-read", { method: "POST" });
      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsMarkingRead(false);
    }
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "LIKE": return <Heart className="w-5 h-5 text-pink-500" fill="currentColor" />;
      case "COMMENT": return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case "FOLLOW": return <UserPlus className="w-5 h-5 text-green-500" />;
      default: return <Sparkles className="w-5 h-5 text-primary" />;
    }
  };

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case "LIKE": return "поставил лайк вашей публикации";
      case "COMMENT": return "прокомментировал вашу публикацию";
      case "FOLLOW": return "подписался на вас";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 px-6 pb-12">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">Уведомления</h1>
            {notifications.some((n) => !n.read) && (
              <button
                onClick={markAllAsRead}
                disabled={isMarkingRead}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-semibold transition-all"
              >
                {isMarkingRead ? "Обновление..." : "Отметить все как прочитанные"}
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="text-center p-12 bg-white/5 rounded-3xl">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Пока пусто</h2>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-6 rounded-2xl bg-white/5 border border-white/10 transition-all ${
                    !notification.read ? "border-l-4 border-l-primary" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <p>
                        <Link href={`/profile/${notification.sender.username}`} className="font-bold hover:underline">
                          {notification.sender.name || notification.sender.username}
                        </Link>{" "}
                        <span className="text-muted-foreground">{getNotificationText(notification)}</span>
                      </p>
                      {notification.post && (
                        <Link href={`/posts/${notification.post.id}`} className="text-sm text-blue-400 block mt-1">
                          "{notification.post.content}"
                        </Link>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: ru })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}