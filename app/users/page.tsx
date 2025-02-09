"use client";

import axios, { AxiosError } from "axios";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { z } from "zod";
type UserFormData = z.infer<typeof userSchema>;
import { SidebarProvider } from "@/components/SidebarProvider";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "@/lib/schemas/user-schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

export default function UsersPage() {
  const [verificationSent, setVerificationSent] = useState(false);
  const [email, setEmail] = useState("");

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
  });

  const sendVerificationCode = async () => {
    try {
      await axios.post("http://localhost:8080/auth/sendEmailNew", { email });
      toast({ title: "تم إرسال رمز التحقق إلى بريدك الإلكتروني" });
      setVerificationSent(true);
    } catch (error) {
      const err = error as any; // Type assertion
      toast({ title: err.response?.data?.error || "فشل في إضافة المستخدم", variant: "destructive" });
    }
  };

  const onSubmit = async (data: any) => {
    try {
      console.log(data);
      
      console.log("ASDASDASD");
      
      await axios.post("http://localhost:8080/auth/add", data);
      toast({ title: "تم إنشاء المستخدم بنجاح" });
      form.reset();
    } catch (error) {
      const err = error as any; // Type assertion
      toast({ title: err.response?.data?.error || "فشل في إضافة المستخدم", variant: "destructive" });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Sidebar />
        <main className="pt-16 lg:pt-20 pr-0 lg:pr-64 w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 lg:space-y-8">
                <FormField control={form.control} name="firstName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم الأول</FormLabel>
                    <FormControl><Input type="text" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="middleName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم الأوسط</FormLabel>
                    <FormControl><Input type="text" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="lastName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم العائلة</FormLabel>
                    <FormControl><Input type="text" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} onChange={(e) => {
                        setEmail(e.target.value);
                        field.onChange(e);
                      }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف</FormLabel>
                    <FormControl><Input type="tel" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="role" render={({ field }) => (
                  <FormItem>
                    <FormLabel>الدور</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full p-2 border rounded-md">
                        <option value="SuperAdmin">مشرف</option>
                        <option value="Admin">مدير</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                {verificationSent && (
                  <FormField control={form.control} name="verificationCode" render={({ field }) => (
                    <FormItem>
                      <FormLabel>رمز التحقق</FormLabel>
                      <FormControl><Input type="text" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                )}
                {!verificationSent && <Button type="button" onClick={sendVerificationCode}>إرسال رمز التحقق</Button>}
                <Button type="submit">إضافة مستخدم</Button>
              </form>
            </Form>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}