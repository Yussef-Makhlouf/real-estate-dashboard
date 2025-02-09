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
import { TabComponent } from "@/components/ui/tab-component"
import { ImageUpload } from "@/components/ui/image-upload"
import { reviewSchema } from "@/lib/schemas"
import { useToast } from "@/hooks/use-toast"
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
            content={watch("description") || ""}
            onChange={(content) => setValue("description", content)}
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
            language={lang}
          />
        </div>

        <Button type="submit" disabled={state.isLoading[lang]}>
          {state.isLoading[lang] ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {lang === "ar" ? "جاري التحديث..." : "Updating..."}
            </>
          ) : (
            lang === "ar" ? "تحديث الرأي" : "Update Review"
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

export default function EditReview({ params }: { params: { id: string } }) {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: { ar: false, en: false }
  })
  const { toast } = useToast()
  const router = useRouter()
  const [reviewData, setReviewData] = useState<any>(null)

  const formHandler = (lang: "ar" | "en") =>
    useForm<FormData>({
      resolver: zodResolver(reviewSchema),
      defaultValues: { 
        lang,
        name: reviewData?.name || '',
        country: reviewData?.country || '',
        description: reviewData?.description || '',
        rate: reviewData?.rate || 0,
      }
    })

  const [forms, setForms] = useState<Record<"ar" | "en", ReturnType<typeof useForm<FormData>>>>({
    ar: formHandler("ar"),
    en: formHandler("en")
  })
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`http://localhost:8080/review/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (!response.ok) throw new Error("Failed to fetch review")
        
        const review = await response.json()
        setReviewData(review)
        
        // تحديث النماذج بعد استلام البيانات مباشرة
        const arForm = formHandler("ar")
        const enForm = formHandler("en")
        
        arForm.reset({
          lang: 'ar',
          name: review.name,
          country: review.country,
          description: review.description,
          rate: Number(review.rate),
          image: review.image
        })
  
        enForm.reset({
          lang: 'en',
          name: review.name,
          country: review.country,
          description: review.description,
          rate: Number(review.rate),
          image: review.image
        })
  
        setForms({ ar: arForm, en: enForm })
  
      } catch (error) {
        console.error("Error fetching review:", error)
        toast({
          title: "Error",
          description: "Failed to load review data",
          variant: "destructive"
        })
      }
    }
  
    fetchReview()
  }, [params.id])
  

  const onSubmit = async (data: FormData, lang: "ar" | "en") => {
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

      const token = localStorage.getItem("token")
      if (!token) {
        toast({
          title: lang === "ar" ? "تنبيه" : "Alert",
          description: lang === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`http://localhost:8080/review/update/${params.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(lang === "ar" ? "فشل في تحديث المراجعة" : "Failed to update review")
      }

      toast({
        title: lang === "ar" ? "تم بنجاح" : "Success",
        description: lang === "ar" ? "تم تحديث المراجعة بنجاح" : "Review updated successfully"
      })

      router.push("/reviews")
    } catch (error) {
      toast({
        title: lang === "ar" ? "خطأ" : "Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      })
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
            <CardTitle>تعديل الرأي / Edit Review</CardTitle>
          </CardHeader>
          <CardContent>
            <TabComponent
              arabicContent={<Form lang="ar" forms={forms} onSubmit={onSubmit} state={state} dispatch={dispatch} />}
              englishContent={<Form lang="en" forms={forms} onSubmit={onSubmit} state={state} dispatch={dispatch} />}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
