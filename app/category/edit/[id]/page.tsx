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
import type { z } from "zod"

type FormData = z.infer<typeof categorySchema>

export default function EditProperty({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [language, setLanguage] = useState<"ar" | "en">("ar")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>()

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`http://localhost:8080/category/getOne/${params.id}`)
        const data = await response.json()
        
        if (data.category) {
          setLanguage(data.category.lang)
          setValue("title", data.category.title)
          setValue("location", data.category.location)
          setValue("area", data.category.area)
          setValue("description", data.category.description)
          setValue("coordinates", data.category.coordinates)

          if (data.category.Image) {
            const response = await fetch(data.category.Image.secure_url)
            const blob = await response.blob()
            const file = new File([blob], "image.jpg", { type: blob.type })
            setValue("image", file)
          }
        }
      } catch (error) {
        console.error("Error fetching category:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategory()
  }, [params.id, setValue])

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch(`http://localhost:8080/category/update/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          location: data.location,
          area: data.area,
          description: data.description,
          coordinates: data.coordinates,
          lang: language
        })
      })

      if (response.ok) {
        router.push("/category")
      }
    } catch (error) {
      console.error("Error updating category:", error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  const formContent = language === "ar" ? (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">العنوان</label>
          <Input {...register("title")} className={errors.title ? "border-red-500" : ""} />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">الموقع</label>
          <Input {...register("location")} className={errors.location ? "border-red-500" : ""} />
          {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">المساحة</label>
          <Input {...register("area", { valueAsNumber: true })} type="number" />
          {errors.area && <p className="text-red-500 text-sm">{errors.area.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">الوصف</label>
          <RichTextEditor
            content={watch("description") || ""}
            onChange={(content) => setValue("description", content)}
            language="ar"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">الصور</label>
          <ImageUpload
            onImagesChange={(files) => setValue("image", files[0])}
            maxImages={1}
            language="ar" existingImages={[]}          />
        </div>
      </div>

      <Button type="submit">حفظ التغييرات</Button>
    </form>
  ) : (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Title</label>
          <Input {...register("title")} className={errors.title ? "border-red-500" : ""} />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Location</label>
          <Input {...register("location")} className={errors.location ? "border-red-500" : ""} />
          {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Area</label>
          <Input {...register("area", { valueAsNumber: true })} type="number" />
          {errors.area && <p className="text-red-500 text-sm">{errors.area.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Description</label>
          <RichTextEditor
            content={watch("description") || ""}
            onChange={(content) => setValue("description", content)}
            language="en"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Images</label>
          <ImageUpload
              onImagesChange={(files) => setValue("image", files[0])}
              maxImages={1}
              language="en" existingImages={[]}          />
        </div>
      </div>

      <Button type="submit">Save Changes</Button>
    </form>
  )

  return (
    <div className="min-h-screen bg-gray-100">
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