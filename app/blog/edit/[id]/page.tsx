"use client"
import { useReducer, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X, Loader2 } from "lucide-react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { ImageUpload } from "@/components/ui/image-upload"
import { blogPostSchema } from "@/lib/schemas"
import { useRouter, useParams } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

// تعريف reducer لإدارة الحالة
const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_KEYWORDS":
      return {
        ...state,
        keywords: {
          ...state.keywords,
          [action.lang]: action.value
        }
      }
    case "SET_NEW_KEYWORD":
      return {
        ...state,
        newKeyword: {
          ...state.newKeyword,
          [action.lang]: action.value
        }
      }
    case "ADD_KEYWORD":
      return {
        ...state,
        keywords: {
          ...state.keywords,
          [action.lang]: [...state.keywords[action.lang], state.newKeyword[action.lang]]
        },
        newKeyword: {
          ...state.newKeyword,
          [action.lang]: ""
        }
      }
    case "REMOVE_KEYWORD":
      return {
        ...state,
        keywords: {
          ...state.keywords,
          [action.lang]: state.keywords[action.lang].filter((kw: string) => kw !== action.keyword)
        }
      }
    case "SET_LOADING":
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [action.lang]: action.value
        }
      }
    default:
      return state
  }
}
export default function EditBlogPost() {
  const [articleLanguage, setArticleLanguage] = useState<'ar' | 'en' | null>(null)
  const [state, dispatch] = useReducer(reducer, {
    keywords: { ar: [], en: [] },
    newKeyword: { ar: "", en: "" },
    isLoading: { ar: false, en: false },
  })

  const router = useRouter()
  const params = useParams()

  const form = useForm({
    resolver: zodResolver(blogPostSchema)
  })

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await fetch(`https://tasis-al-bina.onrender.com/blog/findOne/${params.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        const data = await response.json()

        if (data.blog) {
          const blog = data.blog
          setArticleLanguage(blog.lang)

          form.reset({
            title: blog.title,
            description: blog.description?.replace(/<[^>]*>/g, ''),
            image: blog.Image.secure_url,
            lang: blog.lang
          })

          dispatch({
            type: "SET_KEYWORDS",
            lang: blog.lang,
            value: Array.isArray(blog.Keywords) ? blog.Keywords : blog.Keywords?.split(',') || []
          })
        }
      } catch (error) {
        toast.error("Error fetching blog data")
      }
    }

    if (params.id) {
      fetchBlogData()
    }
  }, [params.id])

  const onSubmit = async (data: any) => {
    if (!articleLanguage) return

    dispatch({ type: "SET_LOADING", lang: articleLanguage, value: true })
    try {
      const formData = new FormData()
      formData.append("title", data.title.trim())
      formData.append("description", data.description.replace(/<[^>]*>/g, '').trim())
      formData.append("Keywords", state.keywords[articleLanguage].join(','))
      formData.append("lang", articleLanguage)

      if (data.image instanceof File) {
        formData.append("image", data.image)
      } else if (typeof data.image === "string" && data.image.startsWith("http")) {
        formData.append("imageUrl", data.image)
      }

      const response = await fetch(`https://tasis-al-bina.onrender.com/blog/update/${params.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to update blog")

      toast.success(articleLanguage === "ar" ? "تم تحديث المقال بنجاح" : "Blog updated successfully")
      router.push("/blog")
    } catch (error) {
      toast.error(articleLanguage === "ar" ? "حدث خطأ أثناء التحديث" : "Error updating blog")
    } finally {
      dispatch({ type: "SET_LOADING", lang: articleLanguage, value: false })
    }
  }

  if (!articleLanguage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-secondary animate-spin"></div>
          </div>
          <div className="mt-4 text-center text-gray-600 font-medium">
            جاري التحميل...
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>
              {articleLanguage === 'ar' ? 'تعديل المقال' : 'Edit Article'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}
              dir={articleLanguage === 'ar' ? 'rtl' : 'ltr'}
              className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    {articleLanguage === 'ar' ? 'العنوان' : 'Title'}
                  </label>
                  <Input
                    {...form.register("title")}
                    dir={articleLanguage === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    {articleLanguage === 'ar' ? 'المحتوى' : 'Content'}
                  </label>
                  <RichTextEditor
                    content={form.watch("description") || ""}
                    onChange={(content) => {
                      form.setValue("description", content, { shouldValidate: true })
                    }}
                    language={articleLanguage}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    {articleLanguage === 'ar' ? 'الكلمات المفتاحية' : 'Keywords'}
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={state.newKeyword[articleLanguage]}
                      onChange={(e) => dispatch({
                        type: "SET_NEW_KEYWORD",
                        lang: articleLanguage,
                        value: e.target.value
                      })}
                      placeholder={articleLanguage === 'ar' ? 'أضف كلمة مفتاحية' : 'Add keyword'}
                      dir={articleLanguage === 'ar' ? 'rtl' : 'ltr'}
                    />
                    <Button
                      type="button"
                      onClick={() => dispatch({
                        type: "ADD_KEYWORD",
                        lang: articleLanguage
                      })}
                    >
                      {articleLanguage === 'ar' ? 'إضافة' : 'Add'}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {state.keywords[articleLanguage].map((keyword: string) => (
                      <span key={keyword} className="bg-primary text-primary-foreground px-2 py-1 rounded-md flex items-center gap-1">
                        {keyword}
                        <button
                          type="button"
                          onClick={() => dispatch({
                            type: "REMOVE_KEYWORD",
                            lang: articleLanguage,
                            keyword
                          })}
                          className="hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    {articleLanguage === 'ar' ? 'صورة المقال' : 'Article Image'}
                  </label>
                  <ImageUpload
                    language={articleLanguage}
                    onImagesChange={(images) => form.setValue("image", images[0])}
                    initialImages={[
                      form.watch("Image")?.secure_url ||
                      form.watch("image")?.secure_url ||
                      form.watch("Image") ||
                      form.watch("image")
                    ].filter(Boolean)}
                    maxImages={10} existingImages={[]} />

                </div>

                <Button
                  type="submit"
                  disabled={state.isLoading[articleLanguage]}
                  className="w-full bg-[#20284DE5] hover:bg-[#AA9554] text-white"

                >
                  {state.isLoading[articleLanguage] ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {articleLanguage === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                    </>
                  ) : (
                    articleLanguage === 'ar' ? 'حفظ التغييرات' : 'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Toaster />
    </div>
  )
}