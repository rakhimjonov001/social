"use client";

import { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, User, Crown, Search, Loader2, MoreVertical, Trash2, ShieldCheck } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Avatar, 
  Button, 
  Badge, 
  Input,
  DropdownMenu,
  DropdownMenuContent,
  DropdownItem,
  DropdownMenuTrigger,
  DropdownSeparator
} from "@/components/ui";
import { getAdminUsers, updateUserRole } from "@/actions/admin";
import { formatRelativeTime, cn } from "@/lib/utils";

export function UserManagement({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  // Реализация Debounce для поиска
  useEffect(() => {
    if (searchTerm === "") {
      setData(initialData);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      startTransition(async () => {
        try {
          const result = await getAdminUsers(1, 20, searchTerm);
          setData(result);
        } catch (error) {
          console.error("Search error:", error);
        }
      });
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, initialData]);

  const handleRoleUpdate = async (userId: string, newRole: 'USER' | 'ADMIN' | 'MODERATOR') => {
    setUpdating(userId);
    try {
      const result = await updateUserRole(userId, newRole);
      if (result.success) {
        setData((prev: any) => ({
          ...prev,
          users: prev.users.map((u: any) => u.id === userId ? { ...u, role: newRole } : u)
        }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border shadow-2xl overflow-hidden">
      <CardHeader className="border-b border-border bg-muted/30 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Registered Users</h2>
            <p className="text-sm text-muted-foreground">Manage permissions and account status</p>
          </div>
          
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-10 bg-background/50 border-border focus:ring-primary/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {isPending && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
                <th className="p-4 pl-6">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-right pr-6">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-foreground">
              <AnimatePresence mode="popLayout">
                {data.users.length === 0 ? (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td colSpan={4} className="p-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <User className="h-10 w-10 text-muted-foreground/20" />
                        <p className="text-muted-foreground font-medium">No users found matching your search</p>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  data.users.map((user: any) => (
                    <motion.tr
                      key={user.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-accent/30 transition-colors group"
                    >
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar src={user.image} name={user.name || user.username} className="h-10 w-10 border border-border" />
                            {user.role === 'ADMIN' && (
                              <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5 shadow-sm">
                                <Crown className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                              {user.name || user.username}
                            </span>
                            <span className="text-xs text-muted-foreground italic">@{user.username}</span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <Badge 
                          variant={user.role === 'ADMIN' ? 'destructive' : 'secondary'} 
                          className={cn(
                            "px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm",
                            user.role === 'ADMIN' ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-primary/10 text-primary border-primary/20"
                          )}
                        >
                          {user.role}
                        </Badge>
                      </td>

                      <td className="p-4 text-xs font-medium text-muted-foreground">
                        <span suppressHydrationWarning>
                          {formatRelativeTime(new Date(user.createdAt))}
                        </span>
                      </td>

                      <td className="p-4 text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
                              <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-xl border-border">
                            <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              Actions
                            </div>
                            <DropdownItem 
                              disabled={updating === user.id}
                              onClick={() => handleRoleUpdate(user.id, user.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                              className="cursor-pointer gap-2 focus:bg-primary focus:text-primary-foreground"
                            >
                              {updating === user.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <ShieldCheck className="h-4 w-4" />
                              )}
                              {user.role === 'ADMIN' ? "Revoke Admin" : "Promote to Admin"}
                            </DropdownItem>
                            
                            <DropdownSeparator className="bg-border" />
                            
                            <DropdownItem className="text-red-500 focus:bg-red-500 focus:text-white gap-2 cursor-pointer">
                              <Trash2 className="h-4 w-4" />
                              Suspend User
                            </DropdownItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}