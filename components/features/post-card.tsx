"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Trash2,
  Edit3,
  Bookmark,
  BookmarkCheck,
  Copy,
  ExternalLink,
  CheckCircle2
} from "lucide-react";
import {
  Avatar,
  Button,
  PostCard as Card,
} from "@/components/ui";
import { formatRelativeTime, formatCompactNumber, cn } from "@/lib/utils";
import type { PostWithAuthor } from "@/actions/posts";

interface PostCardProps {
  post: PostWithAuthor;
  currentUserId?: string;
  showActions?: boolean;
  compact?: boolean;
  onDelete?: () => void; // Добавил колбэк для обновления списка
}

export function PostCard({
  post,
  currentUserId,
  showActions = true,
  compact = false,
  onDelete
}: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwnPost = currentUserId === post.author.id;

  const handleLike = () => {
    if (!currentUserId) return;
    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;

    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    startTransition(async () => {
      try {
        const response = await fetch(`/api/posts/${post.id}/like`, { method: 'POST' });
        if (!response.ok) throw new Error();
      } catch (error) {
        setIsLiked(previousIsLiked);
        setLikeCount(previousLikeCount);
      }
    });
  };

  const handleDelete = async () => {
    if (!confirm("Удалить этот пост?")) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
      if (response.ok && onDelete) onDelete();
    } catch (error) {
      setIsDeleting(false);
    }
  };

  if (isDeleting) {
    return (
      <Card className="opacity-50 border-dashed border-red-500/50 bg-red-500/5">
        <div className="p-6 text-center text-red-400 font-medium">Удаление...</div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group"
    >
      {/* КЛЮЧЕВЫЕ ИЗМЕНЕНИЯ ДЛЯ DARK MODE:
         - bg-white/[0.03] и backdrop-blur-xl (стекло)
         - border-white/10 (тонкая светлая граница)
         - hover:bg-white/[0.06] (плавный отклик)
      */}
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300",
        "bg-white/[0.03] dark:bg-black/20 backdrop-blur-xl border-white/10 hover:border-white/20 shadow-2xl",
        compact ? "p-4" : "p-6",
        "rounded-[2rem]"
      )}>

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${post.author.username}`} className="relative">
              <Avatar
                src={post.author.image}
                name={post.author.name}
                size={compact ? "sm" : "md"}
                className="border-2 border-white/5 ring-2 ring-black/20"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#050505] rounded-full" />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <Link
                  href={`/profile/${post.author.username}`}
                  className="font-bold text-white hover:text-indigo-400 transition-colors truncate"
                >
                  {post.author.name || post.author.username}
                </Link>
                
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-white/40">
                <span>@{post.author.username}</span>
                <span className="text-white/20">·</span>
                <span className="hover:text-white/60 transition-colors cursor-default">
                  {formatRelativeTime(post.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {showActions && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMenu(!showMenu)}
                className="h-9 w-9 rounded-xl hover:bg-white/10 text-white/40 hover:text-white"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>

              <AnimatePresence>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] p-1.5 shadow-2xl backdrop-blur-3xl"
                    >
                      <button onClick={() => { }} className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-all">
                        <Copy className="h-4 w-4" /> Копировать ссылку
                      </button>

                      {isOwnPost && (
                        <button
                          onClick={handleDelete}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 className="h-4 w-4" /> Удалить
                        </button>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="whitespace-pre-wrap break-words text-[15px] text-white/80 leading-relaxed font-medium">
            {post.content}
          </p>
        </div>

        {/* Image */}
        {post.image && (
          <div className="relative mb-5 overflow-hidden rounded-[1.5rem] border border-white/5 shadow-inner">
            <Image
              src={post.image}
              alt="Post image"
              width={800}
              height={500}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 800px"
            />
            {/* Легкое затемнение для картинок, чтобы текст не сливался */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        )}

        {/* Actions Bar */}
        {showActions && (
          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={cn(
                  "group/like gap-2 rounded-xl transition-all active:scale-90",
                  isLiked ? "text-red-500 bg-red-500/5" : "text-white/40 hover:text-red-400 hover:bg-red-500/5"
                )}
              >
                <Heart className={cn("h-5 w-5 transition-transform group-hover/like:scale-110", isLiked && "fill-current")} />
                <span className="font-bold text-xs">{formatCompactNumber(likeCount)}</span>
              </Button>

              <Link href={`/post/${post.id}`} prefetch>
                <Button
                  
                  variant="ghost"
                  size="sm"
                  className="gap-2 rounded-xl text-white/40 hover:text-blue-400 hover:bg-blue-500/5 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    <span className="font-bold text-xs">
                      {formatCompactNumber(post._count.comments)}
                    </span>
                  </div>
                </Button>
              </Link>


              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl text-white/40 hover:text-indigo-400 hover:bg-indigo-500/5"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={cn(
                "rounded-xl transition-all",
                isBookmarked ? "text-yellow-500 bg-yellow-500/5" : "text-white/40 hover:text-yellow-500"
              )}
            >
              <Bookmark className={cn("h-5 w-5", isBookmarked && "fill-current")} />
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  );
}