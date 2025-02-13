"use client"
import { useReducer, useEffect, Key } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Trash, Plus } from "lucide-react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TabComponent } from "@/components/ui/tab-component"
import { ImageUpload } from "@/components/ui/image-upload"
import { toast } from "react-hot-toast"
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
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"

const unitSchema = z.object({
  title: z.string().min(3),
  type: z.string(),
  price: z.number().min(0),
  area: z.number().min(0),
  rooms: z.number().min(0),
  bathrooms: z.number().min(0),
  livingrooms: z.number().min(0),
  elevators: z.number().min(0),
  parking: z.number().min(0),
  guard: z.number().min(0),
  waterTank: z.number().min(0),
  maidRoom: z.number().min(0),
  cameras: z.number().min(0),
  floor: z.number().min(0),
  location: z.string(),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number()
  }),
  description: z.string(),
  status: z.string(),
  nearbyPlaces: z.array(z.object({
    place: z.string(),
    timeInMinutes: z.number()
  })).optional(),
  lang: z.string()
})


const getArabicPlaceholder = (fieldName: string): string => {
  const placeholders: { [key: string]: string } = {
    price: "السعر",
    area: "المساحة",
    rooms: "عدد الغرف",
    bathrooms: "عدد الحمامات",
    livingrooms: "عدد الصالات",
    elevators: "عدد المصاعد",
    parking: "مواقف السيارات",
    guard: "عدد الحراس",
    waterTank: "خزانات المياه",
    maidRoom: "غرف الخدم",
    cameras: "الكاميرات",
    floor: "الطابق"
  }
  return placeholders[fieldName] || fieldName
}
const getEnglishPlaceholder = (fieldName: string): string => {
  const placeholders: { [key: string]: string } = {
    price: "Price",
    area: "Area",
    rooms: "Number of Rooms",
    bathrooms: "Number of Bathrooms",
    livingrooms: "Number of Living Rooms",
    elevators: "Number of Elevators",
    parking: "Parking Spaces",
    guard: "Number of Guards",
    waterTank: "Water Tanks",
    maidRoom: "Maid Rooms",
    cameras: "Number of Cameras",
    floor: "Floor Number"
  }
  return placeholders[fieldName] || fieldName
}
type FormData = z.infer<typeof unitSchema>

const unitTypes = [
  "Villa", "Apartment", "Duplex", "Penthouse", "Townhouse",
  "Studio", "Chalet", "Warehouse", "Office", "Shop"
]

const unitStatuses = [
  "Available", "Sold", "Rented", "Reserved", "Under Maintenance"
]

type State = {
  images: File[]
  existingImages: ExistingImage[]
  isLoading: { ar: boolean; en: boolean }
  nearbyPlaces: Array<{ place: string; timeInMinutes: number }>
}

type ExistingImage = {
  url: string;
  id: string;
}



