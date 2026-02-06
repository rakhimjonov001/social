import { AdminNavbar } from "../../components/admin/admin-navbar";
import { AdminSidebar } from "../../components/admin/admin-sidebar";
import { getCurrentUser } from "../../actions";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Защита: если не админ — на главную
  if (!user || user.role !== "ADMIN") {
    redirect("/feed");
  }

  return (
    <div className="min-h-screen bg-background transition-colors">
      {/* Навбар сверху */}
      <AdminNavbar user={user} />
      
      <div className="flex">
        {/* Сайдбар слева */}
        <AdminSidebar />
        
        {/* Основной контент справа */}
        <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}