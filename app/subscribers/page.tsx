"use client"
import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { SidebarProvider } from "@/components/SidebarProvider"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Subscriber {
  _id: string
  email: string
  createdAt: string
  isRead: boolean
}

function SubscribersContent() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])

  useEffect(() => {
    const fetchSubscribers = async () => {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8080/newsletter/all", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
    //   console.log(data);
      
      setSubscribers(data.emailData)
    }

    fetchSubscribers()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <Sidebar />
      <main className="transition-all duration-300 ease-in-out pt-20 lg:pt-24 pr-0 lg:pr-64 w-full">
        <div className="container mx-auto p-6">
          <Card className="shadow-lg">
            <CardHeader className="border-b border-gray-100 bg-white/50">
              <CardTitle className="text-2xl font-bold">المشتركين في النشرة البريدية</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead>تاريخ الاشتراك</TableHead>
                    <TableHead>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((subscriber) => (
                    <TableRow key={subscriber._id}>
                      <TableCell>{subscriber.email}</TableCell>
                      <TableCell>{new Date(subscriber.createdAt).toLocaleString('ar-SA')}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          subscriber.isRead ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {subscriber.isRead ? 'مقروء' : 'جديد'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function SubscribersPage() {
  return (
    <SidebarProvider>
      <SubscribersContent />
    </SidebarProvider>
  )
}
