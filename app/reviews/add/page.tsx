"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Star } from "lucide-react";

// Components
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { TabComponent } from "@/components/ui/tab-component";
import { ImageUpload } from "@/components/ui/image-upload";

// Schema and Types
import { reviewSchema } from "@/lib/schemas";
import type { z } from "zod";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof reviewSchema>;

export default function AddReview() {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const router =useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rate: 1,
      lang: "ar",
    },
  });

  const lang = watch("lang");
  const rating = watch("rate");

  const onSubmit = async (data: FormData) => {
    console.log("Form Data:", data);
    console.log("Image:", image);
    setLoading(true);
    try {
      const formData = new FormData();

      // الحقول المطلوبة
      formData.append("name", data.name);
      formData.append("country", data.country);
      formData.append("description", data.description); // إلزامي
      formData.append("rate", String(data.rate));
      formData.append("lang", data.lang);

      // الحقول الاختيارية
      // if (data.createdBy) formData.append("createdBy", data.createdBy);
      // if (data.customId) formData.append("customId", data.customId);

      // معالجة الصورة
      if (image) {
        formData.append("image", image);
      } else {
        formData.append("image", new Blob()); // إرسال قيمة فارغة إذا لزم
      }

      // إرسال البيانات
      const response = await axios.post(
        "http://localhost:8080/review/create",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        alert("تمت الإضافة بنجاح!");
        reset();
        router.push('/reviews')
        setImage(null);
      }
    } catch (error: any) {
      console.error("فشل في الإضافة:", error);
      alert(
        error.response?.data?.message ||
          "حدث خطأ أثناء الإضافة. يرجى التحقق من البيانات"
      );
    } finally {
      setLoading(false);
    }
  };
  // const stripHtml = (html: string) => {
  //   // استخدام محلل DOM لإزالة الوسوم بشكل آمن
  //   const doc = new DOMParser().parseFromString(html, 'text/html');
  //   const text = doc.body.textContent || '';
    
  //   // إزالة المسافات الزائدة والأحرف الخاصة
  //   return text
  //     .replace(/\u00a0/g, ' ')  // استبدال non-breaking spaces
  //     .replace(/[^\u0600-\u06FF\u0750-\u077F\s،؛؟ء-ي٠-٩]/g, '') // إزالة أي أحرف غير عربية
  //     .trim();
  // };

  useEffect(() => {
    console.log("Form Errors:", errors);
  }, [errors]);
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">إضافة رأي جديد</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit((data) => {
  console.log("Validated Data:", data);
  onSubmit(data);
})} className="space-y-6">
              {/* Language Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  اللغة
                </label>
                <select
                  {...register("lang")}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </div>

              {/* Content Tabs */}
              <TabComponent
                arabicContent={
                  <div className="space-y-4">
                    {/* Name Field */}
                    <div>
                      <Input
                        {...register("name")}
                        placeholder="الاسم الكامل"
                        dir="rtl"
                        className={errors.name?.message ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Country Field */}
                    <div>
                      <Input
                        {...register("country")}
                        placeholder="الدولة"
                        dir="rtl"
                        className={errors.name?.message ? "border-red-500" : ""}
                      />
                      {errors.country && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.country.message}
                        </p>
                      )}
                    </div>

                    {/* Description Editor */}
                    <div>
                      <RichTextEditor
                        content={watch("description") || ""}
                        onChange={(content) => {
                          setValue("description", content, {
                            shouldValidate: true,
                          });
                        }}
                        language='ar'
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                  </div>
                }
                englishContent={
                  <div className="space-y-4">
                    {/* Name Field */}
                    <div>
                      <Input
                        {...register("name")}
                        placeholder="Full Name"
                        dir="ltr"
                        className={
                          errors.country?.message ? "border-red-500" : ""
                        }
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Country Field */}
                    <div>
                      <Input
                        {...register("country")}
                        placeholder="Country"
                        dir="ltr"
                        className={
                          errors.country?.message ? "border-red-500" : ""
                        }
                      />
                      {errors.country && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.country.message}
                        </p>
                      )}
                    </div>

                    {/* Description Editor */}
                    <div>
                      <RichTextEditor
                        content={watch("description") || ""}
                        onChange={(content) => {
                          setValue("description", content, {
                            shouldValidate: true,
                          });
                        }}
                        language='en'
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                  </div>
                }
              />

              {/* Rating System */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  التقييم
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setValue("rate", value)}
                      className={`p-1 transition-colors ${
                        rating >= value ? "text-yellow-400" : "text-gray-300"
                      } hover:text-yellow-500`}
                    >
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                </div>
                <input type="hidden" {...register("rate")} />
                {errors.rate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.rate.message}
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  صورة المراجعة
                </label>
                <ImageUpload 
                 language={lang}
                  onImagesChange={(images) => setImage(images[0])}
                  maxImages={1}
                />
              </div>

              {/* Additional Fields */}
              <div className="space-y-4">
                {/* <Input
                  {...register("createdBy")}
                  placeholder="تم الإنشاء بواسطة (اختياري)"
                />
                <Input
                  {...register("customId")}
                  placeholder="معرف مخصص (اختياري)"
                /> */}
              </div>

              {/* Submit Button */}
              <Button
  type="submit"
  disabled={loading}
  className="w-full py-3 bg-green-600 hover:bg-green-700"
>
  {loading ? (
    <span className="flex items-center justify-center">
      
      جاري الإضافة...
    </span>
  ) : (
    "إضافة المراجعة"
  )}
</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
