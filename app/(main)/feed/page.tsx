import { auth } from "@/lib/auth";
import { getFeedPosts, getFollowingFeed } from "@/actions/posts";
import { getCurrentUser } from "@/actions/users";
import FeedClient from "./feed-client";

export const metadata = {
  title: "Feed | Social",
  description: "See what's happening in your network",
};

export default async function FeedPage() {
  const session = await auth();
  const user = await getCurrentUser();

  const [allPosts, followingPosts] = await Promise.all([
    getFeedPosts(),
    session?.user?.id ? getFollowingFeed() : { posts: [], nextCursor: null },
  ]);

  return (
    <FeedClient
      user={user}
      sessionUserId={session?.user?.id}
      allPosts={allPosts}
      followingPosts={followingPosts}
    />
  );
}