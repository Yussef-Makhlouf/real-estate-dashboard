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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { propertySchema } from "@/lib/schemas"
import type { z } from "zod"

type FormData = z.infer<typeof propertySchema>

const propertyTypes = [
  { value: "apartment", label: "شقة" },
  { value: "villa", label: "فيلا" },
  { value: "office", label: "مكتب" },
  { value: "land", label: "أرض" },
]

// This would typically come from an API call
const mockProperty = {
  id: 1,
  titleAr: "فيلا فاخرة مع حمام سباحة",
  titleEn: "Luxury Villa with Swimming Pool",
  descriptionAr: "فيلا رائعة مع حمام سباحة خاص وحديقة كبيرة",
  descriptionEn: "Amazing villa with private pool and large garden",
  type: "villa",
  location: "الرياض",
  price: 2500000,
  images: ["/placeholder.svg?height=200&width=300"],
  keywords: ["فيلا", "حمام سباحة", "فاخرة"],
}

export default function EditProperty({ params }: { params: { id: string } }) {
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
    resolver: zodResolver(propertySchema),
    defaultValues: mockProperty,
  })

  useEffect(() => {
    // Fetch property data based on the ID
    // For now, we'll use the mock data
    setKeywords(mockProperty.keywords)
    setValue("images", mockProperty.images)
  }, [setValue]) // Removed params.id from dependencies

  const onSubmit = (data: FormData) => {
    console.log("Updated property data:", data)
    // Here you would typically send the data to your backend
    router.push("/properties")
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
            <CardTitle>تعديل العقار</CardTitle>
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
                      <label className="block text-sm font-medium">الوصف (بالعربية)</label>
                      <RichTextEditor
                        content={watch("descriptionAr") || ""}
                        onChange={(content) => setValue("descriptionAr", content)}
                        language="ar"
                      />
                      {errors.descriptionAr && <p className="text-red-500 text-sm">{errors.descriptionAr.message}</p>}
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
                      <label className="block text-sm font-medium">Description (English)</label>
                      <RichTextEditor
                        content={watch("descriptionEn") || ""}
                        onChange={(content) => setValue("descriptionEn", content)}
                        language="en"
                      />
                      {errors.descriptionEn && <p className="text-red-500 text-sm">{errors.descriptionEn.message}</p>}
                    </div>
                  </div>
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">السعر</label>
                  <Input
                    {...register("price", { valueAsNumber: true })}
                    type="number"
                    className={errors.price ? "border-red-500" : ""}
                  />
                  {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">الموقع</label>
                  <Input {...register("location")} className={errors.location ? "border-red-500" : ""} />
                  {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">نوع العقار</label>
                  <Select onValueChange={(value) => setValue("type", value)} defaultValue={watch("type")}>
                    <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                      <SelectValue placeholder="اختر نوع العقار" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
                </div>
              </div>

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
                <label className="block text-sm font-medium">صور العقار</label>
                <ImageUpload
                  onImagesChange={(images) => setValue("images", images)}
                  maxImages={5}
                  initialImages={watch("images") as string[]}
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

