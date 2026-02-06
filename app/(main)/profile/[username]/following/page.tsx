/**
 * Following Page
 * 
 * List of users a profile is following
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { getUserProfile } from "@/actions/users";
import { getFollowing } from "@/actions/follows";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FollowButton } from "@/components/features/follow-button";

interface FollowingPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: FollowingPageProps) {
  const { username } = await params;
  const profile = await getUserProfile(username);

  if (!profile) {
    return { title: "User Not Found | Social" };
  }

  return {
    title: `People ${profile.name || profile.username} follows | Social`,
  };
}

export default async function FollowingPage({ params }: FollowingPageProps) {
  const { username } = await params;
  const session = await auth();
  const profile = await getUserProfile(username);

  if (!profile) {
    notFound();
  }

  const { users, nextCursor } = await getFollowing(username);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/profile/${username}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold">Following</h1>
          <p className="text-sm text-gray-500">
            @{username} · {profile._count.following} following
          </p>
        </div>
      </div>

      {/* Following List */}
      <Card>
        {users.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">Not following anyone yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <Link href={`/profile/${user.username}`}>
                  <Avatar src={user.image} name={user.name} size="md" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/profile/${user.username}`}
                    className="block truncate font-medium hover:underline"
                  >
                    {user.name || user.username}
                  </Link>
                  <p className="truncate text-sm text-gray-500">
                    @{user.username}
                  </p>
                  {user.bio && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                      {user.bio}
                    </p>
                  )}
                </div>
                {session?.user?.id !== user.id && (
                  <FollowButton
                    userId={user.id}
                    isFollowing={user.isFollowing}
                    size="sm"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Load More */}
      {nextCursor && (
        <div className="flex justify-center">
          <Button variant="outline">Load more</Button>
        </div>
      )}
    </div>
  );
}