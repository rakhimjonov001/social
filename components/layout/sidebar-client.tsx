"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Users, Hash } from "lucide-react";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from "@/components/ui";
import { FollowButton } from "@/components/features/follow-button";


const trendingTopics = [
  { tag: "nextjs", posts: 1234 },
  { tag: "react", posts: 987 },
  { tag: "typescript", posts: 654 },
  { tag: "tailwindcss", posts: 432 },
  { tag: "webdev", posts: 321 },
];

interface SidebarClientProps {
  suggestedUsers: Array<{
    id: string;
    name: string | null;
    username: string;
    image: string | null;
    isFollowing: boolean;
  }>;
}

export function SidebarClient({ suggestedUsers }: SidebarClientProps) {
  return (
    <motion.aside
      className="sticky top-20 hidden w-80 shrink-0 lg:block"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-6">
       

        {/* Trending */}
        <Card variant="outlined" padding="none">
          <CardHeader className="p-4 pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary-500" />
              Trending
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {trendingTopics.map((topic, index) => (
              <motion.div
                key={topic.tag}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/explore?tag=${topic.tag}`}
                  className="flex justify-between px-4 py-3 hover:bg-surface"
                >
                  <span className="font-medium">#{topic.tag}</span>
                  <Badge variant="secondary" size="sm">
                    {topic.posts.toLocaleString()}
                  </Badge>
                </Link>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Suggested users */}
        <Card variant="outlined" padding="none">
          <CardHeader className="p-4 pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-primary-500" />
              Who to follow
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {suggestedUsers.map((user, index) => (
              <motion.div
                key={user.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-surface"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/profile/${user.username}`}>
                  <Avatar src={user.image} name={user.name} size="md" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/profile/${user.username}`}
                    className="truncate font-medium"
                  >
                    {user.name || user.username}
                  </Link>
                  <p className="text-sm text-muted">@{user.username}</p>
                </div>
                <FollowButton
                  userId={user.id}
                  username={user.username}
                  isFollowing={user.isFollowing}
                  size="sm"
                />
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.aside>
  );
}