"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import Link from "next/link"
import { Edit, Trash2, Home, MapPin, DollarSign, Globe } from "lucide-react"

interface Category {
  _id: string
  title: string
  location: string
  area: number
  description: string
  Image: { secure_url: string }
  coordinates: { latitude: number; longitude: number }
  lang: 'ar' | 'en'
}

export default function Properties() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedLang, setSelectedLang] = useState<'all' | 'ar' | 'en'>('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/category/", {
          params: { page: 1, size: 9 }
        })
        setCategories(response.data.category)
      } catch (err) {
        setError("فشل في جلب البيانات")
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredCategories = categories.filter(cat => 
    selectedLang === 'all' ? true : cat.lang === selectedLang
  )

  const handleDelete = (id: string) => {
    setPropertyToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (propertyToDelete) {
      try {
        await axios.delete(`http://localhost:8080/category/delete/${propertyToDelete}`)
        setCategories(prev => prev.filter(cat => cat._id !== propertyToDelete))
      } catch (err) {
        console.error("Error deleting category:", err)
      }
    }
    setDeleteDialogOpen(false)
    setPropertyToDelete(null)
  }

  if (loading) return <div className="text-center py-8">جاري التحميل...</div>
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold">العقارات</h2>
          
          <div className="flex gap-2 items-center">
            <div className="flex border rounded-lg bg-white p-1">
              <Button 
                variant={selectedLang === 'all' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setSelectedLang('all')}
              >
                الكل
              </Button>
              <Button 
                variant={selectedLang === 'ar' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setSelectedLang('ar')}
              >
                العربية
              </Button>
              <Button 
                variant={selectedLang === 'en' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setSelectedLang('en')}
              >
                English
              </Button>
            </div>
            
            <Link href="/properties/add">
              <Button>إضافة عقار جديد</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => (
            <Card 
              key={category._id} 
              className="overflow-hidden"
              dir={category.lang === 'ar' ? 'rtl' : 'ltr'}
            >
              <div className="relative">
                <img
                  src={category.Image.secure_url}
                  alt={category.title}
                  className="w-full h-48 object-cover"
                />
                <span className="absolute top-2 right-2 bg-white/80 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  {category.lang}
                </span>
              </div>
              
              <CardHeader>
                <CardTitle>
                  <div className="flex flex-col space-y-1">
                    <span className="text-lg font-bold">{category.title}</span>
                    <span className="text-sm text-gray-500">
                      {category.location}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <Home className="w-4 h-4 mr-2" />
                    <span>
                      {category.lang === 'ar' ? 'المساحة:' : 'Area:'} 
                      <span className="font-semibold ml-1">
                        {category.area.toLocaleString()} م²
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>
                      {category.lang === 'ar' ? 'الإحداثيات:' : 'Coordinates:'}
                      <span className="font-semibold ml-1">
                        {category.coordinates.latitude.toFixed(4)}, 
                        {category.coordinates.longitude.toFixed(4)}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-start">
                    <Globe className="w-4 h-4 mr-2 mt-1" />
                    <span className="flex-1">
                      {category.lang === 'ar' ? 'الوصف:' : 'Description:'}
                      <p className="text-gray-600 mt-1">{category.description}</p>
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Link href={`/properties/edit/${category._id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 ml-2" />
                      {category.lang === 'ar' ? 'تعديل' : 'Edit'}
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(category._id)}
                  >
                    <Trash2 className="h-4 w-4 ml-2" />
                    {category.lang === 'ar' ? 'حذف' : 'Delete'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title={categories.find(c => c._id === propertyToDelete)?.lang === 'ar' 
            ? "تأكيد الحذف" 
            : "Confirm Delete"}
          description={categories.find(c => c._id === propertyToDelete)?.lang === 'ar' 
            ? "هل أنت متأكد من حذف هذا العقار؟ لا يمكن التراجع عن هذا الإجراء." 
            : "Are you sure you want to delete this property? This action cannot be undone."}
        />
      </main>
    </div>
  )
}