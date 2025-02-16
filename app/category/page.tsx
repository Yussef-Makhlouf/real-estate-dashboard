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
  location?: string
  area?: number
  description?: string
  Image?: { secure_url: string }
  coordinates?: { latitude: number; longitude: number }
  lang: 'ar' | 'en'
  price?: number
  status?: 'available' | 'sold' | 'rented'
}

export default function Category() {
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
  }, [currentPage, selectedLang, sortBy, sortOrder, searchQuery])

  const fetchData = async () => {
    try {
      setLoading(true);
      const pageSize = 9; // Items per page
      let endpoint;
  
      switch (selectedLang) {
        case 'ar':
          endpoint = `https://tasis-al-bina.onrender.com/category/getAllCategoryAR`;
          break;
        case 'en':
          endpoint = `https://tasis-al-bina.onrender.com/category/getAllCategory`;
          break;
        case 'all':
          const [arResponse, enResponse] = await Promise.all([
            axios.get(`https://tasis-al-bina.onrender.com/category/getAllCategoryAR`),
            axios.get(`https://tasis-al-bina.onrender.com/category/getAllCategoryEN`)
          ]);
  
          const combinedCategories = [...arResponse.data.category, ...enResponse.data.category];
          setCategories(combinedCategories);
          setTotalPages(Math.ceil((arResponse.data.total + enResponse.data.total) / pageSize));
          setLoading(false);
          return;
      }
  
      const response = await axios.get(endpoint);
      setCategories(response.data.category);
      setTotalPages(Math.ceil(response.data.total / pageSize));
    } catch (err) {
      toast({
        title: "خطأ في جلب البيانات",
        description: "حدث خطأ أثناء جلب العقارات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  


  const viewUnits = (categoryId: string) => {
    router.push(`/category/${categoryId}`)
  }
  const formatCoordinate = (value: number | undefined): string => {
    return value !== undefined && !isNaN(value) ? value.toFixed(7) : "N/A";
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`https://tasis-al-bina.onrender.com/category/delete/${id}`)
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
            src={category.Image?.secure_url || '/placeholder-image.jpg'}
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
                {category.location || 'Location not available'}
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
                  {(category.area || 0).toLocaleString()} م²
                </span>
              </span>
            </div>


            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm">
                {category?.coordinates?.latitude && category?.coordinates?.longitude ? (
                  `${formatCoordinate(category.coordinates.latitude)}, ${formatCoordinate(category.coordinates.longitude)}`
                ) : (
                  <>Coordinates not available</>
                )}
              </span>
            </div>
            <div className="flex items-start">
              <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed">
                {category.description || 'No description available'}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <Link href={`/category/edit/${category._id}`}>
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
              onClick={() => {
                setPropertyToDelete(category._id)
                setDeleteDialogOpen(true)
              }}
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
         

                <div className="flex rounded-lg bg-white shadow-sm border p-1">
                  <Button
                    variant={selectedLang === 'all' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      setCurrentPage(1)
                      setSelectedLang('all')
                    }}
                  >
                    الكل
                  </Button>
                  <Button
                    variant={selectedLang === 'ar' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      setCurrentPage(1)
                      setSelectedLang('ar')
                    }}
                  >
                    العربية
                  </Button>
                  <Button
                    variant={selectedLang === 'en' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      setCurrentPage(1)
                      setSelectedLang('en')
                    }}
                  >
                    English
                  </Button>
                </div>

                <Link href="/category/add">
                  <Button className="shadow-sm">
                    <Plus className="mr-2 h-4 w-4" />
                    إضافة عقار جديد
                  </Button>
                </Link>
              </div>
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
