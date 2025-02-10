
// "use client"

// import { useState, useEffect } from "react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { Loader2, X } from "lucide-react"
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
// import { useToast } from "@/components/ui/use-toast"
// import type { z } from "zod"

// type FormData = z.infer<typeof blogPostSchema>

// export default function EditBlogPost() {
//   const params = useParams()
//   const router = useRouter()
//   const { toast } = useToast()
//   const [keywordsAr, setKeywordsAr] = useState<string[]>([])
//   const [keywordsEn, setKeywordsEn] = useState<string[]>([])
//   const [newKeywordAr, setNewKeywordAr] = useState("")
//   const [newKeywordEn, setNewKeywordEn] = useState("")
//   const [isLoadingAr, setIsLoadingAr] = useState(false)
//   const [isLoadingEn, setIsLoadingEn] = useState(false)

//   const {
//     register: registerAr,
//     handleSubmit: handleSubmitAr,
//     setValue: setValueAr,
//     watch: watchAr,
//     formState: { errors: errorsAr },
//   } = useForm<FormData>({
//     resolver: zodResolver(blogPostSchema),
//     defaultValues: { lang: 'ar' }
//   })

//   const {
//     register: registerEn,
//     handleSubmit: handleSubmitEn,
//     setValue: setValueEn,
//     watch: watchEn,
//     formState: { errors: errorsEn },
//   } = useForm<FormData>({
//     resolver: zodResolver(blogPostSchema),
//     defaultValues: { lang: 'en' }
//   })

//   useEffect(() => {
//     const fetchBlogData = async () => {
//       try {
//         const response = await fetch(`http://localhost:8080/blog/findOne/${params.id}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         })
//         const data = await response.json()
//   console.log(data)
//         // Handle Arabic data
//         if (data.blog.lang === 'ar') {
//           setValueAr('title', data.blog.title)
//           setValueAr('description', data.blog.description)
//           setValueAr('image', data.blog.Image?.secure_url)
//           setKeywordsAr(data.blog.Keywords || [])
//         }
  
//         // Handle English data
//         if (data.blog.lang === 'en') {
//           setValueEn('title', data.blog.title)
//           setValueEn('description', data.blog.description)
//           setValueEn('image', data.blog.Image?.secure_url)
//           setKeywordsEn(data.blog.Keywords || [])
//         }
//       } catch (error) {
//         toast({
//           variant: "destructive",
//           title: "خطأ",
//           description: "حدث خطأ أثناء جلب بيانات المقال"
//         })
//       }
//     }
  
//     fetchBlogData()
//   }, [params.id, setValueAr, setValueEn, toast])
  

//   const onSubmitArabic = async (data: FormData) => {
//     setIsLoadingAr(true)
//     try {
//       const formData = new FormData()
//       formData.append('title', data.title)
//       formData.append('description', data.description)
//       formData.append('Keywords', JSON.stringify(keywordsAr))
//       formData.append('lang', 'ar')
      
//       if (data.image instanceof File) {
//         formData.append('image', data.image)
//       } else if (typeof data.image === 'string') {
//         formData.append('imageUrl', data.image)
//       }
  
//       const response = await fetch(`http://localhost:8080/blog/update/${params.id}`, {
//         method: 'PUT',
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         },
//         body: formData,
//       })
  
//       const result = await response.json()
//       if (!response.ok) throw new Error(result.message)
  
//       toast({
//         title: "تم التحديث",
//         description: "تم تحديث النسخة العربية بنجاح"
//       })
      
//       router.push('/blog')
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "خطأ",
//         description: "حدث خطأ أثناء تحديث النسخة العربية"
//       })
//     } finally {
//       setIsLoadingAr(false)
//     }
//   }
  
//   const onSubmitEnglish = async (data: FormData) => {
//     setIsLoadingEn(true)
//     try {
//       const formData = new FormData()
//       formData.append('title', data.title || '')
//       formData.append('description', data.description || '')
//       formData.append('lang', 'en')
      
//       // Handle keywords as a string array
//       keywordsEn.forEach(keyword => {
//         formData.append('Keywords[]', keyword)
//       })
      
//       // Handle image upload
//       if (data.image instanceof File) {
//         formData.append('image', data.image)
//       } else if (typeof data.image === 'string' && data.image) {
//         formData.append('currentImage', data.image)
//       }
  
