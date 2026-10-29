"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { 
  LayoutDashboard, Award, 
  Wallet, ArrowDownToLine, Bell, User, Settings,
  LogOut, ChevronDown, X, Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Capabilities", href: "/capabilities", icon: Award },
  { name: "Earnings", href: "/earnings", icon: Wallet }, 
  { name: "Withdrawals", href: "/withdrawals", icon: ArrowDownToLine },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close the sidebar automatically when navigating to a new page
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const userName = session?.user?.name || "Loading...";
  const userEmail = session?.user?.email || "";
  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "U";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      
      {/* OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex-col border-r bg-white transition-transform duration-300 ease-in-out shrink-0",
          "md:static md:flex md:translate-x-0",
          isSidebarOpen ? "translate-x-0 flex" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between px-6 border-b">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              E
            </div>
            Evalia
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1 text-slate-500 hover:bg-slate-100 rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {sidebarItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-blue-700" : "text-slate-400")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col overflow-hidden w-full">
        
        {/* TOP BAR (Logo Left, Profile Right) */}
        <header className="flex h-14 items-center justify-between border-b bg-white px-4 md:px-6 shrink-0">
          
          <Link href="/" className="md:hidden flex items-center gap-2 font-bold text-lg text-slate-900">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white text-xs">E</div>
            Evalia
          </Link>
          
          {/* Desktop Welcome Text */}
          <div className="hidden md:flex items-center gap-2 whitespace-nowrap">
            <span className="text-sm text-slate-500 font-medium">Welcome back,</span>
            <span className="text-base font-extrabold text-slate-900 tracking-tight truncate max-w-[250px]">
              {userName}
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-4 ml-auto">
            <Link href="/notifications" className="relative rounded-full p-1.5 hover:bg-slate-100 transition-colors">
              <Bell className="h-5 w-5 text-slate-500" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
            </Link>

            <div className="flex">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border bg-slate-50 pl-1 pr-3 py-1 shadow-sm hover:bg-slate-100 transition-colors outline-none focus:ring-2 focus:ring-blue-100">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shrink-0">
                    {initials}
                  </div>
                  <span className="text-sm font-bold text-slate-900 whitespace-nowrap truncate max-w-[100px] lg:max-w-[150px] hidden sm:block">
                    {userName}
                  </span>
                  <ChevronDown className="h-3 w-3 text-slate-400 ml-1 shrink-0" />
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end" className="w-56 mt-1">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold text-slate-900 truncate">{userName}</p>
                        <p className="text-xs text-slate-500 truncate">{userEmail}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer p-0">
                      <Link href="/profile" className="w-full flex items-center gap-2 px-2 py-1.5">
                        <User className="h-4 w-4 text-slate-500" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer p-0">
                      <Link href="/settings" className="w-full flex items-center gap-2 px-2 py-1.5">
                        <Settings className="h-4 w-4 text-slate-500" /> Settings
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* MOBILE SUB-BAR (Hamburger + Welcome Text) */}
        <div className="md:hidden flex h-12 items-center px-4 border-b bg-slate-50/80 shrink-0 justify-between">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 -ml-1.5 rounded-md hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-xs text-slate-500 font-medium">Welcome back,</span>
            <span className="text-sm font-bold text-slate-900 truncate max-w-[120px]">
              {userName}
            </span>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-8">
          <div className="mx-auto w-full max-w-[1200px]">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}