type Action =
  | { type: "SET_IMAGES"; value: File[] }
  | { type: "SET_EXISTING_IMAGES"; value: ExistingImage[] }
  | { type: "REMOVE_EXISTING_IMAGE"; id: string }
  | { type: "SET_LOADING"; lang: "ar" | "en"; value: boolean }
  | { type: "SET_NEARBY_PLACES"; value: Array<{ place: string; timeInMinutes: number }> }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_IMAGES":
      return { ...state, images: action.value }
    case "SET_EXISTING_IMAGES":
      return { ...state, existingImages: action.value }
    case "REMOVE_EXISTING_IMAGE":
      return { 
        ...state, 
        existingImages: state.existingImages.filter(img => img.id !== action.id)
      }
    case "SET_LOADING":
      return { ...state, isLoading: { ...state.isLoading, [action.lang]: action.value } }
    case "SET_NEARBY_PLACES":
      return { ...state, nearbyPlaces: action.value }
    default:
      return state
  }
}
const UnitForm = ({ lang, form, onSubmit, state, dispatch }: { lang: "ar" | "en", form: any, onSubmit: (data: FormData, lang: "ar" | "en") => void, state: any, dispatch: any }) => {
  return (
    <Form {...form}>
 <form onSubmit={form.handleSubmit((data: FormData) => onSubmit(data, lang))} 
        className="space-y-8 bg-white p-6 rounded-lg shadow-sm">                 {/* Images Section */}
        <div className="space-y-4">
          <FormLabel className="text-lg font-semibold">
            {lang === "ar" ? "صور العقار" : "Property Images"}
          </FormLabel>
          
         {/* Existing Images */}
         {state.existingImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {state.existingImages.map((image: { id: Key | null | undefined; url: string | undefined }) => (
                <div key={image.id} className="relative group">
                  <img 
                    src={image.url} 
                    alt="Property"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                    onClick={() => dispatch({ 
                      type: "REMOVE_EXISTING_IMAGE", 
                      id: image.id 
                    })}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Image Upload */}
          <FormField
  control={form.control}
  name="images"
  render={({ field }) => (
    <FormItem>
      <ImageUpload
        maxImages={10}
        onImagesChange={(files) => {
          dispatch({ type: "SET_IMAGES", value: files })
          field.onChange(files)
        } }
        language={lang}
        initialImages={state.existingImages?.map((img: { secure_url: any }) => img.secure_url) || []} existingImages={[]}      />
    </FormItem>
  )}
/>

        </div>

        {/* Nearby Places Section */}
        <div className="space-y-4">
          <FormLabel className="text-lg font-semibold">
            {lang === "ar" ? "الأماكن القريبة" : "Nearby Places"}
          </FormLabel>
          
          <div className="grid gap-6">
            {[0, 1, 2].map((index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                <FormField
                  control={form.control}
                  name={`nearbyPlaces.${index}.place`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {lang === "ar" ? "اسم المكان" : "Place Name"}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`nearbyPlaces.${index}.timeInMinutes`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {lang === "ar" ? "الوقت (بالدقائق)" : "Time (minutes)"}
                      </FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        </div>
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <ImageUpload
                maxImages={10}
                onImagesChange={(files) => {
                  dispatch({ type: "SET_IMAGES", value: files })
                  field.onChange(files)
                } }
                language={lang} existingImages={[]}              />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Basic Info */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={lang === "ar" ? "عنوان الوحدة" : "Unit Title"}
                    dir={lang === "ar" ? "rtl" : "ltr"}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={lang === "ar" ? "نوع الوحدة" : "Unit Type"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {unitTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Add all number inputs */}
          {[
            "price", "area", "rooms", "bathrooms", "livingrooms",
            "elevators", "parking", "guard", "waterTank", "maidRoom",
            "cameras", "floor"
          ].map((fieldName) => (
            <FormField
              key={fieldName}
              control={form.control}
              name={fieldName}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder={
                        lang === "ar" 
                          ? getArabicPlaceholder(fieldName) 
                          : getEnglishPlaceholder(fieldName)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}

          {/* Location Fields */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={lang === "ar" ? "الموقع" : "Location"}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={lang === "ar" ? "الحالة" : "Status"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {unitStatuses.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <FormControl>
                <Textarea
                  {...field}
                  rows={4}
                  placeholder={lang === "ar" ? "وصف الوحدة" : "Unit Description"}
                  dir={lang === "ar" ? "rtl" : "ltr"}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={state.isLoading[lang]}>
          {state.isLoading[lang] && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {lang === "ar" ? "حفظ التغييرات" : "Save Changes"}
        </Button>
      </form>
    </Form>
  )
}

export default function EditUnit() {
// In the main EditUnit component, update the initial state:
const [state, dispatch] = useReducer(reducer, {
  images: [],
  existingImages: [], // Add this line
  isLoading: { ar: false, en: false },
  nearbyPlaces: [
    { place: "", timeInMinutes: 0 },
    { place: "", timeInMinutes: 0 },
    { place: "", timeInMinutes: 0 }
  ]
})

  const router = useRouter()
  const params = useParams()

  const forms = {
    ar: useForm<FormData>({ 
      resolver: zodResolver(unitSchema), 
      defaultValues: { lang: "ar" } 
    }),
    en: useForm<FormData>({ 
      resolver: zodResolver(unitSchema), 
      defaultValues: { lang: "en" } 
    })
  }

useEffect(() => {
  const fetchUnitData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/unit/getunit/${params.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await response.json()
      
      if (data.unit) {
        const unit = data.unit
        if (unit.lang === "ar") {
          forms.ar.reset(unit)
        } else {
          forms.en.reset(unit)
        }
        // Set existing images
        if (unit.images) {
          dispatch({ type: "SET_EXISTING_IMAGES", value: unit.images })
        }
        // Set nearby places
        if (unit.nearbyPlaces) {
          dispatch({ type: "SET_NEARBY_PLACES", value: unit.nearbyPlaces })
        }
      }
    } catch (error) {
      toast.error("Failed to fetch unit data")
    }
  }

  fetchUnitData()
}, [params.id])
  const onSubmit = async (data: FormData, lang: "ar" | "en") => {
    dispatch({ type: "SET_LOADING", lang, value: true })
    try {
      const formData = new FormData()
      formData.append('data', JSON.stringify({ ...data, lang }))
      state.images.forEach(file => formData.append('images', file))

      const response = await fetch(`http://localhost:8080/unit/updateunit/${params.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData
      })

      if (!response.ok) throw new Error("Failed to update unit")
      
      toast.success(lang === "ar" ? "تم تحديث الوحدة بنجاح" : "Unit updated successfully")
      router.push(`/category/${params.categoryId}`)
    } catch (error) {
      toast.error(lang === "ar" ? "حدث خطأ أثناء التحديث" : "Error updating unit")
    } finally {
      dispatch({ type: "SET_LOADING", lang, value: false })
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>تعديل الوحدة</CardTitle>
          </CardHeader>
          <CardContent>
            <TabComponent
              arabicContent={
                <UnitForm 
                  lang="ar" 
                  form={forms.ar} 
                  onSubmit={onSubmit} 
                  state={state} 
                  dispatch={dispatch} 
                />
              }
              englishContent={
                <UnitForm 
                  lang="en" 
                  form={forms.en} 
                  onSubmit={onSubmit} 
                  state={state} 
                  dispatch={dispatch} 
                />
              }
            />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
