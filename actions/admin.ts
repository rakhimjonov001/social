/**
 * Admin Actions
 * 
 * Server actions for admin functionality
 */
"use server"
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { redirect } from "next/navigation";

// Check if user is admin
async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/feed");
  }

  return session.user.id;
}

// Get admin dashboard stats
export async function getAdminStats() {
  await requireAdmin();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    totalUsers,
    totalPosts,
    totalLikes,
    totalComments,
    newUsersThisMonth,
    newPostsThisMonth,
    newLikesThisMonth,
    newCommentsThisMonth
  ] = await Promise.all([
    // Total counts
    prisma.user.count(),
    prisma.post.count(),
    prisma.like.count(),
    prisma.comment.count(),

    // This month counts
    prisma.user.count({
      where: { createdAt: { gte: startOfMonth } }
    }),
    prisma.post.count({
      where: { createdAt: { gte: startOfMonth } }
    }),
    prisma.like.count({
      where: { createdAt: { gte: startOfMonth } }
    }),
    prisma.comment.count({
      where: { createdAt: { gte: startOfMonth } }
    })
  ]);

  return {
    totalUsers,
    totalPosts,
    totalLikes,
    totalComments,
    newUsersThisMonth,
    newPostsThisMonth,
    newLikesThisMonth,
    newCommentsThisMonth
  };
}

// Get all users for admin management
export async function getAdminUsers(page = 1, limit = 20, search?: string) {
  await requireAdmin();

  const skip = (page - 1) * limit;

  const where = search ? {
    OR: [
      { name: { contains: search, mode: 'insensitive' as const } },
      { username: { contains: search, mode: 'insensitive' as const } },
      { email: { contains: search, mode: 'insensitive' as const } }
    ]
  } : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.user.count({ where })
  ]);

  return {
    users,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page
  };
}

// Update user role
export async function updateUserRole(userId: string, role: 'USER' | 'ADMIN' | 'MODERATOR') {
  await requireAdmin();

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role }
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, message: "Failed to update user role" };
  }
}

// Get user growth data for charts
export async function getUserGrowthData() {
  await requireAdmin();

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const users = await prisma.user.findMany({
    where: {
      createdAt: { gte: sixMonthsAgo }
    },
    select: {
      createdAt: true
    },
    orderBy: { createdAt: 'asc' }
  });

  // Group by month
  const monthlyData: { [key: string]: number } = {};

  users.forEach(user => {
    const monthKey = user.createdAt.toISOString().slice(0, 7); // YYYY-MM
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
  });

  return Object.entries(monthlyData).map(([month, count]) => ({
    month,
    users: count
  }));
}

// Get user role distribution
export async function getUserRoleStats() {
  await requireAdmin();

  const [admins, moderators, users] = await Promise.all([
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.user.count({ where: { role: 'MODERATOR' } }),
    prisma.user.count({ where: { role: 'USER' } })
  ]);

  return [
    { name: 'Admin', value: admins, color: '#ef4444' }, // red-500
    { name: 'Moderator', value: moderators, color: '#f59e0b' }, // amber-500
    { name: 'User', value: users, color: '#3b82f6' }, // blue-500
  ];
}


// Get weekly activity stats (posts, likes, comments)
export async function getWeeklyActivity() {
  await requireAdmin();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [posts, comments, likes] = await Promise.all([
    prisma.post.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true }
    }),
    prisma.comment.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true }
    }),
    prisma.like.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true }
    })
  ]);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Генерируем массив последних 7 дней
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return {
      name: days[d.getDay()],
      dateStr: d.toDateString(),
      posts: 0,
      comments: 0,
      likes: 0
    };
  }).reverse();

  // Наполняем данными
  posts.forEach(p => {
    const day = last7Days.find(d => d.dateStr === p.createdAt.toDateString());
    if (day) day.posts++;
  });
  comments.forEach(c => {
    const day = last7Days.find(d => d.dateStr === c.createdAt.toDateString());
    if (day) day.comments++;
  });
  likes.forEach(l => {
    const day = last7Days.find(d => d.dateStr === l.createdAt.toDateString());
    if (day) day.likes++;
  });

  return last7Days.map(({ name, posts, comments, likes }) => ({
    name, posts, comments, likes
  }));
}