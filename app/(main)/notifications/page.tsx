// app/(main)/notifications/page.tsx
import { auth } from "@/lib/auth";
import { getNotifications } from "@/actions/notifications";
import NotificationsClient from "./notifications-client";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Уведомления | Social",
};

export default async function NotificationsPage() {
  const session = await auth();
  
  // Если не залогинен — отправляем на вход
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Получаем уведомления через Server Action
  const notificationsData = await getNotifications();

  // Приводим данные к нужному формату (строковые даты)
  const serializedData = {
    notifications: notificationsData.notifications.map(n => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
    })),
    nextCursor: notificationsData.nextCursor
  };

  return <NotificationsClient initialData={serializedData} />;
}