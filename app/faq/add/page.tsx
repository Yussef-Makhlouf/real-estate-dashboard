// "use client"

// import { useState } from "react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { X } from "lucide-react"
// import { Header } from "@/components/Header"
// import { Sidebar } from "@/components/Sidebar"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { RichTextEditor } from "@/components/ui/rich-text-editor"
// import { TabComponent } from "@/components/ui/tab-component"
// import { ImageUpload } from "@/components/ui/image-upload"
// import { faqSchema } from "@/lib/schemas"
// import type { z } from "zod"

// type FormData = z.infer<typeof faqSchema>

// export default function AddFAQ() {
//   const [keywords, setKeywords] = useState<string[]>([])
//   const [newKeyword, setNewKeyword] = useState("")

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm<FormData>({
//     resolver: zodResolver(faqSchema),
//   })

//   const onSubmit = (data: FormData) => {
//     console.log("Form data:", data)
//     // Here you would typically send the data to your backend
//   }

//   const addKeyword = () => {
//     if (newKeyword && !keywords.includes(newKeyword)) {
//       const updatedKeywords = [...keywords, newKeyword]
//       setKeywords(updatedKeywords)
//       setValue("keywords", updatedKeywords)
//       setNewKeyword("")
//     }
//   }

//   const removeKeyword = (keywordToRemove: string) => {
//     const updatedKeywords = keywords.filter((k) => k !== keywordToRemove)
//     setKeywords(updatedKeywords)
//     setValue("keywords", updatedKeywords)
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Header />
//       <Sidebar />
//       <main className="pt-16 px-4 sm:px-6 lg:px-8">
//         <Card>
//           <CardHeader>
//             <CardTitle>إضافة سؤال جديد</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//               <TabComponent
//                 arabicContent={
//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium">السؤال (بالعربية)</label>
//                       <Input
//                         {...register("question")}
//                         dir="rtl"
//                         className={errors.question ? "border-red-500" : ""}
//                       />
//                       {errors.question && <p className="text-red-500 text-sm">{errors.question.message}</p>}
//                     </div>
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium">الإجابة (بالعربية)</label>
//                       <RichTextEditor
//                         content={watch("answer") || ""}
//                         onChange={(content) => setValue("answer", content)}
//                         language="ar"
//                       />
//                       {errors.answer && <p className="text-red-500 text-sm">{errors.answer.message}</p>}
//                     </div>
//                   </div>
//                 }
//                 englishContent={
//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium">Question (English)</label>
//                       <Input
//                         {...register("question")}
//                         dir="ltr"
//                         className={errors.question ? "border-red-500" : ""}
//                       />
//                       {errors.question && <p className="text-red-500 text-sm">{errors.question.message}</p>}
//                     </div>
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium">Answer (English)</label>
//                       <RichTextEditor
//                         content={watch("answer") || ""}
//                         onChange={(content) => setValue("answer", content)}
//                         language="en"
//                       />
//                       {errors.answer && <p className="text-red-500 text-sm">{errors.answer.message}</p>}
//                     </div>
//                   </div>
//                 }
//               />

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium">الكلمات المفتاحية</label>
//                 <div className="flex gap-2">
//                   <Input
//                     value={newKeyword}
//                     onChange={(e) => setNewKeyword(e.target.value)}
//                     placeholder="أضف كلمة مفتاحية"
//                   />
//                   <Button type="button" onClick={addKeyword}>
//                     إضافة
//                   </Button>
//                 </div>
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {keywords.map((keyword) => (
//                     <span
//                       key={keyword}
//                       className="bg-primary text-primary-foreground px-2 py-1 rounded-md flex items-center gap-1"
//                     >
//                       {keyword}
//                       <button type="button" onClick={() => removeKeyword(keyword)} className="hover:text-red-500">
//                         <X className="h-4 w-4" />
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium">صورة السؤال</label>
//                 {/* <ImageUpload onImagesChange={(images) => setValue("image", images[0])} maxImages={1} /> */}
//               </div>

//               <Button type="submit">إضافة السؤال</Button>
//             </form>
//           </CardContent>
//         </Card>
//       </main>
//     </div>
//   )
// }

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
import { faqSchema } from "@/lib/schemas"
import type { z } from "zod"

type FormData = z.infer<typeof faqSchema>

export default function AddFAQ() {
  const [keywords, setKeywords] = useState<string[]>([])
  const [newKeyword, setNewKeyword] = useState("")

  const {
    register: registerAr,
    handleSubmit: handleSubmitAr,
    setValue: setValueAr,
    watch: watchAr,
    formState: { errors: errorsAr },
  } = useForm<FormData>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      lang: 'ar'
    }
  })

  const {
    register: registerEn,
    handleSubmit: handleSubmitEn,
    setValue: setValueEn,
    watch: watchEn,
    formState: { errors: errorsEn },
  } = useForm<FormData>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      lang: 'en'
    }
  })

  const onSubmitArabic = async (data: FormData) => {
    try {
      const formData = new FormData()
      formData.append('question', data.question)
      formData.append('answer', data.answer)
      formData.append('keywords', JSON.stringify(keywords))
      formData.append('lang', 'ar')

      const response = await fetch('http://localhost:8080/question/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      })

      const result = await response.json()
      if (response.ok) {
        console.log('Arabic FAQ created successfully:', result)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const onSubmitEnglish = async (data: FormData) => {
    try {
      const formData = new FormData()
      formData.append('question', data.question)
      formData.append('answer', data.answer)
      formData.append('keywords', JSON.stringify(keywords))
      formData.append('lang', 'en')

      const response = await fetch('http://localhost:8080/question/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      })

      const result = await response.json()
      if (response.ok) {
        console.log('English FAQ created successfully:', result)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>إضافة سؤال جديد</CardTitle>
          </CardHeader>
          <CardContent>
            <TabComponent
              arabicContent={
                <form onSubmit={handleSubmitAr(onSubmitArabic)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">السؤال (بالعربية)</label>
                      <Input {...registerAr("question")} dir="rtl" />
                      {errorsAr.question && <p className="text-red-500 text-sm">{errorsAr.question.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">الإجابة (بالعربية)</label>
                      <RichTextEditor
                        content={watchAr("answer") || ""}
                        onChange={(content) => setValueAr("answer", content)}
                        language="ar"
                      />
                      {errorsAr.answer && <p className="text-red-500 text-sm">{errorsAr.answer.message}</p>}
                    </div>
                    <Button type="submit">نشر السؤال بالعربية</Button>
                  </div>
                </form>
              }
              englishContent={
                <form onSubmit={handleSubmitEn(onSubmitEnglish)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Question (English)</label>
                      <Input {...registerEn("question")} dir="ltr" />
                      {errorsEn.question && <p className="text-red-500 text-sm">{errorsEn.question.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Answer (English)</label>
                      <RichTextEditor
                        content={watchEn("answer") || ""}
                        onChange={(content) => setValueEn("answer", content)}
                        language="en"
                      />
                      {errorsEn.answer && <p className="text-red-500 text-sm">{errorsEn.answer.message}</p>}
                    </div>
                    <Button type="submit">Publish in English</Button>
                  </div>
                </form>
              }
            />

            <div className="mt-6 space-y-2">
              <label className="block text-sm font-medium">الكلمات المفتاحية</label>
              <div className="flex gap-2">
                <Input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="أضف كلمة مفتاحية"
                />
                <Button type="button" onClick={() => {
                  if (newKeyword && !keywords.includes(newKeyword)) {
                    setKeywords([...keywords, newKeyword])
                    setNewKeyword("")
                  }
                }}>
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
                    <button 
                      type="button" 
                      onClick={() => setKeywords(keywords.filter(k => k !== keyword))}
                      className="hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
