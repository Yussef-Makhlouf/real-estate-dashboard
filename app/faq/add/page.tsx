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

import { useReducer } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X, Loader2 } from "lucide-react"
import { Dispatch } from "react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { TabComponent } from "@/components/ui/tab-component"
import { faqSchema } from "@/lib/schemas"
import { toast } from "react-hot-toast"
import { useRouter } from 'next/navigation';
import type { z } from "zod"

type FormData = z.infer<typeof faqSchema>

type State = {
  keywords: { ar: string[]; en: string[] }
  newKeyword: { ar: string; en: string }
  isLoading: { ar: boolean; en: boolean }
}
type Action =
  | { type: "SET_KEYWORDS"; lang: "ar" | "en"; value: string[] }
  | { type: "SET_NEW_KEYWORD"; lang: "ar" | "en"; value: string }
  | { type: "SET_LOADING"; lang: "ar" | "en"; value: boolean }

interface FormProps {
  lang: "ar" | "en"
  forms: { ar: any; en: any }
  onSubmit: (data: FormData, lang: "ar" | "en") => Promise<void>
  state: State
  dispatch: Dispatch<Action>
}

const Form = ({ lang, forms, onSubmit, state, dispatch }: FormProps) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = forms[lang]

  const addKeyword = () => {
    if (state.newKeyword[lang] && !state.keywords[lang].includes(state.newKeyword[lang])) {
      const updatedKeywords = [...state.keywords[lang], state.newKeyword[lang]]
      dispatch({ type: "SET_KEYWORDS", lang, value: updatedKeywords })
      dispatch({ type: "SET_NEW_KEYWORD", lang, value: "" })
    }
  }

  const removeKeyword = (keywordToRemove: string) => {
    const updatedKeywords = state.keywords[lang].filter((k) => k !== keywordToRemove)
    dispatch({ type: "SET_KEYWORDS", lang, value: updatedKeywords })
  }

  return (
    <form onSubmit={handleSubmit((data: FormData) => onSubmit(data, lang))} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          {lang === "ar" ? "السؤال (بالعربية)" : "Question (English)"}
        </label>
        <Input
          {...register("question")}
          dir={lang === "ar" ? "rtl" : "ltr"}
          className={errors.question ? "border-red-500" : ""}
        />
        {errors.question && <p className="text-red-500 text-sm">{errors.question.message}</p>}
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          {lang === "ar" ? "الإجابة (بالعربية)" : "Answer (English)"}
        </label>
        <RichTextEditor
  content={watch("answer")?.replace(/<[^>]*>/g, '') || ""}
  onChange={(content) => setValue("answer", content.replace(/<[^>]*>/g, ''))}
  language={lang}
/>

        {errors.answer && <p className="text-red-500 text-sm">{errors.answer.message}</p>}
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          {lang === "ar" ? "الكلمات المفتاحية" : "Keywords"}
        </label>
        <div className="flex gap-2">
          <Input
            value={state.newKeyword[lang]}
            onChange={(e) => dispatch({ type: "SET_NEW_KEYWORD", lang, value: e.target.value })}
            placeholder={lang === "ar" ? "أضف كلمة مفتاحية" : "Add keyword"}
          />
          <Button type="button" onClick={addKeyword}>
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
              <button type="button" onClick={() => removeKeyword(keyword)} className="hover:text-red-500">
                <X className="h-4 w-4" />
              </button>
            </span>
          ))}
        </div>
      </div>
      <Button type="submit" disabled={state.isLoading[lang]}>
        {state.isLoading[lang] ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {lang === "ar" ? "جاري الإضافة..." : "Adding..."}
          </>
        ) : (
          lang === "ar" ? "إضافة السؤال" : "Add Question"
        )}
      </Button>
    </form>
  )
}

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

export default function AddFAQ() {
  const [state, dispatch] = useReducer(reducer, {
    keywords: { ar: [], en: [] },
    newKeyword: { ar: "", en: "" },
    isLoading: { ar: false, en: false },
  })

  const router = useRouter()

  const forms = {
    ar: useForm<FormData>({ resolver: zodResolver(faqSchema), defaultValues: { lang: "ar" } }),
    en: useForm<FormData>({ resolver: zodResolver(faqSchema), defaultValues: { lang: "en" } }),
  }

  const onSubmit = async (data: FormData, lang: "ar" | "en") => {
    dispatch({ type: "SET_LOADING", lang, value: true })
    try {
      const requestData = {
        lang: lang,
        question: data.question,
        answer: data.answer,
        keywords: state.keywords[lang]
      }
  
      const response = await fetch("http://localhost:8080/question/create", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(requestData)
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create question")
      }
  
      toast.success(lang === "ar" ? "تم إضافة السؤال بنجاح" : "Question added successfully")
      router.push("/faq")
    } catch (error) {
      console.error('API Error:', error)
      toast.error(lang === "ar" ? "حدث خطأ أثناء إضافة السؤال" : "Error adding question")
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
            <CardTitle>إضافة سؤال شائع</CardTitle>
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
