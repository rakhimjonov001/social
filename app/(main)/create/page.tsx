/**
 * Create Post Page
 * * Styled to match the main feed and theme integration
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getCurrentUser } from "@/actions/users";
import { CreatePostForm } from "@/components/features/create-post-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Create Post | Social",
  description: "Share something with the world",
};

export default async function CreatePostPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    // Добавляем отступы и центрирование, чтобы страница не "прилипала" к краям
    <div className="container min-h-[calc(100vh-64px)] py-6 md:py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        
        {/* Хедер страницы (вне карточки для эффекта "ленты") */}
        <div className="px-2 sm:px-0">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Создать публикацию
          </h1>
          <p className="text-muted-foreground mt-1">
            Поделитесь мыслями или фотографиями со своими подписчиками
          </p>
        </div>

        {/* Основная карточка с адаптивным стилем */}
        <Card className="border-border bg-card/50 backdrop-blur-sm shadow-xl shadow-black/5 dark:shadow-black/20 overflow-hidden rounded-2xl">
          <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <CardTitle className="text-lg">Новый пост</CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <CreatePostForm
              user={{
                name: user.name,
                username: user.username,
                image: user.image,
              }}
            />
          </CardContent>
        </Card>

        {/* Подсказка внизу */}
        <p className="text-center text-xs text-muted-foreground/60 px-4">
          Пожалуйста, соблюдайте правила сообщества при публикации контента.
        </p>
      </div>
    </div>
  );
}