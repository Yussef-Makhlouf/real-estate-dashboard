"use client"
import { useEffect, useState } from 'react'
import { Menu, Bell, User, Search, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSidebar } from "./SidebarProvider"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { io } from 'socket.io-client'

interface Subscription {
  _id: string
  email: string
  createdAt: string
}

interface InterestedUser {
  _id: string
  fullName: string
  phone: number
  email: string
  categoryId: {
    title: string
    Image: { secure_url: string }
    location: string
  }
  unitId: {
    title: string
    type: string
    price: number
    images: { secure_url: string }[]
    status: string
  }
}

export function Header() {
  const { toggle } = useSidebar()
  const [notifications, setNotifications] = useState(0)
  const [newInterests, setNewInterests] = useState(0)
  const [interestedUsers, setInterestedUsers] = useState<InterestedUser[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token")
      const [countResponse, subscriptionsResponse, interestedResponse] = await Promise.all([
        fetch("http://localhost:8080/newsletter/unread", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch("http://localhost:8080/newsletter", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch("http://localhost:8080/interested", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      const countData = await countResponse.json()
      const subsData = await subscriptionsResponse.json()
      const interestedData = await interestedResponse.json()

      setNotifications(countData.count)
      setSubscriptions(subsData.emailData || [])
      setInterestedUsers(interestedData.interested || [])
    } catch (error) {
      console.error("Failed to fetch data:", error)
    }
  }

  useEffect(() => {
    fetchData()

    const socket = io("http://localhost:8080")

    socket.on("new_intersted", () => {
      setNewInterests(prev => prev + 1)
      fetchData()
    })

    socket.on("intersted-featch", (data) => {
      setInterestedUsers(data)
    })

    socket.on("new_subscription", () => {
      fetchData()
    })

    socket.on("notifications_read", () => {
      
         setNotifications(0)
        setSubscriptions([])
      })

    socket.on("intersted_read", () => {

         setNewInterests(0)
        setInterestedUsers([])
     })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <header className="fixed top-0 right-0 left-0 bg-white border-b z-50">
      <div className="h-16 px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800 hidden md:block">
            لوحة تحكم العقارات
          </h1>
        </div>

        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="بحث..."
              className="w-full pr-10 pl-4 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
        <DropdownMenu onOpenChange={async (open) => {
          if (!open && (notifications > 0 || newInterests > 0)) {
            const token = localStorage.getItem("token")
            await fetch("http://localhost:8080/newsletter/markAsRead", {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` }
            }),
            await fetch("http://localhost:8080/interested/markAsRead", {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` }
            })
            setNotifications(0)
            setNewInterests(0)
          }
        }}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <div className="relative">
                <Bell className="h-5 w-5" />
                {(notifications > 0 || newInterests > 0) && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {notifications + newInterests}
                  </span>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>الإشعارات</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {subscriptions.map((sub) => (
              <DropdownMenuItem key={sub._id} className="p-4">
                <div className="flex flex-col gap-1">
                  <p className="font-medium">{sub.email}</p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(sub.createdAt).toLocaleString()}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
            {interestedUsers.map((user) => (
              <DropdownMenuItem key={user._id} className="p-4">
                <div className="flex flex-col gap-1">
                  <p className="font-medium">{user.fullName}</p>
                  <p className="text-sm">{user.email}</p>
                  <p className="text-sm">هاتف: {user.phone}</p>
                  <div className="text-xs text-muted-foreground">
                    <p>الفئة: {user.categoryId.title}</p>
                    <p>الوحدة: {user.unitId.title}</p>
                    <p>السعر: ${user.unitId.price}</p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
<DropdownMenuItem asChild>
      <Link href="/notifications" className="w-full text-center text-primary">
        عرض كل الإشعارات
      </Link>
    </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 transition-colors"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>حسابي</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>الملف الشخصي</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/users/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>الإعدادات</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 focus:text-red-600 flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>تسجيل الخروج</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        </header>
  )
}
