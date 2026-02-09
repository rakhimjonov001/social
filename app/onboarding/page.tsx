"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/actions/users"; // Убедись, что путь верный
import { useSession } from "next-auth/react";

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Валидация ника
    if (username.length < 3) {
      setError("Ник должен быть не короче 3 символов");
      setLoading(false);
      return;
    }

    if (username.includes("_") || username.includes(" ")) {
      setError("Ник не должен содержать пробелы или нижнее подчеркивание (на данном этапе)");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("username", username);

    try {
      // Вызываем твой экшен обновления (null передаем, так как это prevState)
      const result = await updateProfile(null, formData);

      if (result.success) {
        // ОБЯЗАТЕЛЬНО: обновляем сессию, чтобы Middleware увидел новый ник
        await update({ username });
        router.push("/feed");
        router.refresh();
      } else {
        setError(result.message || "Этот ник уже занят");
      }
    } catch (err) {
      setError("Произошла ошибка. Попробуйте другой ник.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-xl border shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Добро пожаловать!</h1>
          <p className="text-muted-foreground mt-2">
            Последний шаг — выберите уникальное имя пользователя
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground">@</span>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="my_nickname"
                className="w-full pl-8 pr-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary outline-none"
                required
              />
            </div>
            {error && <p className="text-destructive text-xs mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? "Сохранение..." : "Начать пользоваться"}
          </button>
        </form>
      </div>
    </div>
  );
}