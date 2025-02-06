// "use client";

// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Loader2, X } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { Header } from "@/components/Header";
// import { Sidebar } from "@/components/Sidebar";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { RichTextEditor } from "@/components/ui/rich-text-editor";
// import { TabComponent } from "@/components/ui/tab-component";
// import { ImageUpload } from "@/components/ui/image-upload";
// import { blogPostSchema } from "@/lib/schemas";
// import type { z } from "zod";

// type FormData = z.infer<typeof blogPostSchema>;
// export interface BlogPost {
//   _id: string;
//   title: string;
//   description: string;
//   Image: {
//     secure_url: string;
//   };
//   createdAt: string;
//   customId: string;
// }

// export default function EditBlogPost({ params }: { params: { id: string } }) {
//   const router = useRouter();
//   const [keywords, setKeywords] = useState<string[]>([]);
//   const [newKeyword, setNewKeyword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm<FormData>({
//     resolver: zodResolver(blogPostSchema),
//   });

//   useEffect(() => {
//     // Fetch existing blog data
//     const fetchBlogData = async () => {
//       try {
//         const response = await fetch(`http://localhost:8080/blog/findone/${params.id}`);
//         const data = await response.json();

//         // Set form values from API data
//         setValue("title", data.blog.title);
//         setValue("description", data.blog.description);
//         setKeywords(data.blog.Keywords || []);
//         setValue("image", data.blog.Image.secure_url);
//       } catch (error) {
//         console.error("Error fetching blog data:", error);
//       }
//     };

//     fetchBlogData();
//   }, [params.id, setValue]);

//   const onSubmit = async (data: FormData) => {
//     console.log("Form Data:", data); // Debugging: Log form data
//     console.log("Validation Errors:", errors); // Debugging: Log validation errors
//     setIsLoading(true);

//     try {
//         const formData = new FormData();
//         formData.append("title", data.title || "");
//         formData.append("description", data.description || "");

//         // Append keywords
//         keywords.forEach((keyword) => {
//             formData.append("Keywords", keyword);
//         });

//         // Append image if it's a File object
//         // Handle image upload
//     if (data.image instanceof File) {
//       formData.append("image", data.image)
//     }

//         // Make PUT request to update blog
//         const response = await fetch(`http://localhost:8080/blog/update/${params.id}`, {
//             method: "PUT",
//             body: formData,
//         });

//         console.log("Server Response Status:", response.status); // Debugging

//         if (!response.ok) {
//             throw new Error("Failed to update blog");
//         }

//         const result = await response.json();
//         console.log("Blog updated successfully:", result);

//         // Redirect to blog list page
//         setTimeout(() => {
//             router.push("/blog");
//             router.refresh();
//         }, 500);
//     } catch (error) {
//         console.error("Error updating blog:", error);
//     } finally {
//         setIsLoading(false);
//     }
// };
//   const addKeyword = () => {
//     if (newKeyword && !keywords.includes(newKeyword)) {
//       const updatedKeywords = [...keywords, newKeyword];
//       setKeywords(updatedKeywords);
//       setValue("Keywords", updatedKeywords); // Ensure this matches the schema key
//       setNewKeyword("");
//     }
//   };

