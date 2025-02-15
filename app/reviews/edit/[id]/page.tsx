"use client"
import { useRouter } from 'next/navigation'
import { useReducer, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Star, Loader2 } from "lucide-react"
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

const Form = ({ lang, forms, onSubmit, state }: {
  lang: "ar" | "en"
  forms: Record<"ar" | "en", ReturnType<typeof useForm<FormData>>>
  onSubmit: (data: FormData, lang: "ar" | "en") => Promise<void>
  state: State
}) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = forms[lang]
  const rate = watch("rate")

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data, lang))} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">{lang === "ar" ? "الاسم" : "Name"}</label>
          <Input {...register("name")} className={errors.name ? "border-red-500" : ""} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">{lang === "ar" ? "البلد" : "Country"}</label>
          <Input {...register("country")} className={errors.country ? "border-red-500" : ""} />
          {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">{lang === "ar" ? "التعليق" : "Comment"}</label>
          <RichTextEditor
            // key={`${lang}-${watch("description")}`}
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
  onImagesChange={(images) => forms[lang].setValue("image", images[0])}
  initialImages={[
    forms[lang].watch("Image")?.secure_url ||
    forms[lang].watch("image")?.secure_url ||
    forms[lang].watch("Image") ||
    forms[lang].watch("image")
  ].filter(Boolean)}
  maxImages={10}
  existingImages={state.existingImages || []}
/>

        </div>

        <Button type="submit" disabled={state.isLoading[lang]}>
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
  const [state, dispatch] = useReducer((state: State, action: Action): State => {
    if (action.type === "SET_LOADING") {
      return { ...state, isLoading: { ...state.isLoading, [action.lang]: action.value } }
    }
    return state
  }, {
    isLoading: { ar: false, en: false }
  })

  const forms = {
    ar: useForm<FormData>({ resolver: zodResolver(reviewSchema), defaultValues: { lang: 'ar' } }),
    en: useForm<FormData>({ resolver: zodResolver(reviewSchema), defaultValues: { lang: 'en' } })
  }
  const fetchReview = async () => {
    const loadingToast = toast.loading('جاري تحميل البيانات...')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`http://localhost:8080/review/findOne/${params.id}`, {
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

      const targetForm = forms[data.review.lang as keyof typeof forms]
      if (targetForm) {
        targetForm.reset({
          lang: data.review.lang,
          name: data.review.name,
          country: data.review.country,
          description: data.review.description,
          rate: data.review.rate,
          image: data.review.Image?.secure_url
        })
      }

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

      const response = await fetch(`http://localhost:8080/review/update/${params.id}`, {
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>تعديل المراجعة</CardTitle>
          </CardHeader>
          <CardContent>
            <TabComponent
              arabicContent={<Form lang="ar" forms={forms} onSubmit={onSubmit} state={state} />}
              englishContent={<Form lang="en" forms={forms} onSubmit={onSubmit} state={state} />}
            />
          </CardContent>
        </Card>
      </main>
      <Toaster position="top-center" />
    </div>
  )
}
