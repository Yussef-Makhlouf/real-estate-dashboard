"use client"

import { Menu, Bell, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSidebar } from "./SidebarProvider"

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
        <Input
          type="search"
          placeholder="بحث..."
          className="max-w-sm mx-auto"
          startIcon={<Search className="h-4 w-4 text-gray-400" />}
        />
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-6 w-6" />
        </Button>
      </div>
    </header>
  )
}

