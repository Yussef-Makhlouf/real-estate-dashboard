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
// import { blogPostSchema } from "@/lib/schemas"
// import type { z } from "zod"

// type FormData = z.infer<typeof blogPostSchema>

// export default function AddBlogPost() {
//   const [Keywords, setKeywords] = useState<string[]>([])
//   const [newKeyword, setNewKeyword] = useState("")

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm<FormData>({
//     resolver: zodResolver(blogPostSchema),
//   })

//   const onSubmit = async (data: FormData) => {
//     try {
//       const formData = new FormData()
//       formData.append('title', data.title)
//       formData.append('description', data.description)
//       formData.append('Keywords', JSON.stringify(data.Keywords || []))

//         if (data.image instanceof File) {
//       formData.append("image", data.image)
//     }
     
//       const token = localStorage.getItem('token')
//       if (!token) {
//         throw new Error('No token found')
//       }
//       console.log(token)
//       const response = await fetch('http://localhost:8080/blog/create', {
//         method: 'POST',
//         body: formData,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })

//       const result = await response.json()
      
//       if (response.ok) {
//         // Handle success - you can add toast notification or redirect
//         console.log('Blog created successfully:', result)
//       } else {
//         // Handle error
//         console.error('Error creating blog:', result)
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error)
//     }
//   }

//   const addKeyword = () => {
//     if (newKeyword && !Keywords.includes(newKeyword)) {
//       const updatedKeywords = [...Keywords, newKeyword]
//       setKeywords(updatedKeywords)
//       setValue("Keywords", updatedKeywords)
//       setNewKeyword("")
//     }
//   }

//   const removeKeyword = (keywordToRemove: string) => {
//     const updatedKeywords = Keywords.filter((k) => k !== keywordToRemove)
//     setKeywords(updatedKeywords)
//     setValue("Keywords", updatedKeywords)
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Header />
//       <Sidebar />
//       <main className="pt-16 px-4 sm:px-6 lg:px-8">
//         <Card>
//           <CardHeader>
//             <CardTitle>إضافة مقال جديد</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//               <TabComponent
//                 arabicContent={
//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium">العنوان (بالعربية)</label>
//                       <Input {...register("title")} dir="rtl" className={errors.title ? "border-red-500" : ""} />
//                       {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
//                     </div>
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium">المحتوى (بالعربية)</label>
//                       <RichTextEditor
//                         content={watch("description") || ""}
//                         onChange={(content) => setValue("description", content)}
//                         language="ar"
//                       />
//                       {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
//                     </div>
//                   </div>
//                 }
//                 englishContent={
//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium">Title (English)</label>
//                       <Input {...register("title")} dir="ltr" className={errors.title ? "border-red-500" : ""} />
//                       {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
//                     </div>
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium">Content (English)</label>
//                       <RichTextEditor
//                         content={watch("description") || ""}
//                         onChange={(content) => setValue("description", content)}
//                         language="en"
//                       />
//                       {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
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
//                   {Keywords.map((keyword) => (
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
//                 <label className="block text-sm font-medium">صورة المقال</label>
//                 <ImageUpload onImagesChange={(images) => setValue("image", images[0])} maxImages={1} />
//               </div>

//               <Button type="submit">نشر المقال</Button>
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
import { ImageUpload } from "@/components/ui/image-upload"
import { blogPostSchema } from "@/lib/schemas"
import type { z } from "zod"

type FormData = z.infer<typeof blogPostSchema>

export default function AddBlogPost() {
  const [Keywords, setKeywords] = useState<string[]>([])
  const [newKeyword, setNewKeyword] = useState("")
  const [activeTab, setActiveTab] = useState<'ar' | 'en'>('ar')

  const {
    register: registerAr,
    handleSubmit: handleSubmitAr,
    setValue: setValueAr,
    watch: watchAr,
    formState: { errors: errorsAr },
  } = useForm<FormData>({
    resolver: zodResolver(blogPostSchema),
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
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      lang: 'en'
    }
  })

  const onSubmitArabic = async (data: FormData) => {
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('Keywords', JSON.stringify(Keywords))
      formData.append('lang', 'ar')
      
      if (data.image instanceof File) {
        formData.append('image', data.image)
      }
      const addKeyword = () => {
        if (newKeyword && !Keywords.includes(newKeyword)) {
          setKeywords([...Keywords, newKeyword])
          setNewKeyword('')
        }
      }
      
      const removeKeyword = (keywordToRemove: string) => {
        setKeywords(Keywords.filter(keyword => keyword !== keywordToRemove))
      }
      
console.log(formData)
      const response = await fetch('http://localhost:8080/blog/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      })

      const result = await response.json()
      if (response.ok) {
        console.log('Arabic blog created successfully:', result)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const onSubmitEnglish = async (data: FormData) => {
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('Keywords', JSON.stringify(Keywords))
      formData.append('lang', 'en')
      
      if (data.image instanceof File) {
        formData.append('image', data.image)
      }

      const response = await fetch('http://localhost:8080/blog/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      })

      const result = await response.json()
      if (response.ok) {
        console.log('English blog created successfully:', result)
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
            <CardTitle>إضافة مقال جديد</CardTitle>
          </CardHeader>
          <CardContent>
            <TabComponent
            
              arabicContent={
                <form onSubmit={handleSubmitAr(onSubmitArabic)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">العنوان (بالعربية)</label>
                      <Input {...registerAr("title")} dir="rtl" />
                      {errorsAr.title && <p className="text-red-500 text-sm">{errorsAr.title.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">المحتوى (بالعربية)</label>
                      <RichTextEditor
                        content={watchAr("description") || ""}
                        onChange={(content) => setValueAr("description", content)}
                        language="ar"
                      />
                      {errorsAr.description && <p className="text-red-500 text-sm">{errorsAr.description.message}</p>}
                    </div>
                                <div className="mt-6 space-y-2">
              <label className="block text-sm font-medium">الكلمات المفتاحية</label>
              <div className="flex gap-2">
                <Input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="أضف كلمة مفتاحية"
                />
                <Button type="button" onClick={() => {
                  if (newKeyword && !Keywords.includes(newKeyword)) {
                    setKeywords([...Keywords, newKeyword])
                    setNewKeyword("")
                  }
                }}>
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
                    <button 
                      type="button" 
                      onClick={() => setKeywords(Keywords.filter(k => k !== keyword))}
                      className="hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
              </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">صورة المقال</label>
                      <ImageUpload onImagesChange={(images) => setValueAr("image", images[0])} maxImages={1} />
                    </div>
                    <Button type="submit" >نشر المقال بالعربية</Button>
                  </div>
                </form>
              }
              englishContent={
                <form onSubmit={handleSubmitEn(onSubmitEnglish)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Title (English)</label>
                      <Input {...registerEn("title")} dir="ltr" />
                      {errorsEn.title && <p className="text-red-500 text-sm">{errorsEn.title.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Content (English)</label>
                      <RichTextEditor
                        content={watchEn("description") || ""}
                        onChange={(content) => setValueEn("description", content)}
                        language="en"
                      />
                      {errorsEn.description && <p className="text-red-500 text-sm">{errorsEn.description.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Article Image</label>
                      <ImageUpload onImagesChange={(images) => setValueEn("image", images[0])} maxImages={1} />
                    </div>
                    <Button type="submit">Publish in English</Button>
                  </div>
                </form>
              }
            />

          </CardContent>
        </Card>
      </main>
    </div>
  )
}
