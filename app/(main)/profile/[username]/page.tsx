import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserByUsername } from "@/actions/users";
import { ProfileClient } from "./profile-client";
import { getUserPosts } from "@/actions";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  const user = await getUserByUsername(username);
  if (!user) return { title: "User Not Found" };

  return {
    title: `${user.name || user.username} (@${user.username})`,
    description: user.bio,
  };
}

// ← ЗАМЕНИ ВСЮ ЭТУ ФУНКЦИЮ:
export default async function ProfilePage({ params }: PageProps) {
  const session = await auth();
  const { username } = await params;
  
  const user = await getUserByUsername(username);
  if (!user) notFound();

  const { posts } = await getUserPosts(username); // ← Главное изменение: деструктурируй posts

  return (
    <ProfileClient
      user={user}
      posts={JSON.parse(JSON.stringify(posts))}
      currentUserId={session?.user?.id}
      isOwnProfile={session?.user?.id === user.id}
    />
  );
}