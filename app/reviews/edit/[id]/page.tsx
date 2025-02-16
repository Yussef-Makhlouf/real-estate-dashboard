"use client"
import { useRouter } from 'next/navigation'
import { useReducer, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Star, Loader2 } from "lucide-react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { ImageUpload } from "@/components/ui/image-upload"
import { reviewSchema } from "@/lib/schemas"
import toast, { Toaster } from 'react-hot-toast'
import type { z } from "zod"

type FormData = z.infer<typeof reviewSchema>

type State = {
  isLoading: { ar: boolean; en: boolean }
  currentLang: "ar" | "en" | null
}

type Action =
  | { type: "SET_LOADING"; lang: "ar" | "en"; value: boolean }
  | { type: "SET_LANGUAGE"; lang: "ar" | "en" }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: { ...state.isLoading, [action.lang]: action.value } }
    case "SET_LANGUAGE":
      return { ...state, currentLang: action.lang }
    default:
      return state
  }
}

const Form = ({ lang, form, onSubmit, state }: {
  lang: "ar" | "en"
  form: ReturnType<typeof useForm<FormData>>
  onSubmit: (data: FormData, lang: "ar" | "en") => Promise<void>
  state: State
}) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = form
  const rate = watch("rate")

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data, lang))}
      dir={lang === "ar" ? "rtl" : "ltr"} // ضبط اتجاه النموذج
      className="space-y-6"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">{lang === "ar" ? "الاسم" : "Name"}</label>
          <Input
            {...register("name")}
            className={errors.name ? "border-red-500" : ""}
            dir={lang === "ar" ? "rtl" : "ltr"} // ضبط اتجاه حقل الإدخال
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">{lang === "ar" ? "البلد" : "Country"}</label>
          <Input
            {...register("country")}
            className={errors.country ? "border-red-500" : ""}
            dir={lang === "ar" ? "rtl" : "ltr"} // ضبط اتجاه حقل الإدخال
          />
          {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">{lang === "ar" ? "التعليق" : "Comment"}</label>
          <RichTextEditor
            content={watch("description")?.replace(/<[^>]*>/g, '') || ""}
            onChange={(content) => setValue("description", content.replace(/<[^>]*>/g, ''))}
            language={lang}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">{lang === "ar" ? "التقييم" : "Rating"}</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setValue("rate", value)}
                className={`p-1 ${rate >= value ? "text-yellow-400" : "text-gray-300"}`}
              >
                <Star className="w-6 h-6 fill-current" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">{lang === "ar" ? "الصورة" : "Image"}</label>
          <ImageUpload
            language={lang}
            onImagesChange={(images) => form.setValue("image", images[0])}
            initialImages={[
              form.watch("Image")?.secure_url ||
              form.watch("image")?.secure_url ||
              form.watch("Image") ||
              form.watch("image")
            ].filter(Boolean)}
            maxImages={10} existingImages={[]} />
        </div>

        <Button
          type="submit"
          disabled={state.isLoading[lang]}
          className="w-full"
        >
          {state.isLoading[lang] ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {lang === "ar" ? "جاري التحديث..." : "Updating..."}
            </>
          ) : (
            lang === "ar" ? "تحديث المراجعة" : "Update Review"
          )}
        </Button>
      </div>
    </form>
  )
}

export default function EditReview({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, {
    isLoading: { ar: false, en: false },
    currentLang: null
  })

  const formAr = useForm<FormData>({ resolver: zodResolver(reviewSchema), defaultValues: { lang: 'ar' } })
  const formEn = useForm<FormData>({ resolver: zodResolver(reviewSchema), defaultValues: { lang: 'en' } })

  const fetchReview = async () => {
    const loadingToast = toast.loading('جاري تحميل البيانات...')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`https://tasis-al-bina.onrender.com/review/findOne/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Review not found')
      }

      const data = await response.json()

      if (!data.review) {
        throw new Error('Invalid review data')
      }

      const targetForm = data.review.lang === "ar" ? formAr : formEn
      targetForm.reset({
        lang: data.review.lang,
        name: data.review.name,
        country: data.review.country,
        description: data.review.description,
        rate: data.review.rate,
        image: data.review.Image?.secure_url
      })

      dispatch({ type: "SET_LANGUAGE", lang: data.review.lang })

      toast.success('تم تحميل البيانات بنجاح', { id: loadingToast })
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error('فشل في تحميل البيانات', { id: loadingToast })
      router.push('/reviews')
    }
  }

  useEffect(() => {
    fetchReview()
  }, [params.id])

  const onSubmit = async (data: FormData, lang: "ar" | "en") => {
    const loadingToast = toast.loading('جاري حفظ التغييرات...')
    dispatch({ type: "SET_LOADING", lang, value: true })

    try {
      const formData = new FormData()
      formData.append("lang", lang)
      formData.append("name", data.name)
      formData.append("country", data.country)
      formData.append("description", data.description)
      formData.append("rate", String(data.rate))

      if (data.image instanceof File) {
        formData.append("image", data.image)
      }

      const response = await fetch(`https://tasis-al-bina.onrender.com/review/update/${params.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData
      })

      if (!response.ok) throw new Error('Failed to update review')

      toast.success('تم تحديث المراجعة بنجاح', { id: loadingToast })
      setTimeout(() => router.push("/reviews"), 1500)
    } catch (error) {
      toast.error('فشل في تحديث المراجعة', { id: loadingToast })
      console.error('Update error:', error)
    } finally {
      dispatch({ type: "SET_LOADING", lang, value: false })
    }
  }

  if (!state.currentLang) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-secondary animate-spin"></div>
          </div>
          <div className="mt-4 text-center text-gray-600 font-medium">
            جاري التحميل...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle dir={state.currentLang === "ar" ? "rtl" : "ltr"}> {/* ضبط اتجاه العنوان */}
              {state.currentLang === "ar" ? "تعديل المراجعة" : "Edit Review"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {state.currentLang === "ar" ? (
              <Form lang="ar" form={formAr} onSubmit={onSubmit} state={state} />
            ) : (
              <Form lang="en" form={formEn} onSubmit={onSubmit} state={state} />
            )}
          </CardContent>
        </Card>
      </main>
      <Toaster position="top-center" />
    </div>
  )
}