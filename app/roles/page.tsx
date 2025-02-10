"use client"
import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Search, Plus, UserPlus, Users, Shield, Settings } from "lucide-react"
import Link from "next/link"
import { SidebarProvider } from "@/components/SidebarProvider"

interface User {
  _id: string
  firstName: string
  middleName: string
  lastName: string
  email: string
  phone: string
  role: "Admin" | "SuperAdmin"
}

function UsersListContent() {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found!");
          return;
        }
  
        const response = await fetch("http://localhost:8080/auth/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Fetched Users:", data);
  
        if (Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, []);
  


  const filteredUsers = users?.filter(user => 
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  ) || []

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <Sidebar />
      <main className="transition-all duration-300 ease-in-out pt-20 lg:pt-24 pr-0 lg:pr-64 w-full">
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">إدارة المستخدمين</h1>
                <p className="mt-1 text-gray-500">إدارة وعرض جميع المستخدمين في النظام</p>
              </div>
              <Link href="/users">
                <Button className="bg-primary hover:bg-primary/90">
                  <UserPlus className="ml-2 h-5 w-5" />
                  إضافة مستخدم جديد
                </Button>
              </Link>
            </div>

            <div className="grid gap-6 mb-8 md:grid-cols-3">
              <Card className="bg-blue-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold">إجمالي المستخدمين</p>
                      <h3 className="text-3xl font-bold mt-2">{users.length}</h3>
                    </div>
                    <Users className="h-12 w-12 opacity-80" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold">المشرفين</p>
                      <h3 className="text-3xl font-bold mt-2">
                        {users.filter(u => u.role === "Admin").length}
                      </h3>
                    </div>
                    <Shield className="h-12 w-12 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold">المستخدمين النشطين</p>
                      <h3 className="text-3xl font-bold mt-2">
                        {users.length}
                      </h3>
                    </div>
                    <Settings className="h-12 w-12 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader className="border-b border-gray-100 bg-white/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <Users className="ml-2 h-6 w-6 text-primary" />
                    قائمة المستخدمين
                  </CardTitle>
                  <div className="relative w-full sm:w-96">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="البحث عن مستخدم..."
                      className="pl-4 pr-10 h-11"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-bold">المستخدم</TableHead>
                        <TableHead className="font-bold hidden sm:table-cell">البريد الإلكتروني</TableHead>
                        <TableHead className="font-bold hidden md:table-cell">رقم الهاتف</TableHead>
                        <TableHead className="font-bold">نوع المستخدم</TableHead>
                        <TableHead className="font-bold">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user._id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-semibold">
                                  {user.firstName[0]}{user.lastName[0]}
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold">{`${user.firstName} ${user.lastName}`}</p>
                                <p className="text-sm text-gray-500 sm:hidden">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                          <TableCell className="hidden md:table-cell">{user.phone}</TableCell>
                          <TableCell>
                            <span className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                              user.role === 'Admin' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {user.role === 'Admin' ? 'مدير' : 'مشرف'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                تعديل
                              </Button>
                              <Button variant="destructive" size="sm">
                                حذف
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">لا يوجد مستخدمين</h3>
                      <p className="mt-2 text-gray-500">لم يتم العثور على أي مستخدمين يطابقون بحثك</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
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
