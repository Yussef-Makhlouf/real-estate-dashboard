"use client"

import { useReducer, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X, Loader2 } from "lucide-react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { TabComponent } from "@/components/ui/tab-component"
import { ImageUpload } from "@/components/ui/image-upload"
import { categorySchema } from "@/lib/schemas"
import { useRouter, useParams } from 'next/navigation'
import type { z } from "zod"
import toast, { Toaster } from 'react-hot-toast'

type FormData = z.infer<typeof categorySchema>

type State = {
  keywords: { ar: string[]; en: string[] }
  newKeyword: { ar: string; en: string }
  isLoading: { ar: boolean; en: boolean }
}

type Action =
  | { type: "SET_KEYWORDS"; lang: "ar" | "en"; value: string[] }
  | { type: "SET_NEW_KEYWORD"; lang: "ar" | "en"; value: string }
  | { type: "SET_LOADING"; lang: "ar" | "en"; value: boolean }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_KEYWORDS":
      return { ...state, keywords: { ...state.keywords, [action.lang]: action.value } }
    case "SET_NEW_KEYWORD":
      return { ...state, newKeyword: { ...state.newKeyword, [action.lang]: action.value } }
    case "SET_LOADING":
      return { ...state, isLoading: { ...state.isLoading, [action.lang]: action.value } }
    default:
      return state
  }
}