//   const removeKeyword = (keywordToRemove: string) => {
//     const updatedKeywords = keywords.filter((k) => k !== keywordToRemove);
//     setKeywords(updatedKeywords);
//     setValue("Keywords", updatedKeywords); // Ensure this matches the schema key
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Header />
//       <Sidebar />
//       <main className="pt-16 px-4 sm:px-6 lg:px-8" dir="rtl">
//         <Card>
//           <CardHeader>
//             <CardTitle>تعديل المقال</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//               <TabComponent
//                 arabicContent={
//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium">العنوان (بالعربية)</label>
//                       <Input
//                         {...register("title")}
//                         dir="rtl"
//                         className={errors.title ? "border-red-500" : ""}
//                       />
//                       {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
//                     </div>
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium">المحتوى (بالعربية)</label>
//                       <RichTextEditor
//                         content={watch("description") || ""}
//                         onChange={(content) => setValue("description", content)}
//                         language="ar"
//                       />
//                       {errors.description && (
//                         <p className="text-red-500 text-sm">{errors.description.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 }
//                 englishContent={
//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium">Title (English)</label>
//                       <Input
//                         {...register("title")}
//                         dir="ltr"
//                         className={errors.title ? "border-red-500" : ""}
//                       />
//                       {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
//                     </div>
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium">Content (English)</label>
//                       <RichTextEditor
//                         content={watch("description") || ""}
//                         onChange={(content) => setValue("description", content)}
//                         language="en"
//                       />
//                       {errors.description && (
//                         <p className="text-red-500 text-sm">{errors.description.message}</p>
//                       )}
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
//                       <button
//                         type="button"
//                         onClick={() => removeKeyword(keyword)}
//                         className="hover:text-red-500"
//                       >
//                         <X className="h-4 w-4" />
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium">صورة المقال</label>
//                 <ImageUpload
//                   onImagesChange={(images) => setValue("image", images[0])}
//                   maxImages={1}
//                   initialImages={[watch("image") as string]}
//                 />
//               </div>

//                 <Button type="submit" disabled={isLoading} className="w-full">
//                 {isLoading ? (
//                   <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   جاري الحفظ...
//                   </>
//                 ) : (
//                   "حفظ التغييرات"
//                 )}
//                 </Button>

//             </form>
//           </CardContent>
//         </Card>
//       </main>
//     </div>
//   );
// }
"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, X } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { TabComponent } from "@/components/ui/tab-component"
import { ImageUpload } from "@/components/ui/image-upload"
import { blogPostSchema } from "@/lib/schemas"
import { useToast } from "@/components/ui/use-toast"
import type { z } from "zod"

type FormData = z.infer<typeof blogPostSchema>

