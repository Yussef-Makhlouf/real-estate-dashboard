"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import Link from "next/link"
import { Edit, Trash2 } from "lucide-react"

const blogPosts = [
  {
    id: 1,
    titleAr: "أفضل 10 مناطق للاستثمار العقاري",
    titleEn: "Top 10 Areas for Real Estate Investment",
    date: "2023-06-01",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    titleAr: "كيفية تقييم العقار بشكل صحيح",
    titleEn: "How to Properly Evaluate Real Estate",
    date: "2023-06-15",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    titleAr: "نصائح لشراء منزل أحلامك",
    titleEn: "Tips for Buying Your Dream Home",
    date: "2023-07-01",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function Blog() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    setPostToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (postToDelete) {
      // Here you would typically make an API call to delete the post
      console.log("Deleting post:", postToDelete)
    }
    setDeleteDialogOpen(false)
    setPostToDelete(null)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">المدونة</h2>
          <Link href="/blog/add">
            <Button>إضافة مقال جديد</Button>
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <img src={post.image || "/placeholder.svg"} alt={post.titleAr} className="w-full h-48 object-cover" />
              <CardHeader>
                <CardTitle>
                  <div className="flex flex-col space-y-1">
                    <span className="text-lg">{post.titleAr}</span>
                    <span className="text-sm text-gray-500">{post.titleEn}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">{post.date}</p>
                <div className="flex justify-end space-x-2">
                  <Link href={`/blog/edit/${post.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 ml-2" />
                      تعديل
                    </Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>
                    <Trash2 className="h-4 w-4 ml-2" />
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title="تأكيد الحذف"
          description="هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء."
        />
      </main>
    </div>
  )
}

