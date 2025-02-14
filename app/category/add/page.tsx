"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TabComponent } from "@/components/ui/tab-component"
import { ImageUpload } from "@/components/ui/image-upload"
import { toast } from "react-hot-toast"
import { useRouter } from 'next/navigation'
import * as z from "zod"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { error } from "console"

const extractCoordinatesFromGoogleMapsUrl = (url: string) => {
  try {
    const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/
    const match = url.match(regex)
    if (match) {
      return {
        latitude: parseFloat(match[1]),
        longitude: parseFloat(match[2])
      }
    }
    return null
  } catch (error) {
    return null
  }
}
const categorySchema = z.object({
  title: z.string().min(3, "العنوان يجب أن يكون 3 أحرف على الأقل"),
  area: z.number().min(1, "المساحة مطلوبة"),
  description: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل"),
  location: z.string().min(3, "الموقع مطلوب"),
  coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180)
  }),
  googleMapsUrl: z.string().url().optional(),
  lang: z.string(),
  Image: z.any()

})
const isArabic = (text: string) => /[\u0600-\u06FF]/.test(text);
const isEnglish = (text: string) => /[a-zA-Z]/.test(text);
type FormData = z.infer<typeof categorySchema>

const CategoryForm = ({ lang, form, onSubmit, isLoading }: { lang: string; form: any; onSubmit: any; isLoading: boolean }) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="Image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{lang === "ar" ? "صورة القسم" : "Category Image"}</FormLabel>
              <ImageUpload
                maxImages={1}
                onImagesChange={(files) => field.onChange(files[0])}

                existingImages={[]} language={"ar"} />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
  control={form.control}
  name="title"
  render={({ field }) => (
    <FormItem>
      <FormLabel>{lang === "ar" ? "عنوان القسم" : "Category Title"}</FormLabel>
      <FormControl>
        <Input 
          {...field} 
          dir={lang === "ar" ? "rtl" : "ltr"}
          onChange={(e) => {
            const value = e.target.value;
            if (lang === "ar" && isEnglish(value)) {
              form.setError('title', {
                type: 'manual',
                message: 'يرجى الكتابة باللغة العربية فقط'
              });
            } else if (lang === "en" && isArabic(value)) {
              form.setError('title', {
                type: 'manual',
                message: 'Please type in English only'
              });
            } else {
              form.clearErrors('title');
              field.onChange(value);
            }
          }}        />
      </FormControl>
      <FormMessage className="text-red-500" />
    </FormItem>
  )}
/>

          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{lang === "ar" ? "المساحة" : "Area"}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{lang === "ar" ? "الموقع" : "Location"}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">

            <FormField
              control={form.control}
              name="coordinates"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>
                    {lang === "ar" ? "رابط خرائط جوجل" : "Google Maps Link"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        lang === "ar"
                          ? "الصق رابط خرائط جوجل هنا"
                          : "Paste Google Maps link here"
                      }
                      onChange={(e) => {
                        const coords = extractCoordinatesFromGoogleMapsUrl(e.target.value)
                        if (coords) {
                          field.onChange(coords)
                          form.setValue('coordinates.latitude', coords.latitude)
                          form.setValue('coordinates.longitude', coords.longitude)
                        }
                      }}
                    />
                  </FormControl>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <Input
                      type="text"
                      value={field.value?.latitude || ''}
                      readOnly
                      placeholder={lang === "ar" ? "خط العرض" : "Latitude"}
                    />
                    <Input
                      type="text"
                      value={field.value?.longitude || ''}
                      readOnly
                      placeholder={lang === "ar" ? "خط الطول" : "Longitude"}
                    />
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
  control={form.control}
  name="description"
  render={({ field }) => (
    <FormItem>
      <FormLabel>{lang === "ar" ? "الوصف" : "Description"}</FormLabel>
      <FormControl>
        <Textarea 
          rows={4} 
          {...field} 
          dir={lang === "ar" ? "rtl" : "ltr"}
          onChange={(e) => {
            const value = e.target.value;
            if (lang === "ar" && isEnglish(value)) {
              form.setError('description', {
                type: 'manual',
                message: 'يرجى الكتابة باللغة العربية فقط'
              });
            } else if (lang === "en" && isArabic(value)) {
              form.setError('description', {
                type: 'manual',
                message: 'Please type in English only'
              });
            } else {
              form.clearErrors('description');
              field.onChange(value);
            }
          }}        />
      </FormControl>
      <FormMessage className="text-red-500" />
    </FormItem>
  )}
/>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {lang === "ar" ? "إضافة القسم" : "Add Category"}
        </Button>
      </form>
    </Form>
  )
}

export default function AddCategory() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const forms = {
    ar: useForm<FormData>({
      resolver: zodResolver(categorySchema),
      defaultValues: {
        lang: "ar",
        coordinates: { latitude: 0, longitude: 0 }
      }
    }),
    en: useForm<FormData>({
      resolver: zodResolver(categorySchema),
      defaultValues: {
        lang: "en",
        coordinates: { latitude: 0, longitude: 0 }
      }
    })
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('area', data.area.toString())
      formData.append('description', data.description)
      formData.append('location', data.location)
      formData.append('latitude', data.coordinates.latitude.toString())
      formData.append('longitude', data.coordinates.longitude.toString())
      formData.append('lang', data.lang)
      if (data.Image) {
        formData.append('image', data.Image)
      }
      console.log(formData)
      const response = await fetch("http://localhost:8080/category/create", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData
      })
      console.log(response)
      if (!response.ok) throw new Error("Failed to add category")

      toast.success(data.lang === "ar" ? "تم إضافة القسم بنجاح" : "Category added successfully")
      router.push("/")
    } catch (error) {
      toast.error(data.lang === "ar" ? "حدث خطأ أثناء الإضافة" : "Error adding category")
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>إضافة قسم جديد</CardTitle>
          </CardHeader>
          <CardContent>
            <TabComponent
              arabicContent={
                <CategoryForm
                  lang="ar"
                  form={forms.ar}
                  onSubmit={onSubmit}
                  isLoading={isLoading}
                />
              }
              englishContent={
                <CategoryForm
                  lang="en"
                  form={forms.en}
                  onSubmit={onSubmit}
                  isLoading={isLoading}
                />
              }
            />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
