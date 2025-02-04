"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import Link from "next/link"
import { Edit, Trash2 } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    id: 1,
    questionAr: "كيف يمكنني شراء عقار؟",
    questionEn: "How can I purchase a property?",
    answerAr:
      "يمكنك شراء عقار من خلال التواصل مع أحد وكلائنا المعتمدين. سيقومون بمساعدتك في العثور على العقار المناسب وإتمام عملية الشراء.",
    answerEn:
      "You can purchase a property by contacting one of our certified agents. They will assist you in finding the right property and completing the purchase process.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    questionAr: "ما هي الوثائق المطلوبة لبيع عقار؟",
    questionEn: "What documents are required to sell a property?",
    answerAr:
      "تشمل الوثائق المطلوبة لبيع عقار: صك الملكية، وثيقة إثبات الهوية، شهادة فك الرهن (إن وجدت)، وتصريح البلدية.",
    answerEn:
      "The documents required to sell a property include: property deed, proof of identity, mortgage release certificate (if applicable), and municipal permit.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    questionAr: "كم تستغرق عملية نقل الملكية؟",
    questionEn: "How long does the property transfer process take?",
    answerAr: "عادة ما تستغرق عملية نقل الملكية من 7 إلى 14 يوم عمل، اعتمادًا على تعقيد الصفقة والوثائق المتوفرة.",
    answerEn:
      "The property transfer process usually takes 7 to 14 business days, depending on the complexity of the transaction and the available documents.",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function FAQ() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [faqToDelete, setFaqToDelete] = useState<number | null>(null)

  const handleDelete = (id: number) => {
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
                <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                  <AccordionTrigger>
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <img src={faq.image || "/placeholder.svg"} alt="" className="w-10 h-10 rounded-full" />
                      <div className="text-right">
                        <div>{faq.questionAr}</div>
                        <div className="text-sm text-gray-500">{faq.questionEn}</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p className="text-right">{faq.answerAr}</p>
                      <p className="text-left text-gray-500">{faq.answerEn}</p>
                      <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                        <Link href={`/faq/edit/${faq.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 ml-2" />
                            تعديل
                          </Button>
                        </Link>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(faq.id)}>
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