//       const response = await fetch(`http://localhost:8080/blog/update/${params.id}`, {
//         method: 'PUT',
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         },
//         body: formData,
//       })
  
//       const result = await response.json()
//       console.log('Update response:', result)
  
//       toast({
//         title: "Success",
//         description: "English version updated successfully"
//       })
      
//       router.push('/blog')
//     } catch (error) {
//       console.error('Update error:', error)
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to update English version"
//       })
//     } finally {
//       setIsLoadingEn(false)
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
//                       <Input
//                         {...registerAr("title")}
//                         dir="rtl"
//                         className={errorsAr.title ? "border-red-500" : ""}
//                       />
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
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium">الكلمات المفتاحية (عربي)</label>
//                       <div className="flex gap-2">
//                         <Input
//                           value={newKeywordAr}
//                           onChange={(e) => setNewKeywordAr(e.target.value)}
//                           placeholder="أضف كلمة مفتاحية"
//                           onKeyPress={(e) => {
//                             if (e.key === 'Enter') {
//                               e.preventDefault()
//                               if (newKeywordAr && !keywordsAr.includes(newKeywordAr)) {
//                                 setKeywordsAr([...keywordsAr, newKeywordAr])
//                                 setNewKeywordAr("")
//                               }
//                             }
//                           }}
//                         />
//                         <Button 
//                           type="button" 
//                           onClick={() => {
//                             if (newKeywordAr && !keywordsAr.includes(newKeywordAr)) {
//                               setKeywordsAr([...keywordsAr, newKeywordAr])
//                               setNewKeywordAr("")
//                             }
//                           }}
//                         >
//                           إضافة
//                         </Button>
//                       </div>
//                       <div className="flex flex-wrap gap-2 mt-2">
//                         {keywordsAr.map((keyword) => (
//                           <span
//                             key={keyword}
//                             className="bg-primary text-primary-foreground px-2 py-1 rounded-md flex items-center gap-1"
//                           >
//                             {keyword}
//                             <button
//                               type="button"
//                               onClick={() => setKeywordsAr(keywordsAr.filter(k => k !== keyword))}
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
//                       <ImageUpload
//                       language="ar"
//                         onImagesChange={(images) => setValueAr("image", images[0])}
//                         maxImages={1}
//                         initialImages={[watchAr("image") as string]}
//                       />
//                     </div>
//                     <Button type="submit" disabled={isLoadingAr} className="w-full">
//                       {isLoadingAr ? (
//                         <>
//                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                           جاري الحفظ...
//                         </>
//                       ) : (
//                         "حفظ النسخة العربية"
//                       )}
//                     </Button>
//                   </div>
//                 </form>
//               }
//               englishContent={
//                 <form onSubmit={handleSubmitEn(onSubmitEnglish)} className="space-y-6">
//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium">Title (English)</label>
//                       <Input
//                         {...registerEn("title")}
//                         dir="ltr"
//                         className={errorsEn.title ? "border-red-500" : ""}
//                       />
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
//                       <label className="block text-sm font-medium">Keywords (English)</label>
//                       <div className="flex gap-2">
//                         <Input
//                           value={newKeywordEn}
//                           onChange={(e) => setNewKeywordEn(e.target.value)}
//                           placeholder="Add keyword"
//                           onKeyPress={(e) => {
//                             if (e.key === 'Enter') {
//                               e.preventDefault()
//                               if (newKeywordEn && !keywordsEn.includes(newKeywordEn)) {
//                                 setKeywordsEn([...keywordsEn, newKeywordEn])
//                                 setNewKeywordEn("")
//                               }
//                             }
//                           }}
//                         />
//                         <Button 
//                           type="button" 
//                           onClick={() => {
//                             if (newKeywordEn && !keywordsEn.includes(newKeywordEn)) {
//                               setKeywordsEn([...keywordsEn, newKeywordEn])
//                               setNewKeywordEn("")
//                             }
//                           }}
//                         >
//                           Add
//                         </Button>
//                       </div>
//                       <div className="flex flex-wrap gap-2 mt-2">
//                         {keywordsEn.map((keyword) => (
//                           <span
//                             key={keyword}
//                             className="bg-primary text-primary-foreground px-2 py-1 rounded-md flex items-center gap-1"
//                           >
//                             {keyword}
//                             <button
//                               type="button"
//                               onClick={() => setKeywordsEn(keywordsEn.filter(k => k !== keyword))}
//                               className="hover:text-red-500"
//                             >
//                               <X className="h-4 w-4" />
//                             </button>
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium">Article Image</label>
//                       <ImageUpload
//                       language="en"
//                         onImagesChange={(images) => setValueEn("image", images[0])}
//                         maxImages={1}
//                         initialImages={[watchEn("image") as string]}
//                       />
//                     </div>
//                     <Button type="submit" disabled={isLoadingEn} className="w-full">
//                       {isLoadingEn ? (
//                         <>
//                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                           Saving...
//                         </>
//                       ) : (
//                         "Save English Version"
//                       )}
//                     </Button>
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
"use client"

