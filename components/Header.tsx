"use client"

import { Menu, Bell, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSidebar } from "./SidebarProvider"
import Link from "next/link"

export function Header() {
  const { toggle } = useSidebar()

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={toggle}>
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800 hidden md:block">لوحة تحكم العقارات</h1>
      </div>
      <div className="flex-1 mx-4 hidden md:block">
        <div className="relative max-w-sm mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="بحث..."
            className="pl-10"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">

 
<div className="flex items-center space-x-4">
<Link href="/notifications">
  <Button variant="ghost" size="icon">
    <Bell className="h-6 w-6" />
  </Button>
</Link>
  <Link href="/users/settings">
    <Button variant="ghost" size="icon" className="hover:bg-gray-100">
      <User className="h-6 w-6" />
      <span className="sr-only">إعدادات المستخدم</span>
    </Button>
  </Link>
</div>

      </div>
    </header>
  )
}

