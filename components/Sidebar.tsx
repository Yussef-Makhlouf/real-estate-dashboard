"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, Building, FileQuestion, Star, BookOpen, 
  Send, TimerIcon, Users, Shield, LogOut, X, ChevronDown,
  Newspaper
} from "lucide-react"
import { useSidebar } from "./SidebarProvider"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const menuItems = [
  { name: "لوحة التحكم", icon: LayoutDashboard, href: "/" },
  { name: "العقارات", icon: Building, href: "/category" },
  { name: "الأسئلة الشائعة", icon: FileQuestion, href: "/faq" },
  { name: "آراء العملاء", icon: Star, href: "/reviews" },
  { name: "المدونة", icon: BookOpen, href: "/blog" },
  { name: "المشتركين", icon: Newspaper, href: "/subscribers" },
  { name: "المهتمين بالعقار", icon: Send, href: "/intersted" },
  { name: "الاستشارات المحجوزة", icon: TimerIcon, href: "/consultation" },
]

const userManagementItems = [
  { name: "الأدوار", icon: Shield, href: "/roles" },
  { name: "اضافة مستخدم", icon: Users, href: "/users" },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isOpen, toggle } = useSidebar()
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ token }),
      })

      if (response.ok) {
        localStorage.removeItem("token")
        document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        router.push("/login")
      }
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  return (
    <>
      <aside className={`
    
        fixed top-0 right-0 h-full w-72
        bg-[#20284DE5]
        text-white shadow-xl
        transition-transform duration-300 ease-out z-50
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}>
        <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
          <div className="p-6 border-b border-[#20284DE5]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src="/Group.svg"
                  alt="Company Logo"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
                <span className="text-lg font-semibold">تأسيس البناء</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggle}
                className="text-white hover:bg-[#AA9554] transition-colors"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul className="space-y-1.5">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-colors duration-200
                      ${pathname === item.href 
                        ? "bg-[#20284DE5] text-white" 
                        : "text-blue-100 hover:bg-[#AA9554] hover:text-white"}
                    `}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}

              <li className="mt-6 pt-6 border-t border-blue-800">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-lg
                    transition-colors duration-200
                    ${pathname.includes('/users') 
                      ? "bg-[#20284DE5] text-white" 
                      : "text-blue-100 hover:bg-[#AA9554] hover:text-white"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5" />
                    <span>إدارة المستخدمين</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserDropdownOpen && (
                  <ul className="mt-2 mr-4 space-y-1">
                    {userManagementItems.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`
                            flex items-center gap-3 px-4 py-2 rounded-lg
                            transition-colors duration-200
                            ${pathname === item.href 
                              ? "bg-[#AA9554] text-white" 
                              : "text-blue-100 hover:bg-[#AA9554] hover:text-white"}
                          `}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t border-[#20284DE5]">
            <button
              onClick={() => setShowLogoutDialog(true)}
              className="
                w-full flex items-center gap-3 px-4 py-3 rounded-lg
                text-red-300 hover:bg-red-900/20 hover:text-red-200
                transition-colors duration-200
              "
            >
              <LogOut className="h-5 w-5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تأكيد تسجيل الخروج</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في تسجيل الخروج؟
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              تسجيل الخروج
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300" 
          onClick={toggle}
        />
      )}
    </>
  )
}
