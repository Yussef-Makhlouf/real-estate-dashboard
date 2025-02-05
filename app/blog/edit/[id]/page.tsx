"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { TabComponent } from "@/components/ui/tab-component";
import { ImageUpload } from "@/components/ui/image-upload";
import { blogPostSchema } from "@/lib/schemas";
import type { z } from "zod";

type FormData = z.infer<typeof blogPostSchema>;
export interface BlogPost {
  _id: string;
  title: string;
  description: string;
  Image: {
    secure_url: string;
  };
  createdAt: string;
  customId: string;
}

export default function EditBlogPost({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(blogPostSchema),
  });

  useEffect(() => {
    // Fetch existing blog data
    const fetchBlogData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/blog/findone/${params.id}`);
        const data = await response.json();

        // Set form values from API data
        setValue("title", data.blog.title);
        setValue("description", data.blog.description);
        setKeywords(data.blog.Keywords || []);
        setValue("image", data.blog.Image.secure_url);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };

    fetchBlogData();
  }, [params.id, setValue]);

  const onSubmit = async (data: FormData) => {
    console.log("Form Data:", data); // Debugging: Log form data
    console.log("Validation Errors:", errors); // Debugging: Log validation errors
    setIsLoading(true);

    try {
        const formData = new FormData();
        formData.append("title", data.title || "");
        formData.append("description", data.description || "");

        // Append keywords
        keywords.forEach((keyword) => {
            formData.append("Keywords", keyword);
        });

        // Append image if it's a File object
        // Handle image upload
    if (data.image instanceof File) {
      formData.append("image", data.image)
    }

        // Make PUT request to update blog
        const response = await fetch(`http://localhost:8080/blog/update/${params.id}`, {
            method: "PUT",
            body: formData,
        });

        console.log("Server Response Status:", response.status); // Debugging

        if (!response.ok) {
            throw new Error("Failed to update blog");
        }

        const result = await response.json();
        console.log("Blog updated successfully:", result);

        // Redirect to blog list page
        setTimeout(() => {
            router.push("/blog");
            router.refresh();
        }, 500);
    } catch (error) {
        console.error("Error updating blog:", error);
    } finally {
        setIsLoading(false);
    }
};
  const addKeyword = () => {
    if (newKeyword && !keywords.includes(newKeyword)) {
      const updatedKeywords = [...keywords, newKeyword];
      setKeywords(updatedKeywords);
      setValue("Keywords", updatedKeywords); // Ensure this matches the schema key
      setNewKeyword("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    const updatedKeywords = keywords.filter((k) => k !== keywordToRemove);
    setKeywords(updatedKeywords);
    setValue("Keywords", updatedKeywords); // Ensure this matches the schema key
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8" dir="rtl">
        <Card>
          <CardHeader>
            <CardTitle>تعديل المقال</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <TabComponent
                arabicContent={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">العنوان (بالعربية)</label>
                      <Input
                        {...register("title")}
                        dir="rtl"
                        className={errors.title ? "border-red-500" : ""}
                      />
                      {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">المحتوى (بالعربية)</label>
                      <RichTextEditor
                        content={watch("description") || ""}
                        onChange={(content) => setValue("description", content)}
                        language="ar"
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm">{errors.description.message}</p>
                      )}
                    </div>
                  </div>
                }
                englishContent={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Title (English)</label>
                      <Input
                        {...register("title")}
                        dir="ltr"
                        className={errors.title ? "border-red-500" : ""}
                      />
                      {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Content (English)</label>
                      <RichTextEditor
                        content={watch("description") || ""}
                        onChange={(content) => setValue("description", content)}
                        language="en"
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm">{errors.description.message}</p>
                      )}
                    </div>
                  </div>
                }
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium">الكلمات المفتاحية</label>
                <div className="flex gap-2">
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="أضف كلمة مفتاحية"
                  />
                  <Button type="button" onClick={addKeyword}>
                    إضافة
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="bg-primary text-primary-foreground px-2 py-1 rounded-md flex items-center gap-1"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">صورة المقال</label>
                <ImageUpload
                  onImagesChange={(images) => setValue("image", images[0])}
                  maxImages={1}
                  initialImages={[watch("image") as string]}
                />
              </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                  </>
                ) : (
                  "حفظ التغييرات"
                )}
                </Button>

            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}