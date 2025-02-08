// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Header } from "@/components/Header";
// import { Sidebar } from "@/components/Sidebar";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { TabComponent } from "@/components/ui/tab-component";
// import { reviewSchema } from "@/lib/schemas";

// type FormData = z.infer<typeof reviewSchema>;

// export default function EditReview({ params }: { params: { id: string } }) {
//   const { id } = params;
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isLoadingAr, setIsLoadingAr] = useState(false);
//   const [isLoadingEn, setIsLoadingEn] = useState(false);

//   const arForm = useForm<FormData>({
//     resolver: zodResolver(reviewSchema),
//     defaultValues: { lang: "ar" },
//   });

//   const enForm = useForm<FormData>({
//     resolver: zodResolver(reviewSchema),
//     defaultValues: { lang: "en" },
//   });

//   useEffect(() => {
//     const fetchReview = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8080/review/${id}`);
//         const data = response.data.review;

//         const formValues = {
//           lang: data.lang,
//           name: data.name,
//           country: data.country,
//           description: data.description,
//           rate: data.rate,
//           image: data.Image,
//           createdBy: data.createdBy,
//           customId: data.customId,
//           createdAt: data.createdAt,
//           updatedAt: data.updatedAt,
//         };

//         if (data.lang === "ar") {
//           arForm.reset(formValues);
//         } else {
//           enForm.reset(formValues);
//         }
//       } catch (error) {
//         setError("فشل في تحميل البيانات");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReview();
//   }, [id]);

//   const handleFormSubmit = async (data: FormData, lang: "ar" | "en") => {
//     console.log("بدء عملية الحفظ...", data);

//     try {
//       lang === "ar" ? setIsLoadingAr(true) : setIsLoadingEn(true);

//       const formData = new FormData();
//       formData.append("lang", lang);
//       formData.append("name", data.name);
//       formData.append("country", data.country);
//       formData.append("description", data.description);
//       formData.append("rate", data.rate.toString());
//       // formData.append("createdBy", data.createdBy);
//       // formData.append("customId", data.customId);
//       // formData.append("createdAt", new Date().toISOString());
//       // formData.append("updatedAt", new Date().toISOString());

//       if (data.image) {
//         formData.append("image", data.image.secure_url);
//       }

//       console.log("بيانات الإرسال:", Object.fromEntries(formData.entries()));

//       const response = await axios.put(
//         `http://localhost:8080/review/update/${id}`,
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       router.push("/reviews");
//     } catch (error: any) {
//       console.error("حدث خطأ:", error.response?.data || error.message);
//       setError(error.response?.data?.message || "حدث خطأ غير متوقع");
//     } finally {
//       lang === "ar" ? setIsLoadingAr(false) : setIsLoadingEn(false);
//     }
//   };

//   if (loading) return <div className="text-center mt-10">جاري التحميل...</div>;
//   if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Header />
//       <Sidebar />
//       <main className="pt-16 px-4 sm:px-6 lg:px-8">
//         <Card>
//           <CardHeader>
//             <CardTitle>تعديل التقييم</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <TabComponent
//               arabicContent={
//                 <form onSubmit={arForm.handleSubmit((data) => handleFormSubmit(data, "ar"))}>
//                   <div className="space-y-4">
//                     {/* حقل الاسم */}
//                     <div>
//                       <Label>الاسم</Label>
//                       <Input
//                         {...arForm.register("name")}
//                         dir="rtl"
//                         className={arForm.formState.errors.name ? "border-red-500" : ""}
//                       />
//                       {arForm.formState.errors.name && (
//                         <p className="text-red-500 text-sm mt-1">{arForm.formState.errors.name.message}</p>
//                       )}
//                     </div>

//                     {/* حقل الدولة */}
//                     <div>
//                       <Label>الدولة</Label>
//                       <Input
//                         {...arForm.register("country")}
//                         dir="rtl"
//                         className={arForm.formState.errors.country ? "border-red-500" : ""}
//                       />
//                       {arForm.formState.errors.country && (
//                         <p className="text-red-500 text-sm mt-1">{arForm.formState.errors.country.message}</p>
//                       )}
//                     </div>

//                     {/* حقل التقييم */}
//                     <div>
//                       <Label>التقييم</Label>
//                       <Input
//                         type="number"
//                         {...arForm.register("rate", { valueAsNumber: true })}
//                         min="1"
//                         max="5"
//                         className={arForm.formState.errors.rate ? "border-red-500" : ""}
//                       />
//                       {arForm.formState.errors.rate && (
//                         <p className="text-red-500 text-sm mt-1">{arForm.formState.errors.rate.message}</p>
//                       )}
//                     </div>

