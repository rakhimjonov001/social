import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 1. Изменяем тип параметров: теперь это Promise
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Ждем получения id из параметров
    const { id: commentId } = await params; 
    const userId = session.user.id;

    // Check if comment exists and user owns it
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, authorId: true },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    // Проверка прав: автор комментария ИЛИ админ (по желанию можно добавить)
    if (comment.authorId !== userId) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}