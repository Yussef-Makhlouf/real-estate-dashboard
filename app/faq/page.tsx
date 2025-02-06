"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import Link from "next/link"
import { Edit, Trash2 } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQ() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [faqToDelete, setFaqToDelete] = useState<string | null>(null)
  const [faqs, setFaqs] = useState<any[]>([]) // Add a state for FAQ data
  const [loading, setLoading] = useState<boolean>(true) // For loading state

  useEffect(() => {
    // Fetch questions from the API
    const fetchFaqs = async () => {
      try {
        const response = await fetch('http://localhost:8080/question/')
        const data = await response.json()
        setFaqs(data.questionData) // Set the fetched data to the state
      } catch (error) {
        console.error("Error fetching FAQ data:", error)
      } finally {
        setLoading(false) // Stop loading once data is fetched
      }
    }

    fetchFaqs()
  }, [])

  const handleDelete = (id: string) => {
    setFaqToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (faqToDelete) {
      // Here you would typically make an API call to delete the FAQ
      console.log("Deleting FAQ:", faqToDelete)
    }
    setDeleteDialogOpen(false)
    setFaqToDelete(null)
  }

  if (loading) {
    return <div>Loading...</div> // Show loading state while data is being fetched
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">الأسئلة الشائعة</h2>
          <Link href="/faq/add">
            <Button>إضافة سؤال جديد</Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>الأسئلة الأكثر شيوعًا</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq._id} value={`item-${faq._id}`}>
                  <AccordionTrigger>
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <img src="/placeholder.svg" alt="" className="w-10 h-10 rounded-full" />
                      <div className="text-right">
                        <div>{faq.question}</div>
                        <div className="text-sm text-gray-500">{faq.lang === 'ar' ? faq.answer : faq.answer}</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p className="text-right">{faq.answer}</p>
                      <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                        <Link href={`/faq/edit/${faq._id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 ml-2" />
                            تعديل
                          </Button>
                        </Link>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(faq._id)}>
                          <Trash2 className="h-4 w-4 ml-2" />
                          حذف
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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
