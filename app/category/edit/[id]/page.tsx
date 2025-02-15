// "use client"

// import { useState, useEffect } from "react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useRouter } from "next/navigation"
// import { Header } from "@/components/Header"
// import { Sidebar } from "@/components/Sidebar"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { RichTextEditor } from "@/components/ui/rich-text-editor"
// import { ImageUpload } from "@/components/ui/image-upload"
// import { categorySchema } from "@/lib/schemas"
// import type { z } from "zod"

// type FormData = z.infer<typeof categorySchema>

// export default function EditProperty({ params }: { params: { id: string } }) {
//   const router = useRouter()
//   const [isLoading, setIsLoading] = useState(true)
//   const [language, setLanguage] = useState<"ar" | "en">("ar")

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm<FormData>()

//   useEffect(() => {
//     const fetchCategory = async () => {
//       try {
//         const response = await fetch(`http://localhost:8080/category/getOne/${params.id}`)
//         const data = await response.json()

//         if (data.category) {
//           setLanguage(data.category.lang)
//           setValue("title", data.category.title)
//           setValue("location", data.category.location)
//           setValue("area", data.category.area)
//           setValue("description", data.category.description)
//           setValue("coordinates", data.category.coordinates)

//           if (data.category.Image) {
//             const response = await fetch(data.category.Image.secure_url)
//             const blob = await response.blob()
//             const file = new File([blob], "image.jpg", { type: blob.type })
//             setValue("image", file)
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching category:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchCategory()
//   }, [params.id, setValue])

//   const onSubmit = async (data: FormData) => {
//     try {
//       const response = await fetch(`http://localhost:8080/category/update/${params.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           title: data.title,
//           location: data.location,
//           area: data.area,
//           description: data.description,
//           coordinates: data.coordinates,
//           lang: language
//         })
//       })

//       if (response.ok) {
//         router.push("/category")
//       }
//     } catch (error) {
//       console.error("Error updating category:", error)
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="relative">
//           <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
//           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//             <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-secondary animate-spin"></div>
//           </div>
//           <div className="mt-4 text-center text-gray-600 font-medium">
//             جاري التحميل...
//           </div>
//         </div>
//       </div>
//     )
//   }
  

//   const formContent = language === "ar" ? (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//       <div className="space-y-4">
//         <div className="space-y-2">
//           <label className="block text-sm font-medium">العنوان</label>
//           <Input {...register("title")} className={errors.title ? "border-red-500" : ""} />
//           {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
//         </div>

//         <div className="space-y-2">
//           <label className="block text-sm font-medium">الموقع</label>
//           <Input {...register("location")} className={errors.location ? "border-red-500" : ""} />
//           {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
//         </div>

//         <div className="space-y-2">
//           <label className="block text-sm font-medium">المساحة</label>
//           <Input {...register("area", { valueAsNumber: true })} type="number" />
//           {errors.area && <p className="text-red-500 text-sm">{errors.area.message}</p>}
//         </div>

//         <div className="space-y-2">
//           <label className="block text-sm font-medium">الوصف</label>
//           <RichTextEditor
//             content={watch("description")?.replace(/<[^>]*>/g, '') || ""}
//             onChange={(content) => setValue("description", content.replace(/<[^>]*>/g, ''))}
//             language="ar"
//           />

//         </div>

//         <div className="space-y-2">
//           <label className="block text-sm font-medium">الصور</label>
//           <ImageUpload
//             onImagesChange={(files) => setValue("image", files[0])}
//             maxImages={1}
//             language="ar"
//             initialImages={watch("Image")?.secure_url ||
//               watch("image")?.secure_url ||
//               watch("Image") ||
//               watch("image") ||
//               null}
//             existingImages={[]}
//           />

//         </div>
//       </div>

//       <Button type="submit">حفظ التغييرات</Button>
//     </form>
//   ) : (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//       <div className="space-y-4">
//         <div className="space-y-2">
//           <label className="block text-sm font-medium">Title</label>
//           <Input {...register("title")} className={errors.title ? "border-red-500" : ""} />
//           {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
//         </div>

