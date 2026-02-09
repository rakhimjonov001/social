"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Heart, MoreHorizontal, Trash2, Reply } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  parentId: string | null;
  author: {
    id: string | null;
    name: string | null;
    image: string | null;
  };
  replies?: Comment[];
}

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
  currentUserId?: string;
  currentUser?: {
    name: string | null;
    username: string;
    image: string | null;
  };
}

export function CommentSection({ 
  postId, 
  initialComments, 
  currentUserId,
  currentUser 
}: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    
    const content = parentId ? replyContent : newComment;
    if (!content.trim() || !currentUserId || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: content.trim(),
          parentId: parentId || null
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create comment');
      }

      const comment = await response.json();
      
      if (parentId) {
        // Add reply to existing comment
        setComments(prev => prev.map(c => {
          if (c.id === parentId) {
            return {
              ...c,
              replies: [comment, ...(c.replies || [])]
            };
          }
          return c;
        }));
        setReplyContent("");
        setReplyingTo(null);
      } else {
        // Add new top-level comment
        setComments(prev => [comment, ...prev]);
        setNewComment("");
      }
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      if (replyTextareaRef.current) {
        replyTextareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string, parentId?: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      if (parentId) {
        // Remove reply from parent comment
        setComments(prev => prev.map(c => {
          if (c.id === parentId) {
            return {
              ...c,
              replies: c.replies?.filter(reply => reply.id !== commentId) || []
            };
          }
          return c;
        }));
      } else {
        // Remove top-level comment
        setComments(prev => prev.filter(comment => comment.id !== commentId));
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <motion.div
      key={comment.id}
      className={`surface-outlined rounded-xl p-4 ${isReply ? 'ml-8 mt-2' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex gap-3">
        <Avatar
          src={comment.author.image}
          name={comment.author.name}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">
            {(comment.author as any).name || (comment.author as any).username}
            </span>
            <span className="text-xs text-muted">
            @{(comment.author as any).username}
            </span>
            <span className="text-xs text-muted">·</span>
            <span className="text-xs text-muted">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap mb-2">
            {comment.content}
          </p>
          
          {/* Reply button for top-level comments */}
          {!isReply && currentUserId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="h-6 px-2 text-xs text-muted hover:text-primary"
            >
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>
          )}
        </div>
        
        {/* Delete button */}
        {currentUserId === comment.author.id && (
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(comment.id, comment.parentId || undefined)}
              className="h-8 w-8 text-muted hover:text-error-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Reply form */}
      {replyingTo === comment.id && currentUser && (
        <motion.form
          onSubmit={(e) => handleSubmit(e, comment.id)}
          className="mt-3 ml-11"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="flex gap-2">
            <Avatar
              src={currentUser.image}
              name={currentUser.name}
              size="xs"
            />
            <div className="flex-1">
              <textarea
                ref={replyTextareaRef}
                value={replyContent}
                onChange={(e) => {
                  setReplyContent(e.target.value);
                  adjustTextareaHeight(e.target);
                }}
                placeholder={`Reply to ${(comment.author as any).name || (comment.author as any).username}...`}
                className="w-full resize-none border-0 bg-transparent p-0 text-sm placeholder:text-muted focus:outline-none"
                rows={1}
                maxLength={1000}
                disabled={isSubmitting}
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-muted">
                  {1000 - replyContent.length} characters remaining
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!replyContent.trim() || isSubmitting}
                    isLoading={isSubmitting}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.form>
      )}

      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map(reply => renderComment(reply, true))}
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-4">
      {/* Comment Form */}
      {currentUserId && currentUser && (
        <motion.form
          onSubmit={(e) => handleSubmit(e)}
          className="surface-outlined rounded-xl p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex gap-3">
            <Avatar
              src={currentUser.image}
              name={currentUser.name}
              size="sm"
            />
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={newComment}
                onChange={(e) => {
                  setNewComment(e.target.value);
                  adjustTextareaHeight(e.target);
                }}
                placeholder="Write a comment..."
                className="w-full resize-none border-0 bg-transparent p-0 text-sm placeholder:text-muted focus:outline-none"
                rows={1}
                maxLength={1000}
                disabled={isSubmitting}
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-muted">
                  {1000 - newComment.length} characters remaining
                </span>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newComment.trim() || isSubmitting}
                  isLoading={isSubmitting}
                >
                  <Send className="h-4 w-4 mr-1" />
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </motion.form>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        <AnimatePresence>
          {comments.filter(comment => !comment.parentId).map((comment) => renderComment(comment))}
        </AnimatePresence>

        {comments.filter(comment => !comment.parentId).length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
}