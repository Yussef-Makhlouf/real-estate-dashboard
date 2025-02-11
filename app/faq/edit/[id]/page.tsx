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
// import { faqSchema } from "@/lib/schemas"
// import { useToast } from "@/components/ui/use-toast"
// import type { z } from "zod"

// type FormData = z.infer<typeof faqSchema>

// export default function EditFAQ() {
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
//     // resolver: zodResolver(faqSchema),
//     defaultValues: { lang: 'ar' }
//   })

//   const {
//     register: registerEn,
//     handleSubmit: handleSubmitEn,
//     setValue: setValueEn,
//     watch: watchEn,
//     formState: { errors: errorsEn },
//   } = useForm<FormData>({
//     // resolver: zodResolver(faqSchema),
//     defaultValues: { lang: 'en' }
//   })

//   useEffect(() => {
//     const fetchFAQData = async () => {
//       try {
//         const response = await fetch(`http://localhost:8080/question/${params.id}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         })
//         const data = await response.json()
//         // Handle Arabic data

//         if (data.questionData.lang === 'ar') {
//           setValueAr('question', data.questionData.question)
//           setValueAr('answer', data.questionData.answer)
//          }

//         // Handle English data
//         if (data.questionData.lang === 'en') {
//           setValueEn('question', data.questionData.question)
//           setValueEn('answer', data.questionData.answer)
//         }
//       } catch (error) {
//         toast({
//           variant: "destructive",
//           title: "خطأ",
//           description: "حدث خطأ أثناء جلب بيانات السؤال الشائع"
//         })
//       }
//     }

//     fetchFAQData()
//   }, [params.id, setValueAr, setValueEn, toast])

//   const onSubmitArabic = async (data: FormData) => {
//     setIsLoadingAr(true)
//     try {
//       const formData = new FormData()
//       formData.append('question', data.question)
//       formData.append('answer', data.answer)
//       formData.append('keywords', JSON.stringify(keywordsAr))
//       formData.append('lang', 'ar')


//       const response = await fetch(`http://localhost:8080/question/update/${params.id}`, {
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

//       router.push('/faq')
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
//       formData.append('question', data.question || '')
//       formData.append('answer', data.answer || '')
//       formData.append('lang', 'en')

//       keywordsEn.forEach(keyword => {
//         formData.append('keywords[]', keyword)
//       })


//       console.log(formData);


//       const response = await fetch(`http://localhost:8080/question/update/${params.id}`, {
//         method: 'PUT',
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         },
//         body: formData,
//       })

//       const result = await response.json()
//       console.log("Server Response:", result) // Debugging line

//       if (!response.ok) {
//         console.error("Error Response:", result) // Debugging line
//         throw new Error(result.message || "Failed to update")
//       }
//       toast({
//         title: "Success",
//         description: "English version updated successfully"
//       })

//       router.push('/faq')
//     } catch (error) {
//       console.error('Update error:', error)
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "An error occurred while updating the English version"
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
//             <CardTitle>تعديل السؤال الشائع</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmitAr(onSubmitArabic)} className="space-y-6">
//               <TabComponent
//                 arabicContent={
//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium">السؤال (بالعربية)</label>
//                       <Input
//                         {...registerAr("question")}
//                         className={errorsAr.question ? "border-red-500" : ""}
//                       />
//                       {errorsAr.question && <p className="text-red-500 text-sm">{errorsAr.question.message}</p>}
//                     </div>
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium">الإجابة (بالعربية)</label>
//                       <RichTextEditor
//                         content={watchAr("answer") || ""}
//                         onChange={(content) => setValueAr("answer", content)}
//                         language="ar"
//                       />
//                       {errorsAr.answer && <p className="text-red-500 text-sm">{errorsAr.answer.message}</p>}
//                     </div>
//                   </div>
//                 }
//                 englishContent={
//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium">Question (English)</label>
//                       <Input
//                         {...registerEn("question")}
//                         className={errorsEn.question ? "border-red-500" : ""}
//                       />
//                       {errorsEn.question && <p className="text-red-500 text-sm">{errorsEn.question.message}</p>}
//                     </div>
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium">Answer (English)</label>
//                       <RichTextEditor
//                         content={watchEn("answer") || ""}
//                         onChange={(content) => setValueEn("answer", content)}
//                         language="en"
//                       />
//                       {errorsEn.answer && <p className="text-red-500 text-sm">{errorsEn.answer.message}</p>}
//                     </div>
//                   </div>
//                 }
//               />
// <div className="flex justify-end space-x-2">
//   <Button
//     type="button"

//     disabled={isLoadingAr || isLoadingEn}
//     onClick={() => {
//       handleSubmitAr(onSubmitArabic)()
//       handleSubmitEn(onSubmitEnglish)()
//     }}
//   >
//     {isLoadingAr || isLoadingEn ? (
//       <Loader2 className="animate-spin h-5 w-5" />
//     ) : (
//       "Save Changes"
//     )}
//   </Button>
// </div>

//             </form>
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
import { faqSchema } from "@/lib/schemas"
import { toast } from "react-hot-toast"
import { useRouter, useParams } from 'next/navigation';
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