//         <div className="space-y-2">
//           <label className="block text-sm font-medium">Location</label>
//           <Input {...register("location")} className={errors.location ? "border-red-500" : ""} />
//           {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
//         </div>

//         <div className="space-y-2">
//           <label className="block text-sm font-medium">Area</label>
//           <Input {...register("area", { valueAsNumber: true })} type="number" />
//           {errors.area && <p className="text-red-500 text-sm">{errors.area.message}</p>}
//         </div>

//         <div className="space-y-2">
//           <label className="block text-sm font-medium">Description</label>
//           <RichTextEditor
//             content={watch("description")?.replace(/<[^>]*>/g, '') || ""}
//             onChange={(content) => setValue("description", content.replace(/<[^>]*>/g, ''))}
//             language="en"
//           />

//         </div>

//         <div className="space-y-2">
//           <label className="block text-sm font-medium">Images</label>
//           <ImageUpload
//             onImagesChange={(files) => setValue("image", files[0])}
//             maxImages={1}
//             language="en"
//             initialImages={watch("Image")?.secure_url ||
//               watch("image")?.secure_url ||
//               watch("Image") ||
//               watch("image") ||
//               null}
//             existingImages={[]}
//           />
//         </div>
//       </div>

//       <Button type="submit">Save Changes</Button>
//     </form>
//   )

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Header />
//       <Sidebar />
//       <main className="pt-16 px-4 sm:px-6 lg:px-8" dir={language === "ar" ? "rtl" : "ltr"}>
//         <Card>
//           <CardHeader>
//             <CardTitle>{language === "ar" ? "تعديل العقار" : "Edit Property"}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {formContent}
//           </CardContent>
//         </Card>
//       </main>
//     </div>
//   )
// }
"use client"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { ImageUpload } from "@/components/ui/image-upload"
import { categorySchema } from "@/lib/schemas"
import type { z } from "zod"

type FormData = z.infer<typeof categorySchema>

