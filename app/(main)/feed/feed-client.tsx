"use client";

import { PostFeed } from "@/components/features/post-feed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/features/tabs";
import { useState } from "react";
// import Squares from "@/components/Squares"; // Убедись, что путь верный

// 1. Добавляем интерфейс пропсов (должен совпадать с тем, что передает страница)
interface FeedClientProps {
  user: any; 
  sessionUserId: string | undefined;
  allPosts: any;
  followingPosts: any;
}

// 2. Принимаем пропсы в функции
export default function FeedClient({ 
  user, 
  sessionUserId, 
  allPosts, 
  followingPosts 
}: FeedClientProps) {
  
  // Убираем useEffect и fetch('/api/auth/session'), 
  // так как sessionUserId уже пришел сверху!
  const currentUserId = sessionUserId;

  return (
    <div className="relative min-h-screen w-full flex justify-center py-10 px-4 overflow-x-hidden">
      <div className="w-full max-w-2xl relative z-10">
        <Tabs defaultValue="all" className="w-full space-y-8">

          <div className="flex justify-center">
            <TabsList className="bg-white/5 border border-white/10 backdrop-blur-2xl p-1 rounded-2xl h-12 inline-flex items-center">
              <TabsTrigger
                value="all"
                className="rounded-xl px-8 py-2 text-sm font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-black text-white/60"
              >
                Популярное
              </TabsTrigger>
              <TabsTrigger
                value="following"
                className="rounded-xl px-8 py-2 text-sm font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-black text-white/60"
              >
                Подписки
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-8">
            <TabsContent value="all" className="outline-none">
              {/* Если PostFeed умеет работать с начальными данными, можно передать initialData={allPosts} */}
              <PostFeed key="all" feedType="all" currentUserId={currentUserId} />
            </TabsContent>

            <TabsContent value="following" className="outline-none">
              <PostFeed key="following" feedType="following" currentUserId={currentUserId} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}