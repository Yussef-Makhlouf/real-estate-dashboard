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
import { faqSchema } from "@/lib/schemas"
import { useToast } from "@/components/ui/use-toast"
import type { z } from "zod"

type FormData = z.infer<typeof faqSchema>

export default function EditFAQ() {
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
    // resolver: zodResolver(faqSchema),
    defaultValues: { lang: 'ar' }
  })

  const {
    register: registerEn,
    handleSubmit: handleSubmitEn,
    setValue: setValueEn,
    watch: watchEn,
    formState: { errors: errorsEn },
  } = useForm<FormData>({
    // resolver: zodResolver(faqSchema),
    defaultValues: { lang: 'en' }
  })

  useEffect(() => {
    const fetchFAQData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/question/${params.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        const data = await response.json()
        // Handle Arabic data
        
        if (data.questionData.lang === 'ar') {
          setValueAr('question', data.questionData.question)
          setValueAr('answer', data.questionData.answer)
         }

        // Handle English data
        if (data.questionData.lang === 'en') {
          setValueEn('question', data.questionData.question)
          setValueEn('answer', data.questionData.answer)
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "خطأ",
          description: "حدث خطأ أثناء جلب بيانات السؤال الشائع"
        })
      }
    }

    fetchFAQData()
  }, [params.id, setValueAr, setValueEn, toast])

  const onSubmitArabic = async (data: FormData) => {
    setIsLoadingAr(true)
    try {
      const formData = new FormData()
      formData.append('question', data.question)
      formData.append('answer', data.answer)
      formData.append('keywords', JSON.stringify(keywordsAr))
      formData.append('lang', 'ar')

  
      const response = await fetch(`http://localhost:8080/question/update/${params.id}`, {
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

      router.push('/faq')
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
      formData.append('question', data.question || '')
      formData.append('answer', data.answer || '')
      formData.append('lang', 'en')

      keywordsEn.forEach(keyword => {
        formData.append('keywords[]', keyword)
      })

  
      console.log(formData);
      

      const response = await fetch(`http://localhost:8080/question/update/${params.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      })

      const result = await response.json()
      console.log("Server Response:", result) // Debugging line
      
      if (!response.ok) {
        console.error("Error Response:", result) // Debugging line
        throw new Error(result.message || "Failed to update")
      }
      toast({
        title: "Success",
        description: "English version updated successfully"
      })

      router.push('/faq')
    } catch (error) {
      console.error('Update error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while updating the English version"
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
            <CardTitle>تعديل السؤال الشائع</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitAr(onSubmitArabic)} className="space-y-6">
              <TabComponent
                arabicContent={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">السؤال (بالعربية)</label>
                      <Input
                        {...registerAr("question")}
                        className={errorsAr.question ? "border-red-500" : ""}
                      />
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
                  </div>
                }
                englishContent={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Question (English)</label>
                      <Input
                        {...registerEn("question")}
                        className={errorsEn.question ? "border-red-500" : ""}
                      />
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
                  </div>
                }
              />
<div className="flex justify-end space-x-2">
  <Button
    type="button"
    variant="primary"
    disabled={isLoadingAr || isLoadingEn}
    onClick={() => {
      handleSubmitAr(onSubmitArabic)()
      handleSubmitEn(onSubmitEnglish)()
    }}
  >
    {isLoadingAr || isLoadingEn ? (
      <Loader2 className="animate-spin h-5 w-5" />
    ) : (
      "Save Changes"
    )}
  </Button>
</div>

            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
