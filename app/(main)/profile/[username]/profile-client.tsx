"use client";

import { motion } from "framer-motion";
import { Calendar, Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PostCard } from "@/components/features/post-card";
import Squares from "@/components/Squares";
import { cn } from "@/lib/utils";

// 1. Интерфейс поста, полностью совместимый с PostCard (PostWithAuthor)
interface Post {
  id: string;
  content: string;
  image: string | null; 
  createdAt: string | Date; // Принимаем и строку (от сервера), и Date
  author: {
    id: string;
    username: string;
    name: string | null;
    image: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
  isLiked?: boolean;
}

interface ProfileUser {
  username: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  isFollowing: boolean;
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
}

interface ProfileClientProps {
  user: ProfileUser;
  posts: Post[];
  currentUserId?: string;
  isOwnProfile: boolean;
}

export function ProfileClient({
  user,
  posts: initialPosts,
  currentUserId,
  isOwnProfile,
}: ProfileClientProps) {
  const router = useRouter();
  
  // 2. Явная типизация стейтов для предотвращения ошибок 'any' при билде
  const [posts, setPosts] = useState<Post[]>(Array.isArray(initialPosts) ? initialPosts : []);
  const [isFollowing, setIsFollowing] = useState<boolean>(user.isFollowing || false);
  const [followerCount, setFollowerCount] = useState<number>(user._count.followers);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPosts(Array.isArray(initialPosts) ? initialPosts : []);
  }, [initialPosts]);

  const handleFollow = async () => {
    if (isFollowLoading || !currentUserId) return;
    
    const previousState = { isFollowing, followerCount };
    
    // Оптимистичное обновление
    setIsFollowing(!isFollowing);
    setFollowerCount((prev: number) => (isFollowing ? prev - 1 : prev + 1));
    setIsFollowLoading(true);

    try {
      const response = await fetch(`/api/users/${user.username}/follow`, { method: "POST" });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setIsFollowing(data.isFollowing);
      setFollowerCount(data.followerCount);
    } catch (error) {
      setIsFollowing(previousState.isFollowing);
      setFollowerCount(previousState.followerCount);
    } finally {
      setIsFollowLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden pt-20 px-4 pb-12 transition-colors duration-500 bg-background text-foreground">
      

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Навигация */}
          <div className="mb-6">
             <button 
               onClick={() => router.back()}
               className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group font-medium"
             >
               <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
               <span>Назад</span>
             </button>
          </div>

          {/* Карточка профиля */}
          <div className="bg-card/60 backdrop-blur-2xl border border-border rounded-[2.5rem] overflow-hidden mb-8 shadow-xl">
            <div className="h-40 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent" />

            <div className="px-6 md:px-10 pb-8">
              <div className="-mt-16 mb-6 flex items-end justify-between gap-4 flex-wrap">
                <div className="w-32 h-32 rounded-3xl bg-card border-4 border-background shadow-2xl overflow-hidden relative">
                  <img 
                    src={user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} 
                    alt={user.username} 
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex gap-3">
                  {!isOwnProfile && currentUserId && (
                    <button
                      onClick={handleFollow}
                      disabled={isFollowLoading}
                      className={cn(
                        "px-8 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-lg",
                        isFollowing 
                          ? "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80" 
                          : "bg-primary text-primary-foreground hover:opacity-90 shadow-primary/20"
                      )}
                    >
                      {isFollowLoading ? "..." : isFollowing ? "Вы Подписаны" : "Подписаться"}
                    </button>
                  )}

                  {isOwnProfile && (
                    <Link href="/settings">
                      <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-secondary border border-border text-secondary-foreground font-bold hover:bg-secondary/80 transition-all active:scale-95">
                        <Settings className="w-4 h-4" />
                        <span>Настройки</span>
                      </button>
                    </Link>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <h1 className="text-4xl font-black tracking-tight text-foreground">
                  {user.name || user.username}
                </h1>
                <p className="text-primary font-bold text-lg">@{user.username}</p>
              </div>

              {user.bio && (
                <p className="mt-4 text-muted-foreground text-lg max-w-2xl leading-relaxed">
                  {user.bio}
                </p>
              )}

              <div className="flex gap-8 mt-8 border-t border-border pt-6">
                {[
                  { label: "Публикации", count: user._count.posts },
                  { label: "Подписчики", count: followerCount },
                  { label: "Подписки", count: user._count.following },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col">
                    <span className="text-2xl font-black text-foreground">{item.count}</span>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Лента постов */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground/90 px-2 flex items-center gap-2">
              Последние публикации 
              <span className="text-muted-foreground font-normal text-sm">({posts.length})</span>
            </h2>
            
            {posts.length === 0 ? (
              <div className="bg-card/40 backdrop-blur-xl border border-border border-dashed rounded-[2.5rem] p-20 text-center">
                <Calendar className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">Пусто</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    // 4. Магия приведения типов для успешного билда: превращаем строку в Date
                    post={{
                      ...post,
                      createdAt: new Date(post.createdAt)
                    } as any}
                    currentUserId={currentUserId}
                    onDelete={() => setPosts((prev: Post[]) => prev.filter((p) => p.id !== post.id))}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}