import { useReducer, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X, Loader2 } from "lucide-react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { TabComponent } from "@/components/ui/tab-component"
import { ImageUpload } from "@/components/ui/image-upload"
import { blogPostSchema } from "@/lib/schemas"
import { toast } from "react-hot-toast"
import { useRouter, useParams } from 'next/navigation';
import type { z } from "zod"

type FormData = z.infer<typeof blogPostSchema>

type State = {
  keywords: { ar: string[]; en: string[] }
  newKeyword: { ar: string; en: string }
  isLoading: { ar: boolean; en: boolean }
}

type Action =
  | { type: "SET_KEYWORDS"; lang: "ar" | "en"; value: string[] }
  | { type: "SET_NEW_KEYWORD"; lang: "ar" | "en"; value: string }
  | { type: "SET_LOADING"; lang: "ar" | "en"; value: boolean }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_KEYWORDS":
      return { ...state, keywords: { ...state.keywords, [action.lang]: action.value } }
    case "SET_NEW_KEYWORD":
      return { ...state, newKeyword: { ...state.newKeyword, [action.lang]: action.value } }
    case "SET_LOADING":
      return { ...state, isLoading: { ...state.isLoading, [action.lang]: action.value } }
    default:
      return state
  }
}

export default function EditBlogPost() {
  const [state, dispatch] = useReducer(reducer, {
    keywords: { ar: [], en: [] },
    newKeyword: { ar: "", en: "" },
    isLoading: { ar: false, en: false },
  })

  const router = useRouter()
  const params = useParams()

  const forms = {
    ar: useForm<FormData>({ resolver: zodResolver(blogPostSchema), defaultValues: { lang: "ar" } }),
    en: useForm<FormData>({ resolver: zodResolver(blogPostSchema), defaultValues: { lang: "en" } }),
  }

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/blog/findOne/${params.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        
        // Handle blog data for both languages
        if (data.blog) {
          const blogData = Array.isArray(data.blog) ? data.blog : [data.blog];
          
          blogData.forEach((blog: any) => {
            if (blog.lang === 'ar') {
              forms.ar.reset({
                title: blog.title,
                description: blog.description?.replace(/<[^>]*>/g, ''),
                image: blog.image,
                lang: 'ar'
              });
              dispatch({ 
                type: "SET_KEYWORDS", 
                lang: "ar", 
                value: Array.isArray(blog.Keywords) ? blog.Keywords : blog.Keywords?.split(',') || [] 
              });
            } else if (blog.lang === 'en') {
              forms.en.reset({
                title: blog.title,
                description: blog.description?.replace(/<[^>]*>/g, ''),
                image: blog.image,
                lang: 'en'
              });
              dispatch({ 
                type: "SET_KEYWORDS", 
                lang: "en", 
                value: Array.isArray(blog.Keywords) ? blog.Keywords : blog.Keywords?.split(',') || [] 
               
              });
            }
          });
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        toast.error("Error fetching blog data");
      }
    };
  
    if (params.id) {
      fetchBlogData();
    }
  }, [params.id]);
  
  // In the onSubmit function, modify how keywords are handled:
  const onSubmit = async (data: FormData, lang: "ar" | "en") => {
    dispatch({ type: "SET_LOADING", lang, value: true });
    try {
      const formData = new FormData();
      formData.append("title", data.title.trim());
      formData.append("description", data.description.replace(/<[^>]*>/g, '').trim());
      formData.append("Keywords", state.keywords[lang].join(','));
      formData.append("lang", lang);
      if (data.image instanceof File) {
        formData.append("image", data.image);
      } else if (typeof data.image === "string" && data.image.startsWith("http")) {
        formData.append("imageUrl", data.image); // Send existing image URL
      }
  
  
      const response = await fetch(`http://localhost:8080/blog/update/${params.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
  
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
  
      toast.success(lang === "ar" ? "تم تحديث المقال بنجاح" : "Blog updated successfully");
      router.push("/blog");
    } catch (error) {
      toast.error(lang === "ar" ? "حدث خطأ أثناء التحديث" : "Error updating blog");
    } finally {
      dispatch({ type: "SET_LOADING", lang, value: false });
    }
  }

  const renderForm = (lang: "ar" | "en") => (
    <form onSubmit={forms[lang].handleSubmit((data) => onSubmit(data, lang))} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">{lang === "ar" ? "العنوان (بالعربية)" : "Title (English)"}</label>
          <Input
            {...forms[lang].register("title")}
            dir={lang === "ar" ? "rtl" : "ltr"}
            className={forms[lang].formState.errors.title ? "border-red-500" : ""}
          />
          {forms[lang].formState.errors.title && (
            <p className="text-red-500 text-sm">{forms[lang].formState.errors.title.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            {lang === "ar" ? "المحتوى (بالعربية)" : "Content (English)"}
          </label>
          <RichTextEditor
  content={forms[lang].watch("description")?.replace(/<[^>]*>/g, '') || ""}
  onChange={(content) => forms[lang].setValue("description", content.replace(/<[^>]*>/g, ''))}
  language={lang}
/>

        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            {lang === "ar" ? "الكلمات المفتاحية (عربي)" : "Keywords (English)"}
          </label>
          <div className="flex gap-2">
            <Input
              value={state.newKeyword[lang]}
              onChange={(e) =>
                dispatch({ type: "SET_NEW_KEYWORD", lang, value: e.target.value })
              }
              placeholder={lang === "ar" ? "أضف كلمة مفتاحية" : "Add keyword"}
            />
            <Button
              type="button"
              variant="outline"
              
              className="text-sm  px-4 "
              onClick={() => {
                if (state.newKeyword[lang] && !state.keywords[lang].includes(state.newKeyword[lang])) {
                  dispatch({
                    type: "SET_KEYWORDS",
                    lang,
                    value: [...state.keywords[lang], state.newKeyword[lang]],
                  })
                  dispatch({ type: "SET_NEW_KEYWORD", lang, value: "" })
                }
              }}
            >
              {lang === "ar" ? "إضافة" : "Add"}
            </Button>
            
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
  {state.keywords[lang].map((keyword, index) => (
    <span
      key={index}
      className="bg-primary text-primary-foreground px-2 py-1 rounded-md flex items-center gap-1"
    >
      {keyword}
      <button
        type="button"
        onClick={() => {
          dispatch({
            type: "SET_KEYWORDS",
            lang,
            value: state.keywords[lang].filter((_, i) => i !== index)
          });
        }}
        className="hover:text-red-500"
      >
        <X className="h-4 w-4" />
      </button>
    </span>
  ))}
</div>
        </div>
        <div className="space-y-2">
  <label className="block text-sm font-medium">
    {lang === "ar" ? "صورة المقال" : "Article Image"}
  </label>
  <ImageUpload
    language={lang}
    onImagesChange={(images) => forms[lang].setValue("image", images[0])}
    maxImages={1}
    initialImages={[
      forms[lang].watch("image") 
        ? `http://localhost:8080/uploads/${forms[lang].watch("image")}` 
        : ""
    ]}

  />
</div>

        <Button  type="submit" disabled={state.isLoading[lang]} className="w-full ">
          {state.isLoading[lang] ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {lang === "ar" ? "جاري الحفظ..." : "Saving..."}
            </>
          ) : (
            lang === "ar" ? "حفظ النسخة العربية" : "Save English Version"
          )}
        </Button>
      </div>
    </form>
  )

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
              arabicContent={renderForm("ar")}
              englishContent={renderForm("en")}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
