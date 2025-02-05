'use client';

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const formik = useFormik({
    initialValues: {
      code: ''
    },
    validationSchema: Yup.object({
      code: Yup.string()
        .matches(/^[0-9]{6}$/, 'يجب إدخال 6 أرقام')
        .required('الرمز مطلوب')
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // Handle verification logic here
        console.log(values);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  });

  const handleResendCode = async () => {
    if (!canResend) return;
    setIsLoading(true);
    try {
      // Handle resend code logic here
      setTimer(60);
      setCanResend(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            إعادة تعيين كلمة المرور
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            أدخل الرمز المكون من 6 أرقام الذي تم إرساله إلى بريدك الإلكتروني
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div>
            <input
              id="code"
              type="text"
              maxLength={6}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="أدخل الرمز"
              {...formik.getFieldProps('code')}
            />
            {formik.touched.code && formik.errors.code && (
              <div className="text-red-500 text-sm">{formik.errors.code}</div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? 'جاري التحقق...' : 'تحقق من الرمز'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={!canResend || isLoading}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {timer > 0 
                ? `إعادة إرسال الرمز بعد ${timer} ثانية` 
                : 'إعادة إرسال الرمز'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