export default function EditProperty() {
  const [state, dispatch] = useReducer(reducer, {
    keywords: { ar: [], en: [] },
    newKeyword: { ar: "", en: "" },
    isLoading: { ar: false, en: false },
  })

  const router = useRouter()
  const params = useParams()

  const forms = {
    ar: useForm<FormData>({ resolver: zodResolver(categorySchema), defaultValues: { lang: "ar" } }),
    en: useForm<FormData>({ resolver: zodResolver(categorySchema), defaultValues: { lang: "en" } }),
  }

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/category/getOne/${params.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        const data = await response.json()

        if (data.property) {
          const propertyData = Array.isArray(data.property) ? data.property : [data.property]

          propertyData.forEach((property: any) => {
            if (property.lang === 'ar') {
              forms.ar.reset({
                title: property.title,
                location: property.location,
                area: property.area,
                description: property.description?.replace(/<[^>]*>/g, ''),
                coordinates: property.coordinates,
                image: property.Image.secure_url,
                lang: 'ar'
              })
              dispatch({
                type: "SET_KEYWORDS",
                lang: "ar",
                value: Array.isArray(property.Keywords) ? property.Keywords : property.Keywords?.split(',') || []
              })
            } else if (property.lang === 'en') {
              forms.en.reset({
                title: property.title,
                location: property.location,
                area: property.area,
                description: property.description?.replace(/<[^>]*>/g, ''),
                coordinates: property.coordinates,
                image: property.image,
                lang: 'en'
              })
              dispatch({
                type: "SET_KEYWORDS",
                lang: "en",
                value: Array.isArray(property.Keywords) ? property.Keywords : property.Keywords?.split(',') || []
              })
            }
          })
        }
      } catch (error) {
        console.error('Error fetching property:', error)
        toast.error("Error fetching property data")
      }
    }

    if (params.id) {
      fetchPropertyData()
    }
  }, [params.id])

  const onSubmit = async (data: FormData, lang: "ar" | "en") => {
    dispatch({ type: "SET_LOADING", lang, value: true })
    try {
      const formData = new FormData()
      formData.append("title", data.title.trim())
      formData.append("location", data.location.trim())
      formData.append("area", data.area.toString())
      formData.append("description", data.description.replace(/<[^>]*>/g, '').trim())
      formData.append("coordinates", JSON.stringify(data.coordinates))
      formData.append("lang", lang)
      if (data.image instanceof File) {
        formData.append("image", data.image)
      } else if (typeof data.image === "string" && data.image.startsWith("http")) {
        formData.append("imageUrl", data.image) // Send existing image URL
      }

      const response = await fetch(`http://localhost:8080/category/update/${params.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.message)

      toast.success(lang === "ar" ? "تم تحديث العقار بنجاح" : "Property updated successfully")
      router.push("/property")
    } catch (error) {
      toast.error(lang === "ar" ? "حدث خطأ أثناء التحديث" : "Error updating property")
    } finally {
      dispatch({ type: "SET_LOADING", lang, value: false })
    }
  }

  const renderForm = (lang: "ar" | "en") => (
    <form onSubmit={forms[lang].handleSubmit((data) => onSubmit(data, lang))} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">{lang === "ar" ? "العنوان (بالعربية)" : "Title (English)"}</label>
          <Input
            {...forms[lang].register("title")}
            dir={lang === "ar" ? "rtl" : "ltr"}
            className={forms[lang].formState.errors.title ? "border-red-500" : ""}
          />
          {forms[lang].formState.errors.title && (
            <p className="text-red-500 text-sm">{forms[lang].formState.errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            {lang === "ar" ? "الموقع (بالعربية)" : "Location (English)"}
          </label>
          <Input
            {...forms[lang].register("location")}
            dir={lang === "ar" ? "rtl" : "ltr"}
            className={forms[lang].formState.errors.location ? "border-red-500" : ""}
          />
          {forms[lang].formState.errors.location && (
            <p className="text-red-500 text-sm">{forms[lang].formState.errors.location.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            {lang === "ar" ? "المساحة (بالعربية)" : "Area (English)"}
          </label>
          <Input
            {...forms[lang].register("area", { valueAsNumber: true })}
            type="number"
            dir={lang === "ar" ? "rtl" : "ltr"}
          />
          {forms[lang].formState.errors.area && (
            <p className="text-red-500 text-sm">{forms[lang].formState.errors.area.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            {lang === "ar" ? "الوصف (بالعربية)" : "Description (English)"}
          </label>
          <RichTextEditor
            content={forms[lang].watch("description")?.replace(/<[^>]*>/g, '').replace(/ /g, ' ') || ""}
            onChange={(content) => {
              const plainText = content
                .replace(/<[^>]*>/g, '')
                .replace(/ /g, ' ')
                .replace(/\s+/g, ' ')
                .trim()

              forms[lang].setValue("description", plainText, {
                shouldValidate: true,
                shouldDirty: true
              })
            }}
            language={lang}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            {lang === "ar" ? "الكلمات المفتاحية (عربي)" : "Keywords (English)"}
          </label>
          <div className="flex gap-2">
            <Input
              value={state.newKeyword[lang]}
              onChange={(e) =>
                dispatch({ type: "SET_NEW_KEYWORD", lang, value: e.target.value })
              }
              placeholder={lang === "ar" ? "أضف كلمة مفتاحية" : "Add keyword"}
            />
            <Button
              type="button"
              variant="outline"
              className="text-sm px-4"
              onClick={() => {
                if (state.newKeyword[lang] && !state.keywords[lang].includes(state.newKeyword[lang])) {
                  dispatch({
                    type: "SET_KEYWORDS",
                    lang,
                    value: [...state.keywords[lang], state.newKeyword[lang]],
                  })
                  dispatch({ type: "SET_NEW_KEYWORD", lang, value: "" })
                }
              }}
            >
              {lang === "ar" ? "إضافة" : "Add"}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {state.keywords[lang].map((keyword, index) => (
              <span
                key={index}
                className="bg-primary text-primary-foreground px-2 py-1 rounded-md flex items-center gap-1"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => {
                    dispatch({
                      type: "SET_KEYWORDS",
                      lang,
                      value: state.keywords[lang].filter((_, i) => i !== index)
                    })
                  }}
                  className="hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            {lang === "ar" ? "صورة العقار" : "Property Image"}
          </label>
          <ImageUpload
            language={lang}
            onImagesChange={(images) => forms[lang].setValue("image", images[0])}
            initialImages={forms[lang].watch("Image")?.secure_url ||
              forms[lang].watch("image")?.secure_url ||
              forms[lang].watch("Image") ||
              forms[lang].watch("image") ||
              null}
            maxImages={1}
            existingImages={[]}
          />
        </div>

        <Button type="submit" disabled={state.isLoading[lang]} className="w-full">
          {state.isLoading[lang] ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {lang === "ar" ? "جاري الحفظ..." : "Saving..."}
            </>
          ) : (
            lang === "ar" ? "حفظ النسخة العربية" : "Save English Version"
          )}
        </Button>
      </div>
    </form>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>تعديل العقار</CardTitle>
          </CardHeader>
          <CardContent>
            <TabComponent
              arabicContent={renderForm("ar")}
              englishContent={renderForm("en")}
            />
          </CardContent>
        </Card>
      </main>
      <Toaster />
    </div>
  )
}