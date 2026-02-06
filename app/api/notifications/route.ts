import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "20");

    const notifications = await prisma.notification.findMany({
      where: { receiverId: session.user.id },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            name: true,
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
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
    });

    const hasNextPage = notifications.length > limit;
    const notificationsToReturn = hasNextPage ? notifications.slice(0, -1) : notifications;
    const nextCursor = hasNextPage ? notifications[notifications.length - 1].id : null;

    return NextResponse.json({
      notifications: notificationsToReturn,
      nextCursor,
      hasNextPage,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}