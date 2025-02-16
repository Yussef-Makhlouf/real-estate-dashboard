'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trash2, MapPin, Home, DollarSign, Badge, Phone, Mail, 
  Building, Search, Filter, Calendar, ArrowUpDown 
} from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import { Input } from '@/components/ui/input'

interface InterestedUser {
  _id: string
  fullName: string
  phone: number
  email: string
  categoryId: {
    title: string
    Image: { secure_url: string }
    location: string
  }
  unitId: {
    title: string
    type: string
    price: number
    images: { secure_url: string }[]
    status: string
  }
  createdAt: string
}

export default function InterestedPage() {
  const [interestedUsers, setInterestedUsers] = useState<InterestedUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'price'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8080/interested/${id}`)
      setInterestedUsers(prev => prev.filter(user => user._id !== id))
      toast.success('تم حذف المستخدم بنجاح')
    } catch (error) {
      toast.error('حدث خطأ أثناء الحذف')
    }
  }

  const sortedAndFilteredUsers = interestedUsers
    .filter(user => 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.categoryId.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const modifier = sortOrder === 'asc' ? 1 : -1
      if (sortBy === 'date') {
        return modifier * (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }
      return modifier * (a.unitId.price - b.unitId.price)
    })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/interested')
        const data = await response.json()
        console.log(data);
        setInterestedUsers(data.interested)
      } catch (error) {
        toast.error('حدث خطأ أثناء تحميل البيانات')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header />
      <Sidebar />
      <main className="pt-20 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-8">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">المهتمين بالعقارات</h1>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {sortedAndFilteredUsers.length} مهتم
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="بحث..."
                  className="pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSortBy('date')
                    setSortOrder(current => current === 'asc' ? 'desc' : 'asc')
                  }}
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  تاريخ
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSortBy('price')
                    setSortOrder(current => current === 'asc' ? 'desc' : 'asc')
                  }}
                  className="flex items-center gap-2"
                >
                  <DollarSign className="h-4 w-4" />
                  السعر
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {sortedAndFilteredUsers.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 border-primary/20 group-hover:border-primary transition-colors">
                          <AvatarImage />
                          <AvatarFallback>{user.fullName.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <h2 className="font-semibold text-lg text-gray-900 truncate">{user.fullName}</h2>
                          <div className="mt-1 space-y-1">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="h-4 w-4 shrink-0" />
                              <span className="text-sm truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="h-4 w-4 shrink-0" />
                              <span className="text-sm">{user.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Building className="h-4 w-4 text-primary" />
                              {/* <span className="text-sm font-medium truncate">{user.categoryId.title}</span> */}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Home className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium truncate">{user.unitId.title}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                              <DollarSign className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">{user.unitId.price.toLocaleString()} ريال</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Badge className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">{user.unitId.status}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4 text-primary shrink-0" />
                          {/* <span className="text-sm truncate">{user.categoryId.location}</span> */}
                        </div>

                        <Button
                          onClick={() => handleDelete(user._id)}
                          variant="destructive"
                          size="sm"
                          className="w-full mt-4"
                        >
                          <Trash2 className="h-4 w-4 ml-2" />
                          حذف
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
