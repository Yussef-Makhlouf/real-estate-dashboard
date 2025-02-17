"use client"

import { useReducer, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Trash } from "lucide-react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TabComponent } from "@/components/ui/tab-component"
import { ImageUpload } from "@/components/ui/image-upload"
import toast, { Toaster } from 'react-hot-toast'
import { useRouter, useParams } from 'next/navigation'
import * as z from "zod"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Dynamic error messages based on language
const createUnitSchema = (lang: 'ar' | 'en') => z.object({
  title: z.string().min(3, { 
    message: lang === 'ar' ? 'يجب أن يحتوي العنوان على الأقل على 3 أحرف' : 'Title must be at least 3 characters'
  }),
  type: z.string().min(1, { 
    message: lang === 'ar' ? 'يجب اختيار نوع الوحدة' : 'Please select unit type'
  }),
  price: z.number().min(1, {
    message: lang === 'ar' ? 'يجب إدخال السعر' : 'Price is required'
  }),
  area: z.number().min(1, {
    message: lang === 'ar' ? 'يجب إدخال المساحة' : 'Area is required'
  }),
  rooms: z.number().min(1, {
    message: lang === 'ar' ? 'يجب إدخال عدد الغرف' : 'Number of rooms is required'
  }),
  bathrooms: z.number().min(1, {
    message: lang === 'ar' ? 'يجب إدخال عدد الحمامات' : 'Number of bathrooms is required'
  }),
  livingrooms: z.number().min(1, {
    message: lang === 'ar' ? 'يجب إدخال عدد الصالات' : 'Number of living rooms is required'
  }),
  elevators: z.number().min(1, {
    message: lang === 'ar' ? 'يجب إدخال عدد المصاعد' : 'Number of elevators is required'
  }),
  parking: z.number().min(1, {
    message: lang === 'ar' ? 'يجب إدخال عدد مواقف السيارات' : 'Parking spaces is required'
  }),
  guard: z.number().min(1, {
    message: lang === 'ar' ? 'يجب إدخال عدد الحراس' : 'Number of guards is required'
  }),
  waterTank: z.number().min(1, {
    message: lang === 'ar' ? 'يجب إدخال عدد خزانات المياه' : 'Water tanks count is required'
  }),
  maidRoom: z.number().min(1, {
    message: lang === 'ar' ? 'يجب إدخال عدد غرف الخدم' : 'Maid rooms count is required'
  }),
  cameras: z.number().min(1, {
    message: lang === 'ar' ? 'يجب إدخال عدد الكاميرات' : 'Number of cameras is required'
  }),
  floor: z.number().min(1, {
    message: lang === 'ar' ? 'يجب إدخال رقم الطابق' : 'Floor number is required'
  }),
  location: z.string().min(3, {
    message: lang === 'ar' ? 'يجب إدخال الموقع' : 'Location is required'
  }),
  coordinates: z.object({
    latitude: z.number().min(1, {
      message: lang === 'ar' ? 'يجب إدخال خط العرض' : 'Latitude is required'
    }),
    longitude: z.number().min(1, {
      message: lang === 'ar' ? 'يجب إدخال خط الطول' : 'Longitude is required'
    })
  }),
  description: z.string().min(10, {
    message: lang === 'ar' ? 'يجب أن يحتوي الوصف على الأقل على 10 أحرف' : 'Description must be at least 10 characters'
  }),
  status: z.string().min(1, {
    message: lang === 'ar' ? 'يجب اختيار الحالة' : 'Status is required'
  }),
  nearbyPlaces: z.array(z.object({
    place: z.string().min(2, {
      message: lang === 'ar' ? 'يجب إدخال اسم المكان' : 'Place name is required'
    }),
    timeInMinutes: z.number().min(1, {
      message: lang === 'ar' ? 'يجب إدخال الوقت بالدقائق' : 'Time in minutes is required'
    })
  })).optional(),
  lang: z.string()
})

type FormData = z.infer<ReturnType<typeof createUnitSchema>>

const unitTypes = [
  "Villa", "Apartment", "Duplex", "Penthouse", "Townhouse",
  "Studio", "Chalet", "Warehouse", "Office", "Shop"
]

const unitStatuses = [
  "Available", "Sold", "Rented", "Reserved", "Under Maintenance"
]

type ExistingImage = {
  url: string
  id: string
}

