
"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { userSchema } from "@/lib/schemas/user-schema"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import toast, { Toaster } from 'react-hot-toast'
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { SidebarProvider } from "@/components/SidebarProvider"
export default function UsersPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      role: "Admin",
      password: "",
      verificationCode: "",
    },
  })

  const generatePassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    const symbols = '@$!%*?&'

    let password = ''
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += uppercase[Math.floor(Math.random() * uppercase.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]
    password += symbols[Math.floor(Math.random() * symbols.length)]

    const allChars = lowercase + uppercase + numbers + symbols
    for (let i = password.length; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)]
    }

    password = password.split('').sort(() => Math.random() - 0.5).join('')
    form.setValue("password", password)
  }

  const sendVerificationCode = async () => {
    const email = form.getValues("email")
    if (!email) {
      toast.error("يرجى إدخال البريد الإلكتروني أولاً", {
        style: { direction: 'rtl' }
      })
      return
    }
  
    const loadingToast = toast.loading("جاري إرسال رمز التحقق...")
    setIsSendingCode(true)
  
    try {
      const response = await fetch("https://tasis-al-bina.onrender.com/auth/sendEmailNew", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
  
      if (!response.ok) throw new Error("فشل في إرسال رمز التحقق")
  
      toast.dismiss(loadingToast)
      toast.success("تم إرسال رمز التحقق إلى بريدك الإلكتروني", {
        style: { direction: 'rtl' }
      })
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("فشل في إرسال رمز التحقق", {
        style: { direction: 'rtl' }
      })
    } finally {
      setIsSendingCode(false)
    }
  }
  
  const onSubmit = async (data: any) => {
    const loadingToast = toast.loading("جاري إضافة المستخدم...")
    setIsLoading(true)
  
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("يرجى تسجيل الدخول أولاً", {
          style: { direction: 'rtl' }
        })
        return
      }
  
      const response = await fetch("https://tasis-al-bina.onrender.com/auth/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
  
      if (response?.status === 403) {
        toast.dismiss(loadingToast)
        toast.error("ليس لديك الصلاحية لإضافة مستخدم", {
          style: { direction: 'rtl' }
        })
        return
      }
  
      if (!response.ok) throw new Error("فشل في إضافة المستخدم")
  
      toast.dismiss(loadingToast)
      toast.success("تم إضافة المستخدم الجديد بنجاح", {
        style: { direction: 'rtl' }
      })
      form.reset()
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("فشل في إضافة المستخدم", {
        style: { direction: 'rtl' }
      })
    } finally {
      setIsLoading(false)
    }
  }
  

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Sidebar />
        <main className="transition-all duration-300 ease-in-out pt-16 lg:pt-20 pr-0 lg:pr-64 w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
            <Card className="w-full max-w-[95%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-4xl mx-auto">
              <CardHeader className="space-y-2 p-6 lg:p-8">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-center">
                  إضافة مستخدم جديد
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 lg:space-y-8">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }: { field: any }) => (
                          <FormItem className="flex flex-col space-y-2">
                            <FormLabel className="text-base sm:text-lg">الاسم الأول</FormLabel>
                            <FormControl>
                              <Input
                                className="h-10 sm:h-12 text-base sm:text-lg px-4"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-sm" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="middleName"
                        render={({ field }: { field: any }) => (
                          <FormItem className="flex flex-col space-y-2">
                            <FormLabel className="text-base sm:text-lg">الاسم الأوسط</FormLabel>
                            <FormControl>
                              <Input
                                className="h-10 sm:h-12 text-base sm:text-lg px-4"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-sm" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }: { field: any }) => (
                          <FormItem className="flex flex-col space-y-2">
                            <FormLabel className="text-base sm:text-lg">الاسم الأخير</FormLabel>
                            <FormControl>
                              <Input
                                className="h-10 sm:h-12 text-base sm:text-lg px-4"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-sm" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Contact Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }: { field: any }) => (
                          <FormItem className="flex flex-col space-y-2">
                            <FormLabel className="text-base sm:text-lg">البريد الإلكتروني</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }: { field: any }) => (
                          <FormItem className="flex flex-col space-y-2">
                            <FormLabel className="text-base sm:text-lg">رقم الهاتف</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+9665xxxxxxxx" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Role and Password Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }: { field: any }) => (
                          <FormItem className="flex flex-col space-y-2">
                            <FormLabel className="text-base sm:text-lg">نوع المستخدم</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر نوع المستخدم" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Admin">مدير</SelectItem>
                                <SelectItem value="SuperAdmin">مشرف</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }: { field: any }) => (
                          <FormItem className="flex flex-col space-y-2">
                            <FormLabel className="text-base sm:text-lg">كلمة المرور</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input type="text" {...field} />
                              </FormControl>
                              <Button type="button" variant="outline" onClick={generatePassword}>
                                توليد
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Verification Code Field */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                      <FormField
                        control={form.control}
                        name="verificationCode"
                        render={({ field }: { field: any }) => (
                          <FormItem className="flex flex-col space-y-2">
                            <FormLabel className="text-base sm:text-lg">رمز التحقق</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input type="text" {...field} />
                              </FormControl>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={sendVerificationCode}
                                disabled={isSendingCode}
                              >
                                {isSendingCode ? "جاري الإرسال..." : "إرسال الرمز"}
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "جاري الإضافة..." : "إضافة المستخدم"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
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
    </SidebarProvider>
  )
}
