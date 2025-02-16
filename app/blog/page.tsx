
"use client"
import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { TabComponent } from "@/components/ui/tab-component"
import Link from "next/link"
import { Edit, Trash2, Plus, Eye, Calendar, Tag, Loader2, AlertCircle, BookOpen } from "lucide-react"
import toast, { Toaster } from 'react-hot-toast';


interface BlogPost {
  _id: string
  title: string
  description: string
  Image: {
    secure_url: string
  }
  createdAt: string
  customId: string
  lang: string
  Keywords: string[]
  views: number
}

interface BlogData {
  ar: BlogPost[]
  en: BlogPost[]
}

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogData>({ ar: [], en: [] })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('https://tasis-al-bina.onrender.com/blog/?page=1&size=6', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
  
      const data = await response.json()
      const arabicBlogs = data.blogs.filter((blog: BlogPost) => blog.lang === 'ar')
      const englishBlogs = data.blogs.filter((blog: BlogPost) => blog.lang === 'en')
  
      setBlogPosts({
        ar: arabicBlogs,
        en: englishBlogs
      })
      setIsLoading(false)
    } catch (err) {
      toast.error('حدث خطأ أثناء تحميل المقالات')
      setError('Error fetching blog posts')
      setIsLoading(false)
    }
  }

  const handleDelete = (id: string) => {
    setPostToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (postToDelete) {
      try {
        const response = await fetch(`https://tasis-al-bina.onrender.com/blog/delete/${postToDelete}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (!response.ok) throw new Error('Failed to delete blog post')
        
        toast.success('تم حذف المقال بنجاح')
        fetchBlogPosts()
      } catch (err) {
        toast.error('حدث خطأ أثناء حذف المقال')
        console.error('Error deleting post:', err)
      }
    }
    setDeleteDialogOpen(false)
    setPostToDelete(null)
  }
  
  const BlogGrid = ({ posts }: { posts: BlogPost[] }) => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" dir="rtl">
      {posts.map((post) => (
        <Card key={post._id} className="group flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200">
          <div className="relative aspect-[16/9] overflow-hidden">
            <img
              src={post.Image?.secure_url}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {post.views}
            </div>
          </div>
  
          <CardHeader className="space-y-2 flex-1">
            <CardTitle className="text-xl font-bold line-clamp-2 hover:text-[#20284D] transition-colors">
              {post.title}
            </CardTitle>
            <CardDescription className="flex items-center text-gray-500 text-sm">
              <Calendar className="w-4 h-4 ml-2" />
              {new Date(post.createdAt).toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </CardDescription>
          </CardHeader>
  
          <CardContent className="flex-1 space-y-4">
            <div className="flex flex-wrap gap-2">
              {post.Keywords.slice(0, 3).map((keyword, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-[#20284D] hover:text-white transition-colors"
                >
                  <Tag className="w-3 h-3 ml-1" />
                  {keyword}
                </span>
              ))}
              {post.Keywords.length > 3 && (
                <span className="text-sm text-gray-500">+{post.Keywords.length - 3}</span>
              )}
            </div>
            
            <div className="prose prose-sm">
              <p className="text-gray-600 line-clamp-3">
                {post.description}
              </p>
            </div>
  
            <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4 border-t">
              <Link href={`/blog/edit/${post._id}`}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-[#20284DE5] text-white hover:bg-[#AA9554] transition-colors duration-300"
                >
                  <Edit className="h-4 w-4 ml-2" />
                  تعديل
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(post._id)}
                className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-300"
              >
                <Trash2 className="h-4 w-4 ml-2" />
                حذف
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
  
      {posts.length === 0 && (
        <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">لا توجد مقالات</h3>
          <p className="mt-2 text-gray-500">ابدأ بإضافة مقالات جديدة</p>
        </div>
      )}
    </div>
  )
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Header />
        <Sidebar />
        <main className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
              <p className="text-gray-500">جاري تحميل المقالات...</p>
            </div>
          </div>
        </main>
 
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Header />
        <Sidebar />
        <main className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">المدونة</h1>
              <p className="mt-1 text-gray-500">إدارة ونشر المقالات</p>
            </div>
            <Link href="/blog/add">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-5 w-5 ml-2" />
                إضافة مقال جديد
              </Button>
            </Link>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <TabComponent
                arabicContent={<BlogGrid posts={blogPosts.ar} />}
                englishContent={<BlogGrid posts={blogPosts.en} />}
              />
            </CardContent>
          </Card>
        </div>
      </main>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="تأكيد الحذف"
        description="هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء."
      />
        <Toaster/>
    </div>
  )
}
