/**
 * UI Components Index
 * 
 * Re-exports all UI components for convenient imports
 */

export { Button, type ButtonProps } from "./button";
export { Input, type InputProps } from "./input";
export { Textarea, type TextareaProps } from "./textarea";
export { Avatar, AvatarGroup, type AvatarProps } from "./avatar";
export { Badge, NotificationBadge, StatusBadge, type BadgeProps } from "./badge";
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  PostCard,
  ProfileCard,
  StatsCard,
} from "./card";
export {
  Skeleton,
  PostSkeleton,
  ProfileSkeleton,
  CommentSkeleton,
  FeedSkeleton,
} from "./skeleton";
export { ThemeToggle } from "./theme-toggle";
export { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem as DropdownItem,      // Переименовываем полное имя в короткое
  DropdownMenuLabel as DropdownLabel,    // Переименовываем
  DropdownMenuSeparator as DropdownSeparator, // Переименовываем
  DropdownMenuGroup,
  // ... другие экспорты, если они нужны
} from './dropdown-menu';
