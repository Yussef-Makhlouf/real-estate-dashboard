"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import Link from "next/link"
import { Edit, Trash2, Plus, Search } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "react-hot-toast"
export default function FAQ() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [faqToDelete, setFaqToDelete] = useState<string | null>(null)
  const [faqs, setFaqs] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch('http://localhost:8080/question/')
        const data = await response.json()
        setFaqs(data.questionData)
      } catch (error) {
        console.error("Error fetching FAQ data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFaqs()
  }, [])
// Update the confirmDelete function
const confirmDelete = async () => {
  if (!faqToDelete) return;

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("يرجى تسجيل الدخول أولاً");
      return;
    }

    const response = await fetch(`http://localhost:8080/question/${faqToDelete}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      // Remove the deleted FAQ from the state
      setFaqs(prevFaqs => prevFaqs.filter(faq => faq._id !== faqToDelete));
      toast.success("تم حذف السؤال بنجاح");
    } else {
      const error = await response.json();
      throw new Error(error.message || "فشل حذف السؤال");
    }
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    toast.error("حدث خطأ أثناء حذف السؤال");
  } finally {
    setDeleteDialogOpen(false);
    setFaqToDelete(null);
  }
};
  const handleDelete = (id: string) => {
    setFaqToDelete(id)
    setDeleteDialogOpen(true)
  }

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">الأسئلة الشائعة</h2>
              <p className="text-gray-500 mt-2">إدارة وعرض الأسئلة المتكررة</p>
            </div>
            <Link href="/faq/add">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                <Plus className="h-4 w-4 ml-2" />
                إضافة سؤال جديد
              </Button>
            </Link>
          </div>

          <div className="relative mb-6">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10 bg-white"
              placeholder="البحث في الأسئلة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="border-b bg-white/50 backdrop-blur-sm">
            <CardTitle className="text-2xl font-semibold text-gray-800">الأسئلة الأكثر شيوعًا</CardTitle>
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
            ) : (
              <Accordion type="single" collapsible className="w-full space-y-4">
                {filteredFaqs.map((faq) => (
                  <AccordionItem 
                    key={faq._id} 
                    value={`item-${faq._id}`}
                    className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center gap-4 text-right">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {faq.lang === 'ar' ? 'عربي' : 'English'}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 bg-gray-50">
                      <div className="space-y-4">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        <div className="flex justify-end gap-3">
                          <Link href={`/faq/edit/${faq._id}`}>
                            <Button variant="outline" size="sm" className="hover:bg-gray-100">
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
            )}
          </CardContent>
        </Card>

        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title="تأكيد الحذف"
          description="هل أنت متأكد من حذف هذا السؤال؟ لا يمكن التراجع عن هذا الإجراء."
        />
      </main>
    </div>
  )
}
