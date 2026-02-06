import { auth } from "./lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // 1. Определяем типы роутов
  const isAuthPage = nextUrl.pathname.startsWith("/auth");
  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isPublicRoute = ["/", "/explore"].includes(nextUrl.pathname);
  const isProfileRoute = nextUrl.pathname.startsWith("/profile/");
  const isStaticFile = nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/);

  // Разрешаем статику и API
  if (isStaticFile || isApiRoute) {
    return NextResponse.next();
  }

  // 2. Логика для главной страницы "/"
  if (nextUrl.pathname === "/") {
    if (isLoggedIn) {
      // Если вошел — на фид
      return NextResponse.redirect(new URL("/feed", nextUrl));
    }
    // Если не вошел — остаемся на главной (Landing Page)
    return NextResponse.next();
  }

  // 3. Редирект авторизованных пользователей подальше от страниц входа
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/feed", nextUrl));
  }

  // 4. Пропускаем неавторизованных на страницы входа и другие публичные роуты
  if (isAuthPage || isPublicRoute || isProfileRoute) {
    return NextResponse.next();
  }

  // 5. Защита всех остальных роутов (например, /feed, /settings)
  if (!isLoggedIn) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${callbackUrl}`, nextUrl)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};