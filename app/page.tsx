"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { Sparkles, Globe } from "lucide-react";
import { ThemeToggle } from "../components/ui/theme-toggle";
import { useThemeIntegration } from "../hooks/use-theme-integration";
import GlassSurface from "../components/GlassSurface";
import TextType from "../components/TextType";
import dynamic from 'next/dynamic';

// Динамический импорт LiquidEther с отключенным SSR, 
// так как Canvas-анимации часто вызывают ошибки гидратации
const LiquidEther = dynamic(() => import("../components/LiquidEther"), { ssr: false });


// Явно указываем возвращаемый тип Variants
const slideIn = (direction: "left" | "right" | "up", delay: number = 0): Variants => ({
  hidden: { 
    x: direction === "left" ? -100 : direction === "right" ? 100 : 0,
    y: direction === "up" ? 50 : 0,
    opacity: 0 
  },
  visible: { 
    x: 0, 
    y: 0,
    opacity: 1,
    transition: { 
      duration: 0.8, 
      delay, 
      // Добавляем as const, чтобы массив чисел воспринимался как фиксированный кривой Bezier
      ease: [0.22, 1, 0.36, 1] as const 
    } 
  }
});

export default function LandingPage() {
  const { mounted } = useThemeIntegration();

  if (!mounted) return <div className="h-screen w-full bg-black" />;

  return (
    <div className="relative h-screen w-full overflow-hidden selection:bg-primary/30 text-foreground">
      
      {/* ФОН LiquidEther */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <LiquidEther
          colors={['#3F51B5', '#2196F3', '#00BCD4']}
          mouseForce={15}
          cursorSize={80}
          iterationsViscous={16} 
          iterationsPoisson={16} 
          resolution={0.4}      
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.0}
        />
      </div>

      {/* Навигация */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 p-4"
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <GlassSurface width="90%" height={70} borderRadius={25} blur={12} className="mx-auto border border-white/10">
          <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between h-full">
            <Link href="/" className="flex items-center gap-2 group">
              <Sparkles className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                Social
              </span>
            </Link>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/auth/login">
                <GlassSurface width="auto" height={42} borderRadius={14} blur={4} backgroundOpacity={0.2} className="border border-white/20 hover:bg-white/10 transition-colors cursor-pointer">
                   <span className="px-6 py-2 text-sm font-bold uppercase tracking-tight">Вход</span>
                </GlassSurface>
              </Link>
            </div>
          </div>
        </GlassSurface>
      </motion.nav>

      {/* Hero Section */}
      <main className="relative z-10 h-full flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          
          <motion.div
            variants={slideIn("up", 0.2)}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10"
          >
            <Globe className="w-3 h-3 text-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">
              Future is here
            </span>
          </motion.div>

          <motion.h1 
            variants={slideIn("left", 0.4)}
            initial="hidden"
            animate="visible"
            className="text-6xl md:text-9xl font-black mb-6 tracking-tighter leading-[0.9]"
          >
            <TextType
              text={["Добро Пожаловать!", "Social.", "Твой мир."]}
              typingSpeed={80}
              showCursor
            />
          </motion.h1>

          <motion.p 
            variants={slideIn("right", 0.6)}
            initial="hidden"
            animate="visible"
            className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
          >
            Общайся, создавай и делись моментами в самом современном пространстве без границ.
          </motion.p>

          <motion.div 
            variants={slideIn("up", 0.8)}
            initial="hidden"
            animate="visible"
            className="flex justify-center"
          >
            <Link href="/auth/register">
              <GlassSurface 
                width={260} 
                height={74} 
                borderRadius={24} 
                blur={15} 
                backgroundOpacity={0.1} 
                className="border border-primary/30 shadow-2xl shadow-primary/10 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-center w-full h-full bg-primary/5">
                  <span className="text-xl font-black tracking-[0.2em] text-primary">НАЧАТЬ</span>
                </div>
              </GlassSurface>
            </Link>
          </motion.div>
        </div>
      </main>

      <footer className="absolute bottom-6 left-0 right-0 z-10 flex justify-center opacity-30">
        <div className="text-[10px] font-bold tracking-[0.6em] uppercase">
          © 2026 Social Platform
        </div>
      </footer>
    </div>
  );
}