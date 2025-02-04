"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Building, Users, FileQuestion, Star, BookOpen, LogOut, X } from "lucide-react"
import { useSidebar } from "./SidebarProvider"
import { Button } from "@/components/ui/button"

const menuItems = [
  { name: "لوحة التحكم", icon: Home, href: "/" },
  { name: "العقارات", icon: Building, href: "/properties" },
  { name: "الأدوار", icon: Users, href: "/roles" },
  { name: "الأسئلة الشائعة", icon: FileQuestion, href: "/faq" },
  { name: "آراء العملاء", icon: Star, href: "/reviews" },
  { name: "المدونة", icon: BookOpen, href: "/blog" },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen, toggle } = useSidebar()

  return (
    <>
      <aside
        className={`bg-gray-800 text-white w-64 min-h-screen p-4 fixed top-0 right-0 transition-all duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Button variant="ghost" size="icon" onClick={toggle} className="absolute left-4 top-4 text-white">
          <X className="h-6 w-6" />
        </Button>
        <nav className="mt-8">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 ${
                    pathname === item.href ? "bg-gray-700" : ""
                  }`}
                >
                  <item.icon className="h-5 w-5 ml-2" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-4 w-full left-0 px-4">
          <button className="flex items-center space-x-2 text-red-400 hover:text-red-300 w-full p-2 rounded-lg hover:bg-gray-700">
            <LogOut className="h-5 w-5 ml-2" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggle} />}
    </>
  )
}

