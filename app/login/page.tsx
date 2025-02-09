'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import { toast } from "react-toastify";
import axios from 'axios';

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
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
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('token', data.userUpdated.token);
          toast.success("Login successful!");
          setTimeout(() => {
            router.push('/roles');
          }, 1000);
        } else {
          console.error('Login failed:', data.message);
          toast.error("Login failed. Please try again.");
        }
      } catch (error) {
        console.error('Login error:', error);
        toast.error("Login failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  });

  async function handleForget(email: string) {
    try {
      const response = await axios.post(
        'http://localhost:8080/auth/sendEmail',
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success("تم إرسال رابط استعادة كلمة المرور!");
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Server Error:", error.response?.data);
        toast.error(error.response?.data?.message || "حدث خطأ في الخادم");
      } else {
        console.error("Request Failed:", error);
        toast.error("حدث خطأ في الاتصال بالخادم");
      }
      throw error;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Image
            className="mx-auto h-12 w-auto"
            src="/logo.svg"
            alt="Logo"
            width={48}
            height={48}
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            تسجيل الدخول
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="البريد الإلكتروني"
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm">{formik.errors.email}</div>
              )}
            </div>
            <div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="كلمة المرور"
                {...formik.getFieldProps('password')}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm">{formik.errors.password}</div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <button 
                type="button" 
                onClick={() => handleForget(formik.values.email)} 
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                نسيت كلمة المرور؟
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? 'جاري التحميل...' : 'تسجيل الدخول'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}