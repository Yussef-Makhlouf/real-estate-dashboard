"use client"

import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { SidebarProvider } from "@/components/SidebarProvider"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { userSchema } from "@/lib/schemas/user-schema"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

export default function UsersPage() {
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "supervisor",
      password: "",
    },
  })

  const generatePassword = () => {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars[Math.floor(Math.random() * chars.length)]
    }
    form.setValue("password", password)
  }

  const onSubmit = (data) => {
    console.log(data)
    toast({
      title: "تم إنشاء المستخدم بنجاح",
      description: "تم إضافة المستخدم الجديد إلى النظام",
    })
    form.reset()
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Sidebar />
        <main className="transition-all duration-300 ease-in-out
          pt-16 lg:pt-20 
          pr-0 lg:pr-64 
          w-full">
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
                    {/* حقول الاسم */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
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
                        render={({ field }) => (
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
                        render={({ field }) => (
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

                    {/* حقول الاتصال */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="flex flex-col space-y-2">
                            <FormLabel className="text-base sm:text-lg">البريد الإلكتروني</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
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
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="flex flex-col space-y-2">
                            <FormLabel className="text-base sm:text-lg">رقم الهاتف</FormLabel>
                            <FormControl>
                              <Input 
                                type="tel" 
                                placeholder="05xxxxxxxx" 
                                className="h-10 sm:h-12 text-base sm:text-lg px-4" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-sm" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* حقول الدور وكلمة المرور */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem className="flex flex-col space-y-2">
                            <FormLabel className="text-base sm:text-lg">نوع المستخدم</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-10 sm:h-12 text-base sm:text-lg">
                                  <SelectValue placeholder="اختر نوع المستخدم" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="admin">مدير</SelectItem>
                                <SelectItem value="supervisor">مشرف</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-sm" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="flex flex-col space-y-2">
                            <FormLabel className="text-base sm:text-lg">كلمة المرور</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input 
                                  type="text" 
                                  className="h-10 sm:h-12 text-base sm:text-lg px-4" 
                                  {...field} 
                                />
                              </FormControl>
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={generatePassword}
                                className="h-10 sm:h-12 text-base sm:text-lg"
                              >
                                توليد
                              </Button>
                            </div>
                            <FormMessage className="text-sm" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-10 sm:h-12 text-base sm:text-lg mt-6 sm:mt-8"
                    >
                      إضافة المستخدم
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}