//                     {/* حقل التعليق */}
//                     <div>
//                       <Label>التعليق</Label>
//                       <Textarea
//                         {...arForm.register("description")}
//                         dir="rtl"
//                         className={arForm.formState.errors.description ? "border-red-500" : ""}
//                       />
//                       {arForm.formState.errors.description && (
//                         <p className="text-red-500 text-sm mt-1">{arForm.formState.errors.description.message}</p>
//                       )}
//                     </div>

//                     <Button
//                       type="submit"
//                       className="w-full bg-blue-600 hover:bg-blue-700"
//                       disabled={isLoadingAr}
//                     >
//                       {isLoadingAr ? "جاري الحفظ..." : "حفظ التغييرات"}
//                     </Button>
//                   </div>
//                 </form>
//               }
//               englishContent={
//                 <form onSubmit={enForm.handleSubmit((data) => handleFormSubmit(data, "en"))}>
//                   <div className="space-y-4">
//                     {/* حقل الاسم */}
//                     <div>
//                       <Label>Name</Label>
//                       <Input
//                         {...enForm.register("name")}
//                         className={enForm.formState.errors.name ? "border-red-500" : ""}
//                       />
//                       {enForm.formState.errors.name && (
//                         <p className="text-red-500 text-sm mt-1">{enForm.formState.errors.name.message}</p>
//                       )}
//                     </div>

//                     {/* حقل الدولة */}
//                     <div>
//                       <Label>Country</Label>
//                       <Input
//                         {...enForm.register("country")}
//                         className={enForm.formState.errors.country ? "border-red-500" : ""}
//                       />
//                       {enForm.formState.errors.country && (
//                         <p className="text-red-500 text-sm mt-1">{enForm.formState.errors.country.message}</p>
//                       )}
//                     </div>

//                     {/* حقل التقييم */}
//                     <div>
//                       <Label>Rating</Label>
//                       <Input
//                         type="number"
//                         {...enForm.register("rate", { valueAsNumber: true })}
//                         min="1"
//                         max="5"
//                         className={enForm.formState.errors.rate ? "border-red-500" : ""}
//                       />
//                       {enForm.formState.errors.rate && (
//                         <p className="text-red-500 text-sm mt-1">{enForm.formState.errors.rate.message}</p>
//                       )}
//                     </div>

//                     {/* حقل التعليق */}
//                     <div>
//                       <Label>Comment</Label>
//                       <Textarea
//                         {...enForm.register("description")}
//                         className={enForm.formState.errors.description ? "border-red-500" : ""}
//                       />
//                       {enForm.formState.errors.description && (
//                         <p className="text-red-500 text-sm mt-1">{enForm.formState.errors.description.message}</p>
//                       )}
//                     </div>

//                     <Button
//                       type="submit"
//                       className="w-full bg-blue-600 hover:bg-blue-700"
//                       disabled={isLoadingEn}
//                     >
//                       {isLoadingEn ? "Saving..." : "Save Changes"}
//                     </Button>
//                   </div>
//                 </form>
//               }
//             />
//           </CardContent>
//         </Card>
//       </main>
//     </div>
//   );
// }
// ==================================
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabComponent } from "@/components/ui/tab-component";
import { reviewSchema } from "@/lib/schemas";
import { ImageUpload } from "@/components/ui/image-upload"; // استيراد مكون رفع الصور

type FormData = z.infer<typeof reviewSchema>;

