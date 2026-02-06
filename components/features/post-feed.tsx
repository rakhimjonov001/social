"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { PostCard } from "./post-card";
import { PostSkeleton } from "./post-skeleton";


interface PostFeedProps {
  initialPosts?: any[];
  initialNextCursor?: string | null;
  currentUserId?: string;
  feedType?: "all" | "following" | "user";
  username?: string;
}

export function PostFeed({
  initialPosts = [],
  initialNextCursor = null,
  currentUserId,
  feedType = "all",
  username,
}: PostFeedProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(initialPosts.length === 0);
  const [hasError, setHasError] = useState(false);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(async (cursor: string | null = null) => {
    // ЗАЩИТА: Если мы уже грузим или курсора нет (для дозагрузки), выходим
    if (isLoading) return;
    
    setIsLoading(true);
    setHasError(false);

    try {
      let url = `/api/posts?limit=10&type=${feedType}`;
      if (cursor) url += `&cursor=${cursor}`;
      if (feedType === "user" && username) {
        url = `/api/users/${username}/posts?limit=10${cursor ? `&cursor=${cursor}` : ""}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');

      const result = await response.json();
      
      setPosts((prev) => (cursor ? [...prev, ...result.posts] : result.posts));
      // Если бэк вернул пустой или такой же курсор, ставим null чтобы остановить скролл
      setNextCursor(result.nextCursor || null);
    } catch (error) {
      console.error("Failed to load posts:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  }, [feedType, username, isLoading]);

  // Первичная загрузка при смене таба
  useEffect(() => {
    setPosts([]);
    setNextCursor(null);
    setIsInitialLoading(true);
    fetchPosts(null);
  }, [feedType, username]);

  // Бесконечный скролл с жесткой проверкой nextCursor
  useEffect(() => {
    if (!nextCursor || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchPosts(nextCursor);
        }
      },
      { threshold: 0.5 } // Увеличил порог, чтобы не срабатывало слишком рано
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [nextCursor, isLoading, fetchPosts]);

  if (isInitialLoading) return <PostSkeleton />;

  if (posts.length === 0 && !isLoading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-16 text-center shadow-2xl">
        <p className="text-white/40 text-sm font-medium">
          {feedType === "following" ? "У ваших подписок пока нет публикаций" : "Здесь пока пусто"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {posts.map((post) => (
        <PostCard key={`${feedType}-${post.id}`} post={post} currentUserId={currentUserId} />
      ))}

      {/* Триггер: рендерится только если ЕСТЬ куда грузить дальше */}
      {nextCursor && (
        <div ref={loadMoreRef} className="py-10 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary/50" />
        </div>
      )}

      {!nextCursor && posts.length > 0 && (
        <div className="py-12 flex flex-col items-center gap-4 opacity-20">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-white to-transparent" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-white">Это все посты</p>
        </div>
      )}
    </div>
  );
}