export default function EditBlogPost() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [keywordsAr, setKeywordsAr] = useState<string[]>([])
  const [keywordsEn, setKeywordsEn] = useState<string[]>([])
  const [newKeywordAr, setNewKeywordAr] = useState("")
  const [newKeywordEn, setNewKeywordEn] = useState("")
  const [isLoadingAr, setIsLoadingAr] = useState(false)
  const [isLoadingEn, setIsLoadingEn] = useState(false)

  const {
    register: registerAr,
    handleSubmit: handleSubmitAr,
    setValue: setValueAr,
    watch: watchAr,
    formState: { errors: errorsAr },
  } = useForm<FormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: { lang: 'ar' }
  })

  const {
    register: registerEn,
    handleSubmit: handleSubmitEn,
    setValue: setValueEn,
    watch: watchEn,
    formState: { errors: errorsEn },
  } = useForm<FormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: { lang: 'en' }
  })

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/blog/findOne/${params.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        const data = await response.json()
  console.log(data)
        // Handle Arabic data
        if (data.blog.lang === 'ar') {
          setValueAr('title', data.blog.title)
          setValueAr('description', data.blog.description)
          setValueAr('image', data.blog.Image?.secure_url)
          setKeywordsAr(data.blog.Keywords || [])
        }
  
        // Handle English data
        if (data.blog.lang === 'en') {
          setValueEn('title', data.blog.title)
          setValueEn('description', data.blog.description)
          setValueEn('image', data.blog.Image?.secure_url)
          setKeywordsEn(data.blog.Keywords || [])
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "خطأ",
          description: "حدث خطأ أثناء جلب بيانات المقال"
        })
      }
    }
  
    fetchBlogData()
  }, [params.id, setValueAr, setValueEn, toast])
  

  const onSubmitArabic = async (data: FormData) => {
    setIsLoadingAr(true)
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('Keywords', JSON.stringify(keywordsAr))
      formData.append('lang', 'ar')
      
      if (data.image instanceof File) {
        formData.append('image', data.image)
      } else if (typeof data.image === 'string') {
        formData.append('imageUrl', data.image)
      }
  
      const response = await fetch(`http://localhost:8080/blog/update/${params.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      })
  
      const result = await response.json()
      if (!response.ok) throw new Error(result.message)
  
      toast({
        title: "تم التحديث",
        description: "تم تحديث النسخة العربية بنجاح"
      })
      
      router.push('/blog')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث النسخة العربية"
      })
    } finally {
      setIsLoadingAr(false)
    }
  }
  
  const onSubmitEnglish = async (data: FormData) => {
    setIsLoadingEn(true)
    try {
      const formData = new FormData()
      formData.append('title', data.title || '')
      formData.append('description', data.description || '')
      formData.append('lang', 'en')
      
      // Handle keywords as a string array
      keywordsEn.forEach(keyword => {
        formData.append('Keywords[]', keyword)
      })
      
      // Handle image upload
      if (data.image instanceof File) {
        formData.append('image', data.image)
      } else if (typeof data.image === 'string' && data.image) {
        formData.append('currentImage', data.image)
      }
  
      const response = await fetch(`http://localhost:8080/blog/update/${params.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      })
  
      const result = await response.json()
      console.log('Update response:', result)
  
      toast({
        title: "Success",
        description: "English version updated successfully"
      })
      
      router.push('/blog')
    } catch (error) {
      console.error('Update error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update English version"
      })
    } finally {
      setIsLoadingEn(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>تعديل المقال</CardTitle>
          </CardHeader>
          <CardContent>
            <TabComponent
              arabicContent={
                <form onSubmit={handleSubmitAr(onSubmitArabic)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">العنوان (بالعربية)</label>
                      <Input
                        {...registerAr("title")}
                        dir="rtl"
                        className={errorsAr.title ? "border-red-500" : ""}
                      />
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
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">الكلمات المفتاحية (عربي)</label>
                      <div className="flex gap-2">
                        <Input
                          value={newKeywordAr}
                          onChange={(e) => setNewKeywordAr(e.target.value)}
                          placeholder="أضف كلمة مفتاحية"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              if (newKeywordAr && !keywordsAr.includes(newKeywordAr)) {
                                setKeywordsAr([...keywordsAr, newKeywordAr])
                                setNewKeywordAr("")
                              }
                            }
                          }}
                        />
                        <Button 
                          type="button" 
                          onClick={() => {
                            if (newKeywordAr && !keywordsAr.includes(newKeywordAr)) {
                              setKeywordsAr([...keywordsAr, newKeywordAr])
                              setNewKeywordAr("")
                            }
                          }}
                        >
                          إضافة
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {keywordsAr.map((keyword) => (
                          <span
                            key={keyword}
                            className="bg-primary text-primary-foreground px-2 py-1 rounded-md flex items-center gap-1"
                          >
                            {keyword}
                            <button
                              type="button"
                              onClick={() => setKeywordsAr(keywordsAr.filter(k => k !== keyword))}
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
                      <ImageUpload
                        onImagesChange={(images) => setValueAr("image", images[0])}
                        maxImages={1}
                        initialImages={[watchAr("image") as string]}
                      />
                    </div>
                    <Button type="submit" disabled={isLoadingAr} className="w-full">
                      {isLoadingAr ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          جاري الحفظ...
                        </>
                      ) : (
                        "حفظ النسخة العربية"
                      )}
                    </Button>
                  </div>
                </form>
              }
              englishContent={
                <form onSubmit={handleSubmitEn(onSubmitEnglish)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Title (English)</label>
                      <Input
                        {...registerEn("title")}
                        dir="ltr"
                        className={errorsEn.title ? "border-red-500" : ""}
                      />
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
                      <label className="block text-sm font-medium">Keywords (English)</label>
                      <div className="flex gap-2">
                        <Input
                          value={newKeywordEn}
                          onChange={(e) => setNewKeywordEn(e.target.value)}
                          placeholder="Add keyword"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              if (newKeywordEn && !keywordsEn.includes(newKeywordEn)) {
                                setKeywordsEn([...keywordsEn, newKeywordEn])
                                setNewKeywordEn("")
                              }
                            }
                          }}
                        />
                        <Button 
                          type="button" 
                          onClick={() => {
                            if (newKeywordEn && !keywordsEn.includes(newKeywordEn)) {
                              setKeywordsEn([...keywordsEn, newKeywordEn])
                              setNewKeywordEn("")
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {keywordsEn.map((keyword) => (
                          <span
                            key={keyword}
                            className="bg-primary text-primary-foreground px-2 py-1 rounded-md flex items-center gap-1"
                          >
                            {keyword}
                            <button
                              type="button"
                              onClick={() => setKeywordsEn(keywordsEn.filter(k => k !== keyword))}
                              className="hover:text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Article Image</label>
                      <ImageUpload
                        onImagesChange={(images) => setValueEn("image", images[0])}
                        maxImages={1}
                        initialImages={[watchEn("image") as string]}
                      />
                    </div>
                    <Button type="submit" disabled={isLoadingEn} className="w-full">
                      {isLoadingEn ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save English Version"
                      )}
                    </Button>
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

// "use client"

// import { useState, useEffect } from "react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { X } from "lucide-react"
// import { useParams, useRouter } from "next/navigation"
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

// export default function EditBlogPost() {
//   const params = useParams()
//   const id = params.id

//   const router = useRouter()
//   const [Keywords, setKeywords] = useState<string[]>([])
//   const [newKeyword, setNewKeyword] = useState("")
//   const [activeTab, setActiveTab] = useState<'ar' | 'en'>('ar')

//   const {
//     register: registerAr,
//     handleSubmit: handleSubmitAr,
//     setValue: setValueAr,
//     watch: watchAr,
//     formState: { errors: errorsAr },
//   } = useForm<FormData>({
//     resolver: zodResolver(blogPostSchema),
//     defaultValues: {
//       lang: 'ar'
//     }
//   })

//   const {
//     register: registerEn,
//     handleSubmit: handleSubmitEn,
//     setValue: setValueEn,
//     watch: watchEn,
//     formState: { errors: errorsEn },
//   } = useForm<FormData>({
//     resolver: zodResolver(blogPostSchema),
//     defaultValues: {
//       lang: 'en'
//     }
//   })

//   // جلب بيانات المدونة الحالية
//   useEffect(() => {
//     const fetchBlogPost = async () => {
//       try {
//         const response = await fetch(`http://localhost:8080/blog/findOne/${id}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         })
//         const data = await response.json()

//         if (response.ok) {
//           // تعيين القيم الافتراضية للنموذج
//           setValueAr('title', data.title)
//           setValueAr('description', data.description)
//           setValueAr('image', data.image)
//           setKeywords(data.Keywords || [])

//           setValueEn('title', data.title)
//           setValueEn('description', data.description)
//           setValueEn('image', data.image)
//         }
//       } catch (error) {
//         console.error('Error fetching blog post:', error)
//       }
//     }

//     fetchBlogPost()
//   }, [id, setValueAr, setValueEn])

//   const onSubmitArabic = async (data: FormData) => {
//     try {
//       const formData = new FormData()
//       formData.append('title', data.title)
//       formData.append('description', data.description)
//       formData.append('Keywords', JSON.stringify(Keywords))
//       formData.append('lang', 'ar')
      
//       if (data.image instanceof File) {
//         formData.append('image', data.image)
//       }

//       const response = await fetch(`http://localhost:8080/blog/update/${id}`, {
//         method: 'PUT',
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         },
//         body: formData,
//       })

//       const result = await response.json()
//       if (response.ok) {
//         console.log('Arabic blog updated successfully:', result)
//         router.push('/blog') // إعادة التوجيه بعد التعديل
//       }
//     } catch (error) {
//       console.error('Error:', error)
//     }
//   }

//   const onSubmitEnglish = async (data: FormData) => {
//     try {
//       const formData = new FormData()
//       formData.append('title', data.title)
//       formData.append('description', data.description)
//       formData.append('Keywords', JSON.stringify(Keywords))
//       formData.append('lang', 'en')
      
//       if (data.image instanceof File) {
//         formData.append('image', data.image)
//       }

//       const response = await fetch(`http://localhost:8080/blog/update/${id}`, {
//         method: 'PUT',
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         },
//         body: formData,
//       })

//       const result = await response.json()
//       if (response.ok) {
//         console.log('English blog updated successfully:', result)
//         router.push('/blog') // إعادة التوجيه بعد التعديل
//       }
//     } catch (error) {
//       console.error('Error:', error)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Header />
//       <Sidebar />
//       <main className="pt-16 px-4 sm:px-6 lg:px-8">
//         <Card>
//           <CardHeader>
//             <CardTitle>تعديل المقال</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <TabComponent
//               arabicContent={
//                 <form onSubmit={handleSubmitAr(onSubmitArabic)} className="space-y-6">
//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium">العنوان (بالعربية)</label>
//                       <Input {...registerAr("title")} dir="rtl" />
//                       {errorsAr.title && <p className="text-red-500 text-sm">{errorsAr.title.message}</p>}
//                     </div>
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium">المحتوى (بالعربية)</label>
//                       <RichTextEditor
//                         content={watchAr("description") || ""}
//                         onChange={(content) => setValueAr("description", content)}
//                         language="ar"
//                       />
//                       {errorsAr.description && <p className="text-red-500 text-sm">{errorsAr.description.message}</p>}
//                     </div>
//                     <div className="mt-6 space-y-2">
//                       <label className="block text-sm font-medium">الكلمات المفتاحية</label>
//                       <div className="flex gap-2">
//                         <Input
//                           value={newKeyword}
//                           onChange={(e) => setNewKeyword(e.target.value)}
//                           placeholder="أضف كلمة مفتاحية"
//                         />
//                         <Button type="button" onClick={() => {
//                           if (newKeyword && !Keywords.includes(newKeyword)) {
//                             setKeywords([...Keywords, newKeyword])
//                             setNewKeyword("")
//                           }
//                         }}>
//                           إضافة
//                         </Button>
//                       </div>
//                       <div className="flex flex-wrap gap-2 mt-2">
//                         {Keywords.map((keyword) => (
//                           <span
//                             key={keyword}
//                             className="bg-primary text-primary-foreground px-2 py-1 rounded-md flex items-center gap-1"
//                           >
//                             {keyword}
//                             <button 
//                               type="button" 
//                               onClick={() => setKeywords(Keywords.filter(k => k !== keyword))}
//                               className="hover:text-red-500"
//                             >
//                               <X className="h-4 w-4" />
//                             </button>
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium">صورة المقال</label>
//                       <ImageUpload onImagesChange={(images) => setValueAr("image", images[0])} maxImages={1} />
//                     </div>
//                     <Button type="submit">تحديث المقال بالعربية</Button>
//                   </div>
//                 </form>
//               }
//               englishContent={
//                 <form onSubmit={handleSubmitEn(onSubmitEnglish)} className="space-y-6">
//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium">Title (English)</label>
//                       <Input {...registerEn("title")} dir="ltr" />
//                       {errorsEn.title && <p className="text-red-500 text-sm">{errorsEn.title.message}</p>}
//                     </div>
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium">Content (English)</label>
//                       <RichTextEditor
//                         content={watchEn("description") || ""}
//                         onChange={(content) => setValueEn("description", content)}
//                         language="en"
//                       />
//                       {errorsEn.description && <p className="text-red-500 text-sm">{errorsEn.description.message}</p>}
//                     </div>
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium">Article Image</label>
//                       <ImageUpload onImagesChange={(images) => setValueEn("image", images[0])} maxImages={1} />
//                     </div>
//                     <Button type="submit">Update in English</Button>
//                   </div>
//                 </form>
//               }
//             />
//           </CardContent>
//         </Card>
//       </main>
//     </div>
//   )
// }