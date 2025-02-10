// 'use client';

// import { useState, useEffect } from 'react';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { useSearchParams } from 'next/navigation';
// import { toast } from 'react-toastify';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';

// export default function ResetPassword() {
//   const searchParams = useSearchParams();
//   const email = searchParams.get('email'); // استخراج البريد الإلكتروني من الاستعلام
//   const [isLoading, setIsLoading] = useState(false);
//   const [timer, setTimer] = useState(0);
//   const [canResend, setCanResend] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     if (timer > 0) {
//       const interval = setInterval(() => {
//         setTimer((prev) => prev - 1);
//       }, 1000);
//       return () => clearInterval(interval);
//     } else {
//       setCanResend(true);
//     }
//   }, [timer]);

//   const formik = useFormik({
//     initialValues: {
//       code: '',
//       newPassword: ''
//     },
//     validationSchema: Yup.object({
//       code: Yup.string()
//         .matches(/^[0-9]{6}$/, 'يجب إدخال 6 أرقام')
//         .required('الرمز مطلوب'),
//       newPassword: Yup.string()
//         .min(6, 'يجب أن تكون كلمة المرور 6 أحرف على الأقل')
//         .required('كلمة المرور مطلوبة')
//     }),
//     onSubmit: async (values) => {
//       setIsLoading(true);
//       try {
//         const response = await axios.post('http://localhost:8080/auth/reset/', {
//           verificationCode: values.code,
//           newPassword: values.newPassword,
//           email: email, // استخدم البريد الإلكتروني المستخرج
//         });
//         // عرض رسالة النجاح
//         toast.success(response.data.message);
//         router.push('/login');
//       } catch (error) {
//         if (axios.isAxiosError(error) && error.response) {
//           // عرض رسالة الخطأ
//           toast.error(error.response.data.error || 'حدث خطأ يرجى المحاولة مرة أخرى');
//         } else {
//           toast.error('حدث خطأ في الاتصال بالخادم');
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   });

//   const handleResendCode = async () => {
//     if (!canResend) return;
//     setIsLoading(true);
//     try {
//       // هنا يمكنك إضافة منطق إعادة إرسال الرمز
//       setTimer(60);
//       setCanResend(false);
//       toast.info('تم إرسال الرمز مرة أخرى إلى بريدك الإلكتروني.');
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             إعادة تعيين كلمة المرور
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             أدخل الرمز المكون من 6 أرقام الذي تم إرساله إلى بريدك الإلكتروني
//           </p>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
//           <div>
//             <input
//               id="code"
//               type="text"
//               maxLength={6}
//               className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               placeholder="أدخل الرمز"
//               {...formik.getFieldProps('code')}
//             />
//             {formik.touched.code && formik.errors.code && (
//               <div className="text-red-500 text-sm">{formik.errors.code}</div>
//             )}
//           </div>

//           <div>
//             <input
//               id="newPassword"
//               type="password"
//               className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               placeholder="أدخل كلمة المرور الجديدة"
//               {...formik.getFieldProps('newPassword')}
//             />
//             {formik.touched.newPassword && formik.errors.newPassword && (
//               <div className="text-red-500 text-sm">{formik.errors.newPassword}</div>
//             )}
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               {isLoading ? 'جاري التحقق...' : 'ارسل '}
//             </button>
//           </div>

//           <div className="text-center">
//             <button
//               type="button"
//               onClick={handleResendCode}
//               disabled={!canResend || isLoading}
//               className="font-medium text-indigo-600 hover:text-indigo-500"
//             >
//               {timer > 0 
//                 ? `إعادة إرسال الرمز بعد ${timer} ثانية` 
//                 : 'إعادة إرسال الرمز'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client"
import { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Loader2, Lock, KeyRound, ArrowRight, RefreshCw } from 'lucide-react'
import Image from 'next/image'

export default function ResetPassword() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [isLoading, setIsLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  const [canResend, setCanResend] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setCanResend(true)
    }
  }, [timer])

  const formik = useFormik({
    initialValues: {
      code: '',
      newPassword: ''
    },
    validationSchema: Yup.object({
      code: Yup.string()
        .matches(/^[0-9]{6}$/, 'يجب إدخال 6 أرقام')
        .required('الرمز مطلوب'),
      newPassword: Yup.string()
        .min(6, 'يجب أن تكون كلمة المرور 6 أحرف على الأقل')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
          'يجب أن تحتوي كلمة المرور على حروف كبيرة وصغيرة وأرقام ورموز خاصة'
        )
        .required('كلمة المرور مطلوبة')
    }),
    onSubmit: async (values) => {
      setIsLoading(true)
      try {
        const response = await axios.post('http://localhost:8080/auth/reset/', {
          verificationCode: values.code,
          newPassword: values.newPassword,
          email
        })
        toast.success('تم تغيير كلمة المرور بنجاح')
        router.push('/login')
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.error || 'حدث خطأ، يرجى المحاولة مرة أخرى')
        } else {
          toast.error('حدث خطأ في الاتصال بالخادم')
        }
      } finally {
        setIsLoading(false)
      }
    }
  })

  const handleResendCode = async () => {
    if (!canResend) return
    setIsLoading(true)
    try {
      await axios.post('http://localhost:8080/auth/sendEmail', { email })
      setTimer(60)
      setCanResend(false)
      toast.success('تم إرسال الرمز مرة أخرى')
    } catch (error) {
      toast.error('فشل في إرسال الرمز')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <div className="w-full max-w-md p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <Image
                src="/logo.svg"
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              إعادة تعيين كلمة المرور
            </h2>
            <p className="mt-2 text-gray-600">
              أدخل الرمز المرسل إلى بريدك الإلكتروني
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رمز التحقق
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    {...formik.getFieldProps('code')}
                    className={`
                      w-full px-4 py-3 pr-10 rounded-lg border text-center tracking-widest
                      ${formik.touched.code && formik.errors.code 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-primary focus:border-primary'}
                      transition-all duration-200
                    `}
                    placeholder="000000"
                  />
                  <KeyRound className="absolute top-3 right-3 h-5 w-5 text-gray-400" />
                </div>
                {formik.touched.code && formik.errors.code && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.code}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...formik.getFieldProps('newPassword')}
                    className={`
                      w-full px-4 py-3 pr-10 rounded-lg border
                      ${formik.touched.newPassword && formik.errors.newPassword 
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
                    className="absolute top-3 left-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? "إخفاء" : "إظهار"}
                  </button>
                </div>
                {formik.touched.newPassword && formik.errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.newPassword}</p>
                )}
              </div>
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
                  تغيير كلمة المرور
                  <ArrowRight className="mr-2 h-5 w-5" />
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={!canResend || isLoading}
                className={`
                  inline-flex items-center text-primary hover:text-primary/80
                  transition-colors duration-200
                  ${(!canResend || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${timer > 0 ? 'animate-spin' : ''}`} />
                {timer > 0 ? `إعادة الإرسال خلال ${timer} ثانية` : 'إعادة إرسال الرمز'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
