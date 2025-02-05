"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { TabComponent } from "@/components/ui/tab-component"
import { ImageUpload } from "@/components/ui/image-upload"
import { blogPostSchema } from "@/lib/schemas"
import type { z } from "zod"

type FormData = z.infer<typeof blogPostSchema>

export default function AddBlogPost() {
  const [Keywords, setKeywords] = useState<string[]>([])
  const [newKeyword, setNewKeyword] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(blogPostSchema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('Keywords', JSON.stringify(data.Keywords || []))

        if (data.image instanceof File) {
      formData.append("image", data.image)
    }
     
      const response = await fetch('http://localhost:8080/blog/create', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      
      if (response.ok) {
        // Handle success - you can add toast notification or redirect
        console.log('Blog created successfully:', result)
      } else {
        // Handle error
        console.error('Error creating blog:', result)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const addKeyword = () => {
    if (newKeyword && !Keywords.includes(newKeyword)) {
      const updatedKeywords = [...Keywords, newKeyword]
      setKeywords(updatedKeywords)
      setValue("Keywords", updatedKeywords)
      setNewKeyword("")
    }
  }

  const removeKeyword = (keywordToRemove: string) => {
    const updatedKeywords = Keywords.filter((k) => k !== keywordToRemove)
    setKeywords(updatedKeywords)
    setValue("Keywords", updatedKeywords)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>إضافة مقال جديد</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <TabComponent
                arabicContent={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">العنوان (بالعربية)</label>
                      <Input {...register("title")} dir="rtl" className={errors.title ? "border-red-500" : ""} />
                      {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">المحتوى (بالعربية)</label>
                      <RichTextEditor
                        content={watch("description") || ""}
                        onChange={(content) => setValue("description", content)}
                        language="ar"
                      />
                      {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                    </div>
                  </div>
                }
                englishContent={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Title (English)</label>
                      <Input {...register("title")} dir="ltr" className={errors.title ? "border-red-500" : ""} />
                      {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Content (English)</label>
                      <RichTextEditor
                        content={watch("description") || ""}
                        onChange={(content) => setValue("description", content)}
                        language="en"
                      />
                      {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                    </div>
                  </div>
                }
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium">الكلمات المفتاحية</label>
                <div className="flex gap-2">
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="أضف كلمة مفتاحية"
                  />
                  <Button type="button" onClick={addKeyword}>
                    إضافة
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="bg-primary text-primary-foreground px-2 py-1 rounded-md flex items-center gap-1"
                    >
                      {keyword}
                      <button type="button" onClick={() => removeKeyword(keyword)} className="hover:text-red-500">
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">صورة المقال</label>
                <ImageUpload onImagesChange={(images) => setValue("image", images[0])} maxImages={1} />
              </div>

              <Button type="submit">نشر المقال</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

