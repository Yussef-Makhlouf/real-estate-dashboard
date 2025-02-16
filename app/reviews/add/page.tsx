"use client"
import { useRouter } from 'next/navigation'
import { useReducer } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Star, Loader2, Globe, Plus } from "lucide-react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { TabComponent } from "@/components/ui/tab-component"
import { ImageUpload } from "@/components/ui/image-upload"
import { reviewSchema } from "@/lib/schemas"
import toast, { Toaster } from 'react-hot-toast'

import type { z } from "zod"

type FormData = z.infer<typeof reviewSchema>

type State = {
  isLoading: { ar: boolean; en: boolean }
}

type Action = { type: "SET_LOADING"; lang: "ar" | "en"; value: boolean }

const Form = ({ lang, forms, onSubmit, state, dispatch }: {
  lang: "ar" | "en"
  forms: Record<"ar" | "en", ReturnType<typeof useForm<FormData>>>
  onSubmit: (data: FormData, lang: "ar" | "en") => Promise<void>
  state: State
  dispatch: React.Dispatch<Action>
}) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = forms[lang]
  const rate = watch("rate")

  return (
    <form dir={lang === "ar" ? "rtl" : "ltr"} onSubmit={handleSubmit((data) => onSubmit(data, lang))} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">{lang === "ar" ? "الاسم" : "Name"}</label>
          <Input {...register("name")} dir={lang === "ar" ? "rtl" : "ltr"} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">{lang === "ar" ? "البلد" : "Country"}</label>
          <Input {...register("country")} dir={lang === "ar" ? "rtl" : "ltr"} />
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
          <div className="flex items-center space-x-1">
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
          {errors.rate && <p className="text-red-500 text-sm">{errors.rate.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">{lang === "ar" ? "الصورة" : "Image"}</label>
          <ImageUpload
            onImagesChange={(images) => setValue("image", images[0])}
            maxImages={1}
            language={lang} existingImages={[]} />
        </div>

        <Button type="submit" disabled={state.isLoading[lang]} className="w-full">
          {state.isLoading[lang] ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {lang === "ar" ? "جاري الإضافة..." : "Adding..."}
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              {lang === "ar" ? "إضافة التقييم" : "Add Review"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: { ...state.isLoading, [action.lang]: action.value } }
    default:
      return state
  }
}

export default function AddReview() {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: { ar: false, en: false }
  })
  const router = useRouter()

  const formHandler = (lang: "ar" | "en") =>
    useForm<FormData>({
      resolver: zodResolver(reviewSchema),
      defaultValues: { lang }
    })

  const forms = { ar: formHandler("ar"), en: formHandler("en") }

  const onSubmit = async (data: FormData, lang: "ar" | "en") => {
    dispatch({ type: "SET_LOADING", lang, value: true })
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value)
        } else {
          formData.append(key, String(value))
        }
      })

      const token = localStorage.getItem("token")
      if (!token) throw new Error(lang === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first")

      const response = await fetch("http://localhost:8080/review/create", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })

      if (!response.ok) throw new Error(lang === "ar" ? "فشل في إضافة التقييم" : "Failed to add review")

      toast.success(lang === "ar" ? "تم إضافة التقييم بنجاح" : "Review added successfully")
      router.push("/reviews")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error occurred")
    } finally {
      dispatch({ type: "SET_LOADING", lang, value: false })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">إضافة تقييم جديد</CardTitle>
          </CardHeader>
          <CardContent>
            <TabComponent
              arabicContent={<Form lang="ar" forms={forms} onSubmit={onSubmit} state={state} dispatch={dispatch} />}
              englishContent={<Form lang="en" forms={forms} onSubmit={onSubmit} state={state} dispatch={dispatch} />}
            />
          </CardContent>
        </Card>
      </main>
      <Toaster />
    </div>
  )
}
