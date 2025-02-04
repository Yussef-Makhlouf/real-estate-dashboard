"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
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

// This would typically come from an API call
const mockBlogPost = {
  id: 1,
  titleAr: "أفضل 10 مناطق للاستثمار العقاري",
  titleEn: "Top 10 Areas for Real Estate Investment",
  contentAr: "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى...",
  contentEn:
    "This is an example text that can be replaced in the same space. This text has been generated from the Arabic text generator...",
  image: "/placeholder.svg?height=200&width=300",
  keywords: ["استثمار", "عقارات", "مناطق"],
}

export default function EditBlogPost({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [keywords, setKeywords] = useState<string[]>([])
  const [newKeyword, setNewKeyword] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: mockBlogPost,
  })

  useEffect(() => {
    // Fetch blog post data based on the ID
    // For now, we'll use the mock data
    setKeywords(mockBlogPost.keywords)
    setValue("image", mockBlogPost.image)
  }, [setValue]) // Removed params.id from dependencies

  const onSubmit = (data: FormData) => {
    console.log("Updated blog post data:", data)
    // Here you would typically send the data to your backend
    router.push("/blog")
  }

  const addKeyword = () => {
    if (newKeyword && !keywords.includes(newKeyword)) {
      const updatedKeywords = [...keywords, newKeyword]
      setKeywords(updatedKeywords)
      setValue("keywords", updatedKeywords)
      setNewKeyword("")
    }
  }

  const removeKeyword = (keywordToRemove: string) => {
    const updatedKeywords = keywords.filter((k) => k !== keywordToRemove)
    setKeywords(updatedKeywords)
    setValue("keywords", updatedKeywords)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8" dir="rtl">
        <Card>
          <CardHeader>
            <CardTitle>تعديل المقال</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <TabComponent
                arabicContent={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">العنوان (بالعربية)</label>
                      <Input {...register("titleAr")} dir="rtl" className={errors.titleAr ? "border-red-500" : ""} />
                      {errors.titleAr && <p className="text-red-500 text-sm">{errors.titleAr.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">المحتوى (بالعربية)</label>
                      <RichTextEditor
                        content={watch("contentAr") || ""}
                        onChange={(content) => setValue("contentAr", content)}
                        language="ar"
                      />
                      {errors.contentAr && <p className="text-red-500 text-sm">{errors.contentAr.message}</p>}
                    </div>
                  </div>
                }
                englishContent={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Title (English)</label>
                      <Input {...register("titleEn")} dir="ltr" className={errors.titleEn ? "border-red-500" : ""} />
                      {errors.titleEn && <p className="text-red-500 text-sm">{errors.titleEn.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Content (English)</label>
                      <RichTextEditor
                        content={watch("contentEn") || ""}
                        onChange={(content) => setValue("contentEn", content)}
                        language="en"
                      />
                      {errors.contentEn && <p className="text-red-500 text-sm">{errors.contentEn.message}</p>}
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
                  {keywords.map((keyword) => (
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
                <ImageUpload
                  onImagesChange={(images) => setValue("image", images[0])}
                  maxImages={1}
                  initialImages={[watch("image") as string]}
                />
              </div>

              <Button type="submit">حفظ التغييرات</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

