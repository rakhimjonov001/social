"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Github, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { login, signInWithGitHub, signInWithGoogle } from "@/actions/auth";
import Orb from '@/components/Orb'; // Убедись, что путь верный

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/feed";
  const error = searchParams.get("error");

  const [state, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      const result = await login(null, formData);
      if (result.success) {
        router.push(callbackUrl);
        router.refresh();
      }
      return result;
    },
    null
  );

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black">

      {/* ФОН: Orb на весь экран */}
      <div className="absolute inset-0 z-0">
        <Orb
          hoverIntensity={2}
          rotateOnHover
          hue={0}
          forceHoverState={false}
          backgroundColor="#000000"
        />
      </div>

      {/* Контент: Оборачиваем в motion или div с z-10 */}
      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)] rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 border border-white/20 shadow-inner">
              <span className="text-3xl font-black text-white italic">S</span>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-white">
              Social Platform
            </CardTitle>
            <CardDescription className="text-white/60 text-base">
              Добро пожаловать в будущее связи
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            {/* Ошибки */}
            {(error || (state && !state.success)) && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 backdrop-blur-md">
                {error === "OAuthAccountNotLinked"
                  ? "Этот Email уже связан с другим способом входа."
                  : state?.message || "Ошибка входа. Попробуйте снова."}
              </div>
            )}

            {/* Социальные кнопки */}
            <div className="grid grid-cols-2 gap-3">
              <form action={signInWithGitHub} className="w-full">
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl h-11 transition-all active:scale-[0.98]"
                >
                  {/* Обертка для центрирования */}
                  <div className="flex items-center justify-center gap-2">
                    <Github className="h-5 w-5 shrink-0" />
                    <span>GitHub</span>
                  </div>
                </Button>
              </form>

              <form action={signInWithGoogle} className="w-full">
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl h-11 transition-all active:scale-[0.98]"
                >
                  {/* Обертка для центрирования */}
                  <div className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>Google</span>
                  </div>
                </Button>
              </form>
            </div>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest text-white/40">
                <span className="bg-transparent px-2 backdrop-blur-sm">или через почту</span>
              </div>
            </div>

            {/* Email Форма */}
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11 rounded-xl focus:ring-blue-500/50"
                  required
                />
                <Input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11 rounded-xl focus:ring-blue-500/50"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-white text-black hover:bg-white/90 font-bold rounded-xl transition-all active:scale-[0.98]"
                isLoading={isPending}
              >

                <div className="flex items-center justify-center w-full gap-2">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>Войти в систему</span>
                </div>
              </Button>
            </form>

            <p className="text-center text-sm text-white/40">
              Нет аккаунта?{" "}
              <Link href="/auth/register" className="font-bold text-white hover:text-blue-400 transition-colors">
                Создать профиль
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}