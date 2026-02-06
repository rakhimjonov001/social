"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { register } from "@/actions/auth";
import Orb from '@/components/Orb';

export default function RegisterPage() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      const result = await register(null, formData);
      
      if (result.success) {
        router.push("/auth/login?registered=true");
      }
      
      return result;
    },
    null
  );

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black py-12 px-4">
      
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

      {/* Контент: Стеклянная карточка */}
      <div className="relative z-10 w-full max-w-md">
        <Card className="border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)] rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 border border-white/20 shadow-inner">
              <span className="text-3xl font-black text-white italic">S</span>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-white">
              Создать аккаунт
            </CardTitle>
            <CardDescription className="text-white/60 text-base">
              Присоединяйтесь к нашему сообществу
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            {/* Сообщения о статусе */}
            {state?.success && (
              <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-3 text-sm text-green-400 backdrop-blur-md">
                {state.message}
              </div>
            )}

            {state && !state.success && state.message && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 backdrop-blur-md">
                {state.message}
              </div>
            )}

            {/* Форма регистрации */}
            <form action={formAction} className="space-y-4">
              <div className="space-y-3">
                <Input
                  name="name"
                  type="text"
                  placeholder="Полное имя"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11 rounded-xl focus:ring-blue-500/50"
                  required
                  error={state?.errors?.name?.[0]}
                />

                <Input
                  name="username"
                  type="text"
                  placeholder="Имя пользователя"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11 rounded-xl focus:ring-blue-500/50"
                  required
                  error={state?.errors?.username?.[0]}
                />

                <Input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11 rounded-xl focus:ring-blue-500/50"
                  required
                  error={state?.errors?.email?.[0]}
                />

                <Input
                  name="password"
                  type="password"
                  placeholder="Пароль"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11 rounded-xl focus:ring-blue-500/50"
                  required
                  error={state?.errors?.password?.[0]}
                />

                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Подтвердите пароль"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11 rounded-xl focus:ring-blue-500/50"
                  required
                  error={state?.errors?.confirmPassword?.[0]}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-white text-black hover:bg-white/90 font-bold rounded-xl transition-all active:scale-[0.98] mt-2" 
                isLoading={isPending}
              >
                <div className="flex items-center justify-center gap-2">
                  <UserPlus className="h-4 w-4 shrink-0" />
                  <span>Создать аккаунт</span>
                </div>
              </Button>
            </form>

            <div className="space-y-4">
              <p className="text-center text-sm text-white/40">
                Уже есть аккаунт?{" "}
                <Link href="/auth/login" className="font-bold text-white hover:text-blue-400 transition-colors">
                  Войти
                </Link>
              </p>

              <p className="text-center text-[10px] uppercase tracking-widest text-white/20 leading-relaxed">
                Создавая аккаунт, вы принимаете наши <br />
                <Link href="/terms" className="hover:text-white transition-colors">Условия использования</Link> и <Link href="/privacy" className="hover:text-white transition-colors">Политику конфиденциальности</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}