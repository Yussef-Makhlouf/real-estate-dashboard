// "use client"

// import { useState } from "react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { X, Loader2 } from "lucide-react"
// import { Header } from "@/components/Header"
// import { Sidebar } from "@/components/Sidebar"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { RichTextEditor } from "@/components/ui/rich-text-editor"
// import { TabComponent } from "@/components/ui/tab-component"
// import { ImageUpload } from "@/components/ui/image-upload"
// import { blogPostSchema } from "@/lib/schemas"
// import { toast } from "react-hot-toast"
// import type { z } from "zod"

// type FormData = z.infer<typeof blogPostSchema>

// export default function AddBlogPost() {
//   const [keywords, setKeywords] = useState<{ ar: string[]; en: string[] }>({ ar: [], en: [] })
//   const [newKeyword, setNewKeyword] = useState<{ ar: string; en: string }>({ ar: "", en: "" })
//   const [isLoading, setIsLoading] = useState<{ ar: boolean; en: boolean }>({ ar: false, en: false })

//   const {
//     register: registerAr,
//     handleSubmit: handleSubmitAr,
//     setValue: setValueAr,
//     watch: watchAr,
//     formState: { errors: errorsAr },
//   } = useForm<FormData>({
//     resolver: zodResolver(blogPostSchema),
//     defaultValues: {
//       lang: 'ar' as const
//     },
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
//       lang: "en" as const
//     },
//   })

//   const onSubmit = async (data: FormData, lang: "ar" | "en") => {
//     try {
//       setIsLoading((prev) => ({ ...prev, [lang]: true }))
//       const formData = new FormData()
//       formData.append("lang", lang)
//       formData.append("title", data.title)
//       formData.append("description", data.description)
//       formData.append("Keywords", JSON.stringify(keywords[lang]))
     

//       if (data.image instanceof File) {
//         formData.append("image", data.image)
//       }

//       const token = localStorage.getItem("token")
//       if (!token) {
//         toast.error(lang === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first")
//         return
//       }

//       const response = await fetch("http://localhost:8080/blog/create", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       })

//       const result = await response.json()
//       if (response.ok) {
//         toast.success(lang === "ar" ? "تم نشر المقال بنجاح" : "Article published successfully")
//       } else {
//         throw new Error(result.message || (lang === "ar" ? "حدث خطأ أثناء نشر المقال" : "Error publishing article"))
//       }
//     } catch (error) {
//       const errorMessage =
//         error instanceof Error ? error.message : lang === "ar" ? "حدث خطأ أثناء نشر المقال" : "Error publishing article"
//       toast.error(errorMessage)
//     } finally {
//       setIsLoading((prev) => ({ ...prev, [lang]: false }))
//     }
//   }

//   const handleAddKeyword = (lang: "ar" | "en") => {
//     if (newKeyword[lang] && !keywords[lang].includes(newKeyword[lang])) {
//       setKeywords((prev) => ({ ...prev, [lang]: [...prev[lang], newKeyword[lang]] }))
//       setNewKeyword((prev) => ({ ...prev, [lang]: "" }))
//     }
//   }

//   const handleRemoveKeyword = (lang: "ar" | "en", keyword: string) => {
//     setKeywords((prev) => ({ ...prev, [lang]: prev[lang].filter((k) => k !== keyword) }))
//   }

