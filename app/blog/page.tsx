"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { TabComponent } from "@/components/ui/tab-component"
import Link from "next/link"
import { Edit, Trash2 } from "lucide-react"

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
      const response = await fetch('http://localhost:8080/blog/?page=1&size=25', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await response.json()

      // Separate blogs based on lang property
      const arabicBlogs = data.blogs.filter((blog: BlogPost) => blog.lang === 'ar')
      const englishBlogs = data.blogs.filter((blog: BlogPost) => blog.lang === 'en')

      setBlogPosts({
        ar: arabicBlogs,
        en: englishBlogs
      })
      setIsLoading(false)
    } catch (err) {
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
        const response = await fetch(`http://localhost:8080/blog/${postToDelete}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
       
        if (!response.ok) {
          throw new Error('Failed to delete blog post')
        }

        fetchBlogPosts()
      } catch (err) {
        console.error('Error deleting post:', err)
      }
    }
    setDeleteDialogOpen(false)
    setPostToDelete(null)
  }

  const BlogGrid = ({ posts }: { posts: BlogPost[] }) => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Card key={post._id} className="overflow-hidden">
          <img
            src={post.Image?.secure_url}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
          <CardHeader>
            <CardTitle>
              <div className="flex flex-col space-y-1">
                <span className="text-lg font-semibold">{post.title}</span>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{post.views} مشاهدة</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {post.Keywords.map((keyword, index) => (
                <span key={index} className="bg-gray-100 px-2 py-1 rounded-md text-sm">
                  {keyword}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {new Date(post.createdAt).toLocaleDateString('ar-SA')}
            </p>
            <div className="flex justify-end space-x-2">
              <Link href={`/blog/edit/${post._id}`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 ml-2" />
                  تعديل
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(post._id)}
              >
                <Trash2 className="h-4 w-4 ml-2" />
                حذف
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Sidebar />
        <main className="pt-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">جاري التحميل...</div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Sidebar />
        <main className="pt-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">{error}</div>
        </main>
      </div>
    )
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
        
        <TabComponent
          arabicContent={<BlogGrid posts={blogPosts.ar} />}
          englishContent={<BlogGrid posts={blogPosts.en} />}
        />
      </main>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="حذف المقال"
        description="هل أنت متأكد من حذف هذا المقال؟"
      />
    </div>
  )
}
