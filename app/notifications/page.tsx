
"use client"
import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { SidebarProvider } from "@/components/SidebarProvider"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bell, Mail, Calendar, AlertCircle, CheckCircle2 } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success'
  date: string
  isRead: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]) // Initialize as empty array

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch("http://localhost:8080/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      // Ensure we're setting an array
      setNotifications(Array.isArray(data) ? data : data.notifications || [])
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
      setNotifications([]) // Set empty array on error
    }
  }
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Bell className="h-5 w-5 text-blue-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      default:
        return <Mail className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Header />
        <Sidebar />
        <main className="transition-all duration-300 ease-in-out pt-20 lg:pt-24 pr-0 lg:pr-64 w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-lg">
                <CardHeader className="border-b border-gray-100 bg-white/50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Bell className="h-6 w-6 text-primary" />
                      <CardTitle className="text-2xl font-bold">الإشعارات</CardTitle>
                    </div>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {notifications.filter(n => !n.isRead).length} غير مقروءة
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start p-4 hover:bg-gray-50 transition-colors ${
                          !notification.isRead ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex-shrink-0 pt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="mr-4 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <span className="text-sm text-gray-500">
                              {new Date(notification.date).toLocaleDateString('ar-SA', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="mt-1 text-gray-600">{notification.message}</p>
                        </div>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <Bell className="h-12 w-12 mb-4 text-gray-300" />
                        <p>لا توجد إشعارات جديدة</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