//   const renderKeywordInput = (lang: "ar" | "en") => (
//     <div className="mt-6 space-y-2">
//       <label className="block text-sm font-medium">{lang === "ar" ? "الكلمات المفتاحية" : "Keywords"}</label>
//       <div className="flex gap-2">
//         <Input
//           value={newKeyword[lang]}
//           onChange={(e) => setNewKeyword((prev) => ({ ...prev, [lang]: e.target.value }))}
//           placeholder={lang === "ar" ? "أضف كلمة مفتاحية" : "Add a keyword"}
//           dir={lang === "ar" ? "rtl" : "ltr"}
//         />
//         <Button type="button" onClick={() => handleAddKeyword(lang)}>
//           {lang === "ar" ? "إضافة" : "Add"}
//         </Button>
//       </div>
//       <div className="flex flex-wrap gap-2 mt-2">
//         {keywords[lang].map((keyword) => (
//           <span
//             key={keyword}
//             className="bg-primary text-primary-foreground px-2 py-1 rounded-md flex items-center gap-1"
//           >
//             {keyword}
//             <button type="button" onClick={() => handleRemoveKeyword(lang, keyword)} className="hover:text-red-500">
//               <X className="h-4 w-4" />
//             </button>
//           </span>
//         ))}
//       </div>
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Header />
//       <Sidebar />
//       <main className="pt-16 px-4 sm:px-6 lg:px-8">
//         <Card>
//           <CardHeader>
//             <CardTitle>إضافة مقال جديد / Add New Article</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <TabComponent
//               arabicContent={
//                 <form dir="rtl" onSubmit={handleSubmitAr((data) => onSubmit(data, "ar"))} className="space-y-6">
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
//                     {renderKeywordInput("ar")}
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium">صورة المقال</label>
//                       <ImageUpload
//                         onImagesChange={(images) => setValueAr("image", images[0])}
//                         maxImages={1}
//                         language="ar"
//                       />
//                     </div>
//                     <Button type="submit" disabled={isLoading.ar}>
//                       {isLoading.ar ? (
//                         <>
//                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                           جاري النشر...
//                         </>
//                       ) : (
//                         "نشر المقال بالعربية"
//                       )}
//                     </Button>
//                   </div>
//                 </form>
//               }
//               englishContent={
//                 <form onSubmit={handleSubmitEn((data) => onSubmit(data, "en"))} className="space-y-6">
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
//                     {renderKeywordInput("en")}
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium">Article Image</label>
//                       <ImageUpload
//                         onImagesChange={(images) => setValueEn("image", images[0])}
//                         maxImages={1}
//                         language="en"
//                       />
//                     </div>
//                     <Button type="submit" disabled={isLoading.en}>
//                       {isLoading.en ? (
//                         <>
//                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                           Publishing...
//                         </>
//                       ) : (
//                         "Publish in English"
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
import { useRouter } from 'next/navigation';
import { useReducer } from "react"
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
import type { z } from "zod"

type FormData = z.infer<typeof blogPostSchema>

type State = {
  keywords: { ar: string[]; en: string[] }
  newKeyword: { ar: string; en: string }
  isLoading: { ar: boolean; en: boolean }
}

type Action =
  | { type: "ADD_KEYWORD"; lang: "ar" | "en" }
  | { type: "REMOVE_KEYWORD"; lang: "ar" | "en"; keyword: string }
  | { type: "SET_NEW_KEYWORD"; lang: "ar" | "en"; value: string }
  | { type: "SET_LOADING"; lang: "ar" | "en"; value: boolean }

type FormProps = {
  lang: "ar" | "en"
  forms: Record<"ar" | "en", ReturnType<typeof useForm<FormData>>>
  onSubmit: (data: FormData, lang: "ar" | "en") => Promise<void>
  state: State
  dispatch: React.Dispatch<Action>
}

