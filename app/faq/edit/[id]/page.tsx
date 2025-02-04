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
import { faqSchema } from "@/lib/schemas"
import type { z } from "zod"

type FormData = z.infer<typeof faqSchema>

// This would typically come from an API call
const mockFAQ = {
  id: 1,
  questionAr: "كيف يمكنني شراء عقار؟",
  questionEn: "How can I purchase a property?",
  answerAr:
    "يمكنك شراء عقار من خلال التواصل مع أحد وكلائنا المعتمدين. سيقومون بمساعدتك في العثور على العقار المناسب وإتمام عملية الشراء.",
  answerEn:
    "You can purchase a property by contacting one of our certified agents. They will assist you in finding the right property and completing the purchase process.",
  image: "/placeholder.svg?height=100&width=100",
  keywords: ["شراء", "عقار", "وكيل"],
}

export default function EditFAQ({ params }: { params: { id: string } }) {
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
    resolver: zodResolver(faqSchema),
    defaultValues: mockFAQ,
  })

  useEffect(() => {
    // Fetch FAQ data based on the ID
    // For now, we'll use the mock data
    setKeywords(mockFAQ.keywords)
    setValue("image", mockFAQ.image)
  }, [setValue]) // Removed params.id from dependencies

  const onSubmit = (data: FormData) => {
    console.log("Updated FAQ data:", data)
    // Here you would typically send the data to your backend
    router.push("/faq")
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
            <CardTitle>تعديل السؤال الشائع</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <TabComponent
                arabicContent={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">السؤال (بالعربية)</label>
                      <Input
                        {...register("questionAr")}
                        dir="rtl"
                        className={errors.questionAr ? "border-red-500" : ""}
                      />
                      {errors.questionAr && <p className="text-red-500 text-sm">{errors.questionAr.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">الإجابة (بالعربية)</label>
                      <RichTextEditor
                        content={watch("answerAr") || ""}
                        onChange={(content) => setValue("answerAr", content)}
                        language="ar"
                      />
                      {errors.answerAr && <p className="text-red-500 text-sm">{errors.answerAr.message}</p>}
                    </div>
                  </div>
                }
                englishContent={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Question (English)</label>
                      <Input
                        {...register("questionEn")}
                        dir="ltr"
                        className={errors.questionEn ? "border-red-500" : ""}
                      />
                      {errors.questionEn && <p className="text-red-500 text-sm">{errors.questionEn.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Answer (English)</label>
                      <RichTextEditor
                        content={watch("answerEn") || ""}
                        onChange={(content) => setValue("answerEn", content)}
                        language="en"
                      />
                      {errors.answerEn && <p className="text-red-500 text-sm">{errors.answerEn.message}</p>}
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
                <label className="block text-sm font-medium">صورة السؤال</label>
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

