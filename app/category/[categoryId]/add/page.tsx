"use client"
import { useReducer } from "react"
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const unitSchema = z.object({
  title: z.string().min(3, { message: "يجب أن يكون العنوان على الأقل 3 أحرف" }),
  type: z.string().min(1, { message: "يجب اختيار نوع الوحدة" }),
  price: z.number().min(0, { message: "يجب أن يكون السعر أكبر من أو يساوي 0" }),
  area: z.number().min(0, { message: "يجب أن تكون المساحة أكبر من أو تساوي 0" }),
  rooms: z.number().min(0, { message: "يجب أن يكون عدد الغرف أكبر من أو يساوي 0" }),
  bathrooms: z.number().min(0, { message: "يجب أن يكون عدد الحمامات أكبر من أو يساوي 0" }),
  livingrooms: z.number().min(0, { message: "يجب أن يكون عدد الصالات أكبر من أو يساوي 0" }),
  elevators: z.number().min(0, { message: "يجب أن يكون عدد المصاعد أكبر من أو يساوي 0" }),
  parking: z.number().min(0, { message: "يجب أن يكون عدد مواقف السيارات أكبر من أو يساوي 0" }),
  guard: z.number().min(0, { message: "يجب أن يكون عدد الحراس أكبر من أو يساوي 0" }),
  waterTank: z.number().min(0, { message: "يجب أن يكون عدد خزانات المياه أكبر من أو يساوي 0" }),
  maidRoom: z.number().min(0, { message: "يجب أن يكون عدد غرف الخدم أكبر من أو يساوي 0" }),
  cameras: z.number().min(0, { message: "يجب أن يكون عدد الكاميرات أكبر من أو يساوي 0" }),
  floor: z.number().min(0, { message: "يجب أن يكون رقم الطابق أكبر من أو يساوي 0" }),
  location: z.string().min(1, { message: "يجب إدخال الموقع" }),
  coordinates: z.object({
    latitude: z.number()
      .min(-90, "خط العرض يجب أن يكون بين -90 و 90")
      .max(90, "خط العرض يجب أن يكون بين -90 و 90"),
    longitude: z.number()
      .min(-180, "خط الطول يجب أن يكون بين -180 و 180")
      .max(180, "خط الطول يجب أن يكون بين -180 و 180")
  }),
  description: z.string().min(10, { message: "يجب أن يكون الوصف على الأقل 10 أحرف" }),
  status: z.string().min(1, { message: "يجب اختيار حالة الوحدة" }),
  nearbyPlaces: z.array(z.object({
    place: z.string().min(1, { message: "يجب إدخال اسم المكان" }),
    timeInMinutes: z.number().min(0, { message: "يجب أن يكون الوقت أكبر من أو يساوي 0" })
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
  | { type: "SET_LOADING"; lang: "ar" | "en"; value: boolean }
  | { type: "SET_NEARBY_PLACES"; value: Array<{ place: string; timeInMinutes: number }> }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_IMAGES":
      return { ...state, images: action.value }
    case "SET_LOADING":
      return { ...state, isLoading: { ...state.isLoading, [action.lang]: action.value } }
    case "SET_NEARBY_PLACES":
      return { ...state, nearbyPlaces: action.value }
    default:
      return state
  }
}

const UnitForm = ({ lang, form, onSubmit, state, dispatch }: { lang: "ar" | "en", form: any, onSubmit: (data: FormData, lang: "ar" | "en") => void, state: State, dispatch: React.Dispatch<Action> }) => {
  const handleGoogleMapsLink = (link: string) => {
    const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match = link.match(regex);
    if (match) {
      const latitude = parseFloat(match[1]);
      const longitude = parseFloat(match[2]);
      form.setValue("coordinates.latitude", latitude);
      form.setValue("coordinates.longitude", longitude);
    } else {
      toast.error(lang === "ar" ? "رابط خريطة Google غير صالح" : "Invalid Google Maps link");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data: FormData) => onSubmit(data, lang))} 
        className="space-y-8 bg-white p-6 rounded-lg shadow-sm">
        
        {/* Images Section */}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">
                {lang === "ar" ? "صور العقار" : "Property Images"}
              </FormLabel>
              <ImageUpload
                maxImages={10}
                onImagesChange={(files) => {
                  dispatch({ type: "SET_IMAGES", value: files })
                  field.onChange(files)
                }}
                language={lang}
                existingImages={[]}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{lang === "ar" ? "عنوان الوحدة" : "Unit Title"}</FormLabel>
                <FormControl>
                  <Input {...field} dir={lang === "ar" ? "rtl" : "ltr"} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type Selection */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{lang === "ar" ? "نوع الوحدة" : "Unit Type"}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={lang === "ar" ? "اختر نوع الوحدة" : "Select unit type"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {unitTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Number Input Fields */}
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
                  <FormLabel>
                    {lang === "ar" 
                      ? getArabicPlaceholder(fieldName) 
                      : getEnglishPlaceholder(fieldName)}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          {/* Location Field */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{lang === "ar" ? "الموقع" : "Location"}</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      handleGoogleMapsLink(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status Selection */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{lang === "ar" ? "الحالة" : "Status"}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={lang === "ar" ? "اختر الحالة" : "Select status"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {unitStatuses.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>{lang === "ar" ? "الوصف" : "Description"}</FormLabel>
                <FormControl>
                  <Textarea 
                    rows={4} 
                    {...field} 
                    dir={lang === "ar" ? "rtl" : "ltr"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Coordinates */}
          <FormField
            control={form.control}
            name="coordinates.latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{lang === "ar" ? "خط العرض" : "Latitude"}</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...field} />
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
                <FormLabel>{lang === "ar" ? "خط الطول" : "Longitude"}</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Nearby Places */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel className="text-lg font-semibold">
              {lang === "ar" ? "الأماكن القريبة" : "Nearby Places"}
            </FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => dispatch({
                type: "SET_NEARBY_PLACES",
                value: [...state.nearbyPlaces, { place: "", timeInMinutes: 0 }]
              })}
            >
              <Plus className="w-4 h-4 mr-2" />
              {lang === "ar" ? "إضافة مكان" : "Add Place"}
            </Button>
          </div>
          
          {state.nearbyPlaces.map((_, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
              <FormField
                control={form.control}
                name={`nearbyPlaces.${index}.place`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder={lang === "ar" ? "اسم المكان" : "Place name"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`nearbyPlaces.${index}.timeInMinutes`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="number" placeholder={lang === "ar" ? "الوقت بالدقائق" : "Time in minutes"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <Button type="submit" className="w-full" disabled={state.isLoading[lang]}>
          {state.isLoading[lang] && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {lang === "ar" ? "إضافة الوحدة" : "Add Unit"}
        </Button>
      </form>
    </Form>
  )
}

export default function AddUnit() {
  const [state, dispatch] = useReducer(reducer, {
    images: [],
    existingImages: [],
    isLoading: { ar: false, en: false },
    nearbyPlaces: []
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

  const onSubmit = async (data: FormData, lang: "ar" | "en") => {
    dispatch({ type: "SET_LOADING", lang, value: true })
    try {
      const formData = new FormData()
      formData.append('data', JSON.stringify({ ...data, categoryId: params.categoryId }))
      state.images.forEach(file => formData.append('images', file))

      const response = await fetch("http://localhost:8080/unit/addunit", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData
      })

      if (!response.ok) throw new Error("Failed to add unit")
      
      toast.success(lang === "ar" ? "تم إضافة الوحدة بنجاح" : "Unit added successfully")
      router.push(`/category/${params.categoryId}`)
    } catch (error) {
      toast.error(lang === "ar" ? "حدث خطأ أثناء الإضافة" : "Error adding unit")
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
            <CardTitle>إضافة وحدة جديدة</CardTitle>
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