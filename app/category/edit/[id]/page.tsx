"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { ImageUpload } from "@/components/ui/image-upload"
import { categorySchema } from "@/lib/schemas"
import { Loader2 } from "lucide-react"

import type { z } from "zod"
import toast, { Toaster } from 'react-hot-toast';

type FormData = z.infer<typeof categorySchema>

const isArabic = (text: string) => /[\u0600-\u06FF]/.test(text)
const isEnglish = (text: string) => /[a-zA-Z]/.test(text)

export default function EditProperty({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [language, setLanguage] = useState<"ar" | "en">("ar")

  const form = useForm<FormData>({
    resolver: zodResolver(categorySchema),
    mode: "onChange"
  })

  const { register, handleSubmit, setValue, watch, formState: { errors }, setError, clearErrors } = form

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`http://localhost:8080/category/getOne/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch category")
        
        const data = await response.json()
        
        if (data.category) {
          setLanguage(data.category.lang)
          setValue("title", data.category.title)
          setValue("location", data.category.location)
          setValue("area", data.category.area)
          setValue("description", data.category.description)
          setValue("coordinates", data.category.coordinates)

          if (data.category.Image) {
            const imageResponse = await fetch(data.category.Image.secure_url)
            const blob = await imageResponse.blob()
            const file = new File([blob], "image.jpg", { type: blob.type })
            setValue("image", file)
          }
        }
      }catch (error) {
        toast.error("Failed to load category data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategory()
  }, [params.id, setValue])

  const validateLanguage = (value: string, field: "title" | "description" | "location") => {
    if (language === "ar" && isEnglish(value)) {
      setError(field, {
        type: "manual",
        message: "يرجى الكتابة باللغة العربية فقط"
      })
      return false
    }
    if (language === "en" && isArabic(value)) {
      setError(field, {
        type: "manual",
        message: "Please type in English only"
      })
      return false
    }
    clearErrors(field)
    return true
  }

  const onSubmit = async (data: FormData) => {
    try {
      setIsSaving(true)
      const formData = new FormData()
      
      formData.append('title', data.title)
      formData.append('location', data.location)
      formData.append('area', data.area.toString())
      formData.append('description', data.description)
      formData.append('coordinates', JSON.stringify(data.coordinates))
      formData.append('lang', language)
      
      if (data.image) {
        formData.append('image', data.image)
      }
  
      const response = await fetch(`http://localhost:8080/category/update/${params.id}`, {
        method: 'PUT',
        body: formData
      })
  
      if (!response.ok) throw new Error("Failed to update category")
      
      toast.success(language === "ar" ? "تم تحديث العقار بنجاح" : "Property updated successfully")
      router.push("/category")
    } catch (error) {
      toast.error(language === "ar" ? "حدث خطأ أثناء التحديث" : "Error updating property")
    } finally {
      setIsSaving(false)
    }
  }
  

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const formContent = language === "ar" ? (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">العنوان</label>
          <Input 
            {...register("title")}
            className={errors.title ? "border-red-500" : ""} 
            onChange={(e) => {
              if (validateLanguage(e.target.value, "title")) {
                setValue("title", e.target.value)
              }
            }}
            dir="rtl"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">الموقع</label>
          <Input 
            {...register("location")}
            className={errors.location ? "border-red-500" : ""} 
            onChange={(e) => {
              if (validateLanguage(e.target.value, "location")) {
                setValue("location", e.target.value)
              }
            }}
            dir="rtl"
          />
          {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">المساحة</label>
          <Input {...register("area", { valueAsNumber: true })} type="number" dir="rtl" />
          {errors.area && <p className="text-red-500 text-sm">{errors.area.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">الوصف</label>
          <RichTextEditor
            content={watch("description")?.replace(/<[^>]*>/g, '') || ""}
            onChange={(content) => {
              const cleanContent = content.replace(/<[^>]*>/g, '')
              if (validateLanguage(cleanContent, "description")) {
                setValue("description", cleanContent)
              }
            }}
            language="ar"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">الصور</label>
          <ImageUpload
            onImagesChange={(files) => setValue("image", files[0])}
            maxImages={1}
            language="ar"
            existingImages={[]}
          />
        </div>
      </div>

      <Button type="submit" disabled={isSaving}>
        {isSaving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        حفظ التغييرات
      </Button>
    </form>
  ) : (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Title</label>
          <Input 
            {...register("title")}
            className={errors.title ? "border-red-500" : ""} 
            onChange={(e) => {
              if (validateLanguage(e.target.value, "title")) {
                setValue("title", e.target.value)
              }
            }}
            dir="ltr"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Location</label>
          <Input 
            {...register("location")}
            className={errors.location ? "border-red-500" : ""} 
            onChange={(e) => {
              if (validateLanguage(e.target.value, "location")) {
                setValue("location", e.target.value)
              }
            }}
            dir="ltr"
          />
          {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Area</label>
          <Input {...register("area", { valueAsNumber: true })} type="number" dir="ltr" />
          {errors.area && <p className="text-red-500 text-sm">{errors.area.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Description</label>
          <RichTextEditor
            content={watch("description")?.replace(/<[^>]*>/g, '') || ""}
            onChange={(content) => {
              const cleanContent = content.replace(/<[^>]*>/g, '')
              if (validateLanguage(cleanContent, "description")) {
                setValue("description", cleanContent)
              }
            }}
            language="en"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Images</label>
          <ImageUpload
            onImagesChange={(files) => setValue("image", files[0])}
            maxImages={1}
            language="en"
            existingImages={[]}
          />
        </div>
      </div>

      <Button type="submit" disabled={isSaving}>
        {isSaving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </form>
  )

  return (
    <div className="min-h-screen bg-gray-100">
       <Toaster position="top-center" />
      <Header />
      <Sidebar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8" dir={language === "ar" ? "rtl" : "ltr"}>
        <Card>
          <CardHeader>
            <CardTitle>{language === "ar" ? "تعديل العقار" : "Edit Property"}</CardTitle>
          </CardHeader>
          <CardContent>
            {formContent}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