export default function EditProperty({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [language, setLanguage] = useState<"ar" | "en">("ar")
  const [googleMapsLink, setGoogleMapsLink] = useState<string>("") // لإدارة الرابط
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null) // لإدارة الإحداثيات

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>()

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`http://localhost:8080/category/getOne/${params.id}`)
        const data = await response.json()
        if (data.category) {
          setLanguage(data.category.lang)
          setValue("title", data.category.title)
          setValue("location", data.category.location)
          setValue("area", data.category.area)
          setValue("description", data.category.description)
          setValue("coordinates", data.category.coordinates)
          setGoogleMapsLink(data.category.googleMapsLink || "") // استعادة الرابط السابق
          if (data.category.Image) {
            const response = await fetch(data.category.Image.secure_url)
            const blob = await response.blob()
            const file = new File([blob], "image.jpg", { type: blob.type })
            setValue("image", file)
          }
        }
      } catch (error) {
        console.error("Error fetching category:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCategory()
  }, [params.id, setValue])

  const handleGoogleMapsLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value
    setGoogleMapsLink(link)

    if (link) {
      try {
        const url = new URL(link)
        const pathname = url.pathname

        const match = pathname.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
        if (match) {
          const lat = parseFloat(match[1])
          const lng = parseFloat(match[2])
          setCoordinates({ lat, lng })
          setValue("coordinates", { latitude: lat, longitude: lng })
        } else {
          setCoordinates(null)
          setValue("coordinates", { latitude: 0, longitude: 0 })
          alert("Invalid Google Maps link or coordinates not found.")
        }
      } catch (error) {
        console.error("Error parsing coordinates:", error)
        alert("Failed to parse coordinates. Please check your Google Maps link.")
      }
    } else {
      setCoordinates(null)
      setValue("coordinates", { latitude: 0, longitude: 0 })
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch(`http://localhost:8080/category/update/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          location: data.location,
          area: data.area,
          description: data.description,
          coordinates: data.coordinates,
          googleMapsLink: googleMapsLink, // إضافة الرابط إلى البيانات المرسلة
          lang: language,
        }),
      })
      if (response.ok) {
        router.push("/category")
      }
    } catch (error) {
      console.error("Error updating category:", error)
    }
  }

  if (isLoading) {
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

  const formContent = language === "ar" ? (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">العنوان</label>
          <Input {...register("title")} className={errors.title ? "border-red-500" : ""} />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">الموقع</label>
          <Input {...register("location")} className={errors.location ? "border-red-500" : ""} />
          {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">المساحة</label>
          <Input {...register("area", { valueAsNumber: true })} type="number" />
          {errors.area && <p className="text-red-500 text-sm">{errors.area.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">الوصف</label>
          <RichTextEditor
            content={watch("description")?.replace(/<[^>]*>/g, "") || ""}
            onChange={(content) => setValue("description", content.replace(/<[^>]*>/g, ""))}
            language="ar"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">رابط Google Maps</label>
          <Input
            value={googleMapsLink}
            onChange={handleGoogleMapsLinkChange}
            placeholder="أدخل رابط Google Maps هنا"
            className={errors.coordinates ? "border-red-500" : ""}
          />
          {errors.coordinates && (
            <p className="text-red-500 text-sm">{errors.coordinates.message}</p>
          )}
          {coordinates && (
            <p className="text-green-500">
              الإحداثيات: Latitude: {coordinates.lat}, Longitude: {coordinates.lng}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">الصور</label>
          <ImageUpload
  onImagesChange={(files) => setValue("image", files[0])}
  maxImages={1}
  language="ar"
  initialImages={[
    watch("Image")?.secure_url ||
    watch("image")?.secure_url ||
    watch("Image") ||
    watch("image")
  ].filter(Boolean)}
  existingImages={[]}
/>

        </div>
      </div>
      <Button type="submit">حفظ التغييرات</Button>
    </form>
  ) : (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Title</label>
          <Input {...register("title")} className={errors.title ? "border-red-500" : ""} />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Location</label>
          <Input {...register("location")} className={errors.location ? "border-red-500" : ""} />
          {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Area</label>
          <Input {...register("area", { valueAsNumber: true })} type="number" />
          {errors.area && <p className="text-red-500 text-sm">{errors.area.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Description</label>
          <RichTextEditor
            content={watch("description")?.replace(/<[^>]*>/g, "") || ""}
            onChange={(content) => setValue("description", content.replace(/<[^>]*>/g, ""))}
            language="en"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Google Maps Link</label>
          <Input
            value={googleMapsLink}
            onChange={handleGoogleMapsLinkChange}
            placeholder="Enter Google Maps link here"
            className={errors.coordinates ? "border-red-500" : ""}
          />
          {errors.coordinates && (
            <p className="text-red-500 text-sm">{errors.coordinates.message}</p>
          )}
          {coordinates && (
            <p className="text-green-500">
              Coordinates: Latitude: {coordinates.lat}, Longitude: {coordinates.lng}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Images</label>
          <ImageUpload
  onImagesChange={(files) => setValue("image", files[0])}
  maxImages={1}
  language="en"
  initialImages={[
    watch("Image")?.secure_url ||
    watch("image")?.secure_url ||
    watch("Image") ||
    watch("image")
  ].filter(Boolean)}
  existingImages={[]}
/>

        </div>
      </div>
      <Button type="submit">Save Changes</Button>
    </form>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8" dir={language === "ar" ? "rtl" : "ltr"}>
        <Card>
          <CardHeader>
            <CardTitle>{language === "ar" ? "تعديل العقار" : "Edit Property"}</CardTitle>
          </CardHeader>
          <CardContent>{formContent}</CardContent>
        </Card>
      </main>
    </div>
  )
}