type State = {
  images: File[]
  existingImages: ExistingImage[]
  isLoading: { ar: boolean; en: boolean }
  nearbyPlaces: Array<{ place: string; timeInMinutes: number }>
  removedImages: string[]
  currentLang: "ar" | "en" | null
}

type Action =
  | { type: "SET_IMAGES"; value: File[] }
  | { type: "SET_EXISTING_IMAGES"; value: ExistingImage[] }
  | { type: "REMOVE_EXISTING_IMAGE"; id: string }
  | { type: "SET_LOADING"; lang: "ar" | "en"; value: boolean }
  | { type: "SET_NEARBY_PLACES"; value: Array<{ place: string; timeInMinutes: number }> }
  | { type: "ADD_REMOVED_IMAGE"; id: string }
  | { type: "SET_LANGUAGE"; lang: "ar" | "en" }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_IMAGES":
      return { ...state, images: action.value }
    case "SET_EXISTING_IMAGES":
      return { ...state, existingImages: action.value }
    case "ADD_REMOVED_IMAGE":
      return {
        ...state,
        removedImages: [...state.removedImages, action.id],
        existingImages: state.existingImages.filter(img => img.id !== action.id)
      }
    case "SET_LOADING":
      return { ...state, isLoading: { ...state.isLoading, [action.lang]: action.value } }
    case "SET_NEARBY_PLACES":
      return { ...state, nearbyPlaces: action.value }
    case "SET_LANGUAGE":
      return { ...state, currentLang: action.lang }
    default:
      return state
  }
}

