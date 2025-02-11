
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

import { useRouter } from 'next/navigation';
import type { z } from "zod"
import toast, { Toaster } from 'react-hot-toast'

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
      toast.success(lang === "ar" ? "تم إضافة الكلمة المفتاحية" : "Keyword added", {
        position: "top-center",
        style: { direction: 'rtl' }
      })
    }
  }

  const removeKeyword = (keywordToRemove: string) => {
    const updatedKeywords = state.keywords[lang].filter((k) => k !== keywordToRemove)
    dispatch({ type: "SET_KEYWORDS", lang, value: updatedKeywords })
    toast('تم حذف الكلمة المفتاحية', {
      icon: '🗑️',
      position: "top-center",
      style: { direction: 'rtl' }
    })
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

  const handleSubmitConfirm = async (data: FormData, lang: "ar" | "en") => {
    const toastLoadingId = toast.loading(lang === "ar" ? "جاري إضافة السؤال..." : "Adding question...", {
      position: "top-center"
    })

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

      if (!response.ok) throw new Error("Failed to create question")

      toast.success(lang === "ar" ? "تم إضافة السؤال بنجاح" : "Question added successfully", {
        id: toastLoadingId,
        position: "top-center",
        style: { direction: 'rtl' }
      })

      setTimeout(() => router.push("/faq"), 1500)
    } catch (error) {
      toast.error(lang === "ar" ? "فشل في إضافة السؤال" : "Failed to add question", {
        id: toastLoadingId,
        position: "top-center",
        style: { direction: 'rtl' }
      })
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
              arabicContent={<Form lang="ar" forms={forms} onSubmit={(data) => handleSubmitConfirm(data, "ar")} state={state} dispatch={dispatch} />}
              englishContent={<Form lang="en" forms={forms} onSubmit={(data) => handleSubmitConfirm(data, "en")} state={state} dispatch={dispatch} />}
            />
          </CardContent>
        </Card>
      </main>
      <Toaster />
    </div>
  )
}