"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import Link from "next/link"
import { Edit, Trash2, Home, MapPin, DollarSign, Globe, Search, Plus, Filter, Loader2, ArrowUpDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "@/hooks/use-toast"
import { Formik } from "formik"
import { useRouter } from "next/navigation"

interface Category {
  _id: string
  title: string
  location: string
  area: number
  description: string
  Image: { secure_url: string }
  coordinates: { latitude: number; longitude: number }
  lang: 'ar' | 'en'
  price?: number
  status?: 'available' | 'sold' | 'rented'
}

export default function Category() {
  // State declarations remain the same
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedLang, setSelectedLang] = useState<'all' | 'ar' | 'en'>('all')
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState<'area' | 'price' | 'date'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [currentPage, selectedLang, sortBy, sortOrder])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:8080/category/", {
        params: {
          page: currentPage,
          size: 9,
          lang: selectedLang !== 'all' ? selectedLang : undefined,
          sort: sortBy,
          order: sortOrder,
          search: searchQuery || undefined
        }
      })
      setCategories(response.data.category)
      setTotalPages(Math.ceil(response.data.total / 9))
    } catch (err) {
      toast({
        title: "خطأ في جلب البيانات",
        description: "حدث خطأ أثناء جلب العقارات",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }


  const viewUnits = (categoryId: string) => {
    console.log(categoryId);
    
    router.push(`/properties/${categoryId}`)
  }
  
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8080/category/delete/${id}`)
      setCategories(prev => prev.filter(cat => cat._id !== id))
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف العقار بنجاح"
      })
    } catch (err) {
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف العقار",
        variant: "destructive"
      })
    }
    setDeleteDialogOpen(false)
    setPropertyToDelete(null)
  }
  const PropertyCard = ({ category }: { category: Category }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col group hover:shadow-xl transition-all duration-300 border-gray-200">
        <div className="relative overflow-hidden aspect-video">
          <img
            src={category.Image.secure_url}
            alt={category.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 right-4 flex gap-2">
            <span className="bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
              <Globe className="w-4 h-4" />
              {category.lang === 'ar' ? 'عربي' : 'English'}
            </span>
            {category.status && (
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm shadow-lg
                ${category.status === 'available' ? 'bg-green-500/90 text-white' :
                category.status === 'sold' ? 'bg-red-500/90 text-white' :
                'bg-yellow-500/90 text-white'}`}>
                {category.status === 'available' ? 'متاح' :
                 category.status === 'sold' ? 'تم البيع' : 'مؤجر'}
              </span>
            )}
          </div>
        </div>

        <CardHeader className="p-6">
          <CardTitle>
            <div className="flex flex-col space-y-2">
              <span className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
                {category.title}
              </span>
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                {category.location}
              </span>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 pt-0 flex-1 flex flex-col">
          <div className="space-y-4 mb-6 flex-1">
            <div className="flex items-center text-gray-600">
              <Home className="w-4 h-4 mr-2 text-gray-400" />
              <span>
                {category.lang === 'ar' ? 'المساحة:' : 'Area:'}{' '}
                <span className="font-semibold text-gray-900">
                  {category.area.toLocaleString()} م²
                </span>
              </span>
            </div>

            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm">
                {category.coordinates.latitude.toFixed(4)}, {category.coordinates.longitude.toFixed(4)}
              </span>
            </div>

            <div className="flex items-start">
              <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed">
                {category.description}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <Link href={`/properties/edit/${category._id}`}>
              <Button 
                variant="outline" 
                size="sm" 
                className="hover:bg-gray-50 hover:text-primary transition-colors"
              >
                <Edit className="h-4 w-4 ml-2" />
                {category.lang === 'ar' ? 'تعديل' : 'Edit'}
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(category._id)}
              className="hover:bg-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4 ml-2" />
              {category.lang === 'ar' ? 'حذف' : 'Delete'}
            </Button>
            <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => viewUnits(category._id)}
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  عرض المنشئات
                </button>
              </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-20 px-4 sm:px-6 lg:px-8 pb-8 transition-all duration-300 lg:pr-64">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-3xl font-bold text-gray-900">المشاريع</h2>
              
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="بحث في العقارات..."
                    className="w-full sm:w-64 pl-4 pr-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex rounded-lg bg-white shadow-sm border p-1">
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
                  <Button className="shadow-sm">
                    <Plus className="mr-2 h-4 w-4" />
                    إضافة عقار جديد
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(current => current === 'asc' ? 'desc' : 'asc')}
                className="text-sm"
              >
                <ArrowUpDown className="mr-2 h-4 w-4" />
                ترتيب حسب {sortBy === 'area' ? 'المساحة' : sortBy === 'price' ? 'السعر' : 'التاريخ'}
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <>
              <AnimatePresence>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {categories.map((category) => (
                    <PropertyCard key={category._id} category={category} />
                  ))}
                </div>
              </AnimatePresence>

              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(i + 1)}
                    className="min-w-[2.5rem]"
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            </>
          )}
        </div>

        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={() => propertyToDelete && handleDelete(propertyToDelete)}
          title="تأكيد الحذف"
          description="هل أنت متأكد من حذف هذا العقار؟ لا يمكن التراجع عن هذا الإجراء."
        />
      </main>
    </div>
  )
}
