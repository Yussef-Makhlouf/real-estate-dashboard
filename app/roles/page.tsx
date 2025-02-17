"use client"
import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from "@/components/ui/button"
import { Search, Plus, UserPlus, Users, Shield, Settings, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { SidebarProvider } from "@/components/SidebarProvider"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

import toast, { Toaster } from 'react-hot-toast'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { userEditSchema } from "@/lib/schemas/user-schema"
import type { z } from "zod"
import { Select } from "@radix-ui/react-select"
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type UserEditSchema = z.infer<typeof userEditSchema>

interface User {
  phoneNumber: string | undefined
  _id: string
  firstName: string
  middleName: string
  lastName: string
  email: string
  phone: string
  role: "Admin" | "SuperAdmin"
}

function UsersListContent() {
    const router = useRouter();
  const [users, setUsers] = useState<User[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("")
  const [UserToDelete, setUserToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

 
  const [loading, setLoading] = useState(true);

  const form = useForm<UserEditSchema>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      phoneNumber: " ",
      role: 'Admin', 

    }
  })
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found!");
          return;
        }
  
        const response = await fetch("https://tasis-al-bina.onrender.com/auth/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
 
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
  
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


  useEffect(() => {

    fetchUsers();
  }, []);


  const handleDelete = (id: string) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    form.reset({
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      role: user.role,
      // email: user.email
    })
    setEditingUser(user)
    setEditDialogOpen(true)
  }
  
  const onSubmit = async (data: UserEditSchema) => {
    const loadingToast = toast.loading("جاري تحديث البيانات...")
    
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `https://tasis-al-bina.onrender.com/auth/update/${editingUser?._id}`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      fetchUsers()
      setEditDialogOpen(false)
      
      toast.dismiss(loadingToast)
      toast.success("تم تحديث البيانات بنجاح", {
        style: {
          direction: 'rtl'
        }
      })
  
    } catch (error) {
      toast.dismiss(loadingToast)
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("يرجى تسجيل الدخول أولاً", {
            style: { direction: 'rtl' }
          })
          router.push('/login')
        }
        if (error.response?.status === 403) {
          toast.error("ليس لديك الصلاحية للتعديل", {
            style: { direction: 'rtl' }
          })
        }
      }
    }
  }
  
  const confirmDelete = async () => {
    if (UserToDelete) {
      const loadingToast = toast.loading("جاري حذف المستخدم...")
      
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`https://tasis-al-bina.onrender.com/auth/delete/${UserToDelete}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
  
        setUsers(users.filter(user => user._id !== UserToDelete))
        fetchUsers()
        
        toast.dismiss(loadingToast)
        toast.success("تم حذف المستخدم بنجاح", {
          style: { direction: 'rtl' }
        })
  
      } catch (error) {
        toast.dismiss(loadingToast)
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            toast.error("يرجى تسجيل الدخول أولاً", {
              style: { direction: 'rtl' }
            })
            router.push('/login')
          }
          if (error.response?.status === 403) {
            toast.error("ليس لديك الصلاحية للحذف", {
              style: { direction: 'rtl' }
            })
          }
        }
      } finally {
        setDeleteDialogOpen(false)
        setUserToDelete(null)
      }
    }
  }
  
  

  


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
                        {users.filter(u => u.role === "SuperAdmin").length}
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
                      <p className="text-lg font-semibold"> المديرين</p>
                      <h3 className="text-3xl font-bold mt-2">
                      {users.filter(u => u.role === "Admin").length}
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
      <Table className="w-full">
        <TableHeader>
          <TableRow className="bg-gray-50/80">
            <TableHead className="w-[35%] py-5 px-6 text-right font-bold text-gray-900">
              المستخدم
            </TableHead>
            <TableHead className="w-[30%] py-5 px-6 text-right font-bold text-gray-900 hidden lg:table-cell">
              البريد الإلكتروني
            </TableHead>
            <TableHead className="w-[15%] py-5 px-6 text-right font-bold text-gray-900 hidden md:table-cell">
              رقم الهاتف
            </TableHead>
            <TableHead className="w-[10%] py-5 px-6 text-right font-bold text-gray-900">
              نوع المستخدم
            </TableHead>
            <TableHead className="w-[10%] py-5 px-6 text-center font-bold text-gray-900">
              الإجراءات
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow 
              key={user._id} 
              className="border-b hover:bg-gray-50/50 transition-colors"
            >
              <TableCell className="py-4 px-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold text-lg">
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 text-base mb-0.5">
                      {`${user.firstName} ${user.middleName} ${user.lastName}`}
                    </p>
                    <p className="text-sm text-gray-500 lg:hidden truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4 px-6 hidden lg:table-cell text-gray-700">
                <div className="max-w-xs truncate">{user.email}</div>
              </TableCell>
              <TableCell className="py-4 px-6 hidden md:table-cell text-gray-700">
                <span className="font-medium">{user.phoneNumber}</span>
              </TableCell>
              <TableCell className="py-4 px-6">
                <span className={`
                  inline-flex px-3 py-1.5 rounded-full text-sm font-medium
                  ${user.role === 'Admin' 
                    ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20' 
                    : 'bg-green-50 text-green-700 ring-1 ring-green-600/20'}
                `}>
                  {user.role === 'Admin' ? 'مدير' : 'مشرف'}
                </span>
              </TableCell>
              <TableCell className="py-4 px-6">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-gray-50 font-medium h-9"
                    onClick={() => handleEdit(user)}
                  >
                    <Edit className="h-4 w-4 ml-1.5" />
                    <span className="hidden sm:inline">تعديل</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="hover:bg-red-600 font-medium h-9"
                    onClick={() => handleDelete(user._id)}
                  >
                    <Trash2 className="h-4 w-4 ml-1.5" />
                    <span className="hidden sm:inline">حذف</span>
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
<Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
  <DialogContent className="sm:max-w-[500px]">
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold text-primary">تعديل المستخدم</DialogTitle>
      <DialogDescription className="text-gray-500">
        قم بتعديل معلومات المستخدم. اضغط حفظ عند الانتهاء.
      </DialogDescription>
    </DialogHeader>

    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">الاسم الأول</Label>
          <Input 
            {...form.register("firstName")} 
            className="w-full border rounded-md"
            placeholder="أدخل الاسم الأول"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">الاسم الأوسط</Label>
          <Input 
            {...form.register("middleName")} 
            className="w-full border rounded-md"
            placeholder="أدخل الاسم الأوسط"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">الاسم الأخير</Label>
          <Input 
            {...form.register("lastName")} 
            className="w-full border rounded-md"
            placeholder="أدخل الاسم الأخير"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">رقم الهاتف</Label>
          <Input 
            {...form.register("phoneNumber")} 
            className="w-full border rounded-md"
            placeholder="أدخل رقم الهاتف"
            dir="ltr"
          />
        </div>

   

        <div className="space-y-2">
          <Label className="text-sm font-medium">نوع المستخدم</Label>
          <Select 
            onValueChange={(value: "Admin" | "SuperAdmin") => form.setValue("role", value)}
            defaultValue={form.getValues("role")}
          >
            <SelectTrigger  className="w-full">
              <SelectValue placeholder="اختر نوع المستخدم" />
            </SelectTrigger>
            <SelectContent>
              
              <SelectItem value="SuperAdmin">مشرف</SelectItem>
              <SelectItem value="Admin">مدير</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter className="flex justify-between items-center mt-6 pt-4 border-t">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => setEditDialogOpen(false)}
        >
          إلغاء
        </Button>
        <Button 
          type="submit"
          className="bg-primary hover:bg-primary/90"
        >
          حفظ التغييرات
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تأكيد الحذف</DialogTitle>
            </DialogHeader>
            <p>هل أنت متأكد من حذف هذا المستخدم؟</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>إلغاء</Button>
              <Button variant="destructive" onClick={confirmDelete}>حذف</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
          </div>
        </div>
      </main>
      <Toaster
  position="top-center"
  toastOptions={{
    duration: 3000,
    style: {
      background: '#333',
      color: '#fff',
      padding: '16px',
      fontSize: '16px'
    },
    success: {
      style: {
        background: '#10B981'
      }
    },
    error: {
      style: {
        background: '#EF4444'
      }
    },
    loading: {
      style: {
        background: '#3B82F6'
      }
    }
  }}
/>

    </div>
  )}

export default function UsersList() {
  return (
    <SidebarProvider>
      <UsersListContent />
    </SidebarProvider>
  )
}
