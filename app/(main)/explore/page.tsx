"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Hash, Loader2, X, Users } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { PostCard } from "@/components/features/post-card";
import { PostSkeleton } from "@/components/features/post-skeleton";
import Link from "next/link";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("trending");
  const [posts, setPosts] = useState<any[]>([]);
  const [foundUsers, setFoundUsers] = useState<any[]>([]);
  const [trendingTags, setTrendingTags] = useState<{tag: string, count: number}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 500);

  // 1. Загрузка трендовых тегов при старте
  useEffect(() => {
    fetch("/api/explore/tags")
      .then(res => res.json())
      .then(data => setTrendingTags(data.tags || []));
  }, []);

  // 2. Основной поиск и рекомендации
  useEffect(() => {
    const fetchExplore = async () => {
      setIsLoading(true);
      try {
        const url = debouncedSearch 
          ? `/api/explore/search?q=${encodeURIComponent(debouncedSearch)}`
          : `/api/explore/popular?category=${activeTab}`;
          
        const res = await fetch(url);
        const data = await res.json();
        
        setPosts(data.posts || []);
        setFoundUsers(data.users || []);
      } catch (error) {
        console.error("Explore error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExplore();
  }, [debouncedSearch, activeTab]);

  return (
    <div className="min-h-screen pt-24 px-4 md:px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        
        {/* Search Bar */}
        <div className="relative mb-8 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Поиск постов, людей или #тегов..."
            className="w-full pl-12 pr-12 py-4 rounded-2xl glass-strong border-none focus:ring-2 focus:ring-primary/50 outline-none text-lg transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Found Users (показываем только при поиске) */}
        <AnimatePresence>
          {searchQuery && foundUsers.length > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-8 space-y-2 overflow-hidden">
              <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2 px-2 uppercase tracking-wider">
                <Users className="w-4 h-4" /> Люди
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {foundUsers.map((user) => (
                  <Link key={user.id} href={`/profile/${user.username}`} className="flex flex-col items-center gap-2 p-4 glass rounded-2xl min-w-[120px] hover:glow transition-all">
                    <div className="w-12 h-12 rounded-full bg-primary/20 overflow-hidden">
                      {user.image ? <img src={user.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold">{user.username[0]}</div>}
                    </div>
                    <span className="text-sm font-medium truncate w-full text-center">@{user.username}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories / Trending Tags */}
        {!searchQuery && (
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveTab("trending")}
              className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${activeTab === "trending" ? "bg-primary text-white shadow-lg shadow-primary/30" : "glass hover:bg-white/10"}`}
            >
              🔥 В тренде
            </button>
            {trendingTags.map(({ tag }) => (
              <button
                key={tag}
                onClick={() => setActiveTab(tag)}
                className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${activeTab === tag ? "bg-primary text-white shadow-lg shadow-primary/30" : "glass hover:bg-white/10"}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Content Feed */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="space-y-6"><PostSkeleton /><PostSkeleton /></div>
          ) : posts.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {posts.map((post, idx) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                  <PostCard post={post} />
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="py-20 text-center glass rounded-3xl">
              <p className="text-muted-foreground">Здесь пока ничего нет 🔍</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}