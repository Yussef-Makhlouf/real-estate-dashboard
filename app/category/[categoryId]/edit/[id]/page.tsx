"use client"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams } from "next/navigation"
import { ImageUpload } from "@/components/ui/image-upload"
import { Plus, Trash } from "lucide-react"

const unitTypes = [
  "Villa", "Apartment", "Duplex", "Penthouse", "Townhouse",
  "Studio Apartment", "Chalet", "Warehouse", "Office", "Retail Shop"
]

const unitStatuses = [
  "Available for sale", "available for rent", "Reserved",
  "Rented/Leased", "Sold", "Unavailable"
]

export default function EditUnitPage() {
  const [isLoading, setIsLoading] = useState(false)
  const params = useParams()
  const unitId = params.id as string
  const categoryId = params.categoryId as string
  const [unitImages, setUnitImages] = useState<File[]>([])
  const [nearbyPlaces, setNearbyPlaces] = useState([{ place: "", timeInMinutes: 0 }])

  const arabicForm = useForm()
  const englishForm = useForm()

  useEffect(() => {
    const fetchUnitData = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`http://localhost:8080/unit/getunit/${unitId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()
        
        if (data.unit) {
          const unit = data.unit
          if (unit.lang === "ar") {
            arabicForm.reset(unit)
          } else {
            englishForm.reset(unit)
          }
          setNearbyPlaces(unit.nearbyPlaces || [{ place: "", timeInMinutes: 0 }])
        }
      } catch (error) {
        toast({
          description: "Failed to fetch unit data",
          variant: "destructive"
        })
      }
    }

    fetchUnitData()
  }, [unitId])

  const onSubmit = async (data: any) => {
    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()
      
      const unitData = {
        ...data,
        categoryId
      }
      formData.append('data', JSON.stringify(unitData))
      
      if (unitImages.length > 0) {
        unitImages.forEach(file => {
          formData.append('images', file)
        })
      }

      const response = await fetch(`http://localhost:8080/unit/updateunit/${unitId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData
      })

      const result = await response.json()
      console.log(response, result);
      
      if (response.ok) {
        toast({
          description: data.lang === "ar" ? "تم تحديث الوحدة بنجاح" : "Unit updated successfully",
        })
      } else {
        toast({
          description: result.message || "Failed to update unit",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        description: "Failed to update unit",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="ar" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="ar">عربي</TabsTrigger>
          <TabsTrigger value="en">English</TabsTrigger>
        </TabsList>

        <TabsContent value="ar">
          {/* Arabic form fields (same as add form) */}
                        <Form {...arabicForm}>
                          <form onSubmit={arabicForm.handleSubmit(onSubmit)} className="space-y-6">
                              {/* Arabic Form Fields */}
                              <FormField
                                  control={arabicForm.control}
                                  name="images"
                                  render={({ field }) => (
                                      <FormItem className="col-span-full">
                                      <FormLabel>الصور</FormLabel>
                                      <FormControl>
                                          <ImageUpload
                                          maxImages={10}
                                          language="ar"
                                          onImagesChange={(files) => {
                                              setUnitImages(files)
                                              field.onChange(files) // This ensures the files are set in form state
                                          }}
                                          />
                                      </FormControl>
                                      <FormMessage />
                                      </FormItem>
                                  )}
                                  />
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              <FormField
                                  control={arabicForm.control}
                                  name="title"
                                  render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>عنوان الوحدة</FormLabel>
                                      <FormControl>
                                      <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                                  )}
                              />
          
                              <FormField
                                  control={arabicForm.control}
                                  name="type"
                                  render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>نوع الوحدة</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                          <SelectTrigger>
                                          <SelectValue placeholder="اختر نوع الوحدة" />
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
          
                              <FormField
                                  control={arabicForm.control}
                                  name="area"
                                  render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>المساحة (متر مربع)</FormLabel>
                                      <FormControl>
                                      <Input type="number" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                                  )}
                              />
          
                              <FormField
                                  control={arabicForm.control}
                                  name="price"
                                  render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>السعر</FormLabel>
                                      <FormControl>
                                      <Input type="number" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                                  )}
                              />
          
                              <FormField
                                  control={arabicForm.control}
                                  name="rooms"
                                  render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>عدد الغرف</FormLabel>
                                      <FormControl>
                                      <Input type="number" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                                  )}
                              />
          
                              <FormField
                                  control={arabicForm.control}
                                  name="bathrooms"
                                  render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>عدد الحمامات</FormLabel>
                                      <FormControl>
                                      <Input type="number" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                                  )}
                              />
          
                              <FormField
                                  control={arabicForm.control}
                                  name="livingrooms"
                                  render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>عدد الصالات</FormLabel>
                                      <FormControl>
                                      <Input type="number" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                                  )}
                              />
          
                              <FormField
                                  control={arabicForm.control}
                                  name="elevators"
                                  render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>عدد المصاعد</FormLabel>
                                      <FormControl>
                                      <Input type="number" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                                  )}
                              />
          
                              <FormField
                                  control={arabicForm.control}
                                  name="parking"
                                  render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>عدد المواقف</FormLabel>
                                      <FormControl>
                                      <Input type="number" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                                  )}
                              />
          
                              <FormField
                                  control={arabicForm.control}
                                  name="guard"
                                  render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>عدد الحراس</FormLabel>
                                      <FormControl>
                                      <Input type="number" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                                  )}
                              />
          
                              <FormField
                                  control={arabicForm.control}
                                  name="waterTank"
                                  render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>عدد خزانات المياه</FormLabel>
                                      <FormControl>
                                      <Input type="number" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                                  )}
                              />
          
                              <FormField
                                  control={arabicForm.control}
                                  name="maidRoom"
                                  render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>غرف الخدم</FormLabel>
                                      <FormControl>
                                      <Input type="number" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                                  )}
                              />
          
                              <FormField
                                  control={arabicForm.control}
                                  name="cameras"
                                  render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>عدد الكاميرات</FormLabel>
                                      <FormControl>
                                      <Input type="number" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                                  )}
                              />
          
                              <FormField
                                  control={arabicForm.control}
                                  name="floor"
                                  render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>الطابق</FormLabel>
                                      <FormControl>
                                      <Input type="number" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                                  )}
                              />
          
                              <FormField
                                  control={arabicForm.control}
                                  name="location"
                                  render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>الموقع</FormLabel>
                                      <FormControl>
                                      <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                                  )}
                              />
          {/* // Add to imports */}
          
          {/* // Add state for nearby places */}
          
          // Add these fields to your form
          <div className="col-span-full space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel>الأماكن القريبة</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setNearbyPlaces([...nearbyPlaces, { place: "", timeInMinutes: 0 }])}
              >
                <Plus className="w-4 h-4 mr-2" />
                إضافة مكان
              </Button>
            </div>
            
            {nearbyPlaces.map((_, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={arabicForm.control}
                  name={`nearbyPlaces.${index}.place`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="اسم المكان" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <FormField
                    control={arabicForm.control}
                    name={`nearbyPlaces.${index}.timeInMinutes`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input type="number" placeholder="الوقت بالدقائق" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      const newPlaces = [...nearbyPlaces]
                      newPlaces.splice(index, 1)
                      setNearbyPlaces(newPlaces)
                    }}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={arabicForm.control}
              name="coordinates.latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>خط العرض</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
                                <FormField
                                  control={arabicForm.control}
                                  name="coordinates.longitude"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>خط الطول</FormLabel>
                                      <FormControl>
                                        <Input type="number" step="any" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
          
                              <FormField
                                  control={arabicForm.control}
                                  name="status"
                                  render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>الحالة</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                          <SelectTrigger>
                                          <SelectValue placeholder="اختر حالة الوحدة" />
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
                              </div>
          
                              <FormField
                              control={arabicForm.control}
                              name="description"
                              render={({ field }) => (
                                  <FormItem>
                                  <FormLabel>الوصف</FormLabel>
                                  <FormControl>
                                      <Textarea rows={4} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                  </FormItem>
                              )}
                              />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                              {isLoading ? "جاري الإضافة..." : "إضافة الوحدة"}
                            </Button>
                          </form>
                        </Form>
        </TabsContent>

        <TabsContent value="en">
          {/* English form fields (same as add form) */}
           <Form {...englishForm}>
            <form onSubmit={englishForm.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={englishForm.control}
                name="images"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <ImageUpload
                        maxImages={10}
                        language="en"
                        onImagesChange={(files) => {
                          setUnitImages(files)
                          field.onChange(files)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={englishForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
          
                <FormField
                  control={englishForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit type" />
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
          
                <FormField
                  control={englishForm.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area (sqm)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
          
                <FormField
                  control={englishForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
          
                <FormField
                  control={englishForm.control}
                  name="rooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Rooms</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
          
                <FormField
                  control={englishForm.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Bathrooms</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
          
                <FormField
                  control={englishForm.control}
                  name="livingrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Living Rooms</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
          
                <FormField
                  control={englishForm.control}
                  name="elevators"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Elevators</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
          
                <FormField
                  control={englishForm.control}
                  name="parking"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parking Spaces</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
          
                <FormField
                  control={englishForm.control}
                  name="guard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Guards</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
          
                <FormField
                  control={englishForm.control}
                  name="waterTank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Water Tanks</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
          
                <FormField
                  control={englishForm.control}
                  name="maidRoom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maid Rooms</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
          
                <FormField
                  control={englishForm.control}
                  name="cameras"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Cameras</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
          
                <FormField
                  control={englishForm.control}
                  name="floor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Floor</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
          
                <FormField
                  control={englishForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
          
                <FormField
                  control={englishForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit status" />
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
              </div>
          
              <div className="col-span-full space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>Nearby Places</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setNearbyPlaces([...nearbyPlaces, { place: "", timeInMinutes: 0 }])}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Place
                  </Button>
                </div>
                
                {nearbyPlaces.map((_, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={englishForm.control}
                      name={`nearbyPlaces.${index}.place`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Place name" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-2">
                      <FormField
                        control={englishForm.control}
                        name={`nearbyPlaces.${index}.timeInMinutes`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input type="number" placeholder="Time in minutes" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          const newPlaces = [...nearbyPlaces]
                          newPlaces.splice(index, 1)
                          setNearbyPlaces(newPlaces)
                        }}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
          
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={englishForm.control}
                  name="coordinates.latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={englishForm.control}
                  name="coordinates.longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
          
              <FormField
                control={englishForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Unit"}
              </Button>
            </form>
                      </Form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