const UnitForm = ({ lang, form, onSubmit, state, dispatch }: { 
  lang: "ar" | "en", 
  form: any, 
  onSubmit: (data: FormData, lang: "ar" | "en") => void, 
  state: State, 
  dispatch: React.Dispatch<Action> 
}) => {
  const [mapsUrl, setMapsUrl] = useState('')
  const isRTL = lang === "ar"

  const handleParseCoordinates = () => {
    if (!mapsUrl) return

    // Extract coordinates from Google Maps URL
    const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/
    const match = mapsUrl.match(regex)

    if (match && match[1] && match[2]) {
      form.setValue('coordinates.latitude', match[1])
      form.setValue('coordinates.longitude', match[2])
      toast.success(lang === 'ar' ? 'تم استخراج الإحداثيات بنجاح' : 'Coordinates extracted successfully')
    } else {
      toast.error(lang === 'ar' ? 'رابط خرائط جوجل غير صحيح' : 'Invalid Google Maps URL')
    }
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit((data: FormData) => onSubmit(data, lang))}
        className="space-y-8 bg-white p-6 rounded-lg shadow-sm"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Images Section */}
        <div className="space-y-4">
          <FormLabel className="text-lg font-semibold">
            {lang === "ar" ? "صور العقار *" : "Property Images *"}
          </FormLabel>
          
          {state.existingImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {state.existingImages.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.url}
                    alt="Property"
                    className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => dispatch({ type: "ADD_REMOVED_IMAGE", id: image.id })}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <ImageUpload
                  maxImages={10 - state.existingImages.length}
                  onImagesChange={(files) => {
                    dispatch({ type: "SET_IMAGES", value: files })
                    field.onChange(files)
                  }}
                  language={lang}
                  existingImages={state.existingImages.map(image => image.url)}
                />
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />
        </div>

        {/* Google Maps URL Parser */}
        <div className="space-y-2">
          <FormLabel>{lang === "ar" ? "رابط خرائط جوجل" : "Google Maps URL"}</FormLabel>
          <div className="flex gap-2">
            <Input
              value={mapsUrl}
              onChange={(e) => setMapsUrl(e.target.value)}
              placeholder={lang === "ar" ? "الصق رابط خرائط جوجل هنا" : "Paste Google Maps URL here"}
            />
            <Button
              type="button"
              onClick={handleParseCoordinates}
              variant="secondary"
            >
              {lang === "ar" ? "استخراج الإحداثيات" : "Extract Coordinates"}
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            {lang === "ar" 
              ? "الصق رابط من خرائط جوجل لتعبئة الإحداثيات تلقائيًا" 
              : "Paste Google Maps URL to auto-fill coordinates"}
          </p>
        </div>

        {/* Coordinates Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="coordinates.latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{lang === "ar" ? "خط العرض *" : "Latitude *"}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="any"
                    placeholder="25.276987"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coordinates.longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{lang === "ar" ? "خط الطول *" : "Longitude *"}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="any"
                    placeholder="55.296249"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* باقي الحقول بنفس النمط مع رسائل الخطأ المخصصة */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  {lang === "ar" ? "عنوان الوحدة" : "Unit Title"}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={lang === "ar" ? "أدخل عنوان الوحدة" : "Enter unit title"}
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />

          {/* Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  {lang === "ar" ? "نوع الوحدة" : "Unit Type"}
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger >
                      <SelectValue placeholder={lang === "ar" ? "اختر نوع الوحدة" : "Select unit type"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {unitTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />

          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  {lang === "ar" ? "السعر" : "Price"}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder={lang === "ar" ? "أدخل السعر" : "Enter price"}
                   
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />

          {/* Area */}
          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  {lang === "ar" ? "المساحة" : "Area"}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder={lang === "ar" ? "أدخل المساحة" : "Enter area"}
                 
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />

          {/* Rooms */}
          <FormField
            control={form.control}
            name="rooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  {lang === "ar" ? "عدد الغرف" : "Number of Rooms"}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder={lang === "ar" ? "أدخل عدد الغرف" : "Enter number of rooms"}
                  
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />

          {/* Bathrooms */}
          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  {lang === "ar" ? "عدد الحمامات" : "Number of Bathrooms"}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder={lang === "ar" ? "أدخل عدد الحمامات" : "Enter number of bathrooms"}
          
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />

          {/* Living Rooms */}
          <FormField
            control={form.control}
            name="livingrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  {lang === "ar" ? "عدد الصالات" : "Number of Living Rooms"}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder={lang === "ar" ? "أدخل عدد الصالات" : "Enter number of living rooms"}
                  
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />

          {/* Elevators */}
          <FormField
    control={form.control}
    name="elevators"
    render={({ field }) => (
      <FormItem>
        <FormLabel>{lang === "ar" ? "المصاعد *" : "Elevators *"}</FormLabel>
        <FormControl>
          <Input
            {...field}
            type="number"
            placeholder={lang === "ar" ? "عدد المصاعد" : "Number of elevators"}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

          {/* Parking */}
          <FormField
            control={form.control}
            name="parking"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  {lang === "ar" ? "عدد المواقف" : "Number of Parking Spaces"}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder={lang === "ar" ? "أدخل عدد المواقف" : "Enter number of parking spaces"}
                   
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />

          {/* Guards */}
          <FormField
            control={form.control}
            name="guard"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  {lang === "ar" ? "عدد الحراس" : "Number of Guards"}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder={lang === "ar" ? "أدخل عدد الحراس" : "Enter number of guards"}

                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />

          {/* Water Tanks */}
          <FormField
            control={form.control}
            name="waterTank"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  {lang === "ar" ? "عدد خزانات المياه" : "Number of Water Tanks"}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder={lang === "ar" ? "أدخل عدد الخزانات" : "Enter number of water tanks"}
            
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />

          {/* Maid Rooms */}
          <FormField
            control={form.control}
            name="maidRoom"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  {lang === "ar" ? "عدد غرف الخدم" : "Number of Maid Rooms"}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder={lang === "ar" ? "أدخل عدد غرف الخدم" : "Enter number of maid rooms"}
     
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />

          {/* Cameras */}
          <FormField
            control={form.control}
            name="cameras"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  {lang === "ar" ? "عدد الكاميرات" : "Number of Cameras"}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder={lang === "ar" ? "أدخل عدد الكاميرات" : "Enter number of cameras"}
              
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />

          {/* Floor */}
          <FormField
            control={form.control}
            name="floor"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  {lang === "ar" ? "الطابق" : "Floor"}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder={lang === "ar" ? "أدخل رقم الطابق" : "Enter floor number"}
          
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  {lang === "ar" ? "حالة الوحدة" : "Unit Status"}
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger >
                      <SelectValue placeholder={lang === "ar" ? "اختر حالة الوحدة" : "Select unit status"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {unitStatuses.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                {lang === "ar" ? "وصف الوحدة" : "Unit Description"}
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={4}
                  placeholder={lang === "ar" ? "اكتب وصفاً تفصيلياً للوحدة" : "Write a detailed description of the unit"}
             
                  dir={lang === "ar" ? "rtl" : "ltr"}
                />
              </FormControl>
              <FormMessage className="text-sm text-red-500" />
            </FormItem>
          )}
        />

        {/* ... (جميع الحقول الأخرى بنفس النمط مع FormMessage) ... */}

        <Button 
          type="submit" 
          className="w-full"
          disabled={state.isLoading[lang]}
        >
          {state.isLoading[lang] && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {lang === "ar" ? "حفظ التغييرات" : "Save Changes"}
        </Button>
      </form>
    </Form>
  )
}

export default function EditUnit() {
  const [state, dispatch] = useReducer(reducer, {
    images: [],
    existingImages: [],
    isLoading: { ar: false, en: false },
    nearbyPlaces: [],
    removedImages: [],
    currentLang: null
  })

  const router = useRouter()
  const params = useParams()

  // إنشاء النماذج مع مخططات مختلفة لكل لغة
  const forms = {
    ar: useForm<FormData>({
      resolver: zodResolver(createUnitSchema('ar')),
      defaultValues: { lang: "ar" }
    }),
    en: useForm<FormData>({
      resolver: zodResolver(createUnitSchema('en')),
      defaultValues: { lang: "en" }
    })
  }

  useEffect(() => {
    const fetchUnitData = async () => {
      try {
        const response = await fetch(`https://tasis-al-bina.onrender.com/unit/getunit/${params.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        const data = await response.json()
   
        if (data.returnedData.unit) {
          const unit = data.returnedData.unit
          const form = unit.lang === "ar" ? forms.ar : forms.en
      
          form.reset({
            ...unit,
            nearbyPlaces: unit.nearbyPlaces || [
              { place: "", timeInMinutes: "" },
              { place: "", timeInMinutes: "" },
              { place: "", timeInMinutes: "" }
            ]
          })

          if (unit.images && unit.images.length > 0) {
            const formattedImages = unit.images.map((img: any) => ({
              url: img.secure_url,
              id: img._id || img.public_id
            }))
            
            dispatch({
              type: "SET_EXISTING_IMAGES",
              value: formattedImages
            })
          }
          dispatch({ type: "SET_LANGUAGE", lang: unit.lang })
        }
      } catch (error) {
        toast.error("Failed to fetch unit data")
      }
    }
    if (params.id) fetchUnitData()
  }, [params.id])

  const onSubmit = async (data: FormData, lang: "ar" | "en") => {
    dispatch({ type: "SET_LOADING", lang, value: true })
    
    try {
      const formData = new FormData()
      const payload = {
        ...data,
        removedImages: state.removedImages,
        existingImages: state.existingImages.map(img => img.id),
        lang
      }

      formData.append('data', JSON.stringify(payload))
      state.images.forEach(file => formData.append('images', file))

      const response = await fetch(`https://tasis-al-bina.onrender.com/unit/updateunit/${params.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData
      })

      if (!response.ok) throw new Error("Update failed")
      
      toast.success(lang === "ar" ? "تم التحديث بنجاح" : "Update successful")
      router.push(`/category/${params.categoryId}`)
    } catch (error) {
      toast.error(lang === "ar" 
        ? "خطأ في التحديث، يرجى المحاولة مرة أخرى" 
        : "Update failed, please try again")
    } finally {
      dispatch({ type: "SET_LOADING", lang, value: false })
    }
  }

  if (!state.currentLang){
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
        <Card className="max-w-7xl mx-auto">
          <CardHeader>
            <CardTitle dir={state.currentLang === "ar" ? "rtl" : "ltr"}>
              {state.currentLang === "ar" ? "تعديل الوحدة" : "Edit Unit"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {state.currentLang === "ar" ? (
              <UnitForm
                lang="ar"
                form={forms.ar}
                onSubmit={onSubmit}
                state={state}
                dispatch={dispatch}
              />
            ) : (
              <UnitForm
                lang="en"
                form={forms.en}
                onSubmit={onSubmit}
                state={state}
                dispatch={dispatch}
              />
            )}
          </CardContent>
        </Card>
      </main>
      <Toaster
  position="top-center"
  toastOptions={{
    duration: 3000,
    style: {
      background: '#333',
      color: '#fff',
      padding: '16px',
      fontSize: '16px'
    },
    success: {
      style: {
        background: '#10B981'
      }
    },
    error: {
      style: {
        background: '#EF4444'
      }
    },
    loading: {
      style: {
        background: '#3B82F6'
      }
    }
  }}
/>

    </div>
  )
}