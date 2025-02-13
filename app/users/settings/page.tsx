"use client"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { userEditSchema, userSchema } from "@/lib/schemas/user-schema"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { SidebarProvider } from "@/components/SidebarProvider"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { User, Phone, Mail, Shield, Calendar, MapPin, Building, Key } from "lucide-react"
import toast, { Toaster } from 'react-hot-toast'

export default function UserSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  const form = useForm({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      role: "",
      department: "",
      location: "",
      joinDate: "",
    },
  })

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      const response = await fetch(`http://localhost:8080/auth/getOne`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json()
      console.log(data);
      console.log(data.user);
      
      if (response.ok) {
        setUserData(data.user)
        form.reset({
          firstName: data.user.firstName,
          middleName: data.user.middleName,
          lastName: data.user.lastName,
          email: data.user.email,
          phoneNumber: data.user.phoneNumber,
          role: data.user.role,
          joinDate: data.user.createdAt,
        })
      } else {
        throw new Error(data.message || 'Failed to fetch user data')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const onSubmit = async (data:any) => {
    
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch("http://localhost:8080/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data),
      })
      
      console.log(data);
      
      if (!response.ok) throw new Error()
      toast.success("تم تحديث البيانات بنجاح")
    } catch (error) {
      toast.error("فشل في تحديث البيانات")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Header />
        <Sidebar />
        <main className="transition-all duration-300 ease-in-out pt-20 lg:pt-24 pr-0 lg:pr-64 w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-5xl mx-auto">
              {/* Profile Header Card */}
              <Card className="mb-8 overflow-hidden">
                <div className="relative h-32 bg-gradient-to-r from-primary/20 to-primary/10">
                  <div className="absolute -bottom-12 left-6">
                    <Avatar className="h-24 w-24 ring-4 ring-white">
                      <AvatarImage src={userData?.avatar} />
                      <AvatarFallback className="bg-primary text-2xl">
                        {userData?.firstName?.[0]}{userData?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <CardContent className="pt-16 pb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {userData?.firstName} {userData?.lastName}
                      </h1>
                      <div className="flex items-center mt-2 space-x-4 rtl:space-x-reverse text-gray-500">
                        <span className="flex items-center">
                          <Shield className="h-4 w-4 mr-1" />
                          {userData?.role}
                        </span>
                        <span className="flex items-center">
                          <Building className="h-4 w-4 mr-1" />
                          {userData?.department}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(userData?.joinDate).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" className="hover:bg-primary/5">
                      تغيير الصورة
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Main Settings Card */}
              <Card className="shadow-lg">
                <CardHeader className="space-y-1 pb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl font-bold">إعدادات الحساب</CardTitle>
                      <CardDescription>قم بتحديث معلومات حسابك الشخصي</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        حساب نشط
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      {/* Personal Information Section */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <User className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-semibold">المعلومات الشخصية</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>الاسم الأول</FormLabel>
                                <FormControl>
                                  <Input className="h-11" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="middleName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>الاسم الأوسط</FormLabel>
                                <FormControl>
                                  <Input className="h-11" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>الاسم الأخير</FormLabel>
                                <FormControl>
                                  <Input className="h-11" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Contact Information Section */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Mail className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-semibold">معلومات الاتصال</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>البريد الإلكتروني</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="email" 
                                    className="h-11 bg-gray-50" 
                                    {...field} 
                                    disabled 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>رقم الهاتف</FormLabel>
                                <FormControl>
                                  <Input 
                                    className="h-11" 
                                    {...field} 
                                    dir="ltr"
                                    placeholder="+966 5X XXX XXXX"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Work Information Section */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Building className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-semibold">معلومات العمل</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       
                          <FormField
                            control={form.control}
                            name="joinDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>تاريخ الانضمام</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="date" 
                                    className="h-11" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6">
                        <Button 
                          type="button" 
                          variant="outline"
                          className="min-w-[120px] h-11"
                        >
                          إلغاء
                        </Button>
                        <Button 
                          type="submit" 
                          className="min-w-[120px] h-11"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              جاري الحفظ...
                            </span>
                          ) : (
                            "حفظ التغييرات"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  )
}