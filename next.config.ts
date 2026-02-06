import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Позволяет production builds завершаться успешно даже при ESLint ошибках
    ignoreDuringBuilds: true,
  },
  
  images: {
    // ✅ Разрешаем рендеринг SVG с внешних ресурсов
    dangerouslyAllowSVG: true,
    // ✅ Рекомендуемая настройка для защиты (открывает изображения как вложения)
    contentDispositionType: 'attachment',
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**', // Добавил маску пути для надежности
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
    ],
  },
  
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          '**/node_modules',
          '**/.git',
          '**/.next',
          '**/C:/pagefile.sys',
          '**/C:/swapfile.sys',
          '**/C:/DumpStack.log.tmp',
          'C:\\pagefile.sys',
          'C:\\swapfile.sys',
          'C:\\DumpStack.log.tmp',
        ],
      };
    }
    return config;
  },
};

export default nextConfig;