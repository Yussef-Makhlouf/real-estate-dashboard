"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { TabComponent } from "@/components/ui/tab-component"
import { ImageUpload } from "@/components/ui/image-upload"
import { Star } from "lucide-react"
import { reviewSchema } from "@/lib/schemas"
import type { z } from "zod"

type FormData = z.infer<typeof reviewSchema>

export default function AddReview() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
    },
  })

  const rating = watch("rating")

  const onSubmit = (data: FormData) => {
    console.log("Form data:", data)
    // Here you would typically send the data to your backend
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>إضافة رأي جديد</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <TabComponent
                arabicContent={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">الاسم (بالعربية)</label>
                      <Input {...register("nameAr")} dir="rtl" className={errors.nameAr ? "border-red-500" : ""} />
                      {errors.nameAr && <p className="text-red-500 text-sm">{errors.nameAr.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">التعليق (بالعربية)</label>
                      <RichTextEditor
                        content={watch("commentAr") || ""}
                        onChange={(content) => setValue("commentAr", content)}
                        language="ar"
                      />
                      {errors.commentAr && <p className="text-red-500 text-sm">{errors.commentAr.message}</p>}
                    </div>
                  </div>
                }
                englishContent={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Name (English)</label>
                      <Input {...register("nameEn")} dir="ltr" className={errors.nameEn ? "border-red-500" : ""} />
                      {errors.nameEn && <p className="text-red-500 text-sm">{errors.nameEn.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Comment (English)</label>
                      <RichTextEditor
                        content={watch("commentEn") || ""}
                        onChange={(content) => setValue("commentEn", content)}
                        language="en"
                      />
                      {errors.commentEn && <p className="text-red-500 text-sm">{errors.commentEn.message}</p>}
                    </div>
                  </div>
                }
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium">التقييم</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setValue("rating", value)}
                      className={`p-1 ${rating >= value ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
                {errors.rating && <p className="text-red-500 text-sm">{errors.rating.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">صورة العميل</label>
                <ImageUpload onImagesChange={(images) => setValue("image", images[0])} maxImages={1} />
              </div>

              <Button type="submit">إضافة الرأي</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

