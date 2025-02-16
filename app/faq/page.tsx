"use client"
import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import Link from "next/link"
import { Edit, Trash2, Plus, Search, HelpCircle, Globe, Loader2 } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import toast, { Toaster } from 'react-hot-toast'

interface FAQ {
  _id: string
  question: string
  answer: string
  lang: 'ar' | 'en'
}

export default function FAQ() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [faqToDelete, setFaqToDelete] = useState<string | null>(null)
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [questionToDelete, setQuestionToDelete] = useState(null)
  const [questions, setQuestions] = useState({ ar: [], en: [] })


  const fetchFaqs = async () => {
    try {
      const response = await fetch('https://tasis-al-bina.onrender.com/question/')
      const data = await response.json()
      setFaqs(data.questionData)
    } catch (error) {
      console.error("Error fetching FAQ data:", error)
      toast.error("فشل في تحميل الأسئلة الشائعة")
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = async () => {
    if (!faqToDelete) return

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("يرجى تسجيل الدخول أولاً")
        return
      }

      const response = await fetch(`https://tasis-al-bina.onrender.com/question/${faqToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setFaqs(prevFaqs => prevFaqs.filter(faq => faq._id !== faqToDelete))
        toast.success("تم حذف السؤال بنجاح")
      } else {
        const error = await response.json()
        throw new Error(error.message || "فشل حذف السؤال")
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error)
      toast.error("حدث خطأ أثناء حذف السؤال")
    } finally {
      setDeleteDialogOpen(false)
      setFaqToDelete(null)
    }
  }

  const handleDelete = (id: string) => {
    setFaqToDelete(id)
    setDeleteDialogOpen(true)
  }

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: faqs.length,
    arabic: faqs.filter(faq => faq.lang === 'ar').length,
    english: faqs.filter(faq => faq.lang === 'en').length,
  }
  useEffect(() => {
    fetchFaqs()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-20 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">الأسئلة الشائعة</h1>
                <p className="text-gray-500 mt-1">إدارة وعرض الأسئلة المتكررة</p>
              </div>
              <Link href="/faq/add">
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-5 w-5 ml-2" />
                  إضافة سؤال جديد
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">إجمالي الأسئلة</p>
                      <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
                    </div>
                    <HelpCircle className="h-8 w-8 text-primary opacity-80" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">الأسئلة العربية</p>
                      <h3 className="text-2xl font-bold mt-1">{stats.arabic}</h3>
                    </div>
                    <Globe className="h-8 w-8 text-green-500 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">الأسئلة الإنجليزية</p>
                      <h3 className="text-2xl font-bold mt-1">{stats.english}</h3>
                    </div>
                    <Globe className="h-8 w-8 text-blue-500 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="relative mb-6">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-4 pr-10 h-11 bg-white"
                placeholder="البحث في الأسئلة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader className="border-b bg-white/50">
              <CardTitle className="text-2xl font-bold">قائمة الأسئلة الشائعة</CardTitle>
              <CardDescription>جميع الأسئلة المتكررة وإجاباتها</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="border rounded-lg p-4">
                      <Skeleton className="h-6 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              ) : filteredFaqs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {filteredFaqs.map((faq) => (
                    <AccordionItem
                      key={faq._id}
                      value={`item-${faq._id}`}
                      className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex items-center gap-4 text-right w-full">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              faq.lang === 'ar' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            } mt-2`}>
                              {faq.lang === 'ar' ? 'عربي' : 'English'}
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 py-4 bg-gray-50">
                        <div className="space-y-4">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                          <div className="flex justify-end gap-3">
                            <Link href={`/faq/edit/${faq._id}`}>
                              <Button variant="outline" size="sm" className="hover:bg-white">
                                <Edit className="h-4 w-4 ml-2" />
                                تعديل
                              </Button>
                            </Link>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(faq._id)}
                              className="hover:bg-red-600"
                            >
                              <Trash2 className="h-4 w-4 ml-2" />
                              حذف
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-12">
                  <HelpCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">لا توجد أسئلة</h3>
                  <p className="mt-2 text-gray-500">لم يتم العثور على أسئلة تطابق بحثك</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title="تأكيد الحذف"
          description="هل أنت متأكد من حذف هذا السؤال؟ لا يمكن التراجع عن هذا الإجراء."
        />
      </main>
      <Toaster />
    </div>
  )
}
