"use client"
import { useState, useEffect } from "react"
import { io } from "socket.io-client"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { SidebarProvider } from "@/components/SidebarProvider"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bell } from "lucide-react"

interface EmailData {
  _id: string
  email: string
  createdAt: string
}

export default function NotificationsPage() {
  const [subscriptions, setSubscriptions] = useState<EmailData[]>([])

  useEffect(() => {
    fetchSubscriptions()
    
    const markAsRead = async () => {
      try {
        const token = localStorage.getItem("token")
        await fetch("http://localhost:8080/newsletter/markAsRead", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        })
        // Reset notification count to 0 after marking as read
        socket.emit("notifications_read")
      } catch (error) {
        console.error("Failed to mark as read:", error)
      }
    }
    
    markAsRead()

    const socket = io("http://localhost:8080")
    socket.on("emails_fetched", fetchSubscriptions)

    return () => {
      socket.disconnect()
    }
  }, [])

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8080/newsletter", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()

      if (Array.isArray(data.emailData)) {
        setSubscriptions(data.emailData)
      } else {
        setSubscriptions([])
      }
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error)
      setSubscriptions([])
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
                    <div className="flex items-center space-x-3">
                      <Bell className="h-6 w-6 text-primary" />
                      <CardTitle className="text-2xl font-bold">الاشعارات</CardTitle>
                    </div>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {subscriptions.length} مشتركين
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100">
                    {subscriptions.map((sub) => (
                      <div key={sub._id} className="flex items-start p-4 hover:bg-gray-50 transition-colors">
                        <div className="mr-4 flex-1">
                          <p className="font-medium text-gray-900">{sub.email}</p>
                          <span className="text-sm text-gray-500">
                            اشترك في: {new Date(sub.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                    {subscriptions.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <Bell className="h-12 w-12 mb-4 text-gray-300" />
                        <p>غير مقروءة</p>
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
