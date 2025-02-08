"use client"

import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"
import Link from "next/link"
import { SidebarProvider } from "@/components/SidebarProvider"

interface User {
  id: string
  firstName: string
  middleName: string
  lastName: string
  email: string
  phone: string
  role: "admin" | "supervisor"
}

function UsersListContent() {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = users.filter(user => 
    user.firstName.includes(searchQuery) ||
    user.email.includes(searchQuery) ||
    user.phone.includes(searchQuery)
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-20 lg:pr-64 px-4">
        <div className="container mx-auto p-2 sm:p-4 lg:p-6">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <CardTitle className="text-xl sm:text-2xl">قائمة المشرفين والمستخدمين</CardTitle>
              <Link href="/users">
                <Button className="w-full sm:w-auto">
                  <Plus className="ml-2 h-4 w-4" />
                  <span className="whitespace-nowrap">إضافة مستخدم جديد</span>
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    placeholder="بحث عن مستخدم..."
                    className="pr-10 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">الاسم الكامل</TableHead>
                      <TableHead className="whitespace-nowrap hidden sm:table-cell">البريد الإلكتروني</TableHead>
                      <TableHead className="whitespace-nowrap hidden md:table-cell">رقم الهاتف</TableHead>
                      <TableHead className="whitespace-nowrap">نوع المستخدم</TableHead>
                      <TableHead className="whitespace-nowrap">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {`${user.firstName} ${user.middleName} ${user.lastName}`}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                        <TableCell className="hidden md:table-cell">{user.phone}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-sm whitespace-nowrap ${
                            user.role === 'admin' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role === 'admin' ? 'مدير' : 'مشرف'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button variant="outline" size="sm" className="w-full sm:w-auto">
                              تعديل
                            </Button>
                            <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                              حذف
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function UsersList() {
  return (
    <SidebarProvider>
      <UsersListContent />
    </SidebarProvider>
  )
}