export default function EditFAQ() {
  const [state, dispatch] = useReducer(reducer, {
    keywords: { ar: [], en: [] },
    newKeyword: { ar: "", en: "" },
    isLoading: { ar: false, en: false },
  })

  const router = useRouter()
  const params = useParams()

  const forms = {
    ar: useForm<FormData>({ resolver: zodResolver(faqSchema), defaultValues: { lang: "ar" } }),
    en: useForm<FormData>({ resolver: zodResolver(faqSchema), defaultValues: { lang: "en" } }),
  }
  useEffect(() => {
    const fetchFAQData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/question/getOne/${params.id}`, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch FAQ data');
        }
  
        const data = await response.json();
        console.log('Fetched Data:', data); // Debug log
  
        // Check if data exists and has the correct structure
        if (!data || !data.questionData) {
          throw new Error('Invalid data structure');
        }
  
        // Handle single object response
        if (!Array.isArray(data.questionData)) {
          const questionData = data.questionData;
          if (questionData.lang === 'ar') {
            forms.ar.setValue('question', questionData.question);
            forms.ar.setValue('answer', questionData.answer);
            dispatch({ type: "SET_KEYWORDS", lang: "ar", value: questionData.keywords || [] });
          } else if (questionData.lang === 'en') {
            forms.en.setValue('question', questionData.question);
            forms.en.setValue('answer', questionData.answer);
            dispatch({ type: "SET_KEYWORDS", lang: "en", value: questionData.keywords || [] });
          }
          return;
        }
  
        // Handle array response
        const arData = data.questionData.find((q: any) => q.lang === 'ar');
        const enData = data.questionData.find((q: any) => q.lang === 'en');
  
        if (arData) {
          forms.ar.setValue('question', arData.question);
          forms.ar.setValue('answer', arData.answer);
          dispatch({ type: "SET_KEYWORDS", lang: "ar", value: arData.keywords || [] });
        }
  
        if (enData) {
          forms.en.setValue('question', enData.question);
          forms.en.setValue('answer', enData.answer);
          dispatch({ type: "SET_KEYWORDS", lang: "en", value: enData.keywords || [] });
        }
      } catch (error) {
        console.error('Error fetching FAQ:', error);
        toast.error(error instanceof Error ? error.message : "Error fetching FAQ data");
      }
    };
  
    if (params.id) {
      fetchFAQData();
    }
  }, [params.id, forms.ar, forms.en]); // Add forms as dependencies
  const onSubmit = async (data: FormData, lang: "ar" | "en") => {
    dispatch({ type: "SET_LOADING", lang, value: true })
    try {
      // Sanitize the answer content before sending
      const sanitizedAnswer = data.answer
        .replace(/^<p>|<\/p>$/g, '')  // Remove wrapping <p> tags
        .trim();
  
      const requestData = {
        question: data.question.trim(),
        answer: sanitizedAnswer,
        keywords: state.keywords[lang],
        lang: lang
      }
  
      const response = await fetch(`http://localhost:8080/question/update/${params.id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })
  
      const result = await response.json()
      if (!response.ok) throw new Error(result.message)
  
      toast.success(lang === "ar" ? "تم تحديث السؤال بنجاح" : "FAQ updated successfully")
      router.push("/faq")
    } catch (error) {
      toast.error(lang === "ar" ? "حدث خطأ أثناء التحديث" : "Error updating FAQ")
      console.error(error)
    } finally {
      dispatch({ type: "SET_LOADING", lang, value: false })
    }
  }
  const Form = ({ lang, forms, onSubmit, state, dispatch }: {
    lang: "ar" | "en"
    forms: { ar: any; en: any }
    onSubmit: (data: FormData, lang: "ar" | "en") => Promise<void>
    state: State
    dispatch: React.Dispatch<Action>
  }) => {
    const { register, formState: { errors }, watch, setValue, handleSubmit } = forms[lang]

    return (
      <form onSubmit={handleSubmit((data: FormData) => onSubmit(data, lang))} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              {lang === "ar" ? "السؤال (بالعربية)" : "Question (English)"}
            </label>
            <Input
              {...register("question")}
              className={errors.question ? "border-red-500" : ""}
              dir={lang === "ar" ? "rtl" : "ltr"}
            />
            {errors.question && <p className="text-red-500 text-sm">{errors.question.message}</p>}
          </div>
          <div className="space-y-2" >
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

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={state.isLoading[lang]}
            >
              {state.isLoading[lang] ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {lang === "ar" ? "جاري الحفظ..." : "Saving..."}
                </>
              ) : (
                lang === "ar" ? "حفظ التغييرات" : "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </form>
    )
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>تعديل السؤال الشائع</CardTitle>
          </CardHeader>
          <CardContent>
            <TabComponent
              arabicContent={<Form lang="ar" forms={forms} onSubmit={onSubmit} state={state} dispatch={dispatch} />}
              englishContent={<Form lang="en" forms={forms} onSubmit={onSubmit} state={state} dispatch={dispatch} />}
            />
            {/* <div className="flex justify-end mt-4">
              <Button onClick={() => { forms.ar.handleSubmit((data) => onSubmit(data, "ar"))(); forms.en.handleSubmit((data) => onSubmit(data, "en"))(); }}>
                {state.isLoading.ar || state.isLoading.en ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري التحديث...
                  </>
                ) : (
                  "حفظ التعديلات"
                )}
              </Button>
            </div> */}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}