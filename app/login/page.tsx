"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { useFormik } from 'formik'
import * as Yup from 'yup'

const validationSchema = Yup.object({
  email: Yup.string()
    .email('البريد الإلكتروني غير صالح')
    .required('البريد الإلكتروني مطلوب'),
  password: Yup.string()
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    .required('كلمة المرور مطلوبة')
})

export default function Login() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
    const formik = useFormik({
      initialValues: {
        email: '',
        password: '',
      },
      validationSchema,
      onSubmit: async (values) => {
        setIsLoading(true)
        try {
          const response = await fetch('http://localhost:8080/auth/signIn', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          })

          const data = await response.json()

          if (response.ok) {
            document.cookie = `auth-token=${data.token}; path=/`
            toast({
              title: "تم تسجيل الدخول بنجاح",
              description: "مرحباً بك في لوحة التحكم",
              variant: "default",
            })
            router.push('/')
          } else {
            toast({
              title: "خطأ في تسجيل الدخول",
              description: data.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة",
              variant: "destructive",
            })
          }
        } catch (error) {
          toast({
            title: "خطأ في الاتصال",
            description: "يرجى المحاولة مرة أخرى",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      },
    })
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-3 text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              مرحباً بك
            </CardTitle>
            <CardDescription className="text-gray-500">
              قم بتسجيل الدخول للوصول إلى لوحة التحكم
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="البريد الإلكتروني"
                    className={`pr-10 py-6 ${
                      formik.touched.email && formik.errors.email ? 'border-red-500' : ''
                    }`}
                    {...formik.getFieldProps('email')}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm"
                  >
                    {formik.errors.email}
                  </motion.div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="كلمة المرور"
                    className={`pr-10 py-6 ${
                      formik.touched.password && formik.errors.password ? 'border-red-500' : ''
                    }`}
                    {...formik.getFieldProps('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm"
                  >
                    {formik.errors.password}
                  </motion.div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link 
                  href="/reset-password" 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  هل نسيت كلمة المرور؟
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                    <span>جاري تسجيل الدخول...</span>
                  </div>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}