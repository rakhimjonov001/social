"use client";

import { useActionState, useState, useRef, useEffect } from "react"; // Добавили useEffect
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createPost } from "@/actions/posts";
import { UploadButton } from "../../lib/uploadthing";
import { cn } from "@/lib/utils";

interface CreatePostFormProps {
  user: {
    name: string | null;
    username: string;
    image: string | null;
  };
}

export function CreatePostForm({ user }: CreatePostFormProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      try {
        const postData = {
          content: formData.get("content") as string,
          ...(imageUrl && { image: imageUrl }),
        };

        const response = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        });

        const result = await response.json();

        if (!response.ok) {
          return {
            success: false,
            message: result.error || "Failed to create post",
            errors: result.details || {},
          };
        }

        // --- ГЛАВНОЕ ИЗМЕНЕНИЕ ---
        // Если пост создан успешно:
        setContent("");
        setImageUrl(null);
        router.push("/feed"); // Перенаправляем пользователя
        router.refresh();      // Обновляем данные на странице
        
        return { success: true, data: result };
      } catch (error) {
        return {
          success: false,
          message: "Failed to create post",
          errors: {},
        };
      }
    },
    null
  );

  const handleSubmit = (formData: FormData) => {
    if (imageUrl) formData.set("image", imageUrl);
    formAction(formData);
  };

  const removeImage = () => setImageUrl(null);

  const maxLength = 2000;
  const remainingChars = maxLength - content.length;
  const isOverLimit = remainingChars < 0;

  return (
    // Убрали Card здесь, так как он уже есть в родителе (create/page.tsx)
    <div className="w-full">
      <form ref={formRef} action={handleSubmit}>
        <div className="flex gap-4">
          <Avatar src={user.image} name={user.name || user.username} size="md" className="ring-2 ring-border/50" />
          
          <div className="flex-1 space-y-4">
            <Textarea
              name="content"
              placeholder="О чем вы думаете?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none border-0 bg-transparent p-0 text-lg text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
              maxLength={maxLength + 100}
            />

            {/* Image Preview */}
            {imageUrl && (
              <div className="relative group overflow-hidden rounded-2xl border border-border">
                <div className="relative aspect-video w-full">
                  <Image
                    src={imageUrl}
                    alt="Upload preview"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white backdrop-blur-sm transition-all hover:bg-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Error Messages */}
            {state && !state.success && state.message && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {state.message}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div className="flex items-center gap-2">
                {!imageUrl && (
                  <UploadButton
                    endpoint="imageUploader"
                    onUploadBegin={() => setIsUploading(true)}
                    onClientUploadComplete={(res) => {
                      setIsUploading(false);
                      if (res?.[0]?.url) setImageUrl(res[0].url);
                    }}
                    onUploadError={(error) => {
                      setIsUploading(false);
                      console.error(error.message);
                    }}
                    appearance={{
                      button: "bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-xl text-sm transition-all",
                      allowedContent: "hidden",
                    }}
                    content={{
                      button: isUploading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <div className="flex items-center gap-2">
                          <ImagePlus className="h-5 w-5" />
                          <span className="hidden sm:inline">Фото</span>
                        </div>
                      ),
                    }}
                  />
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Character Count */}
                <span
                  className={cn(
                    "text-xs font-medium transition-colors",
                    isOverLimit ? "text-destructive" : "text-muted-foreground"
                  )}
                >
                  {remainingChars}
                </span>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20"
                  disabled={isPending || isUploading || !content.trim() || isOverLimit}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Публикация...
                    </>
                  ) : (
                    "Опубликовать"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}