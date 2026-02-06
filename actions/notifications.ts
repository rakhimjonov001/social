"use server";

/**
 * Notification Server Actions
 * 
 * Server-side actions for notification management:
 * - Get notifications
 * - Mark as read
 * - Get unread count
 */

import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";

// ==========================================
// TYPES
// ==========================================

export type NotificationWithDetails = {
  id: string;
  type: "LIKE" | "COMMENT" | "FOLLOW";
  read: boolean;
  createdAt: Date;
  sender: {
    id: string;
    name: string | null;
    username: string;
    image: string | null;
  };
  post?: {
    id: string;
    content: string;
  } | null;
  comment?: {
    id: string;
    content: string;
  } | null;
};

// ==========================================
// GET NOTIFICATIONS
// ==========================================

export async function getNotifications(
  cursor?: string,
  limit: number = 20
): Promise<{ notifications: NotificationWithDetails[]; nextCursor: string | null }> {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { notifications: [], nextCursor: null };
  }

  const notifications = await prisma.notification.findMany({
    where: { receiverId: session.user.id },
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
      post: {
        select: {
          id: true,
          content: true,
        },
      },
      comment: {
        select: {
          id: true,
          content: true,
        },
      },
    },
  });

  let nextCursor: string | null = null;
  if (notifications.length > limit) {
    const nextItem = notifications.pop();
    nextCursor = nextItem!.id;
  }

  return {
    notifications: notifications as NotificationWithDetails[],
    nextCursor,
  };
}

// ==========================================
// GET UNREAD COUNT
// ==========================================

export async function getUnreadNotificationCount(): Promise<number> {
  const session = await auth();
  
  if (!session?.user?.id) {
    return 0;
  }

  const count = await prisma.notification.count({
    where: {
      receiverId: session.user.id,
      read: false,
    },
  });

  return count;
}

// ==========================================
// MARK AS READ
// ==========================================

export async function markNotificationAsRead(
  notificationId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in",
      };
    }

    await prisma.notification.update({
      where: {
        id: notificationId,
        receiverId: session.user.id,
      },
      data: { read: true },
    });

    revalidatePath("/notifications");

    return { success: true };
  } catch (error) {
    console.error("Mark notification as read error:", error);
    return {
      success: false,
      message: "Failed to mark notification as read",
    };
  }
}

// ==========================================
// MARK ALL AS READ
// ==========================================

export async function markAllNotificationsAsRead(): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in",
      };
    }

    await prisma.notification.updateMany({
      where: {
        receiverId: session.user.id,
        read: false,
      },
      data: { read: true },
    });

    revalidatePath("/notifications");

    return { success: true };
  } catch (error) {
    console.error("Mark all notifications as read error:", error);
    return {
      success: false,
      message: "Failed to mark notifications as read",
    };
  }
}

// ==========================================
// DELETE NOTIFICATION
// ==========================================

export async function deleteNotification(
  notificationId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in",
      };
    }

    await prisma.notification.delete({
      where: {
        id: notificationId,
        receiverId: session.user.id,
      },
    });

    revalidatePath("/notifications");

    return { success: true };
  } catch (error) {
    console.error("Delete notification error:", error);
    return {
      success: false,
      message: "Failed to delete notification",
    };
  }
}
