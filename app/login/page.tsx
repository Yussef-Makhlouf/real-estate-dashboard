"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Image from 'next/image'
import { toast } from "react-toastify"
import axios from 'axios'
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react'

export default function Login() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('البريد الإلكتروني غير صحيح')
        .required('البريد الإلكتروني مطلوب'),
      password: Yup.string()
        .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
        .required('كلمة المرور مطلوبة')
    }),
    onSubmit: async (values) => {
      setIsLoading(true)
      try {
        const response = await fetch('http://localhost:8080/auth/signIn', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        })

        const data = await response.json()

        if (response.ok) {
          document.cookie = `auth-token=${data.token}; path=/`
          localStorage.setItem('token', data.userUpdated.token)
          toast.success("تم تسجيل الدخول بنجاح!")
          setTimeout(() => {
            router.push('/roles')
          }, 1000)
        } else {
          toast.error("فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.")
        }
      } catch (error) {
        toast.error("حدث خطأ في تسجيل الدخول. يرجى المحاولة مرة أخرى.")
      } finally {
        setIsLoading(false)
      }
    }
  })

  async function handleForget(email: string) {
    if (!email) {
      toast.error("يرجى إدخال البريد الإلكتروني أولاً")
      return
    }

    try {
      await axios.post(
        'http://localhost:8080/auth/sendEmail',
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      toast.success("تم إرسال رابط استعادة كلمة المرور!")
      router.push(`/reset-password?email=${encodeURIComponent(email)}`)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "حدث خطأ في الخادم")
      } else {
        toast.error("حدث خطأ في الاتصال بالخادم")
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 space-y-8">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto">
              <Image
                src="/logo.svg"
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              تسجيل الدخول
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              أدخل بياناتك للوصول إلى لوحة التحكم
            </p>
          </div>

          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  البريد الإلكتروني
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`appearance-none block w-full pr-10 py-3 border ${
                      formik.touched.email && formik.errors.email 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-primary focus:border-primary'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm`}
                    placeholder="أدخل بريدك الإلكتروني"
                    {...formik.getFieldProps('email')}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  كلمة المرور
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className={`appearance-none block w-full pr-10 py-3 border ${
                      formik.touched.password && formik.errors.password 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-primary focus:border-primary'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm`}
                    placeholder="أدخل كلمة المرور"
                    {...formik.getFieldProps('password')}
                  />
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.password}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleForget(formik.values.email)}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  تسجيل الدخول
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
