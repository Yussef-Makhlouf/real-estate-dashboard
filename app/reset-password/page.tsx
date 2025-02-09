"use client"

import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { Mail } from "lucide-react"
import Link from "next/link"

const validationSchema = Yup.object({
  email: Yup.string()
    .email("البريد الإلكتروني غير صالح")
    .required("البريد الإلكتروني مطلوب"),
})

export default function ResetPassword() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })

        if (response.ok) {
          toast({
            title: "تم إرسال رابط إعادة التعيين",
            description: "يرجى التحقق من بريدك الإلكتروني",
            variant: "default",
          })
        } else {
          toast({
            title: "حدث خطأ",
            description: "يرجى المحاولة مرة أخرى",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "خطأ في الاتصال",
          description: "يرجى المحاولة مرة أخرى لاحقاً",
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
              إعادة تعيين كلمة المرور
            </CardTitle>
            <CardDescription className="text-gray-500">
              أدخل بريدك الإلكتروني لإرسال رابط إعادة التعيين
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
                      formik.touched.email && formik.errors.email ? "border-red-500" : ""
                    }`}
                    {...formik.getFieldProps("email")}
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

              <Button
                type="submit"
                className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                    <span>جاري الإرسال...</span>
                  </div>
                ) : (
                  "إرسال رابط إعادة التعيين"
                )}
              </Button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                >
                  العودة إلى تسجيل الدخول
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
