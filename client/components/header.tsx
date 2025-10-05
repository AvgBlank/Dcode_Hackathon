"use client"

import type React from "react"
import { Bell, Search, Menu, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { LayoutDashboard, FolderGit2, BarChart3, ListTodo, Github } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

interface HeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

const notifications = [
  { id: 1, title: "New PR needs review", repo: "react-components", time: "5m ago", href: "/triage" },
  { id: 2, title: "Issue triaged successfully", repo: "vue-utils", time: "1h ago", href: "/repositories/vue-utils" },
  { id: 3, title: "Discussion reply received", repo: "next-starter", time: "2h ago", href: "/triage" },
  {
    id: 4,
    title: "PR approved and merged",
    repo: "react-components",
    time: "3h ago",
    href: "/repositories/react-components",
  },
]

const navigation = [
  { name: "Overview", href: "/overview", icon: LayoutDashboard },
  { name: "Repositories", href: "/repositories", icon: FolderGit2 },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Triage Center", href: "/triage", icon: ListTodo },
]

export function Header({ title, subtitle, actions }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <div className="border-b border-border bg-background sticky top-0 z-10">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-16 items-center gap-2 border-b border-border px-6">
                <Github className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold text-foreground">RepoDesk</span>
              </div>
              <nav className="flex-1 space-y-1 p-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-semibold text-foreground">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground hidden md:block">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative w-60 md:w-80 hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search repositories, issues..." className="pl-9 bg-secondary border-border" />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hidden sm:flex"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="px-3 py-2 border-b border-border">
                <h3 className="font-semibold text-sm">Notifications</h3>
              </div>
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} asChild>
                  <Link href={notification.href} className="cursor-pointer flex flex-col items-start py-3">
                    <div className="font-medium text-sm">{notification.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {notification.repo} • {notification.time}
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
              <div className="px-3 py-2 border-t border-border">
                <Link href="/notifications" className="text-xs text-primary hover:underline">
                  View all notifications
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {actions}
        </div>
      </div>
    </div>
  )
}