export default function EditReview({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingAr, setIsLoadingAr] = useState(false);
  const [isLoadingEn, setIsLoadingEn] = useState(false);
  const [image, setImage] = useState<File | null>(null); // حالة لتخزين الصورة

  const arForm = useForm<FormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { lang: "ar" },
  });

  const enForm = useForm<FormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { lang: "en" },
  });

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/review/${id}`);
        const data = response.data.review;

        const formValues = {
          lang: data.lang,
          name: data.name,
          country: data.country,
          description: data.description,
          rate: data.rate,
          image: data.Image,
          createdBy: data.createdBy,
          customId: data.customId,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };

        if (data.lang === "ar") {
          arForm.reset(formValues);
        } else {
          enForm.reset(formValues);
        }
      } catch (error) {
        setError("فشل في تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id]);

  const handleFormSubmit = async (data: FormData, lang: "ar" | "en") => {
    console.log("بدء عملية الحفظ...", data);

    try {
      lang === "ar" ? setIsLoadingAr(true) : setIsLoadingEn(true);

      const formData = new FormData();
      formData.append("lang", lang);
      formData.append("name", data.name);
      formData.append("country", data.country);
      formData.append("description", data.description);
      formData.append("rate", data.rate.toString());
      // formData.append("createdBy", data.createdBy);
      // formData.append("customId", data.customId);
      formData.append("createdAt", new Date().toISOString());
      formData.append("updatedAt", new Date().toISOString());

      // إذا تم رفع صورة، أضفها إلى البيانات
      if (image) {
        formData.append("image", image);
      }

      console.log("بيانات الإرسال:", Object.fromEntries(formData.entries()));

      const response = await axios.put(
        `http://localhost:8080/review/update/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      router.push("/reviews");
    } catch (error: any) {
      console.error("حدث خطأ:", error.response?.data || error.message);
      setError(error.response?.data?.message || "حدث خطأ غير متوقع");
    } finally {
      lang === "ar" ? setIsLoadingAr(false) : setIsLoadingEn(false);
    }
  };

  if (loading) return <div className="text-center mt-10">جاري التحميل...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>تعديل التقييم</CardTitle>
          </CardHeader>
          <CardContent>
            <TabComponent
              arabicContent={
                <form
                  onSubmit={arForm.handleSubmit((data) =>
                    handleFormSubmit(data, "ar")
                  )}
                >
                  <div className="space-y-4">
                    {image && (
                      <img
                        src={URL.createObjectURL(image)} // عرض الصورة المرفوعة
                        alt="Current Review"
                        className="w-32 h-32 mb-4"
                      />
                    )}
                    <div>
                      <Label>رفع صورة جديدة</Label>
                      <ImageUpload onImagesChange={(images) => setImage(images[0])} maxImages={1} /> {/* استخدام مكون رفع الصور */}
                    </div>

                    <div>
                      <Label>الاسم</Label>
                      <Input
                        {...arForm.register("name")}
                        dir="rtl"
                        className={
                          arForm.formState.errors.name ? "border-red-500" : ""
                        }
                      />
                      {arForm.formState.errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {arForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label>الدولة</Label>
                      <Input
                        {...arForm.register("country")}
                        dir="rtl"
                        className={
                          arForm.formState.errors.country
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {arForm.formState.errors.country && (
                        <p className="text-red-500 text-sm mt-1">
                          {arForm.formState.errors.country.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label>التقييم</Label>
                      <Input
                        type="number"
                        {...arForm.register("rate", { valueAsNumber: true })}
                        min="1"
                        max="5"
                        className={
                          arForm.formState.errors.rate ? "border-red-500" : ""
                        }
                      />
                      {arForm.formState.errors.rate && (
                        <p className="text-red-500 text-sm mt-1">
                          {arForm.formState.errors.rate.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label>التعليق</Label>
                      <Textarea
                        {...arForm.register("description")}
                        dir="rtl"
                        className={
                          arForm.formState.errors.description
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {arForm.formState.errors.description && (
                        <p className="text-red-500 text-sm mt-1">
                          {arForm.formState.errors.description.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isLoadingAr}
                    >
                      {isLoadingAr ? "جاري الحفظ..." : "حفظ التغييرات"}
                    </Button>
                  </div>
                </form>
              }
              englishContent={
                <form
                  onSubmit={enForm.handleSubmit((data) =>
                    handleFormSubmit(data, "en")
                  )}
                >
                  <div className="space-y-4">
                    {image && (
                      <img
                        src={URL.createObjectURL(image)} // عرض الصورة المرفوعة
                        alt="Current Review"
                        className="w-32 h-32 mb-4"
                      />
                    )}
                    <div>
                      <Label>Upload new image</Label>
                      <ImageUpload onImagesChange={(images) => setImage(images[0])} maxImages={1} /> {/* استخدام مكون رفع الصور */}
                    </div>
                    <div>
                      <Label>Name</Label>
                      <Input
                        {...enForm.register("name")}
                        className={
                          enForm.formState.errors.name ? "border-red-500" : ""
                        }
                      />
                      {enForm.formState.errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {enForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label>Country</Label>
                      <Input
                        {...enForm.register("country")}
                        className={
                          enForm.formState.errors.country
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {enForm.formState.errors.country && (
                        <p className="text-red-500 text-sm mt-1">
                          {enForm.formState.errors.country.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label>Rating</Label>
                      <Input
                        type="number"
                        {...enForm.register("rate", { valueAsNumber: true })}
                        min="1"
                        max="5"
                        className={
                          enForm.formState.errors.rate ? "border-red-500" : ""
                        }
                      />
                      {enForm.formState.errors.rate && (
                        <p className="text-red-500 text-sm mt-1">
                          {enForm.formState.errors.rate.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label>Comment</Label>
                      <Textarea
                        {...enForm.register("description")}
                        className={
                          enForm.formState.errors.description
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {enForm.formState.errors.description && (
                        <p className="text-red-500 text-sm mt-1">
                          {enForm.formState.errors.description.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isLoadingEn}
                    >
                      {isLoadingEn ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              }
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}