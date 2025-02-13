"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import type { z } from "zod";
import { categorySchema } from "@/lib/schemas"; // تأكد من وجود هذا المخطط

// Components
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { TabComponent } from "@/components/ui/tab-component";
import { ImageUpload } from "@/components/ui/image-upload";
import { useRouter } from "next/navigation";


type FormData = z.infer<typeof categorySchema>;

export default function AddCategory() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      lang: "ar",
      area: 0,
      coordinates: {
        latitude: 0,
        longitude: 0,
      },
    }
  });

  const lang = watch("lang");

  const onSubmit = async (data: FormData) => {
    
    setLoading(true);
    try {
      const formData = new FormData();
  
      // إضافة الحقول الأساسية
      formData.append("title", data.title);
      formData.append("area", String(data.area));
      formData.append("description", data.description);
      formData.append("location", data.location);
      formData.append("lang", data.lang);
  
      // إرسال الإحداثيات كحقول منفصلة
      formData.append("latitude", String(data.coordinates.latitude));
      formData.append("longitude", String(data.coordinates.longitude));
  
      // معالجة الصورة
      if (data.image) {
        formData.append("image", data.image);
      }
  
      // إرسال البيانات
      console.log(formData);
      
      const response = await axios.post(
        "http://localhost:8080/category/create",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
  
      if (response.status === 201) {
        alert(lang === 'ar' ? "تمت الإضافة بنجاح!" : "Added successfully!");
        reset();
        router.push('/category');
      }
    } catch (error: any) {
      console.error("Error:", error);
      alert(
        error.response?.data?.message ||
        error.message ||
        (lang === 'ar' ? "حدث خطأ أثناء الإضافة" : "An error occurred")
      );
    } finally {
      setLoading(false);
    }
  };
  
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
            <CardTitle className="text-2xl">
              {lang === 'ar' ? "إضافة فئة جديدة" : "Add New Category"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* اختيار اللغة */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {lang === 'ar' ? "اللغة" : "Language"}
                </label>
                <select
                  {...register("lang")}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </div>

              {/* المحتوى حسب اللغة */}
              <TabComponent
                arabicContent={
                  <div className="space-y-4">
                    <Input
                      {...register("title", { required: true })}
                      placeholder="اسم الفئة"
                      dir="rtl"
                      // error={errors.title}
                    />
                    
                    <Input
                      {...register("area", { 
                        required: true,
                        valueAsNumber: true
                      })}
                      placeholder="المساحة"
                      dir="rtl"
                      type="number"
                      // error={errors.area}
                    />

                    <Input
                      {...register("location", { required: true })}
                      placeholder="الموقع"
                      dir="rtl"
                      // error={errors.location}
                    />

                    <RichTextEditor
                      content={watch("description") || ""}
                      onChange={(content) => {
                        setValue("description", content, {
                          shouldValidate: true,
                          shouldDirty: true
                        });
                      }}
                      language="ar"
                      // error={errors.description}
                    />

                    <div className="space-y-2">
                      <Input
                        {...register("coordinates.latitude", {
                          required: true,
                          valueAsNumber: true
                        })}
                        placeholder="خط العرض"
                        dir="rtl"
                        type="number"
                        step="any"
                        // error={errors.coordinates?.latitude}
                      />
                      
                      <Input
                        {...register("coordinates.longitude", {
                          required: true,
                          valueAsNumber: true
                        })}
                        placeholder="خط الطول"
                        dir="rtl"
                        type="number"
                        step="any"
                        // error={errors.coordinates?.longitude}
                      />
                    </div>
                  </div>
                }
                englishContent={
                  <div className="space-y-4">
                    <Input
                      {...register("title", { required: true })}
                      placeholder="Category Title"
                      dir="ltr"
                      // error={errors.title}
                    />
                    
                    <Input
                      {...register("area", { 
                        required: true,
                        valueAsNumber: true
                      })}
                      placeholder="Area"
                      dir="ltr"
                      type="number"
                      // error={errors.area}
                    />

                    <Input
                      {...register("location", { required: true })}
                      placeholder="Location"
                      dir="ltr"
                      // error={errors.location}
                    />

                    <RichTextEditor
                      content={watch("description") || ""}
                      onChange={(content) => {
                        setValue("description", content, {
                          shouldValidate: true,
                          shouldDirty: true
                        });
                      }}
                      language="en"
                      // error={errors.description}
                    />

                    <div className="space-y-2">
                      <Input
                        {...register("coordinates.latitude", {
                          required: true,
                          valueAsNumber: true
                        })}
                        placeholder="Latitude"
                        dir="ltr"
                        type="number"
                        step="any"
                        // error={errors.coordinates?.latitude}
                      />
                      
                      <Input
                        {...register("coordinates.longitude", {
                          required: true,
                          valueAsNumber: true
                        })}
                        placeholder="Longitude"
                        dir="ltr"
                        type="number"
                        step="any"
                        // error={errors.coordinates?.longitude}
                      />
                    </div>
                  </div>
                }
              />

              {/* تحميل الصورة */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {lang === 'ar' ? "صورة الفئة" : "Category Image"}
                </label>
                <ImageUpload 
                  language={lang}
                  onImagesChange={(images) => {
                    setValue("image", images[0], { shouldValidate: true });
                  }}
                  maxImages={1}
                />
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.image.message}
                  </p>
                )}
              </div>

              {/* زر الإرسال */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    {lang === 'ar' ? "جاري الإضافة..." : "Submitting..."}
                  </span>
                ) : (
                  lang === 'ar' ? "إضافة الفئة" : "Add Category"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}