const Form = ({ lang, forms, onSubmit, state, dispatch }: FormProps) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = forms[lang]
  
  return (
    <form dir={lang === "ar" ? "rtl" : "ltr"} onSubmit={handleSubmit((data) => onSubmit(data, lang))} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">{lang === "ar" ? "العنوان (بالعربية)" : "Title (English)"}</label>
          <Input {...register("title")} dir={lang === "ar" ? "rtl" : "ltr"} />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">{lang === "ar" ? "المحتوى (بالعربية)" : "Content (English)"}</label>
          <RichTextEditor
            content={watch("description") || ""}
            onChange={(content) => setValue("description", content)}
            language={lang}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>
        <div className="mt-6 space-y-2">
          <label className="block text-sm font-medium">{lang === "ar" ? "الكلمات المفتاحية" : "Keywords"}</label>
          <div className="flex gap-2">
            <Input
              value={state.newKeyword[lang]}
              onChange={(e) => dispatch({ type: "SET_NEW_KEYWORD", lang, value: e.target.value })}
              placeholder={lang === "ar" ? "أضف كلمة مفتاحية" : "Add a keyword"}
              dir={lang === "ar" ? "rtl" : "ltr"}
            />
            <Button type="button" onClick={() => dispatch({ type: "ADD_KEYWORD", lang })}>
              {lang === "ar" ? "إضافة" : "Add"}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {state.keywords[lang].map((keyword) => (
              <span
                key={keyword}
                className="bg-primary text-primary-foreground px-2 py-1 rounded-md flex items-center gap-1"
              >
                {keyword}
                <button type="button" onClick={() => dispatch({ type: "REMOVE_KEYWORD", lang, keyword })} className="hover:text-red-500">
                  <X className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">{lang === "ar" ? "صورة المقال" : "Article Image"}</label>
          <ImageUpload
            onImagesChange={(images) => setValue("image", images[0])}
            maxImages={1}
            language={lang}
          />
        </div>
        <Button type="submit" disabled={state.isLoading[lang]}>
          {state.isLoading[lang] ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {lang === "ar" ? "جاري النشر..." : "Publishing..."}
            </>
          ) : (
            lang === "ar" ? "نشر المقال بالعربية" : "Publish in English"
          )}
        </Button>
      </div>
    </form>
  )
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_KEYWORD":
      return state.newKeyword[action.lang] && !state.keywords[action.lang].includes(state.newKeyword[action.lang])
        ? {
            ...state,
            keywords: {
              ...state.keywords,
              [action.lang]: [...state.keywords[action.lang], state.newKeyword[action.lang]],
            },
            newKeyword: { ...state.newKeyword, [action.lang]: "" },
          }
        : state
    case "REMOVE_KEYWORD":
      return {
        ...state,
        keywords: {
          ...state.keywords,
          [action.lang]: state.keywords[action.lang].filter((k) => k !== action.keyword),
        },
      }
    case "SET_NEW_KEYWORD":
      return { ...state, newKeyword: { ...state.newKeyword, [action.lang]: action.value } }
    case "SET_LOADING":
      return { ...state, isLoading: { ...state.isLoading, [action.lang]: action.value } }
    default:
      return state
  }
}

export default function AddBlogPost() {
  const [state, dispatch] = useReducer(reducer, {
    keywords: { ar: [], en: [] },
    newKeyword: { ar: "", en: "" },
    isLoading: { ar: false, en: false },
  })

  const formHandler = (lang: "ar" | "en") =>
    useForm<FormData>({
      resolver: zodResolver(blogPostSchema),
      defaultValues: { lang },
    })

  const forms = { ar: formHandler("ar"), en: formHandler("en") }

  const onSubmit = async (data: FormData, lang: "ar" | "en") => {
    console.log("Submitting article with language:", lang);
    console.log("Form data before sending:", data);
    dispatch({ type: "SET_LOADING", lang, value: true })
    try {
      const formData = new FormData()
      formData.append("lang", lang)
      formData.append("title", data.title)
      formData.append("description", data.description)
      formData.append("Keywords", JSON.stringify(state.keywords[lang]))
      if (data.image instanceof File) formData.append("image", data.image)

      const token = localStorage.getItem("token")
      if (!token) throw new Error(lang === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first")

      const response = await fetch("http://localhost:8080/blog/create", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const result = await response.json()
      if (!response.ok) {
        console.error("Error publishing article:", result);
        throw new Error(result.message || "Error publishing article");
      }

      console.log("Article published successfully:", result);
      toast.success(lang === "ar" ? "تم نشر المقال بنجاح" : "Article published successfully");
      
      const router = useRouter();
      router.push("/blog");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error publishing article")
    } finally {
      dispatch({ type: "SET_LOADING", lang, value: false })
    }
    
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>إضافة مقال جديد / Add New Article</CardTitle>
          </CardHeader>
          <CardContent>
            <TabComponent
              arabicContent={<Form lang="ar" forms={forms} onSubmit={onSubmit} state={state} dispatch={dispatch} />}
              englishContent={<Form lang="en" forms={forms} onSubmit={onSubmit} state={state} dispatch={dispatch} />}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

