"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios'
import { Loader2, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)

  useState(() => {
    setMounted(true)
  })

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
          body: JSON.stringify(values),
        })

        const data = await response.json()

        if (response.ok) {
          document.cookie = `auth-token=${data.token}; path=/; secure; samesite=strict`
          localStorage.setItem('token', data.userUpdated.token)
          toast.success("تم تسجيل الدخول بنجاح!")
          router.push('/roles')
        } else {
          throw new Error(data.message || "فشل تسجيل الدخول")
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "حدث خطأ في تسجيل الدخول")
      } finally {
        setIsLoading(false)
      }
    }
  })
  const handleForgotPassword = async () => {
    if (!formik.values.email) {
      toast.error("يرجى إدخال البريد الإلكتروني أولاً")
      return
    }
  
    setIsLoading(true)
    try {
      await axios.post('http://localhost:8080/auth/sendEmail', {
        email: formik.values.email
      })
      
      toast.success('تم إرسال رابط إعادة تعيين كلمة المرور')
      router.push(`/reset-password?email=${encodeURIComponent(formik.values.email)}`)
    } catch (error) {
      toast.error('فشل في إرسال البريد الإلكتروني')
    } finally {
      setIsLoading(false)
    }
  }
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
        <Toaster position="top-center" reverseOrder={false} />
        <div className="w-full max-w-md p-6">
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <Image
                  src="/Group.svg"
                  alt="Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                مرحباً بك
              </h2>
              <p className="mt-2 text-gray-600">
                قم بتسجيل الدخول للوصول إلى لوحة التحكم
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      {...formik.getFieldProps('email')}
                      className={`
                        w-full px-4 py-3 pr-10 rounded-lg border
                        ${formik.touched.email && formik.errors.email 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:ring-primary focus:border-primary'}
                        transition-all duration-200
                      `}
                      placeholder="example@domain.com"
                    />
                    <Mail className="absolute top-3 right-3 h-5 w-5 text-gray-400" />
                  </div>
                  {formik.touched.email && formik.errors.email && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...formik.getFieldProps('password')}
                      className={`
                        w-full px-4 py-3 pr-10 rounded-lg border
                        ${formik.touched.password && formik.errors.password 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:ring-primary focus:border-primary'}
                        transition-all duration-200
                      `}
                      placeholder="••••••••"
                    />
                    <Lock className="absolute top-3 right-3 h-5 w-5 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-3 left-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`
                  w-full py-3 px-4 rounded-lg font-medium text-white
                  bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 
                  focus:ring-offset-2 focus:ring-primary
                  transition-all duration-200
                  flex items-center justify-center
                  ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}
                `}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    تسجيل الدخول
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    )  }
