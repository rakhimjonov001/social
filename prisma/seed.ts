/**
 * Database Seed Script
 * 
 * Populates the database with sample data for development
 * Run with: npx prisma db seed
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clean existing data
  console.log("🧹 Cleaning existing data...");
  await prisma.notification.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log("👤 Creating users...");
  const hashedPassword = await bcrypt.hash("password123", 12);

  const users = await Promise.all([
    // Admin user
    prisma.user.create({
      data: {
        email: "admin@example.com",
        username: "admin",
        name: "Admin",
        password: hashedPassword,
        role: "ADMIN",
        bio: "Platform administrator",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
      },
    }),
    prisma.user.create({
      data: {
        email: "john@example.com",
        username: "johndoe",
        name: "John Doe",
        password: hashedPassword,
        bio: "Software developer passionate about building great products. Love coffee and coding! ☕️💻",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      },
    }),
    prisma.user.create({
      data: {
        email: "jane@example.com",
        username: "janesmith",
        name: "Jane Smith",
        password: hashedPassword,
        bio: "Designer & creative thinker. Making the world more beautiful one pixel at a time. 🎨",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      },
    }),
    prisma.user.create({
      data: {
        email: "bob@example.com",
        username: "bobwilson",
        name: "Bob Wilson",
        password: hashedPassword,
        bio: "Tech enthusiast and startup founder. Building the future! 🚀",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
      },
    }),
    prisma.user.create({
      data: {
        email: "alice@example.com",
        username: "alicejohnson",
        name: "Alice Johnson",
        password: hashedPassword,
        bio: "Product manager by day, photographer by night. 📸",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      },
    }),
    prisma.user.create({
      data: {
        email: "charlie@example.com",
        username: "charliedev",
        name: "Charlie Brown",
        password: hashedPassword,
        bio: "Full-stack developer. Open source contributor. 🌟",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=charlie",
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create follows
  console.log("👥 Creating follow relationships...");
  const follows = await Promise.all([
    // John follows Jane, Bob, Alice
    prisma.follow.create({ data: { followerId: users[1].id, followingId: users[2].id } }),
    prisma.follow.create({ data: { followerId: users[1].id, followingId: users[3].id } }),
    prisma.follow.create({ data: { followerId: users[1].id, followingId: users[4].id } }),
    // Jane follows John, Charlie
    prisma.follow.create({ data: { followerId: users[2].id, followingId: users[1].id } }),
    prisma.follow.create({ data: { followerId: users[2].id, followingId: users[5].id } }),
    // Bob follows everyone
    prisma.follow.create({ data: { followerId: users[3].id, followingId: users[1].id } }),
    prisma.follow.create({ data: { followerId: users[3].id, followingId: users[2].id } }),
    prisma.follow.create({ data: { followerId: users[3].id, followingId: users[4].id } }),
    prisma.follow.create({ data: { followerId: users[3].id, followingId: users[5].id } }),
    // Alice follows John, Jane
    prisma.follow.create({ data: { followerId: users[4].id, followingId: users[1].id } }),
    prisma.follow.create({ data: { followerId: users[4].id, followingId: users[2].id } }),
    // Charlie follows Bob
    prisma.follow.create({ data: { followerId: users[5].id, followingId: users[3].id } }),
  ]);

  console.log(`✅ Created ${follows.length} follow relationships`);

  // Create posts
  console.log("📝 Creating posts...");
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        content: "Just launched my new project! 🚀 It's been months of hard work, but finally seeing it live is amazing. Check it out and let me know what you think!",
        authorId: users[1].id,
      },
    }),
    prisma.post.create({
      data: {
        content: "Beautiful sunset today! 🌅 Sometimes you just need to stop and appreciate the little things in life.",
        image: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800",
        authorId: users[2].id,
      },
    }),
    prisma.post.create({
      data: {
        content: "Excited to announce that we just closed our Series A! 🎉 Thank you to everyone who believed in us from day one. The journey is just beginning!",
        authorId: users[3].id,
      },
    }),
    prisma.post.create({
      data: {
        content: "New camera, who dis? 📸 Testing out my new gear with some street photography. What do you think?",
        image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
        authorId: users[4].id,
      },
    }),
    prisma.post.create({
      data: {
        content: "Just merged my 100th PR to the open source project I maintain! 💯 Open source is all about community, and I'm grateful for every contributor.",
        authorId: users[5].id,
      },
    }),
    prisma.post.create({
      data: {
        content: "Coffee and code - the perfect combination ☕️💻 Working on some exciting new features today!",
        authorId: users[1].id,
      },
    }),
    prisma.post.create({
      data: {
        content: "Design tip of the day: White space is not empty space, it's breathing room for your content. 🎨",
        authorId: users[2].id,
      },
    }),
    prisma.post.create({
      data: {
        content: "The best time to start was yesterday. The second best time is now. 💪 What are you working on today?",
        authorId: users[3].id,
      },
    }),
  ]);

  console.log(`✅ Created ${posts.length} posts`);

  // Create likes
  console.log("❤️ Creating likes...");
  const likes = await Promise.all([
    // Likes on first post
    prisma.like.create({ data: { userId: users[1].id, postId: posts[0].id } }),
    prisma.like.create({ data: { userId: users[2].id, postId: posts[0].id } }),
    prisma.like.create({ data: { userId: users[3].id, postId: posts[0].id } }),
    // Likes on second post
    prisma.like.create({ data: { userId: users[0].id, postId: posts[1].id } }),
    prisma.like.create({ data: { userId: users[2].id, postId: posts[1].id } }),
    prisma.like.create({ data: { userId: users[4].id, postId: posts[1].id } }),
    // Likes on third post
    prisma.like.create({ data: { userId: users[0].id, postId: posts[2].id } }),
    prisma.like.create({ data: { userId: users[1].id, postId: posts[2].id } }),
    prisma.like.create({ data: { userId: users[3].id, postId: posts[2].id } }),
    prisma.like.create({ data: { userId: users[4].id, postId: posts[2].id } }),
    // More likes
    prisma.like.create({ data: { userId: users[0].id, postId: posts[3].id } }),
    prisma.like.create({ data: { userId: users[1].id, postId: posts[4].id } }),
    prisma.like.create({ data: { userId: users[2].id, postId: posts[5].id } }),
    prisma.like.create({ data: { userId: users[3].id, postId: posts[6].id } }),
    prisma.like.create({ data: { userId: users[4].id, postId: posts[7].id } }),
  ]);

  console.log(`✅ Created ${likes.length} likes`);

  // Create comments
  console.log("💬 Creating comments...");
  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        content: "Congratulations! This looks amazing! 🎉",
        authorId: users[1].id,
        postId: posts[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "Can't wait to try it out!",
        authorId: users[2].id,
        postId: posts[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "Stunning photo! Where was this taken?",
        authorId: users[0].id,
        postId: posts[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "This is incredible news! Well deserved! 🚀",
        authorId: users[0].id,
        postId: posts[2].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "The composition is perfect!",
        authorId: users[1].id,
        postId: posts[3].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "That's a huge milestone! Keep up the great work! 💪",
        authorId: users[2].id,
        postId: posts[4].id,
      },
    }),
  ]);

  console.log(`✅ Created ${comments.length} comments`);

  // Create notifications
  console.log("🔔 Creating notifications...");
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        type: "LIKE",
        senderId: users[1].id,
        receiverId: users[0].id,
        postId: posts[0].id,
      },
    }),
    prisma.notification.create({
      data: {
        type: "COMMENT",
        senderId: users[1].id,
        receiverId: users[0].id,
        postId: posts[0].id,
        commentId: comments[0].id,
      },
    }),
    prisma.notification.create({
      data: {
        type: "FOLLOW",
        senderId: users[1].id,
        receiverId: users[0].id,
      },
    }),
    prisma.notification.create({
      data: {
        type: "LIKE",
        senderId: users[0].id,
        receiverId: users[1].id,
        postId: posts[1].id,
      },
    }),
    prisma.notification.create({
      data: {
        type: "FOLLOW",
        senderId: users[2].id,
        receiverId: users[0].id,
      },
    }),
  ]);

  console.log(`✅ Created ${notifications.length} notifications`);

  console.log("\n🎉 Database seed completed successfully!");
  console.log("\n📋 Test accounts:");
  console.log("   🔑 ADMIN: admin@example.com | Password: password123");
  console.log("   👤 USER: john@example.com | Password: password123");
  console.log("   👤 USER: jane@example.com | Password: password123");
  console.log("   👤 USER: bob@example.com | Password: password123");
  console.log("\n🚀 Access admin panel at: http://localhost:3000/